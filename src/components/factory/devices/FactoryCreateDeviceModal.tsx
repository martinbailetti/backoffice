import ModalComponent from "@/components/modal/ModalComponent";
import { useTranslation } from "@/context/contextUtils";
import { GenericRecord } from "@/types";
import React, { memo, useState } from "react";
import CreateDevice from "@/components/factory/devices/CreateDevice";

import { useRouter } from "next/router";

/**
 * Print controls component.
 */

const FactoryCreateDeviceModal = ({
  newDeviceModal,
  close,
  create,
  created,
}: {
  newDeviceModal: GenericRecord | null;
  close: () => void;
  create: (device: GenericRecord) => void;
  created: GenericRecord | null;
}) => {
  const t = useTranslation();

  const router = useRouter();

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

  const goToTable = () => {
    if (!created) return;
    close();
    router.push(`/factory/devices?gid=${created.GroupId}&mid=${created.MachineId}`);
  };
  const goToDetail = () => {
    if (!created) return;
    close();
    router.push(
      `/factory/devices/device?gid=${created.GroupId}&mid=${created.MachineId}&id=${created.Id}`,
    );
  };

  return (
    <>
      <ModalComponent
        title={t("new")}
        onAction={() => { console.log("create", currentRecord); create(currentRecord) }}
        closeButton={true}
        onClose={() => close()}
        dismissible={false}
        onActionLabel={created == null ? "save" : ""}
      >
        {created == null && (
          <form autoComplete="off">
            <CreateDevice
              record={currentRecord}
              setRecord={setCurrentRecord}
              groupSelector="SerialNumber"
              fixedGroupIdMachineId={newDeviceModal?.GroupId && newDeviceModal?.MachineId}
              fixedType={newDeviceModal?.Type}
              multiple={true}
            />
          </form>
        )}
        {created && (
          <div>
            <div className="text-center text-success fw-bold fs-4">{t("created_successfully")}</div>
            <div className="text-center">
              <a onClick={goToDetail}>{t("go_to_device_detail")}</a>
            </div>
            <div className="text-center">
              <a onClick={goToTable}>{t("go_to_devices_table")}</a>
            </div>
          </div>
        )}
      </ModalComponent>
    </>
  );
};
export default memo(FactoryCreateDeviceModal);
