import { memo } from "react";
import { GenericRecord } from "@/types";
import { useTranslation } from "@/context/contextUtils";




export const ListItem = ({ item }: { item: GenericRecord }) => {

  const t = useTranslation();


  return (
    <div className="p-2 bg-dark flex-grow-1 w-100 overflow-hidden d-flex flex-column  justify-content-between">
      <div className="d-flex flex-column flex-grow-1 justify-content-between">
        <div className="d-flex flex-column flex-grow-1">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              {item.GroupId} | {item.SerialNumber}
            </div>
            <div>{item.MachineId}</div>
          </div>
          <div className="pt-1 overflow-hidden" style={{ height: "38px" }}>
            {item.Id}
          </div>
          <div className="pt-1 d-flex align-items-center justify-content-start text-nowrap">
            <div>
              <span className="text-secondary pe-1">{t("Type")}:</span>
              {item.Type}
            </div>
            <div>
              <span className="text-secondary pe-1 ps-3">{t("TypeInfo")}:</span>
              {item.TypeInfo ? item.TypeInfo : "-"}
            </div>
          </div>
          <div className="pt-1">
            <span className="text-secondary pe-1">{t("ManufacturerSerialNumber")}:</span>
            {item.ManufacturerSerialNumber ? item.ManufacturerSerialNumber : "-"}
          </div>
        </div>

        <div className="d-flex justify-content-between">
          <div className="pt-1">
            <span className="text-secondary pe-1">{t("RPI")}:</span>
            {item.RPI ? item.RPI : "-"}
          </div>
          <div className="pt-1">
            <span className="text-secondary pe-1">{t("Owner")}:</span>
            {item.Owner ? item.Owner : "-"}
          </div>
        </div>

        <div className="d-flex justify-content-between pt-1 align-items-center">
          <div>
            <span className="text-secondary pe-1">{t("FirstDate")}:</span>
            {item.FirstDate}
          </div>
          <div className="badge rounded-pill bg-success">{t("validated")}</div>

        </div>

        <div className="d-flex justify-content-between pt-1 align-items-center">

          <div>
            <span className="text-secondary pe-1">{t("LastPing")}:</span>
            {item.LastPingTimeStamp}
          </div>
          <div className="text-warning rounded-pill badge bg-black">{t("validating")}</div>
        </div>


      </div>
    </div>
  );
};

export default memo(ListItem);
