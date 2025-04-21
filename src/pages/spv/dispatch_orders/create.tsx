import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError, setPage } from "@/slices/pageSlice";

import page from "@/config/pages/spv/dispatch_orders/create";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import { GenericRecord } from "@/types";
import FormHeader from "@/components/form/FormHeader";
import FormWrapper from "@/components/form/FormWrapper";
import { useRouter } from "next/router";
import { setFlashMessage } from "@/slices/appSlice";
import { useTranslation } from "@/context/contextUtils";
import AsyncCreatableSelect from "react-select/async-creatable";
import { createSpvClient, createSpvDispatchOrder, createSpvType, getSpvClients, getSpvTypes } from "@/api/spv";




const SpvDispatchOrderCreate = () => {
  const router = useRouter();

  // states

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

      console.log("recordCurrent", recordCurrent);
      const response = await createSpvDispatchOrder({ ...recordCurrent, spv_client_id: recordCurrent.client.value, type: recordCurrent.type.value.id });

      setRecordCurrent(response.data.result);
      dispatch(setFlashMessage({ message: t("created_successfully"), type: "success" }));
      router.push(`/spv/dispatch_orders/edit?id=${response.data.result.id}`);
    } catch (error) {
      dispatch(setError(t("operation_not_executed")));
    }
    setStatus("prepared");
  };

  const loadClientOptions = async (inputValue: string) => {

    if(inputValue.length < 3) return [];
    try {
      const response = await getSpvClients({ search: inputValue });

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
      const response = await createSpvClient({ name: inputValue });
      console.log("response", response);
      setRecordCurrent({ ...recordCurrent, client: { value: response.data.result.id, label: response.data.result.name } });
    } catch (error) {
      dispatch(setError(t("operation_not_executed")));
    }
  };

  const loadTypesOptions = async (inputValue: string) => {
    try {
      const response = await getSpvTypes({ search: inputValue });

      if (!response.data.success) {
        console.log("error", response.data.message);
        return [];
      }

      return response.data.result.map((item: GenericRecord) => ({
        label: item["id"],
        value: item,
      }));
    } catch (error) {
      console.log("error", error);
      return [];
    }
  };

  const handleCreateType = async (inputValue: string) => {

    if(inputValue.length < 3) return [];
    try {
      const response = await createSpvType({ id: inputValue });
      console.log("response", response);
      setRecordCurrent({ ...recordCurrent, type: { value: response.data.result, label: response.data.result.id } });
    } catch (error) {
      dispatch(setError(t("operation_not_executed")));
    }
  };

  return (
    <BackofficeMainTemplate status={status}>
      <form
        autoComplete="off"
        className="flex-grow-1 overflow-hidden d-flex flex-column"
        onSubmit={handleSubmit}
      >
        <FormHeader handleReset={() => { setRecordCurrent(null); }} />

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
                value={recordCurrent?.client ? recordCurrent.client : ''}
                onChange={(newValue) => {
                  setRecordCurrent({ ...recordCurrent, client: newValue });
                }}
                placeholder="Escribe o selecciona..."
              />
            </div>

            <div className="col-md-6 col-12 pt-1 ">
              <label htmlFor="default " className="w-100 d-block">
                {t("type")}
              </label>
              <AsyncCreatableSelect
                isClearable
                cacheOptions
                loadOptions={loadTypesOptions}
                onCreateOption={handleCreateType}
                value={recordCurrent?.type ? recordCurrent.type : ''}
                onChange={(newValue) => {
                  setRecordCurrent({ ...recordCurrent, type: newValue });
                }}
                placeholder="Escribe o selecciona..."
              />
            </div>

            <div className="col-md-6 col-12 pt-1 ">
              <label htmlFor="type_info" className="w-100 d-block">
                {t("information")}
              </label>
              <input type="text" className="form-control" id="type_info"
                onChange={(e) => setRecordCurrent({ ...recordCurrent, type_info: e.target.value })}
                value={recordCurrent?.type_info ? recordCurrent.type_info : ''} />

            </div>

            <div className="col-md-6 col-12 pt-1 ">
              <label htmlFor="manufacturer_serial_number" className="w-100 d-block">
                {t("ManufacturerSerialNumber")}
              </label>
              <input type="text" className="form-control" id="manufacturer_serial_number"
                onChange={(e) => setRecordCurrent({ ...recordCurrent, manufacturer_serial_number: e.target.value })}
                value={recordCurrent?.manufacturer_serial_number ? recordCurrent.manufacturer_serial_number : ''} />

            </div>

            <div className="col-md-6 col-12 pt-1 ">
              <label htmlFor="rpi" className="w-100 d-block">
                {t("RPI")}
              </label>
              <input type="text" className="form-control" id="rpi"
                onChange={(e) => setRecordCurrent({ ...recordCurrent, rpi: e.target.value })}
                value={recordCurrent?.rpi ? recordCurrent.rpi : ''} />

            </div>


            <div className="col-12 pt-1 ">
              <label htmlFor="detail">{t("detail")}</label>
              <textarea
                className="form-control"
                id="detail"
                onChange={(e) => setRecordCurrent({ ...recordCurrent, detail: e.target.value })}
                value={recordCurrent?.detail ? recordCurrent.detail : ''}
              />
            </div>
          </div>
        </FormWrapper>
      </form>
    </BackofficeMainTemplate>
  );
};
export default SpvDispatchOrderCreate;
