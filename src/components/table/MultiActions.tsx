import React, { memo, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import ModalComponent from "../modal/ModalComponent";
import { GenericRecord } from "@/types";
import { useTranslation } from "@/context/contextUtils";
import { setMultiActionsModal, setRefresh } from "@/slices/tableSlice";
import { getApiFunction } from "@/api/apiFunctions";

/**
 * Filters component.
 */

const MultiActions = () => {
  const t = useTranslation();

  const tableDataMultiActions = useAppSelector((state) => state.tableData.multiActions);
  const tableDataSelectedRows = useAppSelector((state) => state.tableData.selectedRows);
  const tableDataRowTitle = useAppSelector((state) => state.tableData.rowTitle);
  const dispatch = useAppDispatch();

  type MultiActionData = { status: string; actionSelected: GenericRecord | null };
  const [multiActionData, setMultiActionData] = useState<MultiActionData>({
    status: "visible",
    actionSelected: null,
  });

  const handleMultiActionConfirmationClick = async (action: GenericRecord) => {
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
        ...tableDataSelectedRows,
        ...initialParams,
      });

      if (response?.data.success) {
        setMultiActionData({ status: "success", actionSelected: null });

        dispatch(setRefresh());
      } else {
        console.log("ERROR: ", response?.data.message);
        setMultiActionData({ status: "error", actionSelected: action });
      }
    } catch (e) {
      setMultiActionData({ status: "error", actionSelected: action });
    }
  };

  const handleMultiActionClick = (action: GenericRecord) => {
    setMultiActionData({ status: "confirm", actionSelected: action });
  };

  const renderMultiActions = () => {
    return tableDataMultiActions.map((action: GenericRecord) => {
      return (
        <div
          key={action.label}
          className={action.className}
          onClick={() => handleMultiActionClick(action)}
        >
          <div>{t(action.label)}</div>
        </div>
      );
    });
  };
  const renderSelectedRows = () => {
    return tableDataSelectedRows.map((action: GenericRecord, index) => {
      return (
        <li key={index} className="list-group-item">
          {action[tableDataRowTitle]}
        </li>
      );
    });
  };
  return (
    <>
      <ModalComponent
        title={
          multiActionData.actionSelected
            ? t(multiActionData.actionSelected.label)
            : t("selected_records")
        }
        onClose={() => {
          setMultiActionData({ status: "hidden", actionSelected: null });

          dispatch(setMultiActionsModal(false));
        }}
        closeButton={true}
        dismissible={false}
        {...(multiActionData.status === "confirm" &&
          multiActionData.actionSelected && {
            onActionLabel: t("apply"),
            onAction: () =>
              handleMultiActionConfirmationClick(multiActionData.actionSelected as GenericRecord),
          })}
      >
        {multiActionData.status === "visible" && renderMultiActions()}
        {multiActionData.status === "confirm" && (
          <>
            <p>{t("selected_records")}:</p>
            <ul className="list-group">{renderSelectedRows()}</ul>
          </>
        )}
        {multiActionData.status === "success" && <>{t("operation_executed_successfully")}</>}
        {multiActionData.status === "error" && <>{t("operation_not_executed")}</>}
      </ModalComponent>
    </>
  );
};
export default memo(MultiActions);
