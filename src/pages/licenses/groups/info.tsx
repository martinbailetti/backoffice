import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError, setPage } from "@/slices/pageSlice";

import page from "@/config/pages/licenses/groups/info";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import { GenericRecord } from "@/types";

import { useTranslation } from "@/context/contextUtils";
import { getGroup, getGroupActivityLogs } from "@/api/licenses";
import GroupsInfoForm from "@/components/groups/GroupsInfoForm";

const Device = () => {
  const t = useTranslation();

  // redux
  const userDataData = useAppSelector((state) => state.userData.data);
  const dispatch = useAppDispatch();

  // states

  const [activityLog, setActivityLog] = useState<GenericRecord[] | null>(null);
  const [record, setRecord] = useState<GenericRecord | null>(null);
  const [status, setStatus] = useState<string>("pending");

  // Prepare page data
  useEffect(() => {
    if (userDataData == null || status != "pending") return;
    const preparePage = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const gid = searchParams.get("gid");

      try {
        const response = await getGroup({ GroupId: gid });
        setRecord(response.data.result);
      } catch (error) {
        dispatch(setError(t("undefined_error")));
      }

      if (gid) {
        dispatch(setPage(page));
      }

      setStatus("ready");
    };

    preparePage();
  }, [userDataData, dispatch]); // eslint-disable-line

  useEffect(() => {
    if (record == null) return;
    const loadActivityLog = async () => {

      try {
        const response = await getGroupActivityLogs({ Id: record.Id, MachineId: record.MachineId, GroupId: record.GroupId });
        setActivityLog(response.data.result);
      } catch (error) {
        dispatch(setError(t("undefined_error")));
      }


    };

    loadActivityLog();
  }, [record]);  // eslint-disable-line
  return (
    <BackofficeMainTemplate status={status}>
      <div className="d-flex flex-column h-100">
        {record && <GroupsInfoForm record={record} activities={activityLog} paths={{ machines: `/licenses/machines` }} />}
      </div>
    </BackofficeMainTemplate>
  );
};
export default Device;
