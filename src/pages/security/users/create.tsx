import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError, setPage } from "@/slices/pageSlice";
import { createUser, getAllRoles } from "@/api/security";

import page from "@/config/pages/security/users/create";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import { GenericRecord } from "@/types";
import FormHeader from "@/components/form/FormHeader";
import FormWrapper from "@/components/form/FormWrapper";
import { useRouter } from "next/router";
import { setFlashMessage } from "@/slices/appSlice";
import { settings } from "@/config";
import { useTranslation } from "@/context/contextUtils";

const UserCreate = () => {
  const t = useTranslation();
  // redux
  const userDataData = useAppSelector((state) => state.userData.data);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // states

  const initialRecordState = {
    name: "",
    email: "",
    timezone: "",
    language_code: "",
    password: "",
    roles: [],
  };

  const [recordCurrent, setRecordCurrent] = useState<GenericRecord>(initialRecordState);
  const [status, setStatus] = useState<string>("pending");
  const [roles, setRoles] = useState<GenericRecord[]>([]);

  // Prepare page data
  useEffect(() => {
    if (userDataData == null) return;
    const preparePage = async () => {
      try {
        const response = await getAllRoles();
        setRoles(response.data.result);
        setStatus("prepared");
      } catch (error) {
        dispatch(setError(t("undefined_error")));
        return;
      }
    };
    preparePage();
  }, [userDataData, dispatch]); // eslint-disable-line

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

    if (recordCurrent.roles.length === 0) {
      dispatch(setError(t("validation_checkbox_at_least_one")));
      return;
    }

    try {
      const response = await createUser(recordCurrent);

      if (!response.data.success) {
        dispatch(setError(t(response.data.message)));
        return;
      }

      dispatch(setFlashMessage({ message: t("insert_executed_successfully"), type: "success" }));
      router.push(`/security/users/edit?id=${response.data.result.id}`);
    } catch (error) {
      dispatch(setError(t("undefined_error")));
    }
    setStatus("prepared");
  };

  return (
    <BackofficeMainTemplate status={status}>
      <form onSubmit={handleSubmit} autoComplete="off" className="flex-grow-1 overflow-hidden d-flex flex-column">
        <FormHeader handleReset={() => setRecordCurrent(initialRecordState)} />

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
                maxLength={settings.user.emailMaxLength}
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
            <div className="col-12 col-md-6 mb-1">
              <label htmlFor="password">{t("password")}</label>
              <input
                required
                minLength={settings.user.passwordMinLength}
                maxLength={settings.user.passwordMaxLength}
                type="text"
                className="form-control"
                id="password"
                name="password"
                value={recordCurrent ? recordCurrent.password : ""}
                onChange={(e) => setRecordCurrent({ ...recordCurrent, password: e.target.value })}
              />
            </div>
            <div className="col-12 mt-2">
              <label>{t("roles")}</label>
              {roles.map((role) => (
                <div key={role.id} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={role.id}
                    id={`role-${role.id}`}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setRecordCurrent({
                          ...recordCurrent,
                          roles: [...recordCurrent.roles, role.id],
                        });
                      } else {
                        setRecordCurrent({
                          ...recordCurrent,
                          roles: recordCurrent.roles.filter((p: GenericRecord) => p != role.id),
                        });
                      }
                    }}
                  />
                  <label className="form-check-label" htmlFor={`role-${role.id}`}>
                    {role.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </FormWrapper>
      </form>
    </BackofficeMainTemplate>
  );
};
export default UserCreate;
