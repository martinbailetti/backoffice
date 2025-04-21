
import {  cancelSyncActionRequestDevice } from "@/api/licenses";
import ModalComponent from "@/components/modal/ModalComponent";
import { useTranslation } from "@/context/contextUtils";
import { useAppDispatch } from "@/redux/hooks";
import { setError } from "@/slices/pageSlice";
import { GenericRecord } from "@/types";
import React, { memo, useState } from "react";

/**
 * Print controls component.
 */

const DeviceCancelSyncActionRequestModal = ({
  record,
  endModal,
  setRecord,
}: {
  record: GenericRecord;
  endModal: () => void;
  setRecord: (rec: GenericRecord | null) => void;
}) => {
  const t = useTranslation();
  const dispatch = useAppDispatch();
  const [done, setDone] = useState<boolean>(false);

  const handleClick = async () => {
    try {
      const response = await cancelSyncActionRequestDevice(record);

      if (response.data.success) {
        setDone(true);
      } else {
        dispatch(setError(t("operation_not_executed")));
      }
    } catch (error) {
      dispatch(setError(t("operation_not_executed")));
    }
  };

  return (
    <>
      <ModalComponent
        title={`${t("cancel_request")}: ${record.Id}`}
        closeButton={true}
        onClose={!done ? () => setRecord(null) : () => endModal()}
        dismissible={false}
        onActionLabel={done ? "" : "cancel_request"}
        onAction={handleClick}
      >
        {!done && (
          <div className="d-flex flex-column">
            <div>
              <label>{t("device")}</label>
              <div className="form-control">{record.Id}</div>
            </div>
          </div>
        )}
        {done && (
          <div className="d-flex flex-column text-success">
            {t("operation_executed_successfully")}
          </div>
        )}
      </ModalComponent>
    </>
  );
};
export default memo(DeviceCancelSyncActionRequestModal);
