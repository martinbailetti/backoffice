import ModalComponent from "@/components/modal/ModalComponent";
import { useTranslation } from "@/context/contextUtils";
import { GenericRecord } from "@/types";
import React, { memo, useState } from "react";
import CreateDevice from "@/components/factory/devices/CreateDevice";

/**
 * Print controls component.
 */

const FactoryCreateDeviceModal = ({
  newDeviceModal,
  close,
  create,
}: {
  newDeviceModal: GenericRecord | null;
  close: () => void;
  create: (device: GenericRecord) => void;
}) => {
  const t = useTranslation();

  const [currentRecord, setCurrentRecord] = useState<GenericRecord>({
    GroupId: newDeviceModal && newDeviceModal.GroupId ? newDeviceModal.GroupId : "",
    SerialNumber: newDeviceModal && newDeviceModal.SerialNumber ? newDeviceModal.SerialNumber : "",
    MachineId: newDeviceModal && newDeviceModal.MachineId ? newDeviceModal.MachineId : "",
    Type: newDeviceModal && newDeviceModal.Type ? newDeviceModal.Type : "",
    TypeInfo: newDeviceModal && newDeviceModal.TypeInfo ? newDeviceModal.TypeInfo : "",
    Position: newDeviceModal && newDeviceModal.Position ? newDeviceModal.Position : 0,
    ManufacturerSerialNumber:
      newDeviceModal && newDeviceModal.ManufacturerSerialNumber
        ? newDeviceModal.ManufacturerSerialNumber
        : "",
    RPI: newDeviceModal && newDeviceModal.RPI ? newDeviceModal.RPI : "",
    SpareOrder: newDeviceModal && newDeviceModal.SpareOrder ? newDeviceModal.SpareOrder : "",
    ProductDefinition:
      newDeviceModal && newDeviceModal.ProductDefinition ? newDeviceModal.ProductDefinition : "",
  });
  return (
    <>
      <ModalComponent
        title={t("new")}
        onAction={() => create(currentRecord)}
        closeButton={true}
        onClose={() => close()}
        dismissible={false}
        onActionLabel={"save"}
      >
        <form autoComplete="off">
          <CreateDevice
            record={currentRecord}
            setRecord={setCurrentRecord}
            groupSelector="SerialNumber"
            fixedGroupIdMachineId={newDeviceModal?.GroupId && newDeviceModal?.MachineId}
            fixedType={newDeviceModal?.Type}
          />
        </form>
      </ModalComponent>
    </>
  );
};
export default memo(FactoryCreateDeviceModal);
