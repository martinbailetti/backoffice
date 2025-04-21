import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError, setPage } from "@/slices/pageSlice";

import page from "@/config/pages/validations/validation_rules/create";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import { GenericRecord } from "@/types";
import FormHeader from "@/components/form/FormHeader";
import FormWrapper from "@/components/form/FormWrapper";
import { useRouter } from "next/router";
import { setFlashMessage } from "@/slices/appSlice";
import { useTranslation } from "@/context/contextUtils";
import { createValidationRule } from "@/api/validations";
import AsyncSelect from "react-select/async";
import { SingleValue } from "react-select";
import { getDeviceTypes } from "@/api/search";
import Link from "next/link";



const ValidationRuleCreate = () => {
  const router = useRouter();

  // states

  const [recordCurrent, setRecordCurrent] = useState<GenericRecord | null>(null);
  const [status, setStatus] = useState<string>("prepared");
  const [validationMessage, setValidationMessage] = useState<boolean>(false);

  const t = useTranslation();


  // redux
  const userDataData = useAppSelector((state) => state.userData.data);
  const dispatch = useAppDispatch();


  // Prepare page data
  useEffect(() => {
    if (status !== "ready") return;
  
      const searchParams = new URLSearchParams(window.location.search);
      const name = searchParams.get("name");
      const value = searchParams.get("value");
      const filter_type = searchParams.get("filter_type");
      console.log("name", name);
      console.log("value", value);
      

      setRecordCurrent({ name: name, value: value, filter_type: filter_type, enabled: "1" });

  }, [status, userDataData]); // eslint-disable-line

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

    if (!recordCurrent.value) {

      setValidationMessage(true);
      return;
    }

    try {
      const response = await createValidationRule({ ...recordCurrent });

      setRecordCurrent(response.data.result);
      dispatch(setFlashMessage({ message: t("created_successfully"), type: "success" }));
      router.push(`/validations/validation_rules/edit?id=${response.data.result.id}`);
    } catch (error) {
      dispatch(setError(t("operation_not_executed")));
    }
    setStatus("prepared");
  };

  useEffect(() => {

    if (recordCurrent?.enabled == undefined) {
      setRecordCurrent({ ...recordCurrent, enabled: "1" });
    }

  }, [recordCurrent]);


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
        <FormHeader handleReset={() => setRecordCurrent(null)} />

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
                value={recordCurrent.name?recordCurrent.name:""}
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
              <select className="form-control" required id="filter_type" value={recordCurrent.filter_type?recordCurrent.filter_type:""} onChange={(e) => setRecordCurrent({ ...recordCurrent, filter_type: e.target.value, value: null })}>
                <option value="">{t("select")}</option>
                <option value="id_prefix">{t("id_prefix")}</option>
                <option value="type">{t("type")}</option>
                <option value="typeInfo_contains">{t("typeInfo_contains")}</option>
              </select>
            </div>
            {recordCurrent.filter_type == "id_prefix" && <div className="col-md-6 col-12 pt-1">
              <label htmlFor="value">{t("id_prefix")}</label>
              <input type="text" className="form-control" id="value" value={recordCurrent.value?recordCurrent.value:""} required onChange={(e) => setRecordCurrent({ ...recordCurrent, value: e.target.value })} />
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
              <input type="text" className="form-control" id="value" value={recordCurrent.value?recordCurrent.value:""} required onChange={(e) => setRecordCurrent({ ...recordCurrent, value: e.target.value })} />
            </div>}
            {recordCurrent.name && recordCurrent.filter_type && recordCurrent.value && <div className="col-md-6 col-12 pt-2">
              <Link href={`/validations/filtered?name=${recordCurrent.name}&value=${recordCurrent.value}&filter_type=${recordCurrent.filter_type}&origin=/validations/validation_rules/create`}>{t("show_filtered_results")}</Link>
            </div>}
          </div>
        </FormWrapper>}
      </form>
    </BackofficeMainTemplate>
  );
};
export default ValidationRuleCreate;
