import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError, setPage } from "@/slices/pageSlice";

import page from "@/config/pages/spv/dispatch_orders/edit";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import { GenericRecord } from "@/types";
import FormHeader from "@/components/form/FormHeader";
import FormWrapper from "@/components/form/FormWrapper";
import { setFlashMessage } from "@/slices/appSlice";
import { useTranslation } from "@/context/contextUtils";
import AsyncCreatableSelect from "react-select/async-creatable";
import { createSpvClient, createSpvType, getSpvClients, getSpvDispatchOrder, getSpvTypes, updateSpvDispatchOrder } from "@/api/spv";

const SpvDispatchOrderEdit = () => {
  const t = useTranslation();


  // redux
  const userDataData = useAppSelector((state) => state.userData.data);
  const dispatch = useAppDispatch();

  // states


  const [record, setRecord] = useState<GenericRecord | null>(null);
  const [recordCurrent, setRecordCurrent] = useState<GenericRecord | null>(null);
  const [status, setStatus] = useState<string>("pending");

  // Prepare page data
  useEffect(() => {
    if (userDataData == null || status != "pending") return;
    const preparePage = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get("id");

      try {
        const response = await getSpvDispatchOrder({ id: id });


        if (!response.data.success) {
          dispatch(setError(t("undefined_error")));
          return;
        }


        const result = response.data.result;

        const rec = { ...result, client: { value: result.spv_client_id, label: result.name }, type: { value: result.type, label: result.type } };

        setRecord(rec);
        setRecordCurrent(rec);


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

      const response = await updateSpvDispatchOrder({ ...recordCurrent, client_id: recordCurrent.client.value, type: recordCurrent.type.value });
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

    if(inputValue.length < 3) return [];
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

    try {
      const response = await createSpvType({ id: inputValue });
      console.log("response", response);
      setRecordCurrent({ ...recordCurrent, type: { value: response.data.result.id, label: response.data.result.id } });
    } catch (error) {
      dispatch(setError(t("operation_not_executed")));
    }
  };

  return (
    <BackofficeMainTemplate status={status}>
      <form autoComplete="off" className="flex-grow-1 overflow-hidden d-flex flex-column" onSubmit={handleSubmit}>
        {record && recordCurrent && <FormHeader title={record.name} handleReset={() => {
          setRecordCurrent(record);

        }} />}

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
              <input type="text" className="form-control" id="information"
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
export default SpvDispatchOrderEdit;
