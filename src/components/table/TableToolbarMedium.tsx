import React, { memo, useState } from "react";

import { FaPlus, FaTable } from "react-icons/fa6";
import { GenericRecord } from "@/types";
import ModalComponent from "../modal/ModalComponent";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setMultiActionsModal, setColumns, setRefresh } from "@/slices/tableSlice";
import { FaFileDownload, FaInfoCircle } from "react-icons/fa";

import { FaCheckSquare } from "react-icons/fa";
import { FaSquare } from "react-icons/fa";
import { LuRefreshCw } from "react-icons/lu";
import MultiActions from "./MultiActions";
import FilterMedium from "../filters/FilterMedium";
import FiltersApplied from "../filters/FiltersApplied";
import { useTranslation } from "@/context/contextUtils";
import downloadExcel from "@/utils/download";
import { can } from "@/utils/auth";
import Link from "next/link";
import { Dropdown } from "react-bootstrap";
import { MdChecklist } from "react-icons/md";



/**
 * Filters component.
 */

const TableToolbarMedium = ({ total = 0, customMultiActions = [] }: { total: number, customMultiActions?: GenericRecord[] }) => {
  const t = useTranslation();

  const dispatch = useAppDispatch();
  const [showTable, setShowTable] = useState(false);

  const user = useAppSelector((state) => state.userData.data);
  const [downloading, setDownloading] = useState(false);


  const pageDataCreatePath = useAppSelector((state) => state.pageData.createPath);
  const pageDataInfoPath = useAppSelector((state) => state.pageData.infoPath);
  const pageDataExportApiFunction = useAppSelector((state) => state.pageData.exportApiFunction);

  const tableDataOnlyFilteredQueries = useAppSelector(
    (state) => state.tableData.onlyFilteredQueries,
  );

  const tableDataLoading = useAppSelector((state) => state.tableData.loading);
  const tableDataFilters = useAppSelector((state) => state.tableData.filters);
  const tableDataColumns = useAppSelector((state) => state.tableData.columns);
  const tableDataSelectedRows = useAppSelector((state) => state.tableData.selectedRows);
  const tableDataMultiActionsModal = useAppSelector((state) => state.tableData.multiActionsModal);
  const tableDataMultiActions = useAppSelector((state) => state.tableData.multiActions);

  const getFilters = () => tableDataFilters.filter((filter: GenericRecord) => filter.applied);

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = event.currentTarget as HTMLElement;
    const dataKey = target.getAttribute("data-key");

    const columns = [...tableDataColumns];
    const index = columns.findIndex((col) => col.key === dataKey);
    if (index > -1) {
      const col = { ...columns[index], omit: !columns[index].omit };
      columns[index] = col;

      dispatch(setColumns(columns));
    }
  };

  const renderColumns = () => {
    return tableDataColumns
      .filter((column: GenericRecord) => column.name)
      .map((column: GenericRecord) => {
        return (
          <div
            key={column.key}
            data-key={column.key}
            className=" btn btn-outline-secondary mb-1  d-flex justify-content-between align-items-center"
            onClick={handleClick}
          >
            <div>{column.name}</div>
            <div>{!column.omit ? <FaCheckSquare /> : <FaSquare />}</div>
          </div>
        );
      });
  };
  const exportToExcel = async () => {
    if (downloading) return;
    if (pageDataExportApiFunction == null) return;
    setDownloading(true);

    let filters = tableDataFilters.filter((filter: GenericRecord) => filter.applied);

    filters = filters.map((filter: GenericRecord) => {
      if (!filter.multi && filter.value.length == 1) {
        return { id: filter.id, value: filter.value[0] };
      }
      return { id: filter.id, value: filter.value };
    });


    await downloadExcel(pageDataExportApiFunction, filters, "report.xlsx");
    setDownloading(false);
  };

  const renderCustomMultiActions = () => {
    return customMultiActions.map((action: GenericRecord) => {
      console.log("action", action);
      return (

        <Dropdown.Item key={action.label} onClick={() => action.action()}>{t(action.label)}</Dropdown.Item>
      );
    });
  }


  return (
    <>
      <div className="toolbar d-flex justify-content-between py-0 align-items-start">
        <div className="d-flex justify-content-start align-items-center">
          <div className="toolbar-total pe-2 me-2 border-end fw-bold">
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
          {tableDataFilters.length > 0 && <FilterMedium />}
        </div>
        <div className="d-flex justify-content-end align-items-center">
          {pageDataInfoPath && (
            <Link className={`btn btn-outline-dark w-auto me-2`} href={pageDataInfoPath}>
              <FaInfoCircle />
            </Link>
          )}

          <div
            className={`btn btn-outline-success  w-auto me-2 ${(tableDataOnlyFilteredQueries && getFilters().length > 0) || !tableDataOnlyFilteredQueries ? "" : "disabled"}`}
            onClick={() => dispatch(setRefresh())}
          >
            <LuRefreshCw />
          </div>
          {pageDataExportApiFunction && (
            <div
              className={`btn btn-success w-auto me-2 ${(tableDataOnlyFilteredQueries && getFilters().length > 0) || !tableDataOnlyFilteredQueries ? "" : "disabled"}`}
              onClick={exportToExcel}
            >
              {!downloading && <FaFileDownload />}
              {downloading && (
                <div className="spinner-border spinner-border-sm" role="status"></div>
              )}
            </div>
          )}
          {pageDataCreatePath && can(user, pageDataCreatePath.permission) && (
            <Link className={`btn btn-primary w-auto me-2`} href={pageDataCreatePath.path}>
              <FaPlus />
            </Link>
          )}
          {tableDataMultiActions.length > 0 && (
            <button
              className="btn btn-dark position-relative me-2"
              {...(tableDataSelectedRows.length == 0 && { disabled: true })}
              onClick={() => dispatch(setMultiActionsModal(true))}
            >
              {t("selected_records")}
              {tableDataSelectedRows.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-info text-dark">
                  {tableDataSelectedRows.length}
                </span>
              )}
            </button>
          )}
          {customMultiActions.length > 0 && (
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic" className={`btn btn-dark position-relative me-2 ${tableDataSelectedRows.length == 0?" disabled": ""}`}>
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

          <div
            className={`btn btn-outline-dark  w-auto me-2 position-relative ${(tableDataOnlyFilteredQueries && getFilters().length > 0) || !tableDataOnlyFilteredQueries ? "" : "disabled"}`}
            onClick={() => setShowTable(true)}
          >
            <FaTable />
            {tableDataColumns.filter((column) => column.omit).length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                {-tableDataColumns.filter((column) => column.omit).length}
              </span>
            )}
          </div>
        </div>
      </div>
      <div>
        <FiltersApplied />
      </div>
      {showTable && (
        <ModalComponent title={"Columns"} onClose={() => setShowTable(false)} dismissible={true}>
          {renderColumns()}
        </ModalComponent>
      )}

      {tableDataMultiActionsModal && <MultiActions />}
    </>
  );
};
export default memo(TableToolbarMedium);
