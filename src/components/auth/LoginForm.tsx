import React, { useContext } from "react";
import { settings } from "@/config";
import { useTranslation } from "@/context/contextUtils";
import { LoginFormProps } from "@/types";
import { DataContext } from "@/context/DataContext";
/**
 * Login form component.
 */
const LoginForm = ({ submitLogin, message, setForm }: LoginFormProps) => {
  const t = useTranslation();
  const { language } = useContext(DataContext);

  return (
    <>
      <h3 className="text-uppercase text-info text-center pt-3 text-shadow">
        {settings.app_title}
      </h3>
      <form onSubmit={submitLogin} autoComplete="off" data-testid="login-form">
        <input type="hidden" name="language_code" value={language} />
        <label className="w-100 text-dark" htmlFor="email">
          {t("email")}
        </label>
        <input
          data-testid="login-form-email-input"
          type="email"
          required={true}
          className="form-control w-100 w-min-md-300px"
          name="email"
          id="email"
          maxLength={settings.user.emailMaxLength}
        />
        <label className="w-100 mt-2 text-dark" htmlFor="password">
          {t("password")}
        </label>
        <input
          type="password"
          data-testid="login-form-password-input"
          required={true}
          className="form-control w-100 w-min-md-300px"
          name="password"
          id="password"
          minLength={settings.user.passwordMinLength}
          maxLength={settings.user.passwordMaxLength}
          autoComplete="off"
        />

        {message !== "loading" && (
          <button
            type="submit"
            className="w-100 btn btn-info mt-3"
            data-testid="login-form-submit-button"
          >
            {t("login")}
          </button>
        )}

        {message === "loading" && (
          <button
            className="w-100 btn btn-info mt-3"
            type="button"
            disabled
            data-testid="login-form-submit-button-disabled"
          >
            <span className="spinner-grow spinner-grow-sm" role="status"></span>
            <span className="sr-only ps-1">{t("login")}</span>
          </button>
        )}

        {message !== "" && message !== "loading" && (
          <div className="text-center mt-2 text-danger">{t(message)}</div>
        )}
      </form>
      <div>
        <a
          className="mt-2 w-100 d-block text-center forgot-password-button d-inline-block text-primary"
          data-testid="login-goto-forgot-password-button"
          onClick={() => setForm("FORGOTPASSWORD")}
        >
          {t("forgot_password")}
        </a>
      </div>
    </>
  );
};

export default LoginForm;
