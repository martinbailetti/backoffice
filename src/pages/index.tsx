import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { loginUser, forgotPassword } from "@/api/auth";
import { FormEvent,  useEffect, useState } from "react";
import { clearUser, getUserApi } from "@/slices/userSlice";
import LoginForm from "@/components/auth/LoginForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import ForgotPasswordFormSuccess from "@/components/auth/ForgotPasswordFormSuccess";
import { useRouter } from "next/router";
import { ServerErrorInterface } from "@/types";
import BackofficeAuthTemplate from "@/templates/BackofficeAuthTemplate";

export default function Login() {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState("LOGIN");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("blank");

  const user = useAppSelector((state) => state.userData.data);
  const appDataLoginRedirect = useAppSelector((state) => state.appData.login_redirect);

  const router = useRouter();

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");

    if (access_token && user === null) {
      dispatch(getUserApi());

      setStatus("pending");
    } else if (access_token && user !== null) {
      router.push(user.roles[0].home_path);
    } else if (!access_token && user === null) {
      setStatus("ready");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user !== null) {
      if (appDataLoginRedirect) {
        router.push(appDataLoginRedirect);
      } else {
        if (user.roles.length > 0) {
          router.push(user.roles[0].home_path);
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          dispatch(clearUser());
          console.log("user has no roles");
          setStatus("ready");
        }
      }
    }
  }, [user, router, appDataLoginRedirect, dispatch]);

  /**
   * Submits the login form.
   *
   * @param {Event} event - The form submit event.
   * @returns {Promise<void>} A promise that resolves when the login process is completed.
   */
  const submitLogin = async (event: FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setMessage("loading");

    try {
      const data = await loginUser(email, password);

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      dispatch(getUserApi());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 500) {
          setMessage("undefined_error");
        } else {
          console.error("Login failed:", error);
          setMessage("wrong_credentials");
        }
      }
    }
  };

  /**
   * Submits the restore password form.
   *
   * @param {Event} event - The form submit event.
   * @returns {Promise<void>} A promise that resolves when the restore password process is completed.
   */
  const submitRestorePassword = async (event: FormEvent) => {
    setMessage("loading");
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);

    try {
      const response = await forgotPassword({ email: data.get("email") as string });
      console.log(response);
      setForm("FORGOTPASSWORDSUCCESS");
      setMessage("");
    } catch (err: unknown) {
      if (
        (err as ServerErrorInterface).response &&
        (err as ServerErrorInterface).response.data &&
        (err as ServerErrorInterface).response.data.error === "EMAIL_NOT_FOUND"
      ) {
        setMessage("email_not_found");
      } else {
        setMessage("undefined_error");
      }
    }
  };

  return (
    <BackofficeAuthTemplate status={status}>
      {form === "LOGIN" && (
        <LoginForm submitLogin={submitLogin} setForm={setForm} message={message} />
      )}

      {form === "FORGOTPASSWORD" && (
        <ForgotPasswordForm
          submitRestorePassword={submitRestorePassword}
          setForm={setForm}
          message={message}
        />
      )}
      {form === "FORGOTPASSWORDSUCCESS" && <ForgotPasswordFormSuccess setForm={setForm} />}
    </BackofficeAuthTemplate>
  );
}
