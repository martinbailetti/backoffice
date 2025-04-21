import API from "@/api/api";
import { GenericRecord } from "@/types";

export const getDevicesList = (params: GenericRecord) => API.get("/api/devices", { params });
export const getDevicesListTypes = (params: GenericRecord) => API.get("/api/devices/types", { params });
export const getDevicesListTypeInfos = (params: GenericRecord) => API.get("/api/devices/type_infos", { params });
