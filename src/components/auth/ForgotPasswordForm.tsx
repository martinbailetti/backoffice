import React from "react";
import { settings } from "@/config";
import { useTranslation } from "@/context/contextUtils";
import { ForgotPasswordFormProps } from "@/types";

/**
 * Forgot password form component.
 */
const ForgotPasswordForm = ({
  submitRestorePassword,
  message,
  setForm,
}: ForgotPasswordFormProps) => {
  const t = useTranslation();

  return (
    <>
      <h3 className="text-uppercase text-info text-center pt-3 text-shadow">{settings.app_title}</h3>
      <form onSubmit={submitRestorePassword} autoComplete="off" data-testid="forgot-password-form">
        <label className="w-100 text-light" htmlFor="email">
          {t("email")}
        </label>
        <input
          type="email"
          required={true}
          data-testid="forgot-password-email-input"
          className="form-control w-100"
          name="email"
          id="email"
          maxLength={settings.user.emailMaxLength}
        />

        {message !== "LOADING" && (
          <button
            data-testid="forgot-password-form-submit-button"
            type="submit"
            className="w-100 btn btn-info mt-3"
          >
            {t("recover_password")}
          </button>
        )}

        {message === "LOADING" && (
          <button
            data-testid="forgot-password-form-submit-button-disabled"
            className="w-100 btn btn-info mt-3"
            type="button"
            disabled
          >
            <span className="spinner-grow spinner-grow-sm" role="status"></span>
            <span className="sr-only ps-1">{t("recover_password")}</span>
          </button>
        )}
      </form>

      <div className="text-dark text-center mt-3 cursor-pointer">
        <a className="text-info back-button" onClick={() => setForm("LOGIN")}>
          {t("login")}
        </a>
      </div>
    </>
  );
};

export default ForgotPasswordForm;
