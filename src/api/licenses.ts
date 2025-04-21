import API from "@/api/api";
import { GenericRecord } from "@/types";



export const getGroups = (params: GenericRecord) => API.get("/api/licenses/groups", { params });
export const getGroupsAll = (params: GenericRecord) => API.get("/api/licenses/groups/all", { params });
export const exportGroups = (params: GenericRecord) => API.get("/api/licenses/groups/export", { params, responseType: "blob" });
export const getGroup = (params: GenericRecord) => API.get("/api/licenses/groups/get", { params });
export const getGroupActivityLogs = (params: GenericRecord) => API.get("/api/licenses/groups/get/activity_logs", { params });

export const validateGroup = (params: GenericRecord) => API.post("/api/licenses/groups/validate", { params });
export const invalidateGroup = (params: GenericRecord) => API.post("/api/licenses/groups/invalidate", { params });
export const requestDeleteGroup = (params: GenericRecord) => API.post("/api/licenses/groups/request_delete", { params });
export const deleteGroup = (params: GenericRecord) => API.post("/api/licenses/groups/delete", { params });

export const getWebRepo = (params: GenericRecord) => API.get("/api/webrepo/get", { params });

export const getMachine = (params: GenericRecord) => API.get("/api/licenses/machines/get", { params });
export const getMachineActivityLogs = (params: GenericRecord) => API.get("/api/licenses/machines/get/activity_logs", { params });
export const getMachines = (params: GenericRecord) => API.get("/api/licenses/machines", { params });
export const exportMachines = (params: GenericRecord) => API.get("/api/licenses/machines/export", { params, responseType: "blob" });
export const validateMachine = (params: GenericRecord) => API.post("/api/licenses/machines/validate", { params });
export const invalidateMachine = (params: GenericRecord) => API.post("/api/licenses/machines/invalidate", { params });
export const requestDeleteMachine = (params: GenericRecord) => API.post("/api/licenses/machines/request_delete", { params });
export const deleteMachine = (params: GenericRecord) => API.post("/api/licenses/machines/delete", { params });
export const quarantineMachine = (params: GenericRecord) => API.post("/api/licenses/machines/quarantine", { params });
export const unquarantineMachine = (params: GenericRecord) => API.post("/api/licenses/machines/unquarantine", { params });


export const updateDevice = (params: GenericRecord) => API.post("/api/licenses/devices/update", { params });
export const invalidateDevice = (params: GenericRecord) => API.post("/api/licenses/devices/invalidate", { params });
export const validateDevice = (params: GenericRecord) => API.post("/api/licenses/devices/validate", { params });
export const invalidateDevices = (params: GenericRecord) => API.post("/api/licenses/devices/invalidate/multi", { params });
export const validateDevices = (params: GenericRecord) => API.post("/api/licenses/devices/validate/multi", { params });
export const getDevice = (params: GenericRecord) => API.get("/api/licenses/devices/get", { params });
export const deleteDevice = (params: GenericRecord) => API.post("/api/licenses/devices/delete", { params });
export const requestDeleteDevice = (params: GenericRecord) => API.post("/api/licenses/devices/request_delete", { params });
export const deleteDevices = (params: GenericRecord) => API.post("/api/licenses/devices/delete/multi", { params });
export const requestDeleteDevices = (params: GenericRecord) => API.post("/api/licenses/devices/request_delete/multi", { params });
export const cancelSyncActionRequestDevice = (params: GenericRecord) => API.post("/api/licenses/devices/cancel_sync_action_request", { params });
export const cancelActionRequestDevice = (params: GenericRecord) => API.post("/api/licenses/devices/cancel_action_request", { params });
export const setQuarantineDevice = (params: GenericRecord) => API.post("/api/licenses/devices/set_quarantine", { params });
export const unsetQuarantineDevice = (params: GenericRecord) => API.post("/api/licenses/devices/unset_quarantine", { params });


export const getDeviceHistory = (params: GenericRecord) => API.get("/api/licenses/devices/get/history", { params });
export const getActivityLogs = (params: GenericRecord) => API.get("/api/licenses/devices/get/activity_logs", { params });

export const getDevices = (params: GenericRecord) => API.get("/api/licenses/devices", { params });
export const exportDevices = (params: GenericRecord) => API.get("/api/licenses/devices/export", { params, responseType: "blob" });
export const getDevicesAll = (params: GenericRecord) => API.get("/api/licenses/devices/all", { params });

export const getDevicesTypes = (params: GenericRecord) => API.get("/api/licenses/devices/types", { params });
export const getDevicesTypeInfos = (params: GenericRecord) => API.get("/api/licenses/devices/type_infos", { params });


export const getActivatingDevices = () => API.get("/api/licenses/devices/activating_devices");
export const getExpirationNoDate = () => API.get("/api/licenses/devices/expiration_no_date");
export const getExpiration = () => API.get("/api/licenses/devices/expiration");
export const getQuarantine = () => API.get("/api/licenses/devices/quarantine");
export const getQuarantineMachines = () => API.get("/api/licenses/machines/quarantine");
export const getPendingExpiration = (params: GenericRecord) => API.get("/api/licenses/devices/pending_expiration", { params });

export const getGroupsCount = () => API.get("/api/licenses/groups/count");
export const getMachinesCount = () => API.get("/api/licenses/machines/count");
export const getDevicesCount = () => API.get("/api/licenses/devices/count");

export const getNewGroups = () => API.get("/api/licenses/groups/new");
export const getNewMachines = () => API.get("/api/licenses/machines/new");
export const getNewDevices = () => API.get("/api/licenses/devices/new");
export const getNewExpirationDevices = () => API.get("/api/licenses/devices/expiration_new");


