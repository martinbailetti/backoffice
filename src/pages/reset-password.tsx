
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GenericRecord } from "@/types";
import { resetPassword } from "@/api/auth";
import { useTranslation } from "@/context/contextUtils";
import { AxiosError } from "axios";
import BackofficeAuthTemplate from "@/templates/BackofficeAuthTemplate";
import { settings } from "@/config";
import Link from "next/link";

export default function ResetPassword() {


  const [message, setMessage] = useState<string | null>(null);
  const [params, setParams] = useState<GenericRecord | null>(null);

  const router = useRouter();

  const t = useTranslation();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email || !token) {
      router.push("/");
    } else {
      setParams({ email, token });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  /**
   * Submits the login form.
   *
   * @param {Event} event - The form submit event.
   * @returns {Promise<void>} A promise that resolves when the login process is completed.
   */
  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const password = formData.get("password") as string;
    const password_confirmation = formData.get("password_confirmation") as string;

    if (password != password_confirmation) {
      setMessage("passwords_not_match");
      return;
    }

    try {
      const response = await resetPassword({
        token: params?.token,
        email: params?.email,
        password: password,
        password_confirmation: password_confirmation,
      });

      console.log("Password updated", response);
      router.push("/login");
    } catch (error) {
      console.error("Reset failed:", error);

      if (error instanceof AxiosError && error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("unknown_error");
      }
    }
  };

  return (
    <BackofficeAuthTemplate>
      <h3 className="text-uppercase text-info text-center pt-3 text-shadow">{settings.app_title}</h3>
      <form onSubmit={submitForm} autoComplete="off" data-testid="login-form">
        <div className="d-flex flex-column justify-content-center align-items-start mt-3">
          <label className="" htmlFor="password">
            {t("password")}
          </label>
          <input
            type="password"
            name="password"
            className="form-control w-min-md-300px"
            autoComplete="off"
            id="password"
            required
          />
          <label className="mt-2" htmlFor="password_confirmation">
            {t("confirm_password")}
          </label>
          <input
            type="password"
            name="password_confirmation"
            className="form-control w-min-md-300px  mb-3"
            autoComplete="off"
            id="password_confirmation"
            required
          />
          {message && (
            <div className="alert alert-danger fade show" role="alert">
              <div className="d-flex">
                <span>{t(message)}</span>

                <button
                  type="button"
                  className="btn-close ms-3"
                  onClick={() => setMessage(null)}
                ></button>
              </div>
            </div>
          )}
          <button type="submit" className="w-100 btn btn-info mt-1 w-min-md-300px">
            {t("change_password")}
          </button>
          <div className="text-center w-100 pt-3">
            <Link className="text-info back-button" href={"/"}>
              {t("login")}
            </Link>
          </div>
        </div>
      </form>
    </BackofficeAuthTemplate>
  );
}
