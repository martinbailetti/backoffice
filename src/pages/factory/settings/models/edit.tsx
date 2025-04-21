import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError, setPage } from "@/slices/pageSlice";

import page from "@/config/pages/factory/settings/models/edit";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import { GenericRecord } from "@/types";
import FormHeader from "@/components/form/FormHeader";
import FormWrapper from "@/components/form/FormWrapper";
import { setFlashMessage } from "@/slices/appSlice";
import { useTranslation } from "@/context/contextUtils";
import AsyncSelect from "react-select/async";
import { FaTrash } from "react-icons/fa";
import { SingleValue } from "react-select";
import {
  getFactoryModel,
  getFactoryTypes,
  updateFactoryModel,
} from "@/api/factory";

const FactoryModelEdit = () => {
  const t = useTranslation();

  // redux
  const userDataData = useAppSelector((state) => state.userData.data);
  const dispatch = useAppDispatch();

  // states

  const [record, setRecord] = useState<GenericRecord | null>(null);
  const [recordCurrent, setRecordCurrent] = useState<GenericRecord | null>(null);
  const [status, setStatus] = useState<string>("pending");
  const [newType, setNewType] = useState<GenericRecord | null>(null);
  const [types, setTypes] = useState<GenericRecord[]>([]);

  // Prepare page data
  useEffect(() => {
    if (userDataData == null || status != "pending") return;
    const preparePage = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get("id");

      try {
        const response = await getFactoryModel({ id: id });

        if (!response.data.success) {
          dispatch(setError(t("undefined_error")));
          return;
        }

        const result = response.data.result;

        const rec = { ...result };

        setRecord(rec);
        setRecordCurrent(rec);

        setTypes(
          result.types.map((type: GenericRecord) => ({
            Type: type["DeviceTypeId"],
            quantity: type["quantity"],
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
      const response = await updateFactoryModel({
        ...recordCurrent,
        types: types,
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

  const handleTypeSelection = (newValue: SingleValue<GenericRecord>) => {
    if (newValue) {
      setNewType({
        Type: newValue.value,
        quantity: 1,
      });
    } else {
      setNewType(null);
    }
  };

  const addType = () => {
    if (!newType) return;

    const index = types.findIndex((type) => type.Type === newType.Type);
    if (index >= 0) {
      const updatedTypes = types.map((type) =>
        type.Type === newType.Type ? { ...type, quantity: type.quantity + 1 } : type,
      );
      setTypes(updatedTypes);
    } else {
      setTypes([...types, newType]);
    }
    setNewType(null);
  };

  const renderTypes = () => {
    console.log("devices", types);
    return types.map((type, index) => {
      return (
        <tr key={index}>
          <td className="w-50px ">
            <a
              className="btn btn-danger btn-sm"
              onClick={() => {
                setTypes(types.filter((item) => item.Type !== type.Type));
              }}
            >
              <FaTrash />
            </a>
          </td>
          <td>{type.Type}</td>
          <td className="w-50px ">
            <input
              value={type.quantity}
              onChange={changeQuantity}
              type="number"
              className="form-control"
              min={1}
              step={1}
            />
          </td>
        </tr>
      );
    });
  };
  const changeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) return;
    const updatedTypes = types.map((type, index) =>
      index === (e.target.parentElement?.parentElement as HTMLTableRowElement)?.rowIndex - 1
        ? { ...type, quantity: value }
        : type,
    );
    setTypes(updatedTypes);
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
              setTypes(
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
              <label htmlFor="name">{t("detail")}</label>
              <input
                required
                type="text"
                className="form-control"
                id="name"
                value={recordCurrent?.name?recordCurrent.name:''}
                onChange={(e) => setRecordCurrent({ ...recordCurrent, name: e.target.value })}
              />
            </div>

            <div className="col-md-6 col-12 pt-1">
              <label htmlFor="add_type" className="w-100">
                {t("add_type")}
              </label>
              <div className="d-flex">
                <AsyncSelect
                  cacheOptions
                  loadOptions={loadTypeOptions}
                  placeholder={t("select")}
                  isClearable
                  onChange={handleTypeSelection}
                  className=" flex-grow-1"
                  value={newType?.Type ? { label: newType.Type, value: newType.Type } : null}
                />
                <a className="btn btn-primary ms-1" onClick={addType}>
                  +
                </a>
              </div>
            </div>

            <div className="col-12 overflow-x-auto">
              {types.length > 0 && (
                <table className="table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>{t("type")}</th>
                      <th>{t("quantity")}</th>
                    </tr>
                  </thead>
                  <tbody>{renderTypes()}</tbody>
                </table>
              )}
            </div>
          </div>
        </FormWrapper>
      </form>
    </BackofficeMainTemplate>
  );
};
export default FactoryModelEdit;
