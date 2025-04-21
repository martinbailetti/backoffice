import { useEffect,  useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError, setPage } from "@/slices/pageSlice";
import { MdEditSquare } from "react-icons/md";

import page from "@/config/pages/factory/devices/device";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import { GenericRecord } from "@/types";
import { useTranslation } from "@/context/contextUtils";
import { FaInfoCircle, FaTimesCircle } from "react-icons/fa";
import { setFlashMessage } from "@/slices/appSlice";
import { FaCheckCircle } from "react-icons/fa";
import DeviceInfoForm from "@/components/factory/devices/DeviceInfoForm";

import { MdLocalPrintshop } from "react-icons/md";
import { getFactoryDevice, getFactoryDeviceHistory, updateFactoryDevice } from "@/api/factory";
import PrintPreview from "@/components/print/PrintPreview";

const Device = () => {
  const t = useTranslation();

  // redux
  const userDataData = useAppSelector((state) => state.userData.data);
  const dispatch = useAppDispatch();



  // states
  const [history, setHistory] = useState<GenericRecord[] | null>(null);
  const [record, setRecord] = useState<GenericRecord | null>(null);
  const [currentRecord, setCurrentRecord] = useState<GenericRecord | null>(null);
  const [status, setStatus] = useState<string>("pending");
  const [view, setView] = useState<string>("show");

  // Prepare page data
  useEffect(() => {
    if (userDataData == null || status != "pending") return;
    const preparePage = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const gid = searchParams.get("gid");
      const mid = searchParams.get("mid");
      const sn = searchParams.get("sn");

      await getInfo();


      const p = { ...page };
      const breadcrumb = [...p.breadcrumb];
      breadcrumb[breadcrumb.length - 1] = {
        name: mid || "",
        path: `${breadcrumb[breadcrumb.length - 1].path}?gid=${gid}&mid=${mid}&sn=${sn}`,
      };
      breadcrumb[breadcrumb.length - 2] = {
        name: sn || "",
        path: `${breadcrumb[breadcrumb.length - 2].path}?gid=${gid}&sn=${sn}`,
      };
      p.breadcrumb = breadcrumb;
      if (mid) {
        dispatch(setPage({ ...p }));
      }
      setStatus("ready");
    };

    preparePage();
  }, [userDataData, dispatch, status]); // eslint-disable-line


  useEffect(() => {
    if (record==null) return;
    const loadHistory = async () => {

      try {
        const response = await getFactoryDeviceHistory({ Id: record.Id });
        setHistory(response.data.result);
      } catch (error) {
        dispatch(setError(t("undefined_error")));
      }
    };

    loadHistory();
  }, [record]); // eslint-disable-line
  const getInfo = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const gid = searchParams.get("gid");
    const mid = searchParams.get("mid");
    const id = searchParams.get("id");
    try {
      const response = await getFactoryDevice({ Id: id, GroupId: gid, MachineId: mid });
      setRecord(response.data.result);
      setCurrentRecord(response.data.result);
    } catch (error) {
      dispatch(setError(t("undefined_error")));
    }


  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentRecord) return;

    setStatus("pending");
    try {
      const response = await updateFactoryDevice(currentRecord);


      if (!response.data.success) {
        dispatch(setFlashMessage({ message: t(response.data.message), type: "danger" }));
        return;
      } else {
        dispatch(setFlashMessage({ message: t("update_executed_successfully"), type: "success" }));
      }
    } catch (error) {
      dispatch(setError(t("operation_not_executed")));
      return;
    }

    await getInfo();
    setStatus("ready");
  };

  const renderContent = () => {
    if (!record) return null;

    return (
      <div className="mt-2 px-2 px-md-0 overflow-x-hidden overflow-y-auto pb-5">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="text-info fw-bold ps-2 text-uppercase mb-0">{t("information")}</h5>
          <div className="flex-grow-1 ps-3">
            <div className="d-flex">
              {record.validated == 1 && (
                <span
                  className={`badge rounded-pill bg-success d-flex align-items-center justify-content-start`}
                >
                  {t("validated")}

                  <FaCheckCircle className="ms-1" />
                </span>
              )}
              {record.validated == 0 && (
                <span
                  className={`badge rounded-pill bg-danger d-flex align-items-center justify-content-start`}
                >
                  {t("invalid")}

                  <FaTimesCircle className="ms-1" />
                </span>
              )}
            </div>
          </div>
          <div>
            <a className="btn btn-dark me-2"  onClick={()=>setView("print")}>
              <MdLocalPrintshop />
            </a>

            {view === "show" && (
              <a className="btn btn-primary" onClick={() => setView("edit")}>
                <MdEditSquare />
              </a>
            )}
            {view === "edit" && (
              <a className="btn btn-primary" onClick={() => setView("show")}>
                <FaInfoCircle />
              </a>
            )}
          </div>
        </div>

        {currentRecord && (
          <DeviceInfoForm
            record={record}
            currentRecord={currentRecord}
            setCurrentRecord={setCurrentRecord}
            history={history}
            view={view}
            setStatus={setStatus}
            paths={{ machine: "/factory/machines/info", group: "/factory/groups/info" }}
          />
        )}

      </div>
    );
  };

  return (
    <BackofficeMainTemplate status={status}>
      {view == "edit" && (
        <form className="d-flex flex-column h-100" onSubmit={handleSubmit}>
          {record && renderContent()}
        </form>
      )}
      {view == "show" && (
        <div className="d-flex flex-column h-100">
          {record && renderContent()}
        </div>
      )}
      {view == "print" && record && <PrintPreview devices={[record]} close={() => setView("show")} />}
    </BackofficeMainTemplate>
  );
};
export default Device;
