import { useEffect,  useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError, setPage } from "@/slices/pageSlice";

import page from "@/config/pages/factory/settings/clients/edit";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import { GenericRecord } from "@/types";
import FormHeader from "@/components/form/FormHeader";
import FormWrapper from "@/components/form/FormWrapper";
import { setFlashMessage } from "@/slices/appSlice";
import { useTranslation } from "@/context/contextUtils";
import { getFactoryClient, updateFactoryClients } from "@/api/factory";


const FactoryClientsEdit = () => {
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
        const response = await getFactoryClient({ id: id });
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
      const response = await updateFactoryClients(recordCurrent);

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
                value={recordCurrent ? recordCurrent.name : ""}
                onChange={(e) => setRecordCurrent({ ...recordCurrent, name: e.target.value })}
              />
            </div>


          </div>
        </FormWrapper>
      </form>
    </BackofficeMainTemplate>
  );
};
export default FactoryClientsEdit;
