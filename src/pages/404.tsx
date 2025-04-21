import React, { useEffect} from "react";
import { useTranslation } from "@/context/contextUtils";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setLoginRedirect } from "@/slices/appSlice";
import { useRouter } from "next/router";
import { getUserApi } from "@/slices/userSlice";
import Link from "next/link";

const Custom404 = () => {
  const t = useTranslation();
  const dispatch = useAppDispatch();

  const userDataData = useAppSelector((state) => state.userData.data);
  const userDataError = useAppSelector((state) => state.userData.error);

  const router = useRouter();
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");

    if (!access_token) {
      dispatch(setLoginRedirect(""));
      router.push("/");
    } else if (access_token) {
      if (userDataData == null) {
        dispatch(getUserApi());
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (userDataError) {
      dispatch(setLoginRedirect(""));
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      router.push("/");
    }
  }, [userDataError, router, dispatch]);

  return (
    <>
      {userDataData !== null && (
        <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center">
          <div className="d-flex flex-column justify-content-center align-items-center">
            <h1 className="display-3">404</h1>
            <h5>{t("page_not_found")}</h5>
            <p>{t("sorry_page_not_found")}</p>

            <Link
              className="btn btn-outline-secondary"
              href={userDataData.roles[0].home_path}
            >
              {t("home")}
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Custom404;
