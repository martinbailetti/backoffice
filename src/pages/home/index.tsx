import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setPage } from "@/slices/pageSlice";
import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import { useEffect } from "react";
import page from "@/config/pages/home/index";
import { useTranslation } from "@/context/contextUtils";
import { useRouter } from "next/router";

export default function Home() {
  const userDataData = useAppSelector((state) => state.userData.data);

  const dispatch = useAppDispatch();

  const t = useTranslation();

  const router = useRouter();

  useEffect(() => {
    if (userDataData == null) return;

    router.push(userDataData.roles[0].home_path);
  }, [userDataData, router]);

  useEffect(() => {
    dispatch(
      setPage({
        ...page,
      }),
    );
  }, [dispatch]);
  return <BackofficeMainTemplate status="pending">{t("home")}</BackofficeMainTemplate>;
}
