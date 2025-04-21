import { GenericRecord } from "@/types";
import React, { memo, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { settings } from "@/config";
import { getPrintings } from "@/api/settings";
import { getPrintStyles } from "@/utils";

/**
 * Print preview component.
 */

const PrintPreviewViewer = ({
  printing = null,
  devices,
  single = false,
  contentRef = null,
}: {
  printing?: GenericRecord | null;
  devices: GenericRecord[];
  single?: boolean;
  contentRef?: React.RefObject<HTMLDivElement> | null;
}) => {
  const [selectedPrinting, setSelectedPrinting] = useState<GenericRecord | null>(printing);

  useEffect(() => {
    if (printing) return;
    const loadPrinting = async () => {
      try {
        const response = await getPrintings();

        const defaultPrinting = response.data.result.find((p: GenericRecord) => p.default == 1);

        setSelectedPrinting(defaultPrinting || response.data.result[0]);
      } catch (error) {
        console.log(error);
      }
    };

    loadPrinting();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const getLine = (device: GenericRecord, index: number) => {
    if (device.CustomizedQR) {
      const lines = device.CustomizedQR.split("-,-");

      if (lines.length !== 5) return "";

      lines.unshift(device.Type);

      return lines[index];
    } else {
      const setting =
        settings.default_printing[`line${index}` as keyof typeof settings.default_printing];

      if (setting.type == "data") {
        return device[setting.value];
      } else {
        return setting.value;
      }
    }
  };

  return (
    <div className="printable bg-white flex-grow-1" ref={contentRef}>
      {selectedPrinting && (
        <div className={`printable-content preview ${single ? "single" : ""}`}>
          {devices
            .reduce((rows, device, index) => {
              if (index % 2 === 0) rows.push([]);
              rows[rows.length - 1].push(device);
              return rows;
            }, [])
            .map((row: GenericRecord, rowIndex: number) => (
              <div className="printable-content-row" key={rowIndex}>
                {row.map((device: GenericRecord, colIndex: number) => (
                  <div className="data" key={colIndex}>
                    <div className="qr">
                      <QRCodeSVG value={device.Id} />
                    </div>
                    <div className="info">
                      <div className="fw-bold">
                        {getLine(device, 0) == "" ? <>&nbsp;</> : getLine(device, 0)}
                      </div>
                      <div className="fw-bold">
                        {getLine(device, 1) == "" ? <>&nbsp;</> : getLine(device, 1)}
                      </div>
                      <div>{getLine(device, 2) == "" ? <>&nbsp;</> : getLine(device, 2)}</div>
                      <div>{getLine(device, 3) == "" ? <>&nbsp;</> : getLine(device, 3)}</div>
                      <div>{getLine(device, 4) == "" ? <>&nbsp;</> : getLine(device, 4)}</div>
                      <div>{getLine(device, 5) == "" ? <>&nbsp;</> : getLine(device, 5)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
export default memo(PrintPreviewViewer);
