import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError, setPage } from "@/slices/pageSlice";

import page from "@/config/pages/licenses/machines/info";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import { GenericRecord } from "@/types";
import { useTranslation } from "@/context/contextUtils";
import { getMachine } from "@/api/licenses";
import MachinesInfoForm from "@/components/machines/MachinesInfoForm";

const Machine = () => {
  const t = useTranslation();


  // redux
  const userDataData = useAppSelector((state) => state.userData.data);
  const dispatch = useAppDispatch();

  // states

  const [record, setRecord] = useState<GenericRecord | null>(null);
  const [status, setStatus] = useState<string>("pending");

  // Prepare page data
  useEffect(() => {
    if (userDataData == null || status != "pending") return;
    const preparePage = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const gid = searchParams.get("gid");
      const mid = searchParams.get("mid");

      const breadcrumb = [...page.breadcrumb];
      breadcrumb[breadcrumb.length - 1] = {
        name: gid ?? "",
        path: `${breadcrumb[breadcrumb.length - 1].path}?gid=${gid}`,
      };

      try {
        const response = await getMachine({ GroupId: gid, MachineId: mid });
        setRecord(response.data.result);
      } catch (error) {
        dispatch(setError(t("undefined_error")));
      }

      if (mid) {
        dispatch(setPage(page));
      }
      setStatus("ready");
    };

    preparePage();
  }, [userDataData, dispatch]); // eslint-disable-line

  return (
    <BackofficeMainTemplate status={status}>
      <div className="d-flex flex-column h-100">
        {record && (
          <MachinesInfoForm
            record={record}
            paths={{ group: `/licenses/groups/info`, devices: `/licenses/devices` }}
          />
        )}
      </div>
    </BackofficeMainTemplate>
  );
};
export default Machine;
