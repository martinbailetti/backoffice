import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearUser } from "@/slices/userSlice";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const Logout = () => {
  const router = useRouter();
  const userData = useAppSelector((state) => state.userData);

  const dispatch = useAppDispatch();
  useEffect(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    dispatch(clearUser());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");

    if (!access_token && userData.data == null) {
      router.push("/");
    }
  }, [userData.data, router]);
  return null;
};

export default Logout;
