import { deleteFactoryDevice } from "@/api/factory";
import ModalComponent from "@/components/modal/ModalComponent";
import { useTranslation } from "@/context/contextUtils";
import { useAppDispatch } from "@/redux/hooks";
import { setError } from "@/slices/pageSlice";
import { GenericRecord } from "@/types";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";

const MachineModelType = ({
  index,
  device,
  update,
  remove,
}: {
  index: number;
  device: GenericRecord;
  update: (record: GenericRecord) => void;
  remove: (record: GenericRecord) => void;
}) => {
  const t = useTranslation();

  const [deleteDevice, setDeleteDevice] = useState<string>("idle");


  const dispatch = useAppDispatch();

  const removeRecord = async () => {

    console.log("removeRecord", device);

    try {
      const response = await deleteFactoryDevice(device);
      console.log("response", response.data);
      if (response.data.success) {
        setDeleteDevice("ended");
        remove(device);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      dispatch(setError(t("undefined_error")));
    }

  };


  return (
    <div className="d-flex align-items-center justify-content-between py-1 border-bottom  w-100">
      <div className="w-50">{device.Id}</div>
      <div className="d-flex align-items-center ">
        <input
          type="text"
          defaultValue={device.ManufacturerSerialNumber ? device.ManufacturerSerialNumber : ""}
          placeholder="ManufacturerSerialNumber"
          className="form-control"
          onBlur={(e) =>
            update({ ...device, ManufacturerSerialNumber: e.target.value, index: index })
          }
        />
        <input
          type="text"
          defaultValue={device.RPI ? device.RPI : ""}
          placeholder="RPI"
          className="form-control ms-1"
          onBlur={(e) => {
            update({ ...device, RPI: e.target.value, index: index });
          }}
        />
      </div>
      <div className="flex-grow-1 text-end">
        {device.FactoryDevice == 1 && (
          <a className="btn btn-danger btn-sm ms-3" onClick={() => setDeleteDevice("started")}>
            <FaTrash />
          </a>
        )}
      </div>

      {deleteDevice !== "idle" && (
        <ModalComponent
          title={t("delete")}
          onAction={()=>removeRecord()}
          onActionLabel={deleteDevice !== "ended" ? "delete" : ""}
          onClose={() => {
            setDeleteDevice("idle");
          }}
          closeButton={true}
        >
          {deleteDevice !== "ended" && (
            <>
              <div>{t("confirm_device_delete")}</div>
              <div>{device.Id}</div>
            </>
          )}
          {deleteDevice == "ended" && (
            <>
              <div>{t("delete_executed_successfully")}</div>
            </>
          )}
        </ModalComponent>
      )}
    </div>
  );
};
export default MachineModelType;
