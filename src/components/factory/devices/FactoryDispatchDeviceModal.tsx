import { dispatchFactoryDevice, getFactoryClients } from "@/api/factory";
import ModalComponent from "@/components/modal/ModalComponent";
import { useTranslation } from "@/context/contextUtils";
import { useAppDispatch } from "@/redux/hooks";
import { setError } from "@/slices/pageSlice";
import { GenericRecord } from "@/types";
import React, { memo, useEffect, useState } from "react";

/**
 * Print controls component.
 */

const FactoryDispatchDeviceModal = ({ endDispatchDevice, dispatchDevice }: { endDispatchDevice: () => void, dispatchDevice:GenericRecord }) => {
  const t = useTranslation();
  const dispatch = useAppDispatch();
  const [clients, setClients] = useState<GenericRecord[]>([]);
  const [updated, setUpdated] = useState<boolean>(false);

  const [recordCurrent, setRecordCurrent] = useState<GenericRecord>({
    FactoryDispatchedDate: "",
    Client: "",
  });

  // Prepare page data
  useEffect(() => {
    const getClients = async () => {
      try {
        const response = await getFactoryClients();
        setClients(response.data.result);
      } catch (error) {
        dispatch(setError(t("undefined_error")));
      }
    };

    getClients();
  }, [dispatch]); // eslint-disable-line

  const renderClients = () => {
    return clients.map((client: GenericRecord) => {
      return (
        <option key={client.id} value={client.id}>
          {client.name}
        </option>
      );
    });
  };
  const handleDispatch = async () => {
    console.log("dispatch");
    if (recordCurrent.Client != "" && recordCurrent.FactoryDispatchedDate != "") {
      try {
        const response = await dispatchFactoryDevice({
          ...recordCurrent,
          device: dispatchDevice,
        });

        if (response.data.success) {
          setUpdated(true);
        }
      } catch (error) {
        dispatch(setError(t("operation_not_executed")));
      }
    }
  };

  return (
    <ModalComponent
      title={t("dispatch_devices_question")}
      closeButton={true}
      onClose={() => endDispatchDevice()}
      dismissible={false}
      onActionLabel={updated ? "" : "dispatch"}
      onAction={handleDispatch}
    >
      {!updated && (
        <div className="d-flex flex-column">
          <div>
            <label htmlFor="clients">{t("client")}</label>
            <select
              className="form-select"
              id="clients"
              value={recordCurrent.Client}
              onChange={(e) => setRecordCurrent({ ...recordCurrent, Client: e.target.value })}
            >
              <option value="">{t("select")}</option>
              {renderClients()}
            </select>
          </div>
          <div className="mt-2">
            <label htmlFor="date">{t("dispatch_date")}</label>
            <input
              type="date"
              className="form-select"
              id="date"
              value={recordCurrent.FactoryDispatchedDate}
              onChange={(e) =>
                setRecordCurrent({ ...recordCurrent, FactoryDispatchedDate: e.target.value })
              }
            />
          </div>
          <div className="mt-2">
            <label>{t("devices")}</label>
            <div className="form-control">
              {dispatchDevice.Id}
            </div>
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
export default memo(FactoryDispatchDeviceModal);
