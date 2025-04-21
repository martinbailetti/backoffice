import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError, setPage } from "@/slices/pageSlice";

import page from "@/config/pages/factory/dispatch_orders/edit";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import { GenericRecord } from "@/types";
import FormHeader from "@/components/form/FormHeader";
import FormWrapper from "@/components/form/FormWrapper";
import { setFlashMessage } from "@/slices/appSlice";
import { useTranslation } from "@/context/contextUtils";
import AsyncSelect from "react-select/async";
import AsyncCreatableSelect from "react-select/async-creatable";
import { FaTrash } from "react-icons/fa";
import { SingleValue } from "react-select";
import {
  createFactoryClients,
  getFactoryClients,
  getFactoryDispatchOrder,
  updateFactoryDispatchOrder,
} from "@/api/factory";
import { getFormattedDateTime } from "@/utils/table";
import { getFactoryFilterFactoryIds } from "@/api/filters";

const DispatchOrderEdit = () => {
  const t = useTranslation();

  // redux
  const userDataData = useAppSelector((state) => state.userData.data);
  const dispatch = useAppDispatch();

  // states

  const [record, setRecord] = useState<GenericRecord | null>(null);
  const [recordCurrent, setRecordCurrent] = useState<GenericRecord | null>(null);
  const [status, setStatus] = useState<string>("pending");
  const [newDevice, setNewDevice] = useState<GenericRecord | null>(null);
  const [devices, setDevices] = useState<GenericRecord[]>([]);

  // Prepare page data
  useEffect(() => {
    if (userDataData == null || status != "pending") return;
    const preparePage = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get("id");

      try {
        const response = await getFactoryDispatchOrder({ id: id });

        if (!response.data.success) {
          dispatch(setError(t("undefined_error")));
          return;
        }

        const result = response.data.result;

        const rec = {
          ...result,
          client: { value: result.factory_client_id, label: result.ClientName },
        };

        setRecord(rec);
        setRecordCurrent(rec);

        setDevices(
          result.items.map((device: GenericRecord) => ({
            label: device["device_id"],
            value: {
              GroupId: device.group_id,
              MachineId: device.machine_id,
              Id: device.device_id,
              Type: device.type,
              TypeInfo: device.type_info,
              ManufacturerSerialNumber: device.manufacturer_serial_number,
              RPI: device.rpi,
            },
          })),
        );
      } catch (error) {
        dispatch(setError(t("undefined_error")));
      }
      setStatus("prepared");
    };
    preparePage();
  }, [userDataData, dispatch]); // eslint-disable-line

  // Store page data
  useEffect(() => {
    if (status != "prepared") return;

    setStatus("ready");

    dispatch(
      setPage({
        title: page.title,
        breadcrumb: page.breadcrumb,
      }),
    );
  }, [dispatch, status]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!recordCurrent) return;
    setStatus("pending");

    try {
      const response = await updateFactoryDispatchOrder({
        ...recordCurrent,
        client_id: recordCurrent.client.value,
        items: devices.map((device) => device.value),
      });
      if (!response.data.success) {
        dispatch(setError(t("operation_not_executed")));
        setStatus("prepared");
        return;
      }

      dispatch(setFlashMessage({ message: t("updated_successfully"), type: "success" }));
      setStatus("prepared");
    } catch (error) {
      dispatch(setError(t("operation_not_executed")));
    }
    setStatus("prepared");
  };

  const loadClientOptions = async (inputValue: string) => {
    if (inputValue.length < 3) return [];
    try {
      const response = await getFactoryClients({ search: inputValue });

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
  const handleCreateClient = async (inputValue: string) => {
    try {
      const response = await createFactoryClients({ name: inputValue });
      console.log("response", response);
      setRecordCurrent({
        ...recordCurrent,
        client: { value: response.data.result.id, label: response.data.result.name },
      });
    } catch (error) {
      dispatch(setError(t("operation_not_executed")));
    }
  };

  const loadDevices = async (inputValue: string) => {
    if (inputValue.length < 3) return [];
    try {
      const response = await getFactoryFilterFactoryIds({
        search: inputValue,
      });

      if (!response.data.success) {
        console.log("error", response.data.message);
        return [];
      }

      return response.data.result.map((item: GenericRecord) => ({
        label: item["Id"],
        value: item,
      }));
    } catch (error) {
      console.log("error", error);
      return [];
    }
  };

  const handleDeviceSelection = (newValue: SingleValue<GenericRecord>) => {
    if (newValue) {
      setNewDevice(newValue);
    } else {
      setNewDevice(null);
    }
  };

  const addDevice = () => {
    if (!newDevice) return;

    if (devices.some((device) => device.value["Id"] === newDevice.value["Id"])) return;
    setDevices([...devices, newDevice]);
    setNewDevice(null);
  };

  const renderDevices = () => {
    console.log("devices", devices);
    return devices.map((device, index) => {
      return (
        <tr key={index}>
          <td>
            <a
              className="btn btn-danger btn-sm"
              onClick={() => {
                setDevices(devices.filter((item) => item !== device));
              }}
            >
              <FaTrash />
            </a>
          </td>
          <td>{device.value["Id"]}</td>
          <td>{device.value["MachineId"]}</td>
          <td>{device.value["GroupId"]}</td>
          <td>{device.value["ManufacturerSerialNumber"]}</td>
          <td>{device.value["Type"]}</td>
          <td>{device.value["TypeInfo"]}</td>
          <td>{device.value["RPI"]}</td>
        </tr>
      );
    });
  };

  return (
    <BackofficeMainTemplate status={status}>
      <form
        autoComplete="off"
        className="flex-grow-1 overflow-hidden d-flex flex-column"
        onSubmit={handleSubmit}
      >
        {record && recordCurrent && (
          <FormHeader
            title={record.name}
            handleReset={() => {
              setRecordCurrent(record);
              setDevices(
                record.items.map((device: GenericRecord) => ({
                  label: device["device_id"],
                  value: {
                    GroupId: device.group_id,
                    MachineId: device.machine_id,
                    Id: device.device_id,
                    Type: device.type,
                    TypeInfo: device.type_info,
                    ManufacturerSerialNumber: device.manufacturer_serial_number,
                    RPI: device.rpi,
                  },
                })),
              );
            }}
          />
        )}

        <FormWrapper>
          <div className="row">
            <div className="col-md-6 col-12 pt-1 ">
              <label htmlFor="detail">{t("number")}</label>
              <div className="form-control">{recordCurrent?.id_number}</div>
            </div>
            <div className="col-md-6 col-12 pt-1 ">

            </div>
            <div className="col-md-6 col-12 pt-1 ">
              <label htmlFor="default " className="w-100 d-block">
                {t("client")}
              </label>
              <AsyncCreatableSelect
                isClearable
                cacheOptions
                loadOptions={loadClientOptions}
                onCreateOption={handleCreateClient}
                value={recordCurrent?.client}
                onChange={(newValue) => {
                  setRecordCurrent({ ...recordCurrent, client: newValue });
                }}
                placeholder="Escribe o selecciona..."
              />
            </div>
            <div className="col-md-6 col-12 pt-1 ">
              <label htmlFor="detail">{t("detail")}</label>
              <input
                required
                type="text"
                className="form-control"
                id="detail"
                value={recordCurrent?.detail}
                onChange={(e) => setRecordCurrent({ ...recordCurrent, detail: e.target.value })}
              />
            </div>
            <div className="col-md-6 col-12 pt-1">
              <label>{t("created_at")}</label>
              <div className="form-control">{getFormattedDateTime(record?.created_at)}</div>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <label>{t("updated_at")}</label>
              <div className="form-control">{getFormattedDateTime(record?.updated_at)}</div>
            </div>
            <div className="col-md-6 col-12 pt-3">
              <label htmlFor="add_device" className="w-100">
                {t("add_device")}
              </label>
              <div className="d-flex">
                <div className="flex-grow-1">
                  <AsyncSelect
                    cacheOptions
                    loadOptions={loadDevices}
                    placeholder={t("select")}
                    isClearable
                    onChange={handleDeviceSelection}
                    value={newDevice}
                  />
                </div>
                <a className="btn btn-primary ms-1" onClick={addDevice}>
                  +
                </a>
              </div>
            </div>

            <div className="col-12 overflow-x-auto">
              {devices.length > 0 && (
                <table className="table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>{t("Id")}</th>
                      <th>{t("MachineId")}</th>
                      <th>{t("GroupId")}</th>
                      <th>{t("ManufacturerSerialNumber")}</th>
                      <th>{t("Type")}</th>
                      <th>{t("TypeInfo")}</th>
                      <th>{t("RPI")}</th>
                    </tr>
                  </thead>
                  <tbody>{renderDevices()}</tbody>
                </table>
              )}
            </div>
          </div>
        </FormWrapper>
      </form>
    </BackofficeMainTemplate>
  );
};
export default DispatchOrderEdit;
