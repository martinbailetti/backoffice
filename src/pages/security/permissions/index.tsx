import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setRowActionsModal, setSelectedRow } from "@/slices/tableSlice";

import { GenericRecord } from "@/types";
import { MdMoreVert } from "react-icons/md";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import useSetTable from "@/hooks/useSetTablePage";

// config imports
import filters from "@/config/pages/security/permissions/filters";
import { rowActions } from "@/config/pages/security/permissions/actions";
import table from "@/config/pages/security/permissions/table";
import page from "@/config/pages/security/permissions/index";
import PageTableComponent from "@/templates/components/PageTableComponent";
import { setPage } from "@/slices/pageSlice";
import Link from "next/link";

export const Permissions = () => {

  // redux
  const dispatch = useAppDispatch();


  // states
  const [status, setStatus] = useState<string>(page.initialStatus); // If there's nothing to load before rendering the page, it should be "prepared"

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
        <Link className="text-primary" href={`/security/permissions/edit?id=${row.id}`}>
          {row.name}
        </Link>
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
  useSetTable(status, () => setStatus("ready"), table, filters, rowActions);

  return (
    <BackofficeMainTemplate status={status}>
      <PageTableComponent
        metaColumns={metaColumns}
      />
    </BackofficeMainTemplate>
  );
};

export default Permissions;
