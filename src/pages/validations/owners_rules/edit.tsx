import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError, setPage } from "@/slices/pageSlice";

import page from "@/config/pages/validations/owners_rules/edit";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import { GenericRecord } from "@/types";
import FormHeader from "@/components/form/FormHeader";
import FormWrapper from "@/components/form/FormWrapper";
import { setFlashMessage } from "@/slices/appSlice";
import { useTranslation } from "@/context/contextUtils";
import { getOwnersRule, updateOwnersRule } from "@/api/validations";


const OwnerRuleEdit = () => {
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
        const response = await getOwnersRule({ id: id });
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
    setStatus("pending");


    try {
      const response = await updateOwnersRule(recordCurrent);

      setRecord(response.data.result);
      setRecordCurrent(response.data.result);
      dispatch(setFlashMessage({ message: t("updated_successfully"), type: "success" }));
      setStatus("prepared");
    } catch (error) {
      dispatch(setError(t("operation_not_executed")));
    }
    setStatus("prepared");
  };


  return (
    <BackofficeMainTemplate status={status}>
      <form autoComplete="off" className="flex-grow-1 overflow-hidden d-flex flex-column" onSubmit={handleSubmit}>
        {record && <FormHeader title={record.name} handleReset={() => setRecordCurrent(record)} />}
        {recordCurrent && <FormWrapper>
          <div className="row">
            <div className="col-md-6 col-12 pt-1">
              <label htmlFor="Owner">{t("Owner")}</label>
              <input
                required
                minLength={3}
                type="text"
                className="form-control"
                id="Owner"
                value={recordCurrent.Owner}
                onChange={(e) => setRecordCurrent({ ...recordCurrent, Owner: e.target.value })}
              />
            </div>
            <div className="col-md-6 col-12 pt-1">
              <label htmlFor="SubOwner">{t("SubOwner")}</label>
              <input
                minLength={3}
                type="text"
                className="form-control"
                id="SubOwner"
                value={recordCurrent.SubOwner}
                onChange={(e) => setRecordCurrent({ ...recordCurrent, SubOwner: e.target.value })}
              />
            </div>
            <div className="col-md-6 col-12 pt-1">
              <label htmlFor="Enabled">{t("Enabled")}</label>
              <select className="form-control" id="Enabled" value={recordCurrent.Enabled} onChange={(e) => setRecordCurrent({ ...recordCurrent, Enabled: e.target.value })}>
                <option value="1">{t("yes")}</option>
                <option value="0">{t("no")}</option>
              </select>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <label htmlFor="Type">{t("Type")}</label>
              <select className="form-control" id="Type" value={recordCurrent.Type} onChange={(e) => setRecordCurrent({ ...recordCurrent, Type: e.target.value })}>
                <option value="validation">{t("autovalidate")}</option>
                <option value="expiration">{t("allow_expiration")}</option>
              </select>
            </div>
          </div>
        </FormWrapper>}
      </form>
    </BackofficeMainTemplate>
  );
};
export default OwnerRuleEdit;
