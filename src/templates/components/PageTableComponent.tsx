import { useAppSelector } from "@/redux/hooks";
import RowActions from "@/components/table/RowActions";

import TableToolbar from "@/components/table/TableToolbar";
import { GenericRecord } from "@/types";
import Table from "@/components/table/Table";
import { useState } from "react";
import { useTranslation } from "@/context/contextUtils";

export const PageTableComponent = ({
  metaColumns,
  info,
  customMultiActions=[],
}: Readonly<{
  metaColumns: GenericRecord[];
  info?: JSX.Element;
  customMultiActions?: GenericRecord[];
}>) => {
  // redux
  const tableDataRowActionsModal = useAppSelector((state) => state.tableData.rowActionsModal);
  const tableDataRowActions = useAppSelector((state) => state.tableData.rowActions);
  const tableDataFilters = useAppSelector((state) => state.tableData.filters);
  const tableDataOnlyFilteredQueries = useAppSelector((state) => state.tableData.onlyFilteredQueries);

  const t = useTranslation();

  const getFilters = () => tableDataFilters.filter((filter: GenericRecord) => filter.applied);

  const [total, setTotal] = useState<number>(0);

  return (
    <>
      <TableToolbar total={total} customMultiActions={customMultiActions} />
      {info && <>{info}</>}

      {((tableDataOnlyFilteredQueries && getFilters().length > 0) || !tableDataOnlyFilteredQueries) && (
        <Table metaColumns={metaColumns} setTotal={setTotal} customMultiActions={customMultiActions} />
      )}

      {tableDataOnlyFilteredQueries && getFilters().length == 0 && (
        <p className="mt-3 text-center">{t("use_filter_to_query")}</p>
      )}

      {tableDataRowActionsModal && tableDataRowActions && <RowActions />}
    </>
  );
};

export default PageTableComponent;
