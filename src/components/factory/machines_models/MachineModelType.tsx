import { GenericRecord } from "@/types";
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
  return (
    <div className="d-flex align-items-center justify-content-between py-1 border-bottom  w-100">
      <div className="w-50">
        {device.Id}
      </div>
      <div className="d-flex align-items-center ">
        <input
          type="text"
          value={device.ManufacturerSerialNumber ? device.ManufacturerSerialNumber : ""}
          placeholder="ManufacturerSerialNumber"
          className="form-control"
          onChange={(e) =>
            update({ ...device, ManufacturerSerialNumber: e.target.value, index: index })
          }
        />
        <input
          type="text"
          value={device.RPI ? device.RPI : ""}
          placeholder="RPI"
          className="form-control ms-1"
          onChange={(e) => update({ ...device, RPI: e.target.value, index: index })}
        />
      </div>
      <div className="flex-grow-1 text-end">
        <a className="btn btn-danger btn-sm ms-3" onClick={() => remove(device)}>
          <FaTrash />
        </a>
      </div>
    </div>
  );
};
export default MachineModelType;
