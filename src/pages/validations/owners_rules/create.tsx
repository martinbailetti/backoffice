import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError, setPage } from "@/slices/pageSlice";

import page from "@/config/pages/validations/owners_rules/create";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import { GenericRecord } from "@/types";
import FormHeader from "@/components/form/FormHeader";
import FormWrapper from "@/components/form/FormWrapper";
import { useRouter } from "next/router";
import { setFlashMessage } from "@/slices/appSlice";
import { useTranslation } from "@/context/contextUtils";
import { createOwnersRule } from "@/api/validations";



const OwnerRuleCreate = () => {
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
      const response = await createOwnersRule({ ...recordCurrent });

      setRecordCurrent(response.data.result);
      dispatch(setFlashMessage({ message: t("created_successfully"), type: "success" }));
      router.push(`/validations/owners_rules/edit?id=${response.data.result.Id}`);
    } catch (error) {
      dispatch(setError(t("operation_not_executed")));
    }
    setStatus("prepared");
  };

  useEffect(() => {
 
    if (recordCurrent?.Enabled == undefined) {
      setRecordCurrent({ ...recordCurrent, Enabled: "1" });
    }
    if (recordCurrent?.Type == undefined) {
      setRecordCurrent({ ...recordCurrent, Type: "validation" });
    }
  }, [recordCurrent]);

  return (
    <BackofficeMainTemplate status={status}>
      <form autoComplete="off" className="flex-grow-1 overflow-hidden d-flex flex-column" onSubmit={handleSubmit}>
        <FormHeader handleReset={() => setRecordCurrent(null)} />

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
export default OwnerRuleCreate;
