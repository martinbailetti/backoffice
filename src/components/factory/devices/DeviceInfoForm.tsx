import { useAppDispatch } from "@/redux/hooks";
import { setError } from "@/slices/pageSlice";

import { GenericRecord } from "@/types";
import { useTranslation } from "@/context/contextUtils";
import { setFlashMessage } from "@/slices/appSlice";
import Link from "next/link";
import AsyncCreatableSelect from "react-select/async-creatable";
import {
  createFactoryDeviceDefinition,
  deleteFactoryDevice,
  getFactoryClients,
  getFactoryDeviceDefinitions,
} from "@/api/factory";
import { SingleValue } from "react-select";
import { useEffect, useState } from "react";
import PrintPreviewViewer from "@/components/print/PrintPreviewViewer";
import { useRouter } from "next/router";

const DeviceInfoForm = ({
  record,
  currentRecord,
  setCurrentRecord,
  view,
  history,
  setStatus,
  paths,
}: {
  record: GenericRecord;
  view: string;
  paths: GenericRecord;
  history: GenericRecord[] | null;
  setStatus: (status: string) => void;
  currentRecord: GenericRecord;
  setCurrentRecord: (currentRecord: GenericRecord) => void;
}) => {
  const t = useTranslation();
  const router = useRouter();
  // redux
  const dispatch = useAppDispatch();

  const [clients, setClients] = useState<GenericRecord[]>([]);

  const deleteDevice = async () => {
    if (!record) return;

    try {
      setStatus("pending");
      const response = await deleteFactoryDevice(record);

      if (!response.data.success) {
        dispatch(setFlashMessage({ message: t(response.data.message), type: "danger" }));
      } else {
        router.push(`/factory/devices?gid=${record.GroupId}&mid=${record.MachineId}`);
      }
    } catch (error) {
      dispatch(setError(t("operation_not_executed")));
      return;
    }
  };
  const loadDeviceDefinitionOptions = async (inputValue: string) => {
    if (inputValue.length < 3) return [];
    try {
      const response = await getFactoryDeviceDefinitions({ search: inputValue });

      if (!response.data.success) {
        console.log("error", response.data.message);
        return [];
      }

      return response.data.result.map((item: GenericRecord) => ({
        label: item["id"],
        value: item["id"],
      }));
    } catch (error) {
      console.log("error", error);
      return [];
    }
  };
  const handleDeviceDefinitionSelection = (newValue: SingleValue<GenericRecord>) => {
    if (newValue) {
      setCurrentRecord({
        ...currentRecord,
        ProductDefinition: newValue.value,
      });
    } else {
      setCurrentRecord({
        ...currentRecord,
        ProductDefinition: "",
      });
    }
  };
  const handleCreateDeviceDefinition = async (inputValue: string) => {
    try {
      const response = await createFactoryDeviceDefinition({ id: inputValue });

      setCurrentRecord({ ...currentRecord, ProductDefinition: response.data.result.id });
    } catch (error) {
      dispatch(setError(t("operation_not_executed")));
    }
  };
  const getCustomizedQRLine = (line: number): string => {
    const lines = currentRecord.CustomizedQR.split("-,-");

    return lines[line] || "";
  };
  const setCustomizedQR = (value: string, line: number) => {
    const lines = currentRecord.CustomizedQR.split("-,-");
    lines[line] = value;
    setCurrentRecord({ ...currentRecord, CustomizedQR: lines.join("-,-") });
  };
  const renderClients = () => {
    return clients.map((client: GenericRecord) => {
      return (
        <option key={client.id} value={client.id}>
          {client.name}
        </option>
      );
    });
  };
  useEffect(() => {
    if (view !== "edit") return;
    const getClients = async () => {
      try {
        const response = await getFactoryClients();
        setClients(response.data.result);
      } catch (error) {
        dispatch(setError(t("undefined_error")));
      }
    };

    getClients();
  }, []); // eslint-disable-line
  return (
    <>
      {record && (
        <>
          <div className="row m-0">
            <div className="col-12 mb-3"></div>
            <div className="col-12">
              <div className="text-secondary fw-bold">{t("Id")}</div>
              <div className="text-info fw-bold">{record.Id}</div>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("MachineId")}</div>
              <Link
                className="text-dark"
                href={`${paths.machine}?gid=${record.GroupId}&mid=${record.MachineId}&sn=${record.SerialNumber}`}
              >
                {record.MachineId}
              </Link>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("SerialNumber")}</div>
              <Link
                href={`${paths.group}?gid=${record.GroupId}&sn=${record.SerialNumber}`}
                passHref
                className="text-dark"
              >
                {record.SerialNumber}
              </Link>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("Type")}</div>
              <div className="">{record.Type}</div>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("TypeInfo")}</div>
              <div className="">{record.TypeInfo ? record.TypeInfo : "-"}</div>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("WhyActive")}</div>
              <div className="">{record.WhyActive}</div>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("Active")}</div>
              <div className="">{record.Active}</div>
            </div>



            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("FactoryMachineSerialNumber")}</div>

              {view === "show" && (
                <div className="">
                  {record.FactoryMachineSerialNumber ? record.FactoryMachineSerialNumber : "-"}
                </div>
              )}
              {view === "edit" && (
                <input
                  className="form-control"
                  readOnly={currentRecord.FactoryDevice==1? false : true}
                  value={
                    currentRecord?.FactoryMachineSerialNumber
                      ? currentRecord.FactoryMachineSerialNumber
                      : ""
                  }
                  onChange={(e) =>
                    setCurrentRecord({
                      ...currentRecord,
                      FactoryMachineSerialNumber: e.currentTarget.value,
                    })
                  }
                />
              )}
            </div>
            <div className="col-md-6 col-12 pt-1">
              <label className="text-secondary fw-bold" htmlFor="Client">
                {t("Client")}
              </label>

              {view === "show" && (
                <div className="">{record.ClientName ? record.ClientName : "-"}</div>
              )}
              {view === "edit" && (
                <select
                  className="form-control"
                  id="Client"
                  value={currentRecord.Client ? currentRecord.Client : ""}
                  onChange={(e) => setCurrentRecord({ ...currentRecord, Client: e.target.value })}
                >
                  <option value="">{t("select")}</option>
                  {renderClients()}
                </select>
              )}
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("ManufacturerSerialNumber")}</div>

              {view === "show" && (
                <div className="">
                  {record.ManufacturerSerialNumber ? record.ManufacturerSerialNumber : "-"}
                </div>
              )}
              {view === "edit" && (
                <input
                  className="form-control"
                  value={
                    currentRecord?.ManufacturerSerialNumber
                      ? currentRecord.ManufacturerSerialNumber
                      : ""
                  }
                  onChange={(e) =>
                    setCurrentRecord({
                      ...currentRecord,
                      ManufacturerSerialNumber: e.currentTarget.value,
                    })
                  }
                />
              )}
            </div>

            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("RPI")}</div>
              {view === "show" && <div className="">{record.RPI ? record.RPI : "-"}</div>}
              {view === "edit" && (
                <input
                  className="form-control"
                  value={currentRecord?.RPI ? currentRecord.RPI : ""}
                  onChange={(e) =>
                    setCurrentRecord({ ...currentRecord, RPI: e.currentTarget.value })
                  }
                />
              )}
            </div>

            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("ProductDefinition")}</div>

              {view === "show" && (
                <div className="">{record.ProductDefinition ? record.ProductDefinition : "-"}</div>
              )}

              {view === "edit" && (
                <AsyncCreatableSelect
                  cacheOptions
                  loadOptions={loadDeviceDefinitionOptions}
                  placeholder={t("select")}
                  isClearable
                  onChange={handleDeviceDefinitionSelection}
                  className=" flex-grow-1"
                  value={{
                    label: currentRecord.ProductDefinition,
                    value: currentRecord.ProductDefinition,
                  }}
                  onCreateOption={handleCreateDeviceDefinition}
                />
              )}
            </div>

            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("MachineSerialNumber")}</div>

              {view === "show" && (
                <div className="">
                  {record.MachineSerialNumber ? record.MachineSerialNumber : "-"}
                </div>
              )}
              {view === "edit" && (
                <input
                  className="form-control"
                  value={
                    currentRecord?.MachineSerialNumber ? currentRecord.MachineSerialNumber : ""
                  }
                  onChange={(e) =>
                    setCurrentRecord({
                      ...currentRecord,
                      MachineSerialNumber: e.currentTarget.value,
                    })
                  }
                />
              )}
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("ClientNumber")}</div>

              {view === "show" && (
                <div className="">{record.ClientNumber ? record.ClientNumber : "-"}</div>
              )}
              {view === "edit" && (
                <input
                  className="form-control"
                  value={currentRecord?.ClientNumber ? currentRecord.ClientNumber : ""}
                  onChange={(e) =>
                    setCurrentRecord({
                      ...currentRecord,
                      ClientNumber: e.currentTarget.value,
                    })
                  }
                />
              )}
            </div>

            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("Owner")}</div>
              <div className="">{record.Owner ? record.Owner : "-"}</div>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("FirstDate")}</div>
              <div className="">{record.FirstDate ? record.FirstDate : "-"}</div>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("LastPingTimeStamp")}</div>
              <div className="">{record.LastPingTimeStamp ? record.LastPingTimeStamp : "-"}</div>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("request")}</div>
              <div className="">
                {record.ActionRequest == 0 && <>-</>}
                {record.ActionRequest == 1 && (
                  <span className={`badge rounded-pill bg-warning text-dark`}>
                    {t("invalidating")}
                  </span>
                )}
                {record.ActionRequest == 2 && (
                  <span className={`badge rounded-pill bg-warning  text-dark`}>
                    {t("validating")}
                  </span>
                )}
              </div>
            </div>
            <div className={`col-12`}></div>

            {view === "edit" && (
              <div className={`col-12 col-md-6 mb-1 mt-1`}>
                <input
                  id="CustomizedQR"
                  type="checkbox"
                  className={`form-check-input`}
                  checked={currentRecord.CustomizedQR ? true : false}
                  onChange={(e) =>
                    setCurrentRecord({
                      ...currentRecord,
                      CustomizedQR: e.target.checked ? `-,--,--,--,-` : null,
                    })
                  }
                />
                <label htmlFor="CustomizedQR" className={`ps-2 text-secondary fw-bold`}>
                  {t("CustomizedQR")}
                </label>

                {currentRecord.CustomizedQR && (
                  <div className="mt-2">
                    <input
                      type="text"
                      className={`form-control mb-1`}
                      placeholder={`${t("line")} 1`}
                      value={getCustomizedQRLine(0)}
                      onChange={(e) => {
                        setCustomizedQR(e.target.value, 0);
                      }}
                    />
                    <input
                      type="text"
                      className={`form-control mb-1`}
                      placeholder={`${t("line")} 2`}
                      value={getCustomizedQRLine(1)}
                      onChange={(e) => {
                        setCustomizedQR(e.target.value, 1);
                      }}
                    />
                    <input
                      type="text"
                      className={`form-control mb-1`}
                      placeholder={`${t("line")} 3`}
                      value={getCustomizedQRLine(2)}
                      onChange={(e) => {
                        setCustomizedQR(e.target.value, 2);
                      }}
                    />
                    <input
                      type="text"
                      className={`form-control mb-1`}
                      placeholder={`${t("line")} 4`}
                      value={getCustomizedQRLine(3)}
                      onChange={(e) => {
                        setCustomizedQR(e.target.value, 3);
                      }}
                    />
                    <input
                      type="text"
                      className={`form-control`}
                      placeholder={`${t("line")} 5`}
                      value={getCustomizedQRLine(4)}
                      onChange={(e) => {
                        setCustomizedQR(e.target.value, 4);
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            <div className={`col-12 col-md-6 mb-1 mt-1`}>
              <label className={`text-secondary fw-bold`}>{t("QR")}</label>
              <PrintPreviewViewer devices={[record]} single={true} />
            </div>
          </div>
          {view === "edit" && (
            <div className="d-flex justify-content-end align-items-center border-top border-secondary mt-3 pt-2">
              <button type="submit" className="btn btn-primary me-2">
                {t("save")}
              </button>
              <button type="button" className="btn btn-danger me-2" onClick={deleteDevice}>
                {t("delete")}
              </button>
              <a className="btn btn-secondary" onClick={() => setCurrentRecord(record)}>
                {t("cancel")}
              </a>
            </div>
          )}
          {view === "show" && (
            <div className="row m-0">
              <h5 className="text-info fw-bold ps-2 mt-3 border-top pt-3 border-secondary text-uppercase">
                {t("history")}
              </h5>
              {history && history.length > 0 && (
                <div className="col-12 overflow-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="px-1 text-secondary">{t("GroupId")}</th>
                        <th className="px-1 text-secondary">{t("MachineId")}</th>
                        <th className="px-1 text-end text-secondary">{t("Action")}</th>
                        <th className="px-1 text-secondary">{t("ActionExtraInfo")}</th>
                        <th className="px-1 text-secondary">{t("Description")}</th>
                        <th className="px-1 text-secondary">{t("InsertionTimestamp")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((element: GenericRecord, index: number) => (
                        <tr key={index}>
                          <td className="px-1 text-nowrap">{element.GroupId}</td>
                          <td className="px-1 text-nowrap">{element.MachineId}</td>
                          <td className="px-1 text-end text-nowrap">{element.Action}</td>
                          <td className="px-1 text-nowrap">{element.ActionExtraInfo}</td>
                          <td className="px-1 text-nowrap" style={{ minWidth: "250px" }}>
                            {element.Description}
                          </td>
                          <td className="px-1 text-nowrap">{element.InsertionTimestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {history && history.length == 0 && (
                <div className="col-12 overflow-auto">{t("no_records_found")}</div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};
export default DeviceInfoForm;
