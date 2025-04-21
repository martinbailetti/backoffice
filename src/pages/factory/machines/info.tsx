import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError, setPage } from "@/slices/pageSlice";

import page from "@/config/pages/factory/machines/info";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import { GenericRecord } from "@/types";
import { useTranslation } from "@/context/contextUtils";
import { getFactoryMachine, updateFactoryMachineModel } from "@/api/factory";
import MachinesInfoForm from "@/components/factory/machines/MachinesInfoForm";
import { MdEditSquare } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";
import { setFlashMessage } from "@/slices/appSlice";

const Machine = () => {
  const t = useTranslation();

  // redux
  const userDataData = useAppSelector((state) => state.userData.data);
  const dispatch = useAppDispatch();

  // states

  const [currentRecord, setCurrentRecord] = useState<GenericRecord | null>(null);
  const [record, setRecord] = useState<GenericRecord | null>(null);
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


      try {
        const response = await getFactoryMachine({ GroupId: gid, MachineId: mid });
        setRecord(response.data.result);
        setCurrentRecord(response.data.result);
      } catch (error) {
        dispatch(setError(t("undefined_error")));
      }

      const breadcrumb = [...page.breadcrumb];
      breadcrumb[breadcrumb.length - 1] = {
        name: sn ?? "",
        path: `${breadcrumb[breadcrumb.length - 1].path}?gid=${gid}&sn=${sn}`,
      };
      if (mid) {
        dispatch(setPage({...page, breadcrumb}));
      }
      setStatus("ready");
    };

    preparePage();
  }, [userDataData, dispatch]); // eslint-disable-line

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentRecord) return;

    try {
      setStatus("pending");
      const response = await updateFactoryMachineModel(currentRecord);

      if (!response.data.success) {
        dispatch(setFlashMessage({ message: t(response.data.message), type: "danger" }));
      } else {
        dispatch(setFlashMessage({ message: t("update_executed_successfully"), type: "success" }));
      }
    } catch (error) {
      dispatch(setError(t("operation_not_executed")));

    }
    setStatus("ready");
  };

  return (
    <BackofficeMainTemplate status={status}>
      <div className="d-flex justify-content-end">
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

      {view == "show" && (
        <div className="d-flex flex-column h-100 flex-grow-1">
          {record && currentRecord && (
            <MachinesInfoForm
              record={record}
              currentRecord={currentRecord}
              setCurrentRecord={setCurrentRecord}
              view={view}
              paths={{ group: `/factory/groups/info`, devices: `/factory/devices` }}
            />
          )}
        </div>
      )}
      {view == "edit" && (
        <form className="d-flex flex-column h-100 flex-grow-1" onSubmit={handleSubmit}>
          {record && currentRecord && (
            <MachinesInfoForm
              record={record}
              currentRecord={currentRecord}
              setCurrentRecord={setCurrentRecord}
              view={view}
              paths={{ group: `/factory/groups/info`, devices: `/factory/devices` }}
            />
          )}
        </form>
      )}
    </BackofficeMainTemplate>
  );
};
export default Machine;
