import {
  updateFactoryMachineSerialNumber,
} from "@/api/factory";
import ModalComponent from "@/components/modal/ModalComponent";
import { useTranslation } from "@/context/contextUtils";
import { useAppDispatch } from "@/redux/hooks";
import { setError } from "@/slices/pageSlice";
import { setRefresh } from "@/slices/tableSlice";
import { GenericRecord } from "@/types";
import React, { memo, useState } from "react";
import { Alert } from "react-bootstrap";

/**
 * Print controls component.
 */

const FactoryMachineSerialNumberModal = ({
  factoryMachineSerialNumberGroup,
  setMachineSerialNumberGroup,
}: {
  factoryMachineSerialNumberGroup: GenericRecord;
  setMachineSerialNumberGroup: (group: GenericRecord | null) => void;
}) => {
  const t = useTranslation();
  const dispatch = useAppDispatch();
  const [updated, setUpdated] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const [recordCurrent, setRecordCurrent] = useState<GenericRecord>({
    FactoryMachineSerialNumber: factoryMachineSerialNumberGroup.FactoryMachineSerialNumber
      ? factoryMachineSerialNumberGroup.FactoryMachineSerialNumber
      : "",
  });



  const handleSetFactoryMachineSerialNumber = async () => {
    console.log("handleSetFactoryMachineSerialNumber");

    try {
      const response = await updateFactoryMachineSerialNumber({
        ...recordCurrent,
        GroupId: factoryMachineSerialNumberGroup.GroupId,
      });

      if (response.data.success) {
        setUpdated(true);
        dispatch(setRefresh());
      } else {

        if(response.data.message === "duplicated"){
          setShowAlert(true);

        }
      }
    } catch (error) {
      dispatch(setError(t("operation_not_executed")));
    }
  };

  return (
    <>
      {factoryMachineSerialNumberGroup && (
        <ModalComponent
          title={t("set_machine_factory_serial_number")}
          closeButton={true}
          onClose={() => setMachineSerialNumberGroup(null)}
          dismissible={false}
          onActionLabel={updated ? "" : "save"}
          onAction={handleSetFactoryMachineSerialNumber}
        >
          {!updated && (
            <div className="d-flex flex-column">
              <div>
                <label>{t("serialnumber")}</label>
                <div className="form-control">{factoryMachineSerialNumberGroup.SerialNumber}</div>
              </div>
              <div className="mt-2">
                <label htmlFor="FactoryMachineSerialNumber">
                  {t("FactoryMachineSerialNumber")}
                </label>
                <input
                  required
                  type="text"
                  className="form-control"
                  id="FactoryMachineSerialNumber"
                  value={recordCurrent.FactoryMachineSerialNumber}
                  onChange={(e) =>
                    setRecordCurrent({
                      ...recordCurrent,
                      FactoryMachineSerialNumber: e.target.value,
                    })
                  }
                />
                {showAlert && (
                  <Alert
                    className="mt-2"
                    variant="danger"
                    onClose={() => setShowAlert(false)}
                    dismissible
                  >
                    {t("serial_number_already_in_use")}
                  </Alert>
                )}
              </div>
            </div>
          )}
          {updated && (
            <div className="d-flex flex-column text-success">
              {t("operation_executed_successfully")}
            </div>
          )}
        </ModalComponent>
      )}
    </>
  );
};
export default memo(FactoryMachineSerialNumberModal);
