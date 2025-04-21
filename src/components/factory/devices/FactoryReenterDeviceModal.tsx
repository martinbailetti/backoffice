import { undispatchFactoryDevice } from "@/api/factory";
import ModalComponent from "@/components/modal/ModalComponent";
import { useTranslation } from "@/context/contextUtils";
import { useAppDispatch } from "@/redux/hooks";
import { setError } from "@/slices/pageSlice";
import { GenericRecord } from "@/types";
import React, { memo, useState } from "react";

/**
 * Print controls component.
 */

const FactoryReenterDeviceModal = ({
  endUndispatchDevice,
  undispatchDevice,
}: {
  endUndispatchDevice: () => void;
  undispatchDevice: GenericRecord;
}) => {
  const t = useTranslation();
  const dispatch = useAppDispatch();
  const [updated, setUpdated] = useState<boolean>(false);

  const handleUndispatch = async () => {
    console.log("dispatch");

    try {
      const response = await undispatchFactoryDevice({
        device: undispatchDevice,
      });

      if (response.data.success) {
        setUpdated(true);
      }
    } catch (error) {
      dispatch(setError(t("operation_not_executed")));
    }
  };

  return (
    <ModalComponent
      title={t("no_dispatch_devices_question")}
      closeButton={true}
      onClose={() => endUndispatchDevice()}
      dismissible={false}
      onActionLabel={updated ? "" : "reenter"}
      onAction={handleUndispatch}
    >
      {!updated && (
        <div className="d-flex flex-column">
          <div className="mt-2">
            <label>{t("devices")}</label>
            <div className="form-control">{undispatchDevice.Id}</div>
          </div>
        </div>
      )}
      {updated && (
        <div className="d-flex flex-column text-success">
          {t("operation_executed_successfully")}
        </div>
      )}
    </ModalComponent>
  );
};
export default memo(FactoryReenterDeviceModal);
