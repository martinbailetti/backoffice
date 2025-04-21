import { useAppDispatch } from "@/redux/hooks";
import { setError } from "@/slices/pageSlice";

import { GenericRecord } from "@/types";
import { useTranslation } from "@/context/contextUtils";
import { getWebRepo } from "@/api/licenses";
import { useEffect, useState } from "react";
import Link from "next/link";

const GroupsInfoForm = ({
  record,
  paths,
  activities
}: {
  record: GenericRecord;
  paths: GenericRecord;
  activities: GenericRecord[] | null;
}) => {
  const t = useTranslation();

  // redux
  const dispatch = useAppDispatch();
  console.log(activities);
  // states

  const [webrepo, setWebrepo] = useState<GenericRecord | null>(null);



  useEffect(() => {
    const loadWebRepo = async () => {
      try {
        const response = await getWebRepo({ GroupId: record.GroupId });
        setWebrepo(response.data.result);
      } catch (error) {
        dispatch(setError(t("undefined_error")));
      }
    };

    loadWebRepo();
  }, [dispatch, record]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="d-flex flex-column h-100">
      {record && (
        <div className="mt-md-0 mt-2 px-2 px-md-0 overflow-auto pb-5">
          <h5 className="text-info fw-bold ps-2 text-uppercase">{t("information")}</h5>
          <div className="row m-0">
            <div className="col-md-6 col-12">
              <div className="text-secondary fw-bold">{t("SerialNumber")}</div>
              <div className="text-info fw-bold">{record.SerialNumber}</div>
            </div>
            <div className="col-md-6 col-12">
              <div className="text-secondary fw-bold">{t("GroupId")}</div>
              <div className="text-black ">{record.GroupId}</div>
            </div>
            <div className="col-md-6 col-12">
              <div className="text-secondary fw-bold">{t("machines")}</div>
              <Link className="text-black" href={`${paths.machines}?gid=${record.GroupId}&sn=${record.SerialNumber}`}>
                {record.MachineIdCount} {t("machines")}
              </Link>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("AppTitle")}</div>
              <div className="text-black">{record.AppTitle}</div>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("AppVersion")}</div>
              <div className="text-black">{record.AppVersion}</div>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("AppDateTime")}</div>
              <div className="text-black">{record.AppDateTime}</div>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("LastPingTimeStamp")}</div>
              <div className="text-black">{record.LastPingTimeStamp}</div>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("Owner")}</div>
              <div className="text-black">{record.Owner ? record.Owner : "-"}</div>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("Description")}</div>
              <div className="text-black">{record.Description ? record.Description : "-"}</div>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("SerialNumber")}</div>
              <div className="text-black">{record.SerialNumber ? record.SerialNumber : "-"}</div>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("IP")}</div>
              <div className="text-black">{record.IP}</div>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("LastDate")}</div>
              <div className="text-black">{record.LastDate}</div>
            </div>
          </div>
          <h5 className="text-info fw-bold ps-2 mt-3 border-top pt-3 border-secondary text-uppercase">
            {t("webrepo")}
          </h5>
          {webrepo && (
            <div className="row m-0">
              <div className="col-md-6 col-12 pt-1">
                <div className="text-secondary fw-bold">{t("Arcade")}</div>
                <div className="text-black">{webrepo.Arcade ? webrepo.Arcade : "-"}</div>
              </div>
              <div className="col-md-6 col-12 pt-1">
                <div className="text-secondary fw-bold">{t("Customer")}</div>
                <div className="text-black">{webrepo.Customer ? webrepo.Customer : "-"}</div>
              </div>
              <div className="col-md-6 col-12 pt-1">
                <div className="text-secondary fw-bold">{t("Location")}</div>
                <div className="text-black">{webrepo.Location ? webrepo.Location : "-"}</div>
              </div>
              <div className="col-md-6 col-12 pt-1">
                <div className="text-secondary fw-bold">{t("LocationLevel1")}</div>
                <div className="text-black">
                  {webrepo.LocationLevel1 ? webrepo.LocationLevel1 : "-"}
                </div>
              </div>
              <div className="col-md-6 col-12 pt-1">
                <div className="text-secondary fw-bold">{t("LocationLevel2")}</div>
                <div className="text-black">
                  {webrepo.LocationLevel2 ? webrepo.LocationLevel2 : "-"}
                </div>
              </div>
              <div className="col-md-6 col-12 pt-1">
                <div className="text-secondary fw-bold">{t("LocationLevel3")}</div>
                <div className="text-black">
                  {webrepo.LocationLevel3 ? webrepo.LocationLevel3 : "-"}
                </div>
              </div>
              <div className="col-md-6 col-12 pt-1">
                <div className="text-secondary fw-bold">{t("SerialNumber")}</div>
                <div className="text-black">
                  {webrepo.SerialNumber ? webrepo.SerialNumber : "-"}
                </div>
              </div>
              <div className="col-md-6 col-12 pt-1">
                <div className="text-secondary fw-bold">{t("WebrepoUser")}</div>
                <div className="text-black">
                  {webrepo.WebrepoUser ? webrepo.WebrepoUser : "-"}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default GroupsInfoForm;
