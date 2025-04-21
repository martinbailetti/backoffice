import { useEffect, useState } from "react";

import { GenericRecord } from "@/types";
import { MdMoreVert } from "react-icons/md";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import useSetTable from "@/hooks/useSetTablePage";

// config imports
import filters from "@/config/pages/security/users/filters";
import { rowActions } from "@/config/pages/security/users/actions";
import tableConfig from "@/config/pages/security/users/table";
import page from "@/config/pages/security/users/index";

import PageTableComponent from "@/templates/components/PageTableComponent";
import Link from "next/link";

// redux imports
import { setPage } from "@/slices/pageSlice";
import { useAppDispatch } from "@/redux/hooks";
import { setRowActionsModal, setSelectedRow } from "@/slices/tableSlice";

const makeMetaColumns = (onActionClick: (row: GenericRecord) => void) => [
  {
    key: "actions",
    cell: (row: GenericRecord) => (
      <div>
        <button
          className="btn btn-dark btn-sm"
          onClick={() => onActionClick(row)}
        >
          <MdMoreVert />
        </button>
      </div>
    ),
  },
  {
    key: "name",
    cell: (row: GenericRecord) => (
      <Link className="text-primary" href={`/security/users/edit?id=${row.id}`}>
        {row.name}
      </Link>
    ),
  },
];

const Users: React.FC = () => {
  // redux
  const dispatch = useAppDispatch();

  // states
  const [status, setStatus] = useState<string>("prepared"); // If there's nothing to load before rendering the page, it should be "prepared"


  useSetTable(status, () => setStatus("ready"), tableConfig, filters, rowActions);

  useEffect(() => {
    dispatch(
      setPage({
        ...page,
      }),
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  // table actions
  const handleActionClick = (row: GenericRecord) => {
    dispatch(setSelectedRow(row));
    dispatch(setRowActionsModal(true));
  };

  return (
    <BackofficeMainTemplate status={status}>
      <PageTableComponent metaColumns={makeMetaColumns(handleActionClick)} />
    </BackofficeMainTemplate>
  );
};

export default Users;
