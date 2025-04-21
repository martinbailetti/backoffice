import { getPrintings } from "@/api/settings";
import { useTranslation } from "@/context/contextUtils";
import { GenericRecord } from "@/types";
import React, { memo, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { getPrintStyles } from "@/utils";
import PrintPreviewViewer from "./PrintPreviewViewer";

/**
 * Print preview component.
 */

const PrintPreview = ({ devices, close }: { devices: GenericRecord[]; close: () => void }) => {
  const [printings, setPrintings] = useState<GenericRecord[]>([]);
  const t = useTranslation();
  const promiseResolveRef = useRef<(() => void) | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      // Resolves the Promise, letting `react-to-print` know that the DOM updates are completed
      promiseResolveRef.current();
    }
  }, [isPrinting]);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    onBeforePrint: () => {
      return new Promise((resolve) => {
        promiseResolveRef.current = resolve;
        setIsPrinting(true);
      });
    },
    onAfterPrint: () => {
      // Reset the Promise resolve so we can print again
      console.log("onAfterPrint");
      promiseResolveRef.current = null;
      setIsPrinting(false);
      close();
    },
  });

  const [selectedPrinting, setSelectedPrinting] = useState<GenericRecord | null>(null);

  // Prepare page data
  useEffect(() => {
    const preparePage = async () => {
      try {
        const response = await getPrintings();

        const defaultPrinting = response.data.result.find((p: GenericRecord) => p.default == 1);

        setSelectedPrinting(defaultPrinting || response.data.result[0]);

        setPrintings(response.data.result);
      } catch (error) {
        console.log(error);
      }
    };

    preparePage();
  }, []);

  const handlePrintingSelection = (id: string) => {
    const printing = printings.find((p: GenericRecord) => p.id == id);
    setSelectedPrinting(printing || null);
  };

  const renderPrintingList = () => {
    if (printings.length == 0) return null;

    return (
      <select
        className="form-select"
        onChange={(e) => handlePrintingSelection(e.target.value)}
        value={selectedPrinting?.id}
      >
        {printings &&
          printings.map((p, index) => {
            return (
              <option className="text-dark" value={p.id} key={index}>
                {p.name}
              </option>
            );
          })}
      </select>
    );
  };

  useEffect(() => {
    console.log("selectedPrinting", selectedPrinting);
    if (selectedPrinting == null) return;

    const settings = selectedPrinting.settings;
    const style = JSON.parse(settings);

    const styleElm = document.createElement("style");
    styleElm.innerHTML = getPrintStyles(style);
    document.head.appendChild(styleElm);

    return () => {
      document.head.removeChild(styleElm);
    };
  }, [selectedPrinting]);

  return (
    <div className="position-fixed top-0 start-0 w-100 dvh-100 bg-light d-flex flex-column">
      <div className="d-flex flex-row w-100 justify-content-between align-items-center bg-body-secondary border-secondary border-bottom">
        <div className="m-2 fw-bold">{t("print")}</div>
        <div className="m-2 fw-bold">
          <button type="button" className="btn-close" aria-label="Close" onClick={close}></button>
        </div>
      </div>
      <div className="mx-3 d-flex justify-content-between mt-2">
        <div>{renderPrintingList()}</div>
        <div>
          <button className="btn btn-dark" onClick={() => reactToPrintFn()}>
            {t("print")}
          </button>
        </div>
      </div>

      <div className="d-flex flex-column justify-content-start align-items-center bg-secondary m-3 flex-grow-1 overflow-auto">
        {selectedPrinting && (
          <PrintPreviewViewer
            printing={selectedPrinting}
            devices={devices}
            contentRef={contentRef}
          />
        )}
      </div>
    </div>
  );
};
export default memo(PrintPreview);
