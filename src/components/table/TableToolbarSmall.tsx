import React, { memo, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { MdChecklist, MdFilterList } from "react-icons/md";
import { MdOutlineChecklist } from "react-icons/md";

import { FaSquare, FaTable } from "react-icons/fa6";
import ModalComponent from "../modal/ModalComponent";
import FilterSmall from "../filters/FilterSmall";
import { GenericRecord } from "@/types";
import { LuRefreshCw } from "react-icons/lu";
import { FaInfoCircle } from "react-icons/fa";

import { FaCheckSquare, FaFileDownload } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { useTranslation } from "@/context/contextUtils";
import downloadExcel from "@/utils/download";
import MultiActions from "./MultiActions";
import { setColumns, setMultiActionsModal, setRefresh } from "@/slices/tableSlice";
import { can } from "@/utils/auth";
import Link from "next/link";
import { Dropdown } from "react-bootstrap";

/**
 * Filters component.
 */

const TableToolbarSmall = ({ total = 0, customMultiActions = [] }: { total: number, customMultiActions?: GenericRecord[] }) => {
  const t = useTranslation();

  const user = useAppSelector((state) => state.userData.data);
  const tableDataFilters = useAppSelector((state) => state.tableData.filters);
  const tableDataLoading = useAppSelector((state) => state.tableData.loading);
  const tableDataMultiActionsModal = useAppSelector((state) => state.tableData.multiActionsModal);
  const tableDataMultiActions = useAppSelector((state) => state.tableData.multiActions);
  const tableDataSelectedRows = useAppSelector((state) => state.tableData.selectedRows);

  const pageDataColumns = useAppSelector((state) => state.tableData.columns);
  const pageDataCreatePath = useAppSelector((state) => state.pageData.createPath);
  const pageDataInfoPath = useAppSelector((state) => state.pageData.infoPath);
  const pageDataExportApiFunction = useAppSelector((state) => state.pageData.exportApiFunction);

  const tableDataOnlyFilteredQueries = useAppSelector(
    (state) => state.tableData.onlyFilteredQueries,
  );

  const dispatch = useAppDispatch();

  //STATES
  const [showFilters, setShowFilters] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const filtersAppliedCount = tableDataFilters.filter((filter) => filter.applied).length;


  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = event.currentTarget as HTMLElement;
    const dataKey = target.getAttribute("data-key");

    const columns = [...pageDataColumns];
    const index = columns.findIndex((col) => col.key === dataKey);
    if (index > -1) {
      const col = { ...columns[index], omit: !columns[index].omit };
      columns[index] = col;

      dispatch(setColumns(columns));
    }
  };

  const renderColumns = () => {
    return pageDataColumns
      .filter((column: GenericRecord) => column.name)
      .map((column: GenericRecord) => {
        return (
          <div
            key={column.key}
            data-key={column.key}
            className="btn btn-outline-secondary mb-1  d-flex justify-content-between align-items-center"
            onClick={handleClick}
          >
            <div>{column.name}</div>
            <div>{!column.omit ? <FaCheckSquare /> : <FaSquare />}</div>
          </div>
        );
      });
  };

  const getFilters = () => tableDataFilters.filter((filter: GenericRecord) => filter.applied);

  const exportToExcel = async () => {
    if (downloading) return;
    setDownloading(true);

    let filters = tableDataFilters.filter((filter: GenericRecord) => filter.applied);

    filters = filters.map((filter: GenericRecord) => {
      if (!filter.multi && filter.value.length == 1) {
        return { id: filter.id, value: filter.value[0] };
      }
      return { id: filter.id, value: filter.value };
    });

    await downloadExcel(pageDataExportApiFunction as string, filters, "report.xlsx");
    setDownloading(false);
  };

  const renderCustomMultiActions = () => {
    return customMultiActions.map((action: GenericRecord) => {
      return (

        <Dropdown.Item key={action.label} onClick={() => action.action()}>{t(action.label)}</Dropdown.Item>
      );
    });
  }


  return (
    <>
      <div className="d-flex d-md-none flex-row flex-md-row justify-content-between align-items-center bg-light py-2 pe-2">
        <div className="ps-2">
          {((tableDataOnlyFilteredQueries && getFilters().length > 0) ||
            !tableDataOnlyFilteredQueries) && (
              <>
                {t("total")}:{" "}
                {!tableDataLoading ? (
                  total
                ) : (
                  <div className="spinner-grow spinner-grow-sm text-secondary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
              </>
            )}
        </div>

        <div>
          {pageDataInfoPath && (
            <Link className={`btn btn-outline-dark btn-sm w-auto me-2`} href={pageDataInfoPath}>
              <FaInfoCircle />
            </Link>
          )}
          <div
            className={`btn btn-outline-success btn-sm w-auto me-2 ${(tableDataOnlyFilteredQueries && getFilters().length > 0) || !tableDataOnlyFilteredQueries ? "" : "disabled"}`}
            onClick={() => dispatch(setRefresh())}
          >
            <LuRefreshCw />
          </div>
          {pageDataExportApiFunction && (
            <div
              className={`btn btn-success btn-sm w-auto me-2 ${(tableDataOnlyFilteredQueries && getFilters().length > 0) || !tableDataOnlyFilteredQueries ? "" : "disabled"}`}
              onClick={exportToExcel}
            >
              {!downloading && <FaFileDownload />}
              {downloading && (
                <div className="spinner-border spinner-border-sm" role="status"></div>
              )}
            </div>
          )}
          {pageDataCreatePath && can(user, pageDataCreatePath.permission) && (
            <Link
              className={`btn btn-primary btn-sm w-auto me-2`}
              href={pageDataCreatePath.path}
            >
              <FaPlus />
            </Link>
          )}

          {tableDataMultiActions.length > 0 && (
            <div
              className={`btn btn-dark btn-sm w-auto me-2 position-relative ${tableDataSelectedRows.length > 0 ? "" : "disabled"}`}
              onClick={() => dispatch(setMultiActionsModal(true))}
            >
              <MdOutlineChecklist />
              {tableDataSelectedRows.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-info text-dark">
                  {tableDataSelectedRows.length}
                </span>
              )}
            </div>
          )}
          {customMultiActions.length > 0 && (
            <Dropdown className=" d-inline-block">
              <Dropdown.Toggle variant="success" id="dropdown-basic" className={`btn btn-dark btn-sm position-relative me-2 ${tableDataSelectedRows.length == 0 ? " disabled" : ""}`}>
                <MdChecklist />
                {tableDataSelectedRows.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-info text-dark">
                    {tableDataSelectedRows.length}
                  </span>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {renderCustomMultiActions()}
              </Dropdown.Menu>
            </Dropdown>
          )}

          {tableDataFilters.length > 0 && (
            <div
              className={`btn btn-info btn-sm w-auto position-relative me-2`}
              onClick={() => setShowFilters(true)}
            >
              <MdFilterList />
              {filtersAppliedCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">
                  {filtersAppliedCount}
                </span>
              )}
            </div>
          )}

          <div
            className={`btn btn-outline-dark btn-sm w-auto me-2 position-relative ${(tableDataOnlyFilteredQueries && getFilters().length > 0) || !tableDataOnlyFilteredQueries ? "" : "disabled"}`}
            onClick={() => setShowTable(true)}
          >
            <FaTable />
            {pageDataColumns.filter((column) => column.omit).length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                {-pageDataColumns.filter((column) => column.omit).length}
              </span>
            )}
          </div>
        </div>
      </div>

      {showFilters && (
        <ModalComponent title={"Filters"} onClose={() => setShowFilters(false)} centered={false}>
          <FilterSmall />
        </ModalComponent>
      )}

      {showTable && (
        <ModalComponent title={"Columns"} onClose={() => setShowTable(false)} dismissible={true}>
          {renderColumns()}
        </ModalComponent>
      )}

      {tableDataMultiActionsModal && <MultiActions />}
    </>
  );
};

export default memo(TableToolbarSmall);
