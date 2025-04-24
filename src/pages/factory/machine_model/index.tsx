import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError, setPage } from "@/slices/pageSlice";

import page from "@/config/pages/factory/machine_model/index";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import { GenericRecord } from "@/types";
import FormHeader from "@/components/form/FormHeader";
import FormWrapper from "@/components/form/FormWrapper";
import { useTranslation } from "@/context/contextUtils";
import {
  createFactoryDevice,
  deleteFactoryDevice,
  getFactoryMachinesModels,
  getFactoryModels,
  updateFactoryDevice,
  updateFactoryMachineModel,
  updateFactoryMachinesModels,
} from "@/api/factory";
import MachineModelType from "@/components/factory/machines_models/MachineModelType";
import { FaCheckCircle } from "react-icons/fa";
import { FaTimesCircle } from "react-icons/fa";
import { setFlashMessage } from "@/slices/appSlice";
import FactoryCreateDeviceModal from "@/components/factory/machines_models/FactoryCreateDeviceModal";
import { FaPlus } from "react-icons/fa";
import useResponsive from "@/hooks/useResponsive";
import { MdEditSquare } from "react-icons/md";
import ModalComponent from "@/components/modal/ModalComponent";
import AsyncSelect from "react-select/async";
import { SingleValue } from "react-select";

const MachineModel = () => {
  const t = useTranslation();

  // redux
  const userDataData = useAppSelector((state) => state.userData.data);
  const dispatch = useAppDispatch();

  const machineRefs = useRef<(HTMLDivElement | null)[]>([]);
  // states

  const [title, setTitle] = useState<string>("");
  const [record, setRecord] = useState<GenericRecord[]>([]);
  const [recordCurrent, setRecordCurrent] = useState<GenericRecord[]>([]);
  const [status, setStatus] = useState<string>("pending");
  const [machine, setMachine] = useState<GenericRecord | null>(null);
  const [refresh, setRefresh] = useState<boolean>(true);

  const [newDeviceModal, setNewDeviceModal] = useState<GenericRecord | null>(null);

  const [activeMachine, setActiveMachine] = useState<number>(0);

  const size = useResponsive();
  // Prepare page data

  useEffect(() => {
    console.log("useEffect status", status, userDataData);
    if (userDataData == null || status != "pending") return;

    const preparePage = async () => {
      console.log("preparePage");
      const searchParams = new URLSearchParams(window.location.search);
      const gid = searchParams.get("gid");
      const sn = searchParams.get("sn");
      if (!sn) return;

      setTitle(sn);

      try {
        const response = await getFactoryMachinesModels({ GroupId: gid });

        const data = response.data.result.map((rec: GenericRecord) => {
          const machine: GenericRecord = {
            MachineId: rec.MachineId,
            Position: rec.Position,
            GroupId: gid,
            SerialNumber: sn,
            ModelName: rec.model?.ModelName,
            ModelId: rec.model?.ModelId,
            remove: [],
            types: [],
            error: false,
          };

          const notInModelDevices = rec.devices
            ? rec.devices.filter((device: GenericRecord) => {
                return !rec.model_devices.some(
                  (model: GenericRecord) => model.DeviceTypeId === device.Type,
                );
              })
            : [];

          if (notInModelDevices.length > 0) {
            machine.types.push({
              Type: notInModelDevices[0].Type,
              quantity: 0,
              devices: notInModelDevices,
            });
            machine.error = true;
          }

          let type = "";
          if (rec.model_devices) {
            rec.model_devices.forEach((modelType: GenericRecord) => {
              const filteredDevices = rec.devices.filter((device: GenericRecord) => {
                return device.Type === modelType.DeviceTypeId;
              });

              if (type != modelType.DeviceTypeId) {
                machine.types.push({
                  Type: modelType.DeviceTypeId,
                  quantity: modelType.quantity,
                  devices: filteredDevices,
                });
                if (modelType.quantity != filteredDevices.length) {
                  machine.error = true;
                }
              }

              type = modelType.DeviceTypeId;
            });
          }
          return machine;
        });
        console.log("data", data);

        setRecord(data);
        setRecordCurrent(JSON.parse(JSON.stringify(data)));
      } catch (error) {
        console.log("error", error);
        dispatch(setError(t("undefined_error")));
      }
      setStatus("prepared");
    };
    preparePage();
  }, [userDataData, dispatch, refresh]); // eslint-disable-line
  useEffect(() => {
    if (activeMachine >= 0 && machineRefs.current[activeMachine]) {
      machineRefs.current[activeMachine]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeMachine]);
  // Store page data
  useEffect(() => {
    if (status != "prepared") return;

    setStatus("ready");

    dispatch(
      setPage({
        title: page.title,
        breadcrumb: page.breadcrumb,
      }),
    );
  }, [dispatch, status]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setStatus("pending");

    try {
      const response = await updateFactoryMachinesModels({ machines: recordCurrent });

      if (response.data.success) {
        dispatch(setFlashMessage({ message: t("updated_successfully"), type: "success" }));
        setMachine(null);
        setRefresh(!refresh);
      } else {
        dispatch(setError(t("operation_not_executed")));
      }
    } catch (error) {
      dispatch(setError(t("operation_not_executed")));
    }
  };

  const reload = () => {
    setStatus("pending");
    setMachine(null);
    setRefresh(!refresh);
  };

  const renderDevices = (devices: GenericRecord[]) => {
    return devices.map((device: GenericRecord, index: number) => {
      return (
        <MachineModelType
          key={index}
          device={device}
          index={index}
          update={updateRecord}
          remove={removeRecord}
        />
      );
    });
  };
  const renderMachineTypes = (machine: GenericRecord) => {
    return machine.types.map((element: GenericRecord, index: number) => {
      return (
        <div key={index} style={{ minWidth: size == "small" ? "none" : "600px" }}>
          <div className={`mt-2 d-flex justify-content-between align-items-center`}>
            <strong>{element.Type}</strong>{" "}
            {element.quantity !== element.devices.length && (
              <span className="ms-2 text-danger flex-grow-1">
                {t("required")} {element.quantity}, {t("found")} {element.devices.length}
              </span>
            )}
            {element.quantity === element.devices.length && (
              <span className="ms-2 text-success flex-grow-1">
                {t("required")} {element.quantity}, {t("found")} {element.devices.length}
              </span>
            )}
            <a
              className={`btn btn-sm btn-primary`}
              onClick={() =>
                setNewDeviceModal({
                  GroupId: machine.GroupId,
                  SerialNumber: machine.SerialNumber,
                  MachineId: machine.MachineId,
                  ModelName: machine.ModelName,
                  Type: element.Type,
                })
              }
            >
              <FaPlus />
            </a>
          </div>

          <div>{renderDevices(element.devices)}</div>
        </div>
      );
    });
  };

  const machineHasError = (index: number) => {
    for (const type of recordCurrent[index].types) {
      if (type.quantity !== type.devices.length) {
        return true;
      }
    }
    return false;
  };
  const renderMachines = () => {
    if (!recordCurrent) return null;

    return recordCurrent.map((machine: GenericRecord, index: number) => {
      return (
        <div
          key={machine.MachineId}
          className=""
          ref={(el) => {
            machineRefs.current[index] = el;
          }}
        >
          <div
            className={`${machineHasError(index) ? "bg-danger bg-gradient" : index == activeMachine ? "bg-success bg-gradient" : "bg-secondary bg-gradient"} px-2 py-1 text-white`}
            onClick={() => setActiveMachine(index == activeMachine ? -1 : index)}
          >
            <strong className="me-2">
              {machineHasError(index) ? <FaTimesCircle /> : <FaCheckCircle />}
            </strong>

            <strong className="text-uppercase">
              {t("machine")} {machine.MachineId} | {t("model")} {machine.ModelName}
            </strong>

            <span
              className="btn btn-sm btn-outline-light ms-2"
              onClick={(e) => {
                e.stopPropagation();
                console.log("onClick", machine);
                setMachine(machine);
              }}
            >
              <MdEditSquare />
            </span>
          </div>
          <div
            className={`accordion-collapse collapse p-3 pb-5 ${index === activeMachine ? "show" : ""}`}
          >
            {renderMachineTypes(machine)}
          </div>
        </div>
      );
    });
  };

  const updateRecord = async (row: GenericRecord) => {
    console.log("updateRecord", row);


    const response = await updateFactoryDevice(row);


    const machineIndex = recordCurrent.findIndex((machine) => machine.MachineId === row.MachineId);

    if (machineIndex < 0) return;

    const typeIndex = recordCurrent[machineIndex].types.findIndex(
      (type: GenericRecord) => type.Type === row.Type,
    );

    if (typeIndex < 0) return;

    console.log("deviceIndex", row.index);

    recordCurrent[machineIndex].types[typeIndex].devices[row.index] = row;
    console.log("recordCurrent", recordCurrent);
    console.log("record", record);

    setRecordCurrent([...recordCurrent]);
  };

  const removeRecord = async (row: GenericRecord) => {

    console.log("removeRecord", row);

   /*  try {
      const response = await deleteFactoryDevice(row);
      console.log("response", response.data);
      if (response.data.success) {
        dispatch(setFlashMessage({ message: t("delete_executed_successfully"), type: "success" }));
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      dispatch(setError(t("undefined_error")));
    }
 */
    const machineIndex = recordCurrent.findIndex((machine) => machine.MachineId === row.MachineId);

    if (machineIndex < 0) return;

    const typeIndex = recordCurrent[machineIndex].types.findIndex(
      (type: GenericRecord) => type.Type === row.Type,
    );

    if (typeIndex < 0) return;

    const deviceIndex = recordCurrent[machineIndex].types[typeIndex].devices.findIndex(
      (device: GenericRecord) => device.Id === row.Id,
    );

    if (deviceIndex < 0) return;

    recordCurrent[machineIndex].types[typeIndex].devices.splice(deviceIndex, 1);

    recordCurrent[machineIndex].remove.push(row);

    if (
      recordCurrent[machineIndex].types[typeIndex].devices.length === 0 &&
      recordCurrent[machineIndex].types[typeIndex].quantity == 0
    ) {
      recordCurrent[machineIndex].types.splice(typeIndex, 1);
    }

    setRecordCurrent([...recordCurrent]);
  };

  const createRecord = async (device: GenericRecord) => {
    console.log("device", device);

    try {
      const response = await createFactoryDevice(device);
      console.log("response", response.data);
      if (response.data.success) {
        dispatch(setFlashMessage({ message: t("created_successfully"), type: "success" }));
        device=response.data.result;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      dispatch(setError(t("undefined_error")));
    }

    const machineIndex = recordCurrent.findIndex(
      (machine) => machine.MachineId === device.MachineId,
    );

    if (machineIndex < 0) return;

    const typeIndex = recordCurrent[machineIndex].types.findIndex(
      (type: GenericRecord) => type.Type === device.Type,
    );

    if (typeIndex < 0) return;

    recordCurrent[machineIndex].types[typeIndex].devices.push(device);
    console.log("recordCurrent", recordCurrent);

    setRecordCurrent(JSON.parse(JSON.stringify(recordCurrent)));

    setNewDeviceModal(null);
  };

  const changeModel = async () => {
    console.log("changeModel", machine);

    if (!machine) return;
    console.log("machine", machine);
    try {
      const result = await updateFactoryMachineModel(machine);
      console.log("result", result.data);
      if (result.data.success) {
        reload();
      } else {
        throw new Error(result.data.message);
      }
    } catch (e) {
      console.log("error", e);
      dispatch(setError(t("operation_not_executed")));
    }
  };

  const loadOptions = async (inputValue: string) => {
    if (inputValue.length < 3) return [];
    try {
      const response = await getFactoryModels({ search: inputValue });

      if (!response.data.success) {
        console.log("error", response.data.message);
        return [];
      }

      return response.data.result.map((item: GenericRecord) => ({
        label: item["name"],
        value: item["id"],
      }));
    } catch (error) {
      console.log("error", error);
      return [];
    }
  };
  const handleSelection = (newValue: SingleValue<GenericRecord>) => {
    if (newValue) {
      setMachine({
        ...machine,
        ModelId: newValue.value,
        ModelName: newValue.label,
      });
    } else {
      setMachine({
        ...machine,
        ModelId: null,
        ModelName: "",
      });
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <BackofficeMainTemplate status={status}>
      <form
        onKeyDown={handleKeyDown}
        autoComplete="off"
        className="flex-grow-1 overflow-hidden d-flex flex-column"
        onSubmit={handleSubmit}
      >
        {title && recordCurrent.length > 0 && (
          <FormHeader
            title={`${t("group")} ${title}`}
            handleReset={() => setRecordCurrent(JSON.parse(JSON.stringify(record)))}
          />
        )}

        <FormWrapper>
          <div className="">{renderMachines()}</div>
        </FormWrapper>
      </form>
      {newDeviceModal && (
        <FactoryCreateDeviceModal
          create={createRecord}
          close={() => setNewDeviceModal(null)}
          newDeviceModal={newDeviceModal}
        />
      )}
      {machine && (
        <ModalComponent
          title={t("model")}
          onAction={changeModel}
          onActionLabel={t("change_model")}
          onClose={() => {
            setMachine(null);
          }}
          closeButton={true}
          overflowHidden={false}
        >
          <AsyncSelect
            cacheOptions
            loadOptions={loadOptions}
            placeholder={t("select")}
            isClearable
            onChange={handleSelection}
            className=" flex-grow-1"
            value={{ label: machine.ModelName, value: machine.ModelId }}
          />
        </ModalComponent>
      )}



    </BackofficeMainTemplate>
  );
};
export default MachineModel;
