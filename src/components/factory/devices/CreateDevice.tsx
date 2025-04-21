import {
  createFactoryDeviceDefinition,
  getFactoryClients,
  getFactoryDeviceDefinitions,
  getFactoryGroupsAll,
  getFactoryMachinesAll,
} from "@/api/factory";
import { getFactoryTypes } from "@/api/factory";
import { useTranslation } from "@/context/contextUtils";
import { useAppDispatch } from "@/redux/hooks";
import { setError } from "@/slices/pageSlice";
import { GenericRecord } from "@/types";
import React, { memo, useEffect, useRef, useState } from "react";
import { SingleValue } from "react-select";
import AsyncSelect from "react-select/async";
import AsyncCreatableSelect from "react-select/async-creatable";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";

/**
 * Print controls component.
 */

const CreateDevice = ({
  record,
  setRecord,
  multiple = false,
  groupSelector = "GroupId",
  fixedGroupIdMachineId = false,
  fixedType = false,
}: {
  record: GenericRecord;
  setRecord: (record: GenericRecord) => void;
  multiple?: boolean;
  groupSelector?: string;
  fixedGroupIdMachineId?: boolean;
  fixedType?: boolean;
}) => {
  const t = useTranslation();

  const [multi, setMulti] = useState(false);
  const [machines, setMachines] = useState<GenericRecord[]>([]);
  const [clients, setClients] = useState<GenericRecord[]>([]);

  const dispatch = useAppDispatch();

  const manufacturerSerialNumberMulti = useRef<HTMLInputElement>(null);
  useEffect(() => {
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

  const renderClients = () => {
    return clients.map((client: GenericRecord) => {
      return (
        <option key={client.id} value={client.id}>
          {client.name}
        </option>
      );
    });
  };
  const addManufacturerSerialNumber = () => {
    console.log("addManufacturerSerialNumber");

    console.log("addManufacturerSerialNumber", record);
    if (manufacturerSerialNumberMulti.current) {
      if (record.ManufacturerSerialNumber !== "") {
        setRecord({
          ...record,
          ManufacturerSerialNumber:
            record.ManufacturerSerialNumber + "," + manufacturerSerialNumberMulti.current.value,
        });
      } else {
        setRecord({
          ...record,
          ManufacturerSerialNumber: manufacturerSerialNumberMulti.current.value,
        });
      }
      manufacturerSerialNumberMulti.current.value = "";
    }
  };
  const removeManufacturerSerialNumber = (item: string) => {
    console.log("removeManufacturerSerialNumber", record);

    if (record.ManufacturerSerialNumber) {
      const items = record.ManufacturerSerialNumber.split(",");
      const newItems = items.filter((i: string) => i !== item);
      setRecord({
        ...record,
        ManufacturerSerialNumber: newItems.join(","),
      });
    }
  };
  const loadSerialNumberOptions = async (inputValue: string) => {
    if (inputValue.length < 3) return [];
    try {
      const response = await getFactoryGroupsAll({ column: "SerialNumber", search: inputValue });

      if (!response.data.success) {
        console.log("error", response.data.message);
        return [];
      }

      return response.data.result.map((item: GenericRecord) => ({
        label: item["SerialNumber"],
        value: item["GroupId"],
      }));
    } catch (error) {
      console.log("error", error);
      return [];
    }
  };

  const handleSerialNumberSelection = async (newValue: SingleValue<GenericRecord>) => {
    console.log("newValue", newValue);
    if (newValue) {
      setRecord({
        ...record,
        SerialNumber: newValue.label,
        GroupId: newValue.value,
      });

      try {
        const response = await getFactoryMachinesAll({ GroupId: newValue.value });

        if (!response.data.success) {
          console.log("error", response.data.message);
          return [];
        }

        setMachines(response.data.result);

        if (response.data.result.length > 0) {
          setRecord({
            ...record,
            SerialNumber: newValue.label,
            GroupId: newValue.value,
            MachineId: response.data.result[0].MachineId,
          });
        }
      } catch (error) {
        console.log("error", error);
        return [];
      }
    } else {
      setRecord({
        ...record,
        SerialNumber: "",
        GroupId: "",
      });
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
  const loadTypeOptions = async (inputValue: string) => {
    if (inputValue.length < 3) return [];
    try {
      const response = await getFactoryTypes({ search: inputValue });

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
      setRecord({
        ...record,
        ProductDefinition: newValue.value,
      });
    } else {
      setRecord({
        ...record,
        ProductDefinition: "",
      });
    }
  };
  const handleTypeSelection = (newValue: SingleValue<GenericRecord>) => {
    if (newValue) {
      setRecord({
        ...record,
        Type: newValue.value,
      });
    } else {
      setRecord({
        ...record,
        Type: "",
      });
    }
  };
  const handleCreateDeviceDefinition = async (inputValue: string) => {
    try {
      const response = await createFactoryDeviceDefinition({ id: inputValue });

      setRecord({ ...record, ProductDefinition: response.data.result.id });
    } catch (error) {
      dispatch(setError(t("operation_not_executed")));
    }
  };
  const getCustomizedQRLine = (line: number): string => {
    const lines = record.CustomizedQR.split("-,-");

    return lines[line] || "";
  };
  const setCustomizedQR = (value: string, line: number) => {
    const lines = record.CustomizedQR.split("-,-");
    lines[line] = value;
    setRecord({ ...record, CustomizedQR: lines.join("-,-") });
  };
  return (
    <div>
      <div className={`row`}>
        <div className={`col-12 col-md-6 mb-1`}>
          {groupSelector === "GroupId" && (
            <>
              <label htmlFor="GroupId">{t("GroupId")}</label>
              {fixedGroupIdMachineId && (
                <div className={`form-control`} id="GroupId">
                  {record.GroupId}
                </div>
              )}
              {!fixedGroupIdMachineId && (
                <input
                  type="text"
                  className={`form-control`}
                  id="GroupId"
                  onChange={(e) => setRecord({ ...record, GroupId: e.target.value })}
                />
              )}
            </>
          )}
          {groupSelector === "SerialNumber" && (
            <>
              <label htmlFor="SerialNumber">{t("SerialNumber")}</label>
              {fixedGroupIdMachineId && (
                <div className={`form-control`} id="SerialNumber">
                  {record.SerialNumber}
                </div>
              )}
              {!fixedGroupIdMachineId && (
                <AsyncSelect
                  cacheOptions
                  loadOptions={loadSerialNumberOptions}
                  placeholder={t("select")}
                  isClearable
                  onChange={handleSerialNumberSelection}
                  className=" flex-grow-1"
                  value={{ label: record.SerialNumber, value: record.GroupId }}
                />
              )}
            </>
          )}
        </div>
        <div className={`col-12 col-md-6 mb-1`}>
          <label htmlFor="MachineId">{t("MachineId")}</label>
          {fixedGroupIdMachineId && (
            <div className={`form-control`} id="MachineId">
              {record.MachineId}
            </div>
          )}
          {!fixedGroupIdMachineId && (
            <select
              id="MachineId"
              className={`form-control`}
              onChange={(e) => setRecord({ ...record, MachineId: e.target.value })}
            >
              {record.GroupId &&
                machines.map((machine) => (
                  <option key={machine.MachineId} value={machine.MachineId}>
                    {machine.MachineId}
                  </option>
                ))}
            </select>
          )}
        </div>
        <div className={`col-12 col-md-6 mb-1`}>
          <label htmlFor="Type">{t("Type")}</label>

          {fixedType && (
            <div className={`form-control`} id="Type">
              {record.Type}
            </div>
          )}
          {!fixedType && (
            <AsyncSelect
              cacheOptions
              loadOptions={loadTypeOptions}
              placeholder={t("select")}
              isClearable
              onChange={handleTypeSelection}
              className=" flex-grow-1"
              value={{ label: record.Type, value: record.Type }}
            />
          )}
        </div>
        <div className={`col-12 col-md-6 mb-1`}>
          <label htmlFor="TypeInfo">{t("TypeInfo")}{" "}({t("operator")})</label>
          <input
            type="text"
            value={record.TypeInfo || ""}
            className={`form-control`}
            id="TypeInfo"
            onChange={(e) => setRecord({ ...record, TypeInfo: e.target.value })}
          />
        </div>
        <div className={`col-12 col-md-6 mb-1`}>
          <label htmlFor="FactoryMachineSerialNumber">{t("FactoryMachineSerialNumber")}</label>
          <input
            type="text"
            value={record.FactoryMachineSerialNumber || ""}
            className={`form-control`}
            id="FactoryMachineSerialNumber"
            onChange={(e) => setRecord({ ...record, FactoryMachineSerialNumber: e.target.value })}
          />
        </div>
        <div className={`col-12 col-md-6 mb-1`}>
          <div className={`d-flex justify-content-between align-items-center`}>
            <label htmlFor="ManufacturerSerialNumber">{t("ManufacturerSerialNumber")}</label>
            {multiple && (
              <div>
                <label>
                  multi{" "}
                  <input
                    type="checkbox"
                    checked={multi}
                    onChange={(e) => {
                      setRecord({ ...record, ManufacturerSerialNumber: "", multi: e.target.checked });
                      setMulti(e.target.checked);
                    }}
                  />
                </label>
              </div>
            )}
          </div>

          {!multi && (
            <input
              type="text"
              value={record.ManufacturerSerialNumber || ""}
              className={`form-control`}
              id="ManufacturerSerialNumber"
              onChange={(e) => setRecord({ ...record, ManufacturerSerialNumber: e.target.value })}
            />
          )}
          {multi && (
            <>
              <div className={`d-flex justify-content-between align-items-center`}>
                <input
                  type="text"
                  className={`form-control`}
                  id="ManufacturerSerialNumber"
                  ref={manufacturerSerialNumberMulti}
                />
                <a className="btn btn-primary btn-sm ms-1" onClick={addManufacturerSerialNumber}>
                  <FaPlus />
                </a>
              </div>
              {record.ManufacturerSerialNumber && (
                <div className={`overflow-auto`} style={{ maxHeight: "200px" }}>
                  {record.ManufacturerSerialNumber.split(",").map((item: string, index: number) => {
                    return (
                      <div
                        key={index}
                        className={`d-flex justify-content-between align-items-center mb-1 `}
                      >
                        <div>{item}</div>
                        <a
                          className="btn btn-danger btn-sm"
                          onClick={() => removeManufacturerSerialNumber(item)}
                        >
                          <FaMinus />
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
        <div className={`col-12 col-md-6 mb-1`}>
          <label htmlFor="ProductDefinition">{t("ProductDefinition")}</label>
          <AsyncCreatableSelect
            cacheOptions
            loadOptions={loadDeviceDefinitionOptions}
            placeholder={t("select")}
            isClearable
            onChange={handleDeviceDefinitionSelection}
            className=" flex-grow-1"
            value={{ label: record.ProductDefinition, value: record.ProductDefinition }}
            onCreateOption={handleCreateDeviceDefinition}
          />
        </div>
        <div className={`col-12 col-md-6 mb-1`}>
          <label htmlFor="RPI">{t("RPI")}</label>
          <input
            type="text"
            value={record.RPI || ""}
            className={`form-control`}
            id="RPI"
            onChange={(e) => setRecord({ ...record, RPI: e.target.value })}
          />
        </div>
        <div className={`col-12 col-md-6 mb-1`}>
          <label htmlFor="SpareOrder">{t("SpareOrder")}</label>
          <input
            type="text"
            value={record.SpareOrder || ""}
            className={`form-control`}
            id="SpareOrder"
            onChange={(e) => setRecord({ ...record, SpareOrder: e.target.value })}
          />
        </div>
        <div className={`col-12 col-md-6 mb-1`}>
          <label htmlFor="ClientNumber">{t("ClientNumber")}{" "}({t("order_number")})</label>
          <input
            type="text"
            value={record.ClientNumber || ""}
            className={`form-control`}
            id="ClientNumber"
            onChange={(e) => setRecord({ ...record, ClientNumber: e.target.value })}
          />
        </div>
        <div className={`col-12 col-md-6 mb-1`}>
          <label htmlFor="MachineSerialNumber">{t("MachineSerialNumber")}</label>
          <input
            type="text"
            value={record.MachineSerialNumber || ""}
            className={`form-control`}
            id="MachineSerialNumber"
            onChange={(e) => setRecord({ ...record, MachineSerialNumber: e.target.value })}
          />
        </div>
        <div className={`col-12 col-md-6 mb-1`}>
          <label htmlFor="Client">{t("Client")}</label>

          <select
            className="form-control"
            id="Client"
            value={record.Client ? record.Client : ""}
            onChange={(e) => setRecord({ ...record, Client: e.target.value })}
          >
            <option value="">{t("select")}</option>
            {renderClients()}
          </select>
        </div>
        <div className={`col-12 col-md-6 mb-1 mt-1`}>
          <input
            id="CustomizedQR"
            type="checkbox"
            className={`form-check-input`}
            onChange={(e) =>
              setRecord({ ...record, CustomizedQR: e.target.checked ? `-,--,--,--,-` : null })
            }
          />
          <label htmlFor="CustomizedQR" className={`ps-2`}>
            {t("CustomizedQR")}
          </label>
          {record.CustomizedQR && (
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
      </div>
    </div>
  );
};
export default memo(CreateDevice);
