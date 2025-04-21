import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError, setPage } from "@/slices/pageSlice";

import page from "@/config/pages/factory/settings/models/create";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import { GenericRecord } from "@/types";
import FormHeader from "@/components/form/FormHeader";
import FormWrapper from "@/components/form/FormWrapper";
import { useRouter } from "next/router";
import { setFlashMessage } from "@/slices/appSlice";
import { useTranslation } from "@/context/contextUtils";
import { SingleValue } from "react-select";
import {
  createFactoryModel,
} from "@/api/factory";
import AsyncSelect from "react-select/async";
import { FaTrash } from "react-icons/fa";
import { getFactoryTypes } from "@/api/factory";

const FactoryModelCreate = () => {
  const router = useRouter();

  // states

  const [newType, setNewType] = useState<GenericRecord | null>(null);
  const [types, setTypes] = useState<GenericRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<GenericRecord | null>(null);
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

    try {
      const response = await createFactoryModel({
        ...currentRecord,
        types: types,
      });

      dispatch(setFlashMessage({ message: t("created_successfully"), type: "success" }));
      router.push(`/factory/settings/models/edit?id=${response.data.result.id}`);
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
          <td>
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
            <input value={type.quantity} onChange={changeQuantity} type="number" className="form-control" min={1} step={1} />
          </td>
        </tr>
      );
    });
  };
const changeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) return;
    const updatedTypes = types.map((type, index) =>
      index === (e.target.parentElement?.parentElement as HTMLTableRowElement)?.rowIndex - 1 ? { ...type, quantity: value } : type,
    );
    setTypes(updatedTypes);
  }

  return (
    <BackofficeMainTemplate status={status}>
      <form
        autoComplete="off"
        className="flex-grow-1 overflow-hidden d-flex flex-column"
        onSubmit={handleSubmit}
      >
        <FormHeader
          handleReset={() => {
            setCurrentRecord(null);
            setTypes([]);
          }}
        />

        <FormWrapper>
          <div className="row">
            <div className="col-md-6 col-12 pt-1 ">
              <label htmlFor="name">{t("name")}</label>
              <input
                required
                type="text"
                className="form-control"
                id="name"
                onChange={(e) => setCurrentRecord({ ...currentRecord, name: e.target.value })}
                value={currentRecord?.name ? currentRecord.name : ""}
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
                      <th>{t("Type")}</th>
                      <th>{t("Quantity")}</th>
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
export default FactoryModelCreate;
