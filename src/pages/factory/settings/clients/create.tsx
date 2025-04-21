import { useEffect,  useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError, setPage } from "@/slices/pageSlice";

import page from "@/config/pages/factory/settings/clients/create";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import { GenericRecord } from "@/types";
import FormHeader from "@/components/form/FormHeader";
import FormWrapper from "@/components/form/FormWrapper";
import { useRouter } from "next/router";
import { setFlashMessage } from "@/slices/appSlice";
import { useTranslation } from "@/context/contextUtils";
import { createFactoryClients } from "@/api/factory";



const FactoryClientsCreate = () => {
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
      const response = await createFactoryClients({ ...recordCurrent });

      setRecordCurrent(response.data.result);
      dispatch(setFlashMessage({ message: t("created_successfully"), type: "success" }));
      router.push(`/factory/settings/clients/edit?id=${response.data.result.id}`);
    } catch (error) {
      dispatch(setError(t("operation_not_executed")));
    }
    setStatus("prepared");
  };



  return (
    <BackofficeMainTemplate status={status}>
      <form autoComplete="off" className="flex-grow-1 overflow-hidden d-flex flex-column" onSubmit={handleSubmit}>
        <FormHeader handleReset={() => setRecordCurrent(null)} />

        <FormWrapper>
          <div className="row">
            <div className="col-md-6 col-12 pt-1">
              <label htmlFor="name">{t("name")}</label>
              <input
                required
                minLength={3}
                type="text"
                className="form-control"
                id="name"
                onChange={(e) => setRecordCurrent({ ...recordCurrent, name: e.target.value })}
              />
            </div>
          </div>
        </FormWrapper>
      </form>
    </BackofficeMainTemplate>
  );
};
export default FactoryClientsCreate;
