import API from "@/api/api";
import { GenericRecord } from "@/types";



export const searchDevices = (params: GenericRecord) => API.get("/api/search", { params });
export const searchFactoryDevices = (params: GenericRecord) => API.get("/api/factory/search", { params });
export const getDeviceTypes = (params: GenericRecord) => API.get("/api/search/types", { params });
export const getDeviceTypeInfos = (params: GenericRecord) => API.get("/api/search/type_infos", { params });
export const exportSearch = (params: GenericRecord) => API.get("/api/search/export", { params, responseType: "blob" });

export const getFactoryDeviceTypes = (params: GenericRecord) => API.get("/api/factory/search/types", { params });
export const getFactoryDeviceTypeInfos = (params: GenericRecord) => API.get("/api/factory/search/type_infos", { params });