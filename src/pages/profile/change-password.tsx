import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import {  setPage } from "@/slices/pageSlice";

import page from "@/config/pages/profile/change-password";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import FormHeader from "@/components/form/FormHeader";
import FormWrapper from "@/components/form/FormWrapper";
import { GenericRecord } from "@/types";
import { setFlashMessage } from "@/slices/appSlice";
import { updatePassword } from "@/api/profile";
import { useTranslation } from "@/context/contextUtils";

const ChangePasssword = () => {

  const t = useTranslation();
  // redux
  const dispatch = useAppDispatch();

  // states

  const [status, setStatus] = useState<string>("prepared");

  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

  // Store page data
  useEffect(() => {
    if (status != "prepared") return;

    dispatch(
      setPage({
        title: page.title,
        breadcrumb: page.breadcrumb,
      }),
    );
    setStatus("ready");
  }, [dispatch, status]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (passwordConfirmation !== password) return;
    setStatus("pending");

    try {
      const response = await updatePassword({
        password: password,
        password_confirmation: passwordConfirmation,
      });

      const data: GenericRecord = response.data;

      if (data.success) {
        dispatch(setFlashMessage({ message: t("updated_successfully"), type: "success" }));
      } else {
        dispatch(setFlashMessage({ message: t("operation_not_executed"), type: "danger" }));
      }
    } catch (error) {
      dispatch(setFlashMessage({ message: t("operation_not_executed"), type: "danger" }));
    }
    setStatus("prepared");
  };

  return (
    <BackofficeMainTemplate status={status}>
      <form onSubmit={handleSubmit} autoComplete="off" className="flex-grow-1 overflow-hidden d-flex flex-column">
        <FormHeader />

        <FormWrapper>
          <div className="row">
            <div className="col-12 col-md-6">
              <label htmlFor="password">Password</label>
              <input
                required
                minLength={6}
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-6 pt-2 pt-md-0">
              <label htmlFor="password_confirmation">Confirm Password</label>
              <input
                required
                minLength={6}
                type="password"
                className="form-control"
                id="password_confirmation"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
              {passwordConfirmation && password && passwordConfirmation !== password && (
                <small className="text-danger">Las contraseñas no coinciden</small>
              )}
            </div>
          </div>
        </FormWrapper>
      </form>
    </BackofficeMainTemplate>
  );
};
export default ChangePasssword;
