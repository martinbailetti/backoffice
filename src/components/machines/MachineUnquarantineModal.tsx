import { unquarantineMachine } from "@/api/licenses";
import ModalComponent from "@/components/modal/ModalComponent";
import { useTranslation } from "@/context/contextUtils";
import { useAppDispatch } from "@/redux/hooks";
import { setError } from "@/slices/pageSlice";
import { GenericRecord } from "@/types";
import React, { memo, useState } from "react";

/**
 * Print controls component.
 */

const MachineUnquarantineModal = ({
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
  const [updated, setUpdated] = useState<boolean>(false);

  const handleClick = async () => {
    try {
      const response = await unquarantineMachine(record);

      if (response.data.success) {
        setUpdated(true);
      } else {
        dispatch(setError({ message: t("operation_not_executed") }));
      }
    } catch (e) {
      dispatch(setError({ message: t("operation_not_executed") }));
    }
  };

  return (
    <>
      <ModalComponent
        title={`${t("unset_quarantine")}: ${record.MachineId}`}
        closeButton={true}
        onClose={!updated ? () => setRecord(null) : () => endModal()}
        dismissible={false}
        onActionLabel={updated ? "" : "unset_quarantine"}
        onAction={handleClick}
      >
        {!updated && (
          <div className="d-flex flex-column">
            <div>
              <label>{t("machine")}</label>
              <div className="form-control">{record.MachineId}</div>
            </div>
          </div>
        )}
        {updated && (
          <div className="d-flex flex-column text-success">
            {t("operation_executed_successfully")}
          </div>
        )}
      </ModalComponent>
    </>
  );
};
export default memo(MachineUnquarantineModal);
