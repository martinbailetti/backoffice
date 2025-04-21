import { useEffect, useState } from "react";
import { GenericRecord } from "@/types";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import useSetTable from "@/hooks/useSetTablePage";

// config imports


import { rowActions } from "@/config/pages/factory/settings/printings/actions";
import table from "@/config/pages/factory/settings/printings/table";
import page from "@/config/pages/factory/settings/printings/index";
import PageTableComponent from "@/templates/components/PageTableComponent";
import { useAppDispatch } from "@/redux/hooks";
import { setRowActionsModal, setSelectedRow } from "@/slices/tableSlice";
import { MdMoreVert } from "react-icons/md";
import { setPage } from "@/slices/pageSlice";
import Link from "next/link";

export const SpvClients = () => {

  // redux
  const dispatch = useAppDispatch();


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
        <Link className="text-primary" href={`/spv/settings/clients/edit?id=${row.id}`}>
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
  useSetTable(status, () => setStatus("ready"), table, [], rowActions);

  return (
    <BackofficeMainTemplate status={status}>
      <PageTableComponent
        metaColumns={metaColumns}
      />
    </BackofficeMainTemplate>
  );
};

export default SpvClients;
