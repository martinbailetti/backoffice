import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { memo, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { clearUser, getUserApi } from "@/slices/userSlice";
import AuthWaiting from "./components/AuthWaiting";
import { settings } from "@/config";
import { DataContext } from "@/context/DataContext";

const BackofficeAuthTemplate = ({
  status = "ready",
  children,
}: Readonly<{
  status?: string;
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.userData.data);
  const appDataLoginRedirect = useAppSelector((state) => state.appData.login_redirect);
  const { changeLanguage } = useContext(DataContext);

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");

    if (access_token) {
      dispatch(getUserApi());
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
          router.push("/");
        }
      }
    }
  }, [user, router, appDataLoginRedirect, dispatch]);


  useEffect(() => {
    if (user == null) {
      const navLang = navigator.language;
      const lang = navLang.split("-")[0];
      const storedLanguage = localStorage.getItem("language_code");

      if (storedLanguage && storedLanguage !== settings.default_language) {

        changeLanguage(storedLanguage);
      } else {
        const selectedLanguage = settings.languages.find((language) => language.code === lang);
        if (selectedLanguage && selectedLanguage.code !== settings.default_language) {
          changeLanguage(lang);
        }
      }

    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {status == "ready" && (
        <div className="basic-container d-flex align-items-center justify-content-center flex-column flex-grow-1 hl-bg min-dvh-100">
          <div className="d-flex d-flex flex-column flex-md-row justify-content-center box-shadow-lg w-75 max-width-md-900px bg-white mx-auto">
            <div className="w-100 w-md-50 d-none d-md-block">
              <img className="w-100" src="/images/hardwarelink_image.jpg" alt={settings.app_title} />
            </div>
            <div className="w-100 w-md-50 px-3 pb-3">{children}</div>
          </div>
        </div>
      )}
      {status == "pending" && <AuthWaiting />}
    </>
  );
};
export default memo(BackofficeAuthTemplate);
