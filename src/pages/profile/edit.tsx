import { useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {  setPage } from "@/slices/pageSlice";

import page from "@/config/pages/profile/edit";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import FormHeader from "@/components/form/FormHeader";
import FormWrapper from "@/components/form/FormWrapper";
import { GenericRecord } from "@/types";
import { setFlashMessage } from "@/slices/appSlice";
import { updateProfile } from "@/api/profile";
import { useTranslation } from "@/context/contextUtils";
import { settings } from "@/config";
import { getUserApi } from "@/slices/userSlice";
import { DataContext } from "@/context/DataContext";

const EditProfile = () => {
  const t = useTranslation();
  // redux
  const dispatch = useAppDispatch();

  // states

  const [status, setStatus] = useState<string>("prepared");
  const [recordCurrent, setRecordCurrent] = useState<GenericRecord | null>(null);
  const userDataData = useAppSelector((state) => state.userData.data);

  const { changeLanguage } = useContext(DataContext);
  // Store page data
  useEffect(() => {
    if (userDataData == null) return;
    setRecordCurrent(userDataData);

  }, [userDataData]);
  // Store page data
  useEffect(() => {
    if (status != "prepared" || userDataData == null) return;
    setRecordCurrent(userDataData);
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
    setStatus("pending");

    try {
      const response = await updateProfile(recordCurrent);

      const data: GenericRecord = response.data;

      if (data.success) {

        dispatch(getUserApi());
        changeLanguage(recordCurrent.language_code);
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
        <FormHeader handleReset={() => setRecordCurrent(userDataData)} />

        <FormWrapper>
          <div className="row mt-2">
            <div className="col-12 col-md-6 mb-1">
              <label htmlFor="name">{t("name")}</label>
              <input
                required
                minLength={settings.user.nameMinLength}
                maxLength={settings.user.nameMaxLength}
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={recordCurrent ? recordCurrent.name : ""}
                onChange={(e) => setRecordCurrent({ ...recordCurrent, name: e.target.value })}
              />
            </div>
            <div className="col-12 col-md-6 mb-1">
              <label htmlFor="email">{t("email")}</label>
              <input
                required
                minLength={5}
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={recordCurrent ? recordCurrent.email : ""}
                onChange={(e) => setRecordCurrent({ ...recordCurrent, email: e.target.value })}
              />
            </div>
            <div className="col-12 col-md-6 mb-1">
              <label htmlFor="timezone">{t("timezone")}</label>
              <select
                required
                className="form-control"
                id="timezone"
                name="timezone"
                value={recordCurrent ? recordCurrent.timezone : ""}
                onChange={(e) => setRecordCurrent({ ...recordCurrent, timezone: e.target.value })}
              >
                <option value="">Select</option>
                {settings.timezones.map((timezone) => (
                  <option key={timezone} value={timezone}>
                    {timezone}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-6 mb-1">
              <label htmlFor="language_code">{t("language")}</label>
              <select
                required
                className="form-control"
                id="language_code"
                name="language_code"
                value={recordCurrent ? recordCurrent.language_code : ""}
                onChange={(e) =>
                  setRecordCurrent({ ...recordCurrent, language_code: e.target.value })
                }
              >
                <option value="">Select</option>
                {settings.languages.map((language) => (
                  <option key={language.code} value={language.code}>
                    {t(language.name)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </FormWrapper>
      </form>
    </BackofficeMainTemplate>
  );
};
export default EditProfile;
