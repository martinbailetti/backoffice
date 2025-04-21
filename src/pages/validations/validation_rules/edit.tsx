import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError, setPage } from "@/slices/pageSlice";

import page from "@/config/pages/validations/validation_rules/edit";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import { GenericRecord } from "@/types";
import FormHeader from "@/components/form/FormHeader";
import FormWrapper from "@/components/form/FormWrapper";
import { setFlashMessage } from "@/slices/appSlice";
import { useTranslation } from "@/context/contextUtils";
import { getValidationRule, updateValidationRule } from "@/api/validations";
import { getDeviceTypes } from "@/api/search";
import { SingleValue } from "react-select";
import AsyncSelect from "react-select/async";
import Link from "next/link";


const ValidationRuleEdit = () => {
  const t = useTranslation();


  // redux
  const userDataData = useAppSelector((state) => state.userData.data);
  const dispatch = useAppDispatch();

  // states


  const [record, setRecord] = useState<GenericRecord | null>(null);
  const [recordCurrent, setRecordCurrent] = useState<GenericRecord | null>(null);
  const [status, setStatus] = useState<string>("pending");
  const [validationMessage, setValidationMessage] = useState<boolean>(false);

  // Prepare page data
  useEffect(() => {
    if (userDataData == null || status != "pending") return;
    const preparePage = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get("id");

      try {
        const response = await getValidationRule({ id: id });
        setRecord(response.data.result);
        setRecordCurrent(response.data.result);


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


    if (!recordCurrent.value) {

      setValidationMessage(true);
      return;
    }


    setStatus("pending");


    try {
      const response = await updateValidationRule(recordCurrent);

      setRecord(response.data.result);
      setRecordCurrent(response.data.result);
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
      const response = await getDeviceTypes({ search: inputValue });

      if (!response.data.success) {
        console.log("error", response.data.message);
        return [];
      }

      return response.data.result.map((item: GenericRecord) => ({
        label: item["Type"],
        value: item["Type"],
      }));
    } catch (error) {
      console.log("error", error);
      return [];
    }
  };

  const handleTypeSelection = (newValue: SingleValue<GenericRecord>) => {
    if (!recordCurrent) return;
    if (newValue) {
      setRecordCurrent({ ...recordCurrent, value: newValue.value });
    } else {
      setRecordCurrent({ ...recordCurrent, value: null });
    }
  };
  return (
    <BackofficeMainTemplate status={status}>
      <form autoComplete="off" className="flex-grow-1 overflow-hidden d-flex flex-column" onSubmit={handleSubmit}>
        {record && <FormHeader title={record.name} handleReset={() => setRecordCurrent(record)} />}
        {recordCurrent && <FormWrapper>
          <div className="row">
            <div className="col-md-6 col-12 pt-1">
              <label htmlFor="name">{t("name")}</label>
              <input
                required
                minLength={3}
                type="text"
                className="form-control"
                id="name"
                value={recordCurrent.name}
                onChange={(e) => setRecordCurrent({ ...recordCurrent, name: e.target.value })}
              />
            </div>
            <div className="col-md-6 col-12 pt-1">
              <label htmlFor="enabled">{t("enabled")}</label>
              <select className="form-control" id="enabled" value={recordCurrent.enabled} onChange={(e) => setRecordCurrent({ ...recordCurrent, enabled: e.target.value })}>
                <option value="1">{t("yes")}</option>
                <option value="0">{t("no")}</option>
              </select>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <label htmlFor="filter_type">{t("filters")}</label>
              <select className="form-control" required id="filter_type" value={recordCurrent.filter_type} onChange={(e) => setRecordCurrent({ ...recordCurrent, filter_type: e.target.value, value: null })}>
                <option value="">{t("select")}</option>
                <option value="id_prefix">{t("id_prefix")}</option>
                <option value="type">{t("type")}</option>
                <option value="typeInfo_contains">{t("typeInfo_contains")}</option>
              </select>
            </div>
            {recordCurrent.filter_type == "id_prefix" && <div className="col-md-6 col-12 pt-1">
              <label htmlFor="value">{t("id_prefix")}</label>
              <input type="text" className="form-control" id="value"
                value={recordCurrent.value} required onChange={(e) => setRecordCurrent({ ...recordCurrent, value: e.target.value })} />
            </div>}
            {recordCurrent.filter_type == "type" && <div className="col-md-6 col-12 pt-1">
              <label htmlFor="value">{t("type")} {validationMessage && <span className="text-danger">* {t("mandatory_field")}</span>}</label>
              <AsyncSelect
                cacheOptions
                loadOptions={loadTypeOptions}
                placeholder={t("select")}
                isClearable
                onChange={handleTypeSelection}
                value={recordCurrent.value ? { label: recordCurrent.value, value: recordCurrent.value } : null}
              />
            </div>}
            {recordCurrent.filter_type == "typeInfo_contains" && <div className="col-md-6 col-12 pt-1">
              <label htmlFor="value">{t("typeInfo_contains")}</label>
              <input type="text" className="form-control" id="value"
                value={recordCurrent.value} required onChange={(e) => setRecordCurrent({ ...recordCurrent, value: e.target.value })} />
            </div>}
            <div className="col-md-6 col-12 pt-2">
              <Link href={`/validations/filtered?name=${record?.name}&value=${record?.value}&filter_type=${record?.filter_type}&origin=/validations/validation_rules/edit&id=${record?.id}`}>{t("show_filtered_results")}</Link>
            </div>
          </div>
        </FormWrapper>}
      </form>
    </BackofficeMainTemplate>
  );
};
export default ValidationRuleEdit;
