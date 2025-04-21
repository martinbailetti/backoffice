import API from "@/api/api";
import { GenericRecord } from "@/types";



export const getSpvDispatchOrdersPaginated = (params: GenericRecord) => API.get("/api/spv/dispatch_orders", { params });
export const getSpvDispatchOrder = (params: GenericRecord) => API.get("/api/spv/dispatch_orders/get", { params });
export const updateSpvDispatchOrder = (params: GenericRecord) => API.post("/api/spv/dispatch_orders/update", { params });
export const createSpvDispatchOrder = (params: GenericRecord) => API.post("/api/spv/dispatch_orders/create", { params });
export const deleteSpvDispatchOrder = (params: GenericRecord) => API.post("/api/spv/dispatch_orders/delete", { params });


export const getSpvClients = (params: GenericRecord) => API.get("/api/spv/clients/all", { params });

export const getSpvTypes = (params: GenericRecord) => API.get("/api/spv/types", { params });
export const createSpvType = (params: GenericRecord) => API.post("/api/spv/types/create", { params });


export const getSpvDispatchOrderSearchTypes = (params: GenericRecord) => API.get("/api/spv/dispatch_orders/search/types", { params });
export const getSpvDispatchOrderSearchNumbers = (params: GenericRecord) => API.get("/api/spv/dispatch_orders/search/numbers", { params });
export const getSpvDispatchOrderSearchClients = (params: GenericRecord) => API.get("/api/spv/dispatch_orders/search/clients", { params });


export const getPaginatedSpvClients = (params: GenericRecord) => API.get("/api/spv/clients", { params });
export const deleteSpvClient = (params: GenericRecord) => API.post("/api/spv/clients/delete", { params });
export const updateSpvClient = (params: GenericRecord) => API.post("/api/spv/clients/update", { params });
export const createSpvClient = (params: GenericRecord) => API.post("/api/spv/clients/create", { params });
export const getSpvClient = (params: GenericRecord) => API.get("/api/spv/clients/get", { params });
