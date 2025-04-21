import API from "@/api/api";
import { GenericRecord } from "@/types";



export const getPaginatedPrintings = (params: GenericRecord) => API.get("/api/settings/printings", { params });
export const getPrintings = () => API.get("/api/settings/printings/all");
export const getPrinting = (params: GenericRecord) => API.get("/api/settings/printings/get", { params });
export const updatePrinting = (params: GenericRecord) => API.post("/api/settings/printings/update", { params });
export const createPrinting = (params: GenericRecord) => API.post("/api/settings/printings/create", { params });
export const deletePrinting = (params: GenericRecord) => API.post("/api/settings/printings/delete", { params });
export const getPrinters = (params: GenericRecord) => API.get("/api/settings/printings/printers", { params });


export const getPaginatedFactoryTypes = (params: GenericRecord) => API.get("/api/settings/types", { params });
export const getFactoryTypes = () => API.get("/api/settings/types/all");
export const getFactoryType = (params: GenericRecord) => API.get("/api/settings/types/get", { params });
export const updateFactoryType = (params: GenericRecord) => API.post("/api/settings/types/update", { params });
export const createFactoryType = (params: GenericRecord) => API.post("/api/settings/types/create", { params });
export const deleteFactoryType = (params: GenericRecord) => API.post("/api/settings/types/delete", { params });


export const getPaginatedIps = (params: GenericRecord) => API.get("/api/settings/ips", { params });
export const createIp = (params: GenericRecord) => API.post("/api/settings/ips/create", { params });
export const deleteIp = (params: GenericRecord) => API.post("/api/settings/ips/delete", { params });
