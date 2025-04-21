import React, {  memo, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import ModalComponent from "../modal/ModalComponent";
import { GenericRecord } from "@/types";
import { setRowActionsModal, setRefresh } from "@/slices/tableSlice";
import { useTranslation } from "@/context/contextUtils";
import { getApiFunction } from "@/api/apiFunctions";
import { getNestedProperty } from "@/utils";

/**
 * Filters component.
 */

const RowActions = () => {
  

  const t = useTranslation();

  const tableDataRowActions = useAppSelector((state) => state.tableData.rowActions);
  const tableDataSelectedRow = useAppSelector((state) => state.tableData.selectedRow);
  const tableDataRowTitle = useAppSelector((state) => state.tableData.rowTitle);
  const dispatch = useAppDispatch();

  type RowActionData = { status: string; actionSelected: GenericRecord | null };
  const [rowActionData, setRowActionData] = useState<RowActionData>({
    status: "visible",
    actionSelected: null,
  });

  const handleRowActionConfirmationClick = async (action: GenericRecord) => {
    try {
      const f = getApiFunction(action.result.apiFunction);

      const searchParams = new URLSearchParams(window.location.search);
      const initialParams: GenericRecord = {};
      if (action.result.params && action.result.params.length > 0) {
        action.result.params.forEach((param: GenericRecord) => {
          initialParams[param.query] = searchParams.get(param.url);
        });
      }
      const response = await f({
        ...tableDataSelectedRow,
        ...initialParams,
      });


      const success = getNestedProperty(response.data, action.result.success ?? "success");

      if (!success) {
        const message = getNestedProperty(response.data, action.result.message ?? "message");
        console.log("ERROR: ", message);
        setRowActionData({ status: "error", actionSelected: action });
      } else {
        setRowActionData({ status: "success", actionSelected: null });

        dispatch(setRefresh());
      }
    } catch (error) {
      console.log("ERROR: ", error);
      setRowActionData({ status: "error", actionSelected: action });
    }

  };

  const handleRowActionClick = (action: GenericRecord) => {
    setRowActionData({ status: "confirm", actionSelected: action });
  };

  const renderRowActions = () => {
    return tableDataRowActions.map((action: GenericRecord) => {
      return (
        <div
          key={action.label}
          className={action.className}
          onClick={() => handleRowActionClick(action)}
        >
          <div>{t(action.label)}</div>
        </div>
      );
    });
  };

  return (
    <>
      <ModalComponent
        title={rowActionData.actionSelected ? t(rowActionData.actionSelected.label) : ""}
        onClose={() => {
          setRowActionData({ status: "hidden", actionSelected: null });

          dispatch(setRowActionsModal(false));
        }}
        closeButton={false}
        dismissible={true}
        {...(rowActionData.status === "confirm" &&
          rowActionData.actionSelected && {
            onActionLabel: t("apply"),
            onAction: () =>
              handleRowActionConfirmationClick(rowActionData.actionSelected as GenericRecord),
          })}
      >
        {rowActionData.status === "visible" && renderRowActions()}
        {rowActionData.status === "confirm" && (
          <>
            <p>{t("confirm_operation")}</p>
            {tableDataSelectedRow ? tableDataSelectedRow[tableDataRowTitle] : ""}
          </>
        )}
        {rowActionData.status === "success" && <>{t("operation_executed_successfully")}</>}
        {rowActionData.status === "error" && <>{t("operation_not_executed")}</>}
      </ModalComponent>
    </>
  );
};
export default memo(RowActions);
