import { useEffect, useState } from "react";
import { GenericRecord } from "@/types";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import useSetTable from "@/hooks/useSetTablePage";


import filters from "@/config/pages/validations/validation_report/filters";
import table from "@/config/pages/validations/validation_report/table";
import page from "@/config/pages/validations/validation_report/index";
import PageTableComponent from "@/templates/components/PageTableComponent";
import { useAppDispatch } from "@/redux/hooks";
import { setRowActionsModal, setSelectedRow } from "@/slices/tableSlice";
import { MdMoreVert } from "react-icons/md";
import { setPage } from "@/slices/pageSlice";
import Link from "next/link";
import { useTranslation } from "@/context/contextUtils";

export const ValidationReport = () => {

  // redux
  const dispatch = useAppDispatch();

  const t = useTranslation();

  // states
  const [status, setStatus] = useState<string>("prepared");

  // Columns additions
  const metaColumns = [
    {
      key: "actions",
      cell: (row: GenericRecord) => (
        <div>
          <button
            className="btn btn-dark btn-sm"
            onClick={() => {
              dispatch(setSelectedRow(row));
              dispatch(setRowActionsModal(true));
            }}
          >
            <MdMoreVert />
          </button>
        </div>
      ),
    },
    {
      key: "name",
      cell: (row: GenericRecord) => (
        <Link className="text-primary" href={`/validations/validation_rules/edit?id=${row.id}`}>
          {row.name}
        </Link>
      ),
    },
    {
      key: "enabled",
      cell: (row: GenericRecord) => (
        <span className={`${row.enabled == 1 ? "text-success" : "text-danger"}`}>
          {row.enabled == 1 ? t("yes") : t("no")}
        </span>
      ),
    },
    {
      key: "filter_type",
      cell: (row: GenericRecord) => (
        <>
          {t(row.filter_type)}
        </>
      ),
    },
  ];

  useEffect(() => {
    dispatch(
      setPage({
        ...page,
      }),
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // hooks
  useSetTable(status, () => setStatus("ready"), table, filters);

  return (
    <BackofficeMainTemplate status={status}>
      <PageTableComponent
        metaColumns={metaColumns}
      />
    </BackofficeMainTemplate>
  );
};

export default ValidationReport;
