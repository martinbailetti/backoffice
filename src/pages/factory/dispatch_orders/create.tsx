import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError, setPage } from "@/slices/pageSlice";

import page from "@/config/pages/factory/dispatch_orders/create";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import { GenericRecord } from "@/types";
import FormHeader from "@/components/form/FormHeader";
import FormWrapper from "@/components/form/FormWrapper";
import { useRouter } from "next/router";
import { setFlashMessage } from "@/slices/appSlice";
import { useTranslation } from "@/context/contextUtils";
import AsyncCreatableSelect from "react-select/async-creatable";
import { SingleValue } from "react-select";
import { createFactoryClients, createFactoryDispatchOrder, getFactoryClients } from "@/api/factory";
import AsyncSelect from "react-select/async";
import { FaTrash } from "react-icons/fa";
import { getFactoryFilterFactoryIds } from "@/api/filters";



const DispatchOrderCreate = () => {
  const router = useRouter();

  // states

  const [newDevice, setNewDevice] = useState<GenericRecord | null>(null);
  const [devices, setDevices] = useState<GenericRecord[]>([]);
  const [recordCurrent, setRecordCurrent] = useState<GenericRecord | null>(null);
  const [status, setStatus] = useState<string>("prepared");

  const t = useTranslation();

  // redux
  const userDataData = useAppSelector((state) => state.userData.data);
  const dispatch = useAppDispatch();

  // states

  // Store page data
  useEffect(() => {
    if (userDataData && status != "prepared") return;

    dispatch(
      setPage({
        title: page.title,
        breadcrumb: page.breadcrumb,
      }),
    );
    setStatus("ready");
  }, [dispatch, status, userDataData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!recordCurrent) return;

    try {
      const response = await createFactoryDispatchOrder({ ...recordCurrent, client_id: recordCurrent.client.value, items: devices.map((device) => device.value) });

      setRecordCurrent(response.data.result);
      dispatch(setFlashMessage({ message: t("created_successfully"), type: "success" }));
      router.push(`/factory/dispatch_orders/edit?id=${response.data.result.id}`);
    } catch (error) {
      dispatch(setError(t("operation_not_executed")));
    }
    setStatus("prepared");
  };

  const loadClientOptions = async (inputValue: string) => {

    if(inputValue.length < 3) return [];
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
      setRecordCurrent({ ...recordCurrent, client: {value:response.data.result.id, label:response.data.result.name} });
    } catch (error) {
      dispatch(setError(t("operation_not_executed")));
    }
  };

  const loadDevices = async (inputValue: string) => {

    if(inputValue.length < 3) return [];
    try {
      const response = await getFactoryFilterFactoryIds({
        search: inputValue,
        per_page: 10,
      });

      if (!response.data.success) {
        console.log("error", response.data.message);
        return [];
      }

      return response.data.result.map((item: GenericRecord) => ({
        label: <><small className="fst-italic">{item["Type"]}</small><span className="ps-2 text-secondary">{`${item["Id"]}${item["ManufacturerSerialNumber"]?' - '+item["ManufacturerSerialNumber"]:''}`}</span></>,
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
        <FormHeader handleReset={() => {setRecordCurrent(null);setDevices([])}} />

        <FormWrapper>
          <div className="row">
            <div className="col-md-6 col-12 pt-1 ">
              <label htmlFor="default " className="w-100 d-block">
                {t("client")}
              </label>
              <AsyncCreatableSelect
                isClearable
                cacheOptions
                loadOptions={loadClientOptions}
                onCreateOption={handleCreateClient}
                value={recordCurrent?.client?recordCurrent.client:''}
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
                onChange={(e) => setRecordCurrent({ ...recordCurrent, detail: e.target.value })}
                value={recordCurrent?.detail?recordCurrent.detail:''}
              />
            </div>
            <div className="col-md-6 col-12 pt-3">
              <label htmlFor="add_device" className="w-100">
                {t("add_device")}
              </label>
              <div className="d-flex">
                <AsyncSelect
                  cacheOptions
                  loadOptions={loadDevices}
                  placeholder={t("select")}
                  isClearable
                  onChange={handleDeviceSelection}
                  className=" flex-grow-1"
                  value={newDevice}
                />
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
export default DispatchOrderCreate;
