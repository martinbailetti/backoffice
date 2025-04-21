import { memo, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import DataTable, { TableColumn } from "react-data-table-component";
import useResponsive from "@/hooks/useResponsive";
import useSizeScroll from "./hooks/useSizeScroll";
import { GenericRecord, TableProps } from "@/types";
import {
  getColumnIndexByKey,
  getColumns,
  getColumnsWithMeta,
  getSerializedColumns,
} from "@/utils/table";
import { useTranslation } from "@/context/contextUtils";
import {
  setPage,
  setRowsPerPage,
  setSelectedRows,
  setSort,
  setColumns as setTableColumns,
} from "@/slices/tableSlice";
import useTablePaginationTop from "./hooks/useTablePaginationTop";
import useTableScrollTop from "./hooks/useTableScrollTop";
import useFetchData from "./hooks/useFetchData";
import useSetColumns from "./hooks/useSetColumns";
import useSetParams from "./hooks/useSetParams";

const Table = ({ metaColumns, setTotal = () => null, customMultiActions = [] }: TableProps) => {
  // Translation
  const t = useTranslation();

  // Redux
  const dispatch = useAppDispatch();

  const tableDataRowsPerPage = useAppSelector((state) => state.tableData.paginationRowsPerPage);
  const tableDataFixedHeight = useAppSelector((state) => state.tableData.fixedHeight);
  const tableDataPage = useAppSelector((state) => state.tableData.page);
  const tableDataLoading = useAppSelector((state) => state.tableData.loading);
  const tableDataSort = useAppSelector((state) => state.tableData.sort);
  const tableDataCustomStyles = useAppSelector((state) => state.tableData.customStyles);
  const tableDataCustomHeadStyles = useAppSelector((state) => state.tableData.customHeadStyles);
  const tableDataPaginationRowsPerPageOptions = useAppSelector(
    (state) => state.tableData.paginationRowsPerPageOptions,
  );

  const tableDataColumns = useAppSelector((state) => state.tableData.columns);
  const tableDataMultiActions = useAppSelector((state) => state.tableData.multiActions);

  // States
  const [result, setResult] = useState<GenericRecord>({ total: 0, data: [] });
  const [clearSelectedRows, setClearSelectedRows] = useState<boolean>(false); // State to clear selected rows

  const [params, setParams] = useState<GenericRecord | null>(null);
  const [columns, setColumns] = useState<GenericRecord[] | null>(null);

  // Refs
  const parentRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement | null>(null);
  const topScrollRef = useRef<HTMLDivElement | null>(null);
  const topScrollContentRef = useRef<HTMLDivElement | null>(null);

  // Table custom hooks
  const size = useResponsive();
  const scrollHeight = useSizeScroll(parentRef, tableDataFixedHeight);

  useTablePaginationTop(paginationRef, result.data);

  useTableScrollTop(parentRef, topScrollRef, topScrollContentRef, columns, result.data);

  useFetchData(setResult, setTotal, setClearSelectedRows, params, scrollHeight, clearSelectedRows);

  useSetColumns(setColumns);
  useSetParams(setParams);

  // Functions

  // Function to check if the table has multiActions
  const isMultiActions = () => {
    if (
      (tableDataMultiActions && tableDataMultiActions.length > 0) ||
      customMultiActions.length > 0
    ) {
      return true;
    }
    return false;
  };
  // Function to get the table styles
  const getCustomStyles = () => {
    const data: GenericRecord = {};
    for (const id in tableDataCustomHeadStyles) {
      if (tableDataCustomHeadStyles.hasOwnProperty(id)) {
        const index = getColumnIndexByKey(tableDataColumns, id);
        console.log(id, index);
        if (index >= 0) {
          const plus = isMultiActions() ? 1 : 0;
          data[`&:nth-child(${index + 1 + plus})`] = tableDataCustomHeadStyles[id];
        }
      }
    }

    const customStyles = {
      ...tableDataCustomStyles,
      headCells: { style: data },
      responsiveWrapper: {
        style: {
          borderTop: "1px solid lightgray",
          borderRight: "1px solid lightgray",
          borderLeft: "1px solid lightgray",
          borderRadius: "6px",
        },
      },
      header: {
        style: {
          border: "1px solid lightgray",
          borderRadius: "6px",
        },
      },
    };

    return customStyles;
  };
  // Function to handle sorting
  const handleSort = (column: GenericRecord, sortDirection: "asc" | "desc") => {
    dispatch(setSort({ column: column.key, direction: sortDirection }));
  };

  const tableColumns: TableColumn<GenericRecord>[] = useMemo(() => {
    if (!columns) return [];
    return getColumnsWithMeta(
      getColumns(columns as GenericRecord[], tableDataColumns, t),
      metaColumns as GenericRecord[],
    );
  }, [columns, tableDataColumns, metaColumns, t]);


  return (
    <>
      {size !== "small" && !tableDataFixedHeight && (
        <div className="mt-2" ref={paginationRef}></div>
      )}
      {columns && (
        <div ref={parentRef} className={`overflow-hidden flex-grow-1 bg-white table-container`}>
          {size !== "small" && !tableDataFixedHeight && (
            <div
              ref={topScrollRef}
              style={{
                overflowX: "auto",
                padding: "3px 10px",
              }}
            >
              <div ref={topScrollContentRef}></div>
            </div>
          )}
          {(scrollHeight !== "" || (size !== "small" && !tableDataFixedHeight)) && (
            <DataTable
              columns={tableColumns}
              onColumnOrderChange={(cols) => {
                dispatch(setTableColumns(getSerializedColumns(cols)));
              }}
              customStyles={
                tableDataCustomStyles || tableDataCustomHeadStyles ? getCustomStyles() : {}
              }
              data={result.data}
              progressPending={tableDataLoading}
              pagination
              paginationPerPage={tableDataRowsPerPage}
              paginationDefaultPage={tableDataPage}
              paginationRowsPerPageOptions={tableDataPaginationRowsPerPageOptions}
              paginationServer
              paginationComponentOptions={{
                noRowsPerPage:
                  tableDataPaginationRowsPerPageOptions &&
                  tableDataPaginationRowsPerPageOptions.length == 0
                    ? true
                    : false,
              }}
              paginationTotalRows={result.total}
              onChangePage={(page) => {
                dispatch(setPage(page));
              }}
              onChangeRowsPerPage={(rowsPerPage) => {
                dispatch(setRowsPerPage(rowsPerPage));
              }}
              onSort={handleSort}
              sortServer
              defaultSortFieldId={getColumnIndexByKey(tableDataColumns, tableDataSort?.column) + 1}
              defaultSortAsc={tableDataSort?.direction === "asc"}
              selectableRows={
                (tableDataMultiActions && tableDataMultiActions.length > 0) ||
                customMultiActions.length > 0
                  ? true
                  : false
              }
              clearSelectedRows={clearSelectedRows}
              onSelectedRowsChange={(selected) => {
                dispatch(setSelectedRows(selected.selectedRows));
              }}
              {...((size === "small" || tableDataFixedHeight) && {
                fixedHeader: true,
                fixedHeaderScrollHeight: scrollHeight,
              })}
            />
          )}
        </div>
      )}
    </>
  );
};

export default memo(Table);
