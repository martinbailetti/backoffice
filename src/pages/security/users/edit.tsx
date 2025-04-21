import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError, setPage } from "@/slices/pageSlice";
import { getAllRoles, getUser, updateUser } from "@/api/security";

import page from "@/config/pages/security/users/edit";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import { GenericRecord } from "@/types";
import FormHeader from "@/components/form/FormHeader";
import FormWrapper from "@/components/form/FormWrapper";
import { setFlashMessage } from "@/slices/appSlice";
import { settings } from "@/config";
import { useTranslation } from "@/context/contextUtils";
import { useRouter } from "next/router";

const PlanetEdit = () => {
  const t = useTranslation();

  const router = useRouter();
  // redux
  const userDataData = useAppSelector((state) => state.userData.data);
  const dispatch = useAppDispatch();

  // states

  const [record, setRecord] = useState<GenericRecord | null>(null);
  const [recordCurrent, setRecordCurrent] = useState<GenericRecord | null>(null);
  const [status, setStatus] = useState<string>("pending");
  const [roles, setRoles] = useState<GenericRecord[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);



  // Prepare page data
  useEffect(() => {
    if (userDataData == null || status != "pending") return;
    const preparePage = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get("id");

      if (!id) {
        router.push("/404");
        return;
      }

      try {
        const response = await getUser({ id: id });

        if (response.data.success === false) {
          if (response.data.message === "page_not_found") {
            router.push("/404");
          } else {
            dispatch(setFlashMessage({ message: t("bad_request"), type: "error" }));
          }
          return;
        }

        response.data.result.roles = response.data.result.roles.map(
          (role: GenericRecord) => role.id,
        );
        setRecord(response.data.result);
        setRecordCurrent(response.data.result);

      } catch (error) {
        dispatch(setFlashMessage({ message: t("bad_request"), type: "warning" }));
        router.push(userDataData.roles[0].home_path);
        return;
      }

      try {
        const response = await getAllRoles();
        setRoles(response.data.result);
        setStatus("prepared");
      } catch (error) {
        dispatch(setFlashMessage({ message: t("bad_request"), type: "warning" }));
        router.push(userDataData.roles[0].home_path);
        return;
      }
    };
    preparePage();
  }, [userDataData, dispatch, refresh]); // eslint-disable-line


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

    if (!recordCurrent) return;
    setStatus("pending");

    try {
      const response = await updateUser(recordCurrent);

      if (!response.data.success) {
        dispatch(setFlashMessage({ message: t(response.data.message), type: "danger" }));
      } else {
        dispatch(setFlashMessage({ message: t("update_executed_successfully"), type: "success" }));
      }
      setRefresh(!refresh);
    } catch (error) {
      dispatch(setError(t("undefined_error")));
      return;
    }
  };

  return (
    <BackofficeMainTemplate status={status}>
      <form onSubmit={handleSubmit} autoComplete="off" className="flex-grow-1 overflow-hidden d-flex flex-column">
        <FormHeader handleReset={() => setRecordCurrent(record)} />

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
                <option value="">{t("select")}</option>
                {settings.languages.map((language) => (
                  <option key={language.code} value={language.code}>
                    {t(language.name)}
                  </option>
                ))}
              </select>
            </div>

            {record && (
              <div className="col-12 mt-2">
                <label>{t("roles")}</label>
                {roles.map((role) => (
                  <div key={role.id} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={role.id}
                      id={`role-${role.id}`}
                      checked={recordCurrent?.roles.some((r: number) => r === role.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRecordCurrent({
                            ...recordCurrent,
                            roles: [...recordCurrent?.roles, role.id],
                          });
                        } else {
                          setRecordCurrent({
                            ...recordCurrent,
                            roles: recordCurrent?.roles.filter((r: GenericRecord) => r != role.id),
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
            )}
          </div>
        </FormWrapper>
      </form>
    </BackofficeMainTemplate>
  );
};
export default PlanetEdit;
