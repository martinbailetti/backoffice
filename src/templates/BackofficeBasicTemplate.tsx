
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { memo, useEffect } from "react";
import { useRouter } from "next/router";
import { getUserApi } from "@/slices/userSlice";
import AuthWaiting from "./components/AuthWaiting";
import ErrorModal from "@/components/error/ErrorModal";
import useAuth from "@/hooks/useAuth";
import { setLoginRedirect } from "@/slices/appSlice";

const BackofficeBasicTemplate = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const userData = useAppSelector((state) => state.userData);
  const pageDataError = useAppSelector((state) => state.pageData.error);


  const dispatch = useAppDispatch();

  useAuth();


  useEffect(() => {
    const access_token = localStorage.getItem("access_token");

    if (!access_token) {
      dispatch(setLoginRedirect(router.asPath));

      router.push("/");
    } else if (access_token) {
      if (userData.data == null) {
        dispatch(getUserApi());
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (userData.error) {
      dispatch(setLoginRedirect(router.asPath));
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      router.push("/");
    }
  }, [userData.error, router, dispatch]);

  return (
    <>
      {userData.loading === "idle" && userData.data && <>{children}</>}
      {userData.loading === "pending" && <AuthWaiting />}
      {pageDataError && <ErrorModal />}
    </>
  );
};
export default memo(BackofficeBasicTemplate);
