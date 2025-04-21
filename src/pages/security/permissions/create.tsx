import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError, setPage } from "@/slices/pageSlice";
import { createPermission } from "@/api/security";

import page from "@/config/pages/security/permissions/create";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import { GenericRecord } from "@/types";
import FormHeader from "@/components/form/FormHeader";
import FormWrapper from "@/components/form/FormWrapper";
import { useRouter } from "next/router";
import { setFlashMessage } from "@/slices/appSlice";
import { useTranslation } from "@/context/contextUtils";

const PermissionCreate = () => {


  const t = useTranslation();
  // redux
  const userDataData = useAppSelector((state) => state.userData.data);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // states

  const [recordCurrent, setRecordCurrent] = useState<GenericRecord | null>(null);
  const [status, setStatus] = useState<string>("prepared");




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
      const response = await createPermission(recordCurrent);

      setRecordCurrent(response.data.result);
      dispatch(setFlashMessage({ message: t("created_successfully"), type: "success" }));
      router.push(`/security/permissions/edit?id=${response.data.result.id}`);
    } catch (error) {
      dispatch(setError(t("operation_not_executed")));
    }
    setStatus("prepared");
  }

  return (
    <BackofficeMainTemplate status={status}>
      <form autoComplete="off" className="flex-grow-1 overflow-hidden d-flex flex-column"
        onSubmit={handleSubmit}
      >
        <FormHeader handleReset={() => setRecordCurrent(null)} />

        <FormWrapper >
          <div className="form-group">
            <label htmlFor="name">{t("name")}</label>
            <input
              required
              minLength={3}
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={recordCurrent ? recordCurrent.name : ""}
              onChange={(e) => setRecordCurrent({ ...recordCurrent, name: e.target.value })}
            />
          </div>

        </FormWrapper>
      </form>
    </BackofficeMainTemplate>
  );
};
export default PermissionCreate;
