import NavBar from "./components/NavBar";

import ContentHeader from "./components/ContentHeader";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { memo, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getUserApi } from "@/slices/userSlice";
import AuthWaiting from "./components/AuthWaiting";
import useResponsive from "@/hooks/useResponsive";
import ContentWrapper from "./components/ContentWrapper";
import ErrorModal from "@/components/error/ErrorModal";
import MainWrapper from "./components/MainWrapper";
import useAuth from "@/hooks/useAuth";
import { setCreateFactoryDeviceModal,  setLoginRedirect } from "@/slices/appSlice";
import { DataContext } from "@/context/DataContext";
import { can } from "@/utils/auth";
import FactoryCreateDeviceModal from "@/components/factory/devices/FactoryCreateDeviceModal";
import { GenericRecord } from "@/types";
import { createFactoryDevice } from "@/api/factory";
import { setError } from "@/slices/pageSlice";
import { useTranslation } from "@/context/contextUtils";

const BackofficeMainTemplate = ({
  status = "pending",
  children,
}: Readonly<{
  status: string;
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const userData = useAppSelector((state) => state.userData);
  const pageDataError = useAppSelector((state) => state.pageData.error);
  const appDataModal = useAppSelector((state) => state.appData.createFactoryDeviceModal);

  const t = useTranslation();
  const [deviceCreated, setDeviceCreated] = useState<GenericRecord | null>(null);
  const { language, changeLanguage } = useContext(DataContext);
  const size = useResponsive();

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
    if (userData.data?.language_code && language !== userData.data.language_code) {
      localStorage.setItem("language_code", userData.data.language_code);
      changeLanguage(userData.data.language_code);
    }
  }, [userData, changeLanguage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (userData.error) {
      dispatch(setLoginRedirect(router.asPath));
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      router.push("/");
    }
  }, [userData.error, router, dispatch]);

  const renderChildren = () => {
    return (
      <div
        className={`flex-grow-1 p-0 mt-1 p-md-3 mt-md-2 d-flex flex-column border-top ${size == "medium" ? "rounded bg-light border" : " overflow-hidden"}`}
      >
        {size !== "small" && (
          <div className={`p-1 pt-0 p-md-3 bg-white flex-grow-1  d-flex flex-column rounded`}>
            {children}
          </div>
        )}
        {size === "small" && <>{children}</>}
      </div>
    );
  };

  const createRecord = async (record: GenericRecord) => {
    console.log("device", record);
    if (!record.GroupId || !record.MachineId || !record.Type) {
      return;
    }

    try {
      const response = await createFactoryDevice(record);

      if (response.data.success) {
        setDeviceCreated(response.data.result);
      } else {
        dispatch(setError(t("operation_not_executed")));
      }
    } catch (error) {
      dispatch(setError(t("operation_not_executed")));
    }
  };

  return (
    <MainWrapper>
      {userData.loading === "idle" && userData.data && (
        <>
          <NavBar />
          <ContentWrapper>
            <ContentHeader status={status} />

            {status == "ready" && renderChildren()}
            {status == "pending" && (
              <div className="d-flex justify-content-center align-items-center flex-grow-1">
                <div className="loader"></div>
              </div>
            )}
          </ContentWrapper>
        </>
      )}
      {userData.loading === "pending" && <AuthWaiting />}
      {pageDataError && <ErrorModal />}

      {userData && can(userData.data, "create factory device") && appDataModal && (
        <FactoryCreateDeviceModal
          create={createRecord}
          created={deviceCreated}
          close={() => {
            setDeviceCreated(null);
            dispatch(setCreateFactoryDeviceModal(false));
          }}
          newDeviceModal={null}
        />
      )}
    </MainWrapper>
  );
};
export default memo(BackofficeMainTemplate);
