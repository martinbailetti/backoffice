import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError, setPage } from "@/slices/pageSlice";

import page from "@/config/pages/factory/settings/printings/edit";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import { GenericRecord } from "@/types";
import FormHeader from "@/components/form/FormHeader";
import FormWrapper from "@/components/form/FormWrapper";
import { setFlashMessage } from "@/slices/appSlice";
import { useTranslation } from "@/context/contextUtils";
import { getPrinters, getPrinting, updatePrinting } from "@/api/settings";
import PrintControls from "@/components/factory/settings/printings/PrintControls";
import { useReactToPrint } from "react-to-print";
import PrintableBlock from "@/components/factory/settings/printings/PrintableBlock";
import { SingleValue } from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";
import { getPrintStyles } from "@/utils";

/* const styleDefault = {
  "pageWidth": 11,
  "pageHeight": 2.5,
  "qrSize": 2.3,
  "qrMarginLeft": 0.1,
  "qrMarginRight": 0.1,
  "qrMarginTop": 0.1,
  "fontSize": 0.33,
  "lineHeight": 0.35,
  "infoWidth": 5,
  "infoMarginTop": 0.1
};
 */

const PrintingEdit = () => {
  const t = useTranslation();

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  // redux
  const userDataData = useAppSelector((state) => state.userData.data);
  const dispatch = useAppDispatch();

  // states


  const [style, setStyle] = useState<GenericRecord | null>(null);
  const [record, setRecord] = useState<GenericRecord | null>(null);
  const [currentRecord, setCurrentRecord] = useState<GenericRecord | null>(null);
  const [status, setStatus] = useState<string>("pending");

  // Prepare page data
  useEffect(() => {
    if (userDataData == null || status != "pending") return;
    const preparePage = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get("id");

      try {
        const response = await getPrinting({ id: id });
        setRecord(response.data.result);
        setCurrentRecord(response.data.result);

        setStyle(JSON.parse(response.data.result.settings));

      } catch (error) {
        dispatch(setError(t("undefined_error")));
      }
      setStatus("prepared");
    };
    preparePage();
  }, [userDataData, dispatch]); // eslint-disable-line

  // Store page data
  useEffect(() => {
    if (status != "prepared") return;

    setStatus("ready");

    dispatch(
      setPage({
        title: page.title,
        breadcrumb: page.breadcrumb,
      }),
    );
  }, [dispatch, status]);


  useEffect(() => {

    if (style == null) return;
    const styleElm = document.createElement("style");
    styleElm.innerHTML = getPrintStyles(style);
    document.head.appendChild(styleElm);
    setCurrentRecord({ ...currentRecord, settings: JSON.stringify(style) });
    return () => {
      document.head.removeChild(styleElm);
    };
  }, [style, status]); // eslint-disable-line




  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentRecord) return;
    setStatus("pending");



    try {
      const response = await updatePrinting(currentRecord);

      setRecord(response.data.result);
      setCurrentRecord(response.data.result);
      dispatch(setFlashMessage({ message: t("updated_successfully"), type: "success" }));
      setStatus("prepared");
    } catch (error) {
      dispatch(setError(t("operation_not_executed")));
    }
    setStatus("prepared");
  };

  const loadPrinterOptions = async (inputValue: string) => {

    if(inputValue.length < 3) return [];
    try {
      const response = await getPrinters({ search: inputValue });

      if (!response.data.success) {
        console.log("error", response.data.message);
        return [];
      }

      return response.data.result.map((item: GenericRecord) => ({
        label: item["printer"],
        value: item["printer"],
      }));
    } catch (error) {
      console.log("error", error);
      return [];
    }
  };
  const handlePrinterSelection = (newValue: SingleValue<GenericRecord>) => {
    if (newValue) {
      setCurrentRecord({
        ...currentRecord,
        printer: newValue.value,
      });
    } else {
      setCurrentRecord({
        ...currentRecord,
        printer: "",
      });
    }
  };

  const handleCreatePrinter = async (inputValue: string) => {

    setCurrentRecord({ ...currentRecord, printer: inputValue });
  };
  return (
    <BackofficeMainTemplate status={status}>
      <form autoComplete="off" className="flex-grow-1 overflow-hidden d-flex flex-column" onSubmit={handleSubmit}>
        {record && <FormHeader title={record.name} handleReset={() => setCurrentRecord(record)} />}

        <FormWrapper>
          <div className="row">
            <div className="col-md-6 col-12 pt-1">
              <label htmlFor="name">{t("name")}</label>
              <input
                required
                minLength={3}
                type="text"
                className="form-control"
                id="name"
                value={currentRecord ? currentRecord.name : ""}
                onChange={(e) => setCurrentRecord({ ...currentRecord, name: e.target.value })}
              />
            </div>
            <div className="col-md-6 col-12 pt-1 ">
              <label htmlFor="printer">{t("printer")}</label>

              <AsyncCreatableSelect
                cacheOptions
                loadOptions={loadPrinterOptions}
                placeholder={t("select")}
                isClearable
                onChange={handlePrinterSelection}
                value={{
                  label: currentRecord?.printer,
                  value: currentRecord?.printer,
                }}
                onCreateOption={handleCreatePrinter}
              />
            </div>
            <div className="col-md-6 col-12 pt-1">
              <label htmlFor="default " className="w-100 d-block">{t("default")}</label>
              <input
                type="checkbox"
                className="form-check-input"
                id="default"
                checked={currentRecord && currentRecord.default == 1 ? true : false}
                onChange={(e) => setCurrentRecord({ ...currentRecord, default: e.target.checked ? 1 : 0 })}
              />
            </div>
            <div className="col-12 mt-3">
              <strong>{t("settings")}</strong>

              <div className="d-flex flex-column justify-content-center align-items-center mt-3">

                {style && <div className="w-100">
                  <PrintControls style={style} setStyle={setStyle} />
                  <div className="mb-3 w-100 text-end">
                    <a
                      onClick={() => reactToPrintFn()}
                      className="btn btn-dark"
                    >
                      {t("print_test")}
                    </a>
                  </div>
                </div>}

                <div className="w-100 d-flex justify-content-center bg-secondary p-3">
                  <div ref={contentRef} className="printable bg-white">
                    <PrintableBlock />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </FormWrapper>
      </form>
    </BackofficeMainTemplate>
  );
};
export default PrintingEdit;
