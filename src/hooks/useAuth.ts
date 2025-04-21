import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearUser } from "@/slices/userSlice";

import { can } from "@/utils/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

const useAuth = () => {
  const userDataData = useAppSelector((state) => state.userData.data);
  const pageDataPermission = useAppSelector((state) => state.pageData.permission);
  const dispatch = useAppDispatch();

  const router = useRouter();
  useEffect(() => {
    if (pageDataPermission == null) return;
    if (userDataData == null) return;
    if (!can(userDataData, pageDataPermission)) {
      if (userDataData.roles.length > 0) {
        router.push(userDataData.roles[0].home_path);
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        dispatch(clearUser());
        router.push("/");
      }
    }
  }, [userDataData, pageDataPermission, router, dispatch]);
};

export default useAuth;
