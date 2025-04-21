import { useEffect, useState } from "react";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import useSetTable from "@/hooks/useSetTablePage";


import table from "@/config/pages/validations/filtered/table";
import page from "@/config/pages/validations/filtered/index";
import { useAppDispatch } from "@/redux/hooks";
import { setPage } from "@/slices/pageSlice";
import { useTranslation } from "@/context/contextUtils";
import PageTableComponent from "@/templates/components/PageTableComponent";

export const FilteredDevices = () => {

  // redux
  const dispatch = useAppDispatch();

  const t = useTranslation();

  // states
  const [status, setStatus] = useState<string>("prepared");


  useEffect(() => {

    const searchParams = new URLSearchParams(window.location.search);
    const name = searchParams.get("name");
    const value = searchParams.get("value");
    const filter_type = searchParams.get("filter_type");
    const origin = searchParams.get("origin");
    const id = searchParams.get("id");


    const p = { ...page };
    const breadcrumb = [...p.breadcrumb];
    const  url = id ? `${origin}?id=${id}` : `${origin}?name=${name}&value=${value}&filter_type=${filter_type}`;
    breadcrumb[breadcrumb.length - 1] = {
      name: name || "",
      path: url,
    };
    p.breadcrumb = breadcrumb;

    dispatch(
      setPage({
        ...p,
      }),
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // hooks
  useSetTable(status, () => setStatus("ready"), table, []);


  const getInfo = (): JSX.Element => {

    if (typeof window == "undefined") return <></>;

    const searchParams = new URLSearchParams(window.location.search);
    const name = searchParams.get("name");
    const value = searchParams.get("value");
    const filter_type = searchParams.get("filter_type");
    return (
      <div className="d-flex flex-column ps-2">
        <div><strong>{t("name")}: </strong>{name}</div>
        <div><strong>{t("value")}: </strong>{value}</div>
        <div><strong>{t("type")}: </strong>{filter_type}</div>
      </div>
    );
  };


  return (
    <BackofficeMainTemplate status={status}>
      <PageTableComponent
        metaColumns={[]}
        info={getInfo()}
      />
    </BackofficeMainTemplate>
  );
};

export default FilteredDevices;
