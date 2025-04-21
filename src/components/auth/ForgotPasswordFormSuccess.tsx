import { settings } from "@/config";
import { useTranslation } from "@/context/contextUtils";
import { ForgotPasswordFormSuccessProps } from "@/types";
import React from "react";

/**
 * Forgot password success message component.
 */
const ForgotPasswordFormSuccess = ({ setForm }: ForgotPasswordFormSuccessProps) => {
  const t = useTranslation();

  return (
    <>
      <h3 className="text-uppercase text-info text-center pt-3 text-shadow">{settings.app_title}</h3>

      <div className="text-dark text-center mt-3">{t("restore_password_email_sent")}</div>

      <div className="text-center mt-3">
        <a
          data-testid="back-button"
          className="text-info back-button"
          onClick={() => setForm("LOGIN")}
        >
          {t("login")}
        </a>
      </div>
    </>
  );
};

export default ForgotPasswordFormSuccess;
