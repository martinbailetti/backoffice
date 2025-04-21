import { GenericRecord } from "@/types";
import { useTranslation } from "@/context/contextUtils";
import Link from "next/link";
import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import { getFactoryModels } from "@/api/factory";
import { SingleValue } from "react-select";
import { getMachinePosition } from "@/utils";

const MachinesInfoForm = ({
  record,
  currentRecord,
  setCurrentRecord,
  paths,
  view = "show",
}: {
  record: GenericRecord;
  currentRecord: GenericRecord;
  setCurrentRecord?: (rec: GenericRecord) => void;
  paths: GenericRecord;
  view?: string;
}) => {
  const t = useTranslation();

  const [serialNumber, setSerialNumber] = useState<string>("");

  // Prepare page data
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const sn = searchParams.get("sn");
    setSerialNumber(sn ?? "");
  }, []);

  const loadOptions = async (inputValue: string) => {

    if(inputValue.length < 3) return [];
    try {
      const response = await getFactoryModels({ search: inputValue });

      if (!response.data.success) {
        console.log("error", response.data.message);
        return [];
      }

      return response.data.result.map((item: GenericRecord) => ({
        label: item["name"],
        value: item["id"],
      }));
    } catch (error) {
      console.log("error", error);
      return [];
    }
  };
  const handleSelection = (newValue: SingleValue<GenericRecord>) => {
    if (!setCurrentRecord) return;
    if (newValue) {
      setCurrentRecord({
        ...currentRecord,
        ModelId: newValue.value,
        ModelName: newValue.label,
      });
    } else {
      setCurrentRecord({
        ...currentRecord,
        ModelId: null,
        ModelName: "",
      });
    }
  };
  return (
    <div className="mt-md-0 mt-2 flex-grow-1 px-2 px-md-0 overflow-auto pb-5">
      <h5 className="text-info fw-bold ps-2 text-uppercase">{t("information")}</h5>
      <div className="row m-0">
        <div className="col-md-6 col-12">
          <div className="text-secondary fw-bold">{t("MachineId")}</div>
          <div className="text-info fw-bold">{record.MachineId}</div>
        </div>
        <div className="col-md-6 col-12 pt-md-0 pt-1">
          <div className="text-secondary fw-bold">{t("SerialNumber")}</div>
          <div className="text-black">
            <Link
              className="text-black"
              href={`${paths.group}?gid=${record.GroupId}&sn=${serialNumber}`}
            >
              {serialNumber}
            </Link>
          </div>
        </div>
        <div className="col-md-6 col-12 pt-md-0 pt-1">
          <div className="text-secondary fw-bold">{t("GroupId")}</div>
          <div className="text-black">
            <Link
              className="text-black"
              href={`${paths.group}?gid=${record.GroupId}&sn=${serialNumber}`}
            >
              {record.GroupId}
            </Link>
          </div>
        </div>
        <div className="col-md-6 col-12">
          <div className="text-secondary fw-bold pt-1">{t("Position")}</div>
          <div className="text-black">{getMachinePosition(record.Position)}</div>
        </div>
        <div className="col-md-6 col-12">
          <div className="text-secondary fw-bold pt-1">{t("devices")}</div>
          <div className="text-black">
            <Link
              className="text-black"
              href={`${paths.devices}?gid=${record.GroupId}&mid=${record.MachineId}&sn=${serialNumber}`}
            >
              {record.Total} {t("devices")}
            </Link>
          </div>
        </div>
        <div className="col-md-6 col-12">
          <div className="text-secondary fw-bold pt-1">{t("ModelName")}</div>
          {view == "show" && <div className="text-black">{record.ModelName}</div>}
          {view == "edit" && (
            <AsyncSelect
              cacheOptions
              loadOptions={loadOptions}
              placeholder={t("select")}
              isClearable
              onChange={handleSelection}
              className="flex-grow-1"
              value={{ label: currentRecord.ModelName, value: currentRecord.ModelId }}
            />
          )}
        </div>
      </div>

      {view === "edit" && (
        <div className="d-flex justify-content-end align-items-center border-top border-secondary mt-3 pt-2">
          <button type="submit" className="btn btn-primary me-2">
            {t("save")}
          </button>
          <a className="btn btn-secondary" onClick={() => setCurrentRecord && setCurrentRecord(record)}>
            {t("cancel")}
          </a>
        </div>
      )}
    </div>
  );
};
export default MachinesInfoForm;
