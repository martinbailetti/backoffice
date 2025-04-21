import { memo, useEffect, useState } from "react";
import { GenericRecord } from "@/types";

import { useTranslation } from "@/context/contextUtils";
import { getDeviceHistory } from "@/api/licenses";

export const ListItemDetail = ({ item }: { item: GenericRecord }) => {
  const t = useTranslation();
  const [selectedHistory, setSelectedHistory] = useState<GenericRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDeviceHistory({ Id: item.Id });
        setSelectedHistory(result.data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [item]);

  const renderHistory = () => {

    if (selectedHistory.length > 0) {
 
      return selectedHistory.map((historyItem) => (
        <div key={historyItem.AutoInc} className="text-secondary pt-1">
          {historyItem.GroupId}: {historyItem.MachineId}
        </div>
      ));
    }
    return null;
  };
  return (
    <div className={"flex-grow-1 bg-dark overflow-auto p-2 d-flex flex-column"}>
      <div className="text-info pt-1">{t("information")}</div>
      <div className="text-secondary pt-2">{t("Id")}:</div>
      <div>{item.Id}</div>
      <div className="text-secondary pt-1">{t("MachineId")}:</div>
      <div>{item.MachineId}</div>
      <div className="text-secondary pt-1">{t("GroupId")}:</div>
      <div>{item.GroupId}</div>
      <div className="text-secondary pt-1">{t("SerialNumber")}:</div>
      <div>{item.SerialNumber ?? "-"}</div>
      <div className="text-secondary pt-1">{t("Type")}:</div>
      <div>{item.Type}</div>
      <div className="text-secondary pt-1">{t("TypeInfo")}:</div>
      <div>{item.TypeInfo ? item.TypeInfo : "-"}</div>
      <div className="text-secondary pt-1">{t("ManufacturerSerialNumber")}:</div>
      <div>{item.ManufacturerSerialNumber ? item.ManufacturerSerialNumber : "-"}</div>
      <div className="text-secondary pt-1">{t("RPI")}:</div>
      <div>{item.RPI ? item.RPI : "-"}</div>
      <div className="text-secondary pt-1">{t("Owner")}:</div>
      <div>{item.Owner ?? "-"}</div>
      <div className="text-secondary pt-1">{t("FirstDate")}:</div>
      <div>{item.FirstDate}</div>
      <div className="text-secondary pt-1">{t("LastPingTimeStamp")}:</div>
      <div>{item.LastPingTimeStamp}</div>
      <div className="text-info pt-3 border-top border-info mt-3">{t("history")}</div>
      {!loading && selectedHistory.length > 0 && renderHistory()}
      {!loading && selectedHistory.length == 0 && (
        <div className="text-secondary pt-1">{t("no_records")}</div>
      )}
    </div>
  );
};

export default memo(ListItemDetail);
