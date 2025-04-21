import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError, setPage } from "@/slices/pageSlice";
import { MdEditSquare, MdLocalPrintshop } from "react-icons/md";

import page from "@/config/pages/licenses/devices/device";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import { GenericRecord } from "@/types";
import { useTranslation } from "@/context/contextUtils";
import { getActivityLogs, getDevice, getDeviceHistory, updateDevice } from "@/api/licenses";
import { FaInfoCircle, FaTimesCircle } from "react-icons/fa";
import { setFlashMessage } from "@/slices/appSlice";
import { FaCheckCircle } from "react-icons/fa";
import DeviceInfoForm from "@/components/devices/DeviceInfoForm";
import PrintPreview from "@/components/print/PrintPreview";

const Device = () => {
  const t = useTranslation();

  // redux
  const userDataData = useAppSelector((state) => state.userData.data);
  const dispatch = useAppDispatch();

  // states
  const [activityLog, setActivityLog] = useState<GenericRecord[] | null>(null);
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

      await getInfo();

      const p = { ...page };
      const breadcrumb = [...p.breadcrumb];
      breadcrumb[breadcrumb.length - 1] = {
        name: mid || "",
        path: `${breadcrumb[breadcrumb.length - 1].path}?gid=${gid}&mid=${mid}`,
      };
      breadcrumb[breadcrumb.length - 2] = {
        name: gid || "",
        path: `${breadcrumb[breadcrumb.length - 2].path}?gid=${gid}`,
      };
      p.breadcrumb = breadcrumb;

      dispatch(setPage({ ...p }));

      setStatus("ready");
    };

    preparePage();
  }, [userDataData, dispatch]); // eslint-disable-line

  useEffect(() => {
    if (record == null) return;
    const loadHistory = async () => {
      try {
        const response = await getDeviceHistory({ Id: record.Id });
        setHistory(response.data.result);
      } catch (error) {
        dispatch(setError(t("undefined_error")));
      }
    };

    loadHistory();
  }, [record]); // eslint-disable-line

  useEffect(() => {
    if (record == null) return;
    const loadActivityLog = async () => {
      try {
        const response = await getActivityLogs({
          Id: record.Id,
          MachineId: record.MachineId,
          GroupId: record.GroupId,
        });
        setActivityLog(response.data.result);
      } catch (error) {
        dispatch(setError(t("undefined_error")));
      }
    };

    loadActivityLog();
  }, [record]); // eslint-disable-line

  const getInfo = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const gid = searchParams.get("gid");
    const mid = searchParams.get("mid");
    const id = searchParams.get("id");
    try {
      const response = await getDevice({ Id: id, GroupId: gid, MachineId: mid });
      setRecord(response.data.result);
      setCurrentRecord(response.data.result);
    } catch (error) {
      dispatch(setError(t("undefined_error")));
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentRecord) return;

    try {
      setStatus("pending");
      const response = await updateDevice(currentRecord);

      if (!response.data.success) {
        dispatch(setFlashMessage({ message: t(response.data.message), type: "danger" }));
      } else {
        dispatch(setFlashMessage({ message: t("update_executed_successfully"), type: "success" }));
      }
    } catch (error) {
      dispatch(setError(t("operation_not_executed")));
      return;
    }

    refresh();
  };
  const refresh = async () => {
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
            <a className="btn btn-dark me-2" onClick={() => setView("print")}>
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
        <div className="flex-grow-1 ps-1">
          <div className="d-flex">
            {record.Validated == 1 && (
              <span
                className={`badge rounded-pill bg-success d-flex align-items-center justify-content-start`}
              >
                {t("validated")}

                <FaCheckCircle className="ms-1" />
              </span>
            )}
            {record.Validated == 0 && (
              <span
                className={`badge rounded-pill bg-danger d-flex align-items-center justify-content-start`}
              >
                {t("invalid")}

                <FaTimesCircle className="ms-1" />
              </span>
            )}
            {record.Connected == 1 && (
              <span
                className={`ms-2 badge rounded-pill bg-success d-flex align-items-center justify-content-start`}
              >
                {t("connected")}

                <FaCheckCircle className="ms-1" />
              </span>
            )}
            {record.Connected == 0 && (
              <span
                className={`ms-2 badge rounded-pill bg-danger d-flex align-items-center justify-content-start`}
              >
                {t("disconnected")}

                <FaTimesCircle className="ms-1" />
              </span>
            )}
          </div>
        </div>
        {currentRecord && (
          <DeviceInfoForm
            record={record}
            currentRecord={currentRecord}
            setCurrentRecord={setCurrentRecord}
            history={history}
            activities={activityLog}
            view={view}
            paths={{ machine: "/licenses/machines/info", group: "/licenses/groups/info" }}
            refresh={refresh}
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
        <form className="d-flex flex-column h-100" onSubmit={handleSubmit}>
          {record && renderContent()}
        </form>
      )}
      {view == "print" && record && (
        <PrintPreview devices={[record]} close={() => setView("show")} />
      )}
    </BackofficeMainTemplate>
  );
};
export default Device;
