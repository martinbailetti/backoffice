import API from "@/api/api";
import { GenericRecord } from "@/types";

export const getFactoryDispatchOrdersPaginated = (params: GenericRecord) =>
  API.get("/api/factory/dispatch_orders", { params });
export const getFactoryDispatchOrder = (params: GenericRecord) =>
  API.get("/api/factory/dispatch_orders/get", { params });
export const updateFactoryDispatchOrder = (params: GenericRecord) =>
  API.post("/api/factory/dispatch_orders/update", { params });
export const createFactoryDispatchOrder = (params: GenericRecord) =>
  API.post("/api/factory/dispatch_orders/create", { params });
export const deleteFactoryDispatchOrder = (params: GenericRecord) =>
  API.post("/api/factory/dispatch_orders/delete", { params });
export const getFactoryDispatchOrderNumbers = (params: GenericRecord) =>
  API.get("/api/factory/dispatch_orders/numbers", { params });
export const getFactoryDispatchOrderTypes = (params: GenericRecord) =>
  API.get("/api/factory/dispatch_orders/types", { params });
export const getFactoryDispatchOrderClients = (params: GenericRecord) =>
  API.get("/api/factory/dispatch_orders/clients", { params });



export const getFactoryDispatchOrderManufacturerSerialNumbers = (params: GenericRecord) =>
  API.get("/api/factory/dispatch_orders/manufacturer_serial_numbers", { params });
export const getFactoryDispatchOrderDeviceIds = (params: GenericRecord) =>
  API.get("/api/factory/dispatch_orders/device_ids", { params });

export const getFactoryClients = (params?: GenericRecord) =>
  API.get("/api/factory/clients/all", { params });
export const getFactoryClientsPaginated = (params: GenericRecord) =>
  API.get("/api/factory/clients", { params });
export const getFactoryClient = (params: GenericRecord) =>
  API.get("/api/factory/clients/get", { params });
export const createFactoryClients = (params: GenericRecord) =>
  API.post("/api/factory/clients/create", { params });
export const updateFactoryClients = (params: GenericRecord) =>
  API.post("/api/factory/clients/update", { params });
export const deleteFactoryClients = (params: GenericRecord) =>
  API.post("/api/factory/clients/delete", { params });

export const getFactoryGroups = (params: GenericRecord) =>
  API.get("/api/factory/groups", { params });
export const getFactoryGroupsAll = (params: GenericRecord) =>
  API.get("/api/factory/groups/all", { params });
export const exportFactoryGroups = (params: GenericRecord) =>
  API.get("/api/factory/groups/export", { params, responseType: "blob" });
export const getFactoryGroup = (params: GenericRecord) =>
  API.get("/api/factory/groups/get", { params });
export const getFactoryGroupDevices = (params: GenericRecord) =>
  API.get("/api/factory/groups/devices", { params });

export const dispatchFactoryGroup = (params: GenericRecord) =>
  API.post("/api/factory/groups/dispatch", { params });
export const enterFactoryGroup = (params: GenericRecord) =>
  API.post("/api/factory/groups/enter", { params });

export const updateFactoryMachineSerialNumber = (params: GenericRecord) =>
  API.post("/api/factory/groups/update/factory_machine_serial_number", { params });

export const getFactoryDeviceDefinitions = (params: GenericRecord) =>
  API.get("/api/factory/device_definitions", { params });
export const createFactoryDeviceDefinition = (params: GenericRecord) =>
  API.post("/api/factory/device_definitions/create", { params });
export const getFactoryTypes = (params: GenericRecord) => API.get("/api/factory/types", { params });

export const getFactoryMachine = (params: GenericRecord) =>
  API.get("/api/factory/machines/get", { params });
export const getFactoryMachinesAll = (params: GenericRecord) =>
  API.get("/api/factory/machines/all", { params });
export const getFactoryMachines = (params: GenericRecord) =>
  API.get("/api/factory/machines", { params });
export const exportFactoryMachines = (params: GenericRecord) =>
  API.get("/api/factory/machines/export", { params, responseType: "blob" });
export const deleteFactoryMachine = (params: GenericRecord) =>
  API.post("/api/factory/machines/delete", { params });
export const getFactoryMachinepDevices = (params: GenericRecord) =>
  API.get("/api/factory/machines/devices", { params });

export const deleteFactoryDevice = (params: GenericRecord) =>
  API.post("/api/factory/devices/delete", { params });
export const updateFactoryDevice = (params: GenericRecord) =>
  API.post("/api/factory/devices/update", { params });
export const getFactoryDevice = (params: GenericRecord) =>
  API.get("/api/factory/devices/get", { params });
export const getFactoryDeviceHistory = (params: GenericRecord) =>
  API.get("/api/factory/devices/get/history", { params });
export const getFactoryDevices = (params: GenericRecord) =>
  API.get("/api/factory/devices", { params });
export const exportFactoryDevices = (params: GenericRecord) =>
  API.get("/api/factory/devices/export", { params, responseType: "blob" });
export const createFactoryDevice = (params: GenericRecord) =>
  API.post("/api/factory/devices/create", { params });

export const dispatchFactoryDevices = (params: GenericRecord) =>
  API.post("/api/factory/devices/dispatch/multi", { params });
export const dispatchFactoryDevice = (params: GenericRecord) =>
  API.post("/api/factory/devices/dispatch", { params });


export const undispatchFactoryDevices = (params: GenericRecord) =>
  API.post("/api/factory/devices/undispatch/multi", { params });
export const undispatchFactoryDevice = (params: GenericRecord) =>
  API.post("/api/factory/devices/undispatch", { params });

export const getFactoryMachinesModels = (params: GenericRecord) =>
  API.get("/api/factory/machines_models", { params });
export const updateFactoryMachinesModels = (params: GenericRecord) =>
  API.post("/api/factory/machines_models/update", { params });
export const getFactoryModels = (params: GenericRecord) =>
  API.get("/api/factory/machines_models/models", { params });
export const updateFactoryMachineModel = (params: GenericRecord) =>
  API.post("/api/factory/machines_models/update_model", { params });

export const getFactoryModelsPaginated = (params: GenericRecord) =>
  API.get("/api/factory/models", { params });
export const getFactoryModel = (params: GenericRecord) =>
  API.get("/api/factory/models/get", { params });
export const createFactoryModel = (params: GenericRecord) =>
  API.post("/api/factory/models/create", { params });
export const updateFactoryModel = (params: GenericRecord) =>
  API.post("/api/factory/models/update", { params });
export const deleteFactoryModel = (params: GenericRecord) =>
  API.post("/api/factory/models/delete", { params });
