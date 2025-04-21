import { useEffect, useState } from "react";
import { GenericRecord } from "@/types";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import useSetTable from "@/hooks/useSetTablePage";

// config imports


import { rowActions } from "@/config/pages/factory/dispatch_orders/actions";
import table from "@/config/pages/factory/dispatch_orders/table";
import filters from "@/config/pages/factory/dispatch_orders/filters";
import page from "@/config/pages/factory/dispatch_orders/index";
import PageTableComponent from "@/templates/components/PageTableComponent";
import { useAppDispatch } from "@/redux/hooks";
import { setRowActionsModal, setSelectedRow } from "@/slices/tableSlice";
import { MdMoreVert } from "react-icons/md";
import { setPage } from "@/slices/pageSlice";
import { getFormattedDateTime } from "@/utils/table";
import Link from "next/link";

export const DispatchOrders = () => {

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
      key: "id_number",
      cell: (row: GenericRecord) => (
        <Link className="text-primary" href={`/factory/dispatch_orders/edit?id=${row.id}`}>
          {getFormattedDateTime(row.id_number)}
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

export default DispatchOrders;
