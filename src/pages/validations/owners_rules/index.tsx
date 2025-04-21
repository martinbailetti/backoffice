import { useEffect, useState } from "react";
import { GenericRecord } from "@/types";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import useSetTable from "@/hooks/useSetTablePage";


import { rowActions } from "@/config/pages/validations/owners_rules/actions";
import table from "@/config/pages/validations/owners_rules/table";
import page from "@/config/pages/validations/owners_rules/index";
import PageTableComponent from "@/templates/components/PageTableComponent";
import { useAppDispatch } from "@/redux/hooks";
import { setRowActionsModal, setSelectedRow } from "@/slices/tableSlice";
import { MdMoreVert } from "react-icons/md";
import { setPage } from "@/slices/pageSlice";
import Link from "next/link";
import { useTranslation } from "@/context/contextUtils";

export const OwnersRules = () => {

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
      key: "Owner",
      cell: (row: GenericRecord) => (
        <Link className="text-primary" href={`/validations/owners_rules/edit?id=${row.Id}`}>
          {row.Owner}
        </Link>
      ),
    },
    {
      key: "Type",
      cell: (row: GenericRecord) => (
        <>
          {row.Type == "validation" ? t("autovalidate") : row.Type == "expiration" ? t("allow_expiration") : row.Type}
        </>
      ),
    },
    {
      key: "Enabled",
      cell: (row: GenericRecord) => (
        <span className={`${row.Enabled == 1 ? "text-success" : "text-danger"}`}>
          {row.Enabled == 1 ? t("yes") : t("no")}
        </span>
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
  useSetTable(status, () => setStatus("ready"), table, [], rowActions);

  return (
    <BackofficeMainTemplate status={status}>
      <PageTableComponent
        metaColumns={metaColumns}
      />
    </BackofficeMainTemplate>
  );
};

export default OwnersRules;
