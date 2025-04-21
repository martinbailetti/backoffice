import API from "@/api/api";
import { GenericRecord } from "@/types";



export const getFactoryFilterTypes = (params: GenericRecord) => API.get("/api/factory/filters/get/Type", { params });
export const getFactoryFilterTypeInfos = (params: GenericRecord) => API.get("/api/factory/filters/get/TypeInfo", { params });
export const getFactoryFilterProductDefinitions = (params: GenericRecord) => API.get("/api/factory/filters/get/ProductDefinition", { params });
export const getFactoryFilterManufacturerSerialNumbers = (params: GenericRecord) => API.get("/api/factory/filters/get/ManufacturerSerialNumber", { params });
export const getFactoryFilterSpareOrders = (params: GenericRecord) => API.get("/api/factory/filters/get/SpareOrder", { params });

export const getFactoryFilterClientNumbers = (params: GenericRecord) => API.get("/api/factory/filters/get/ClientNumber", { params });
export const getFactoryFilterMachineSerialNumbers = (params: GenericRecord) => API.get("/api/factory/filters/get/MachineSerialNumber", { params });
export const getFactoryFilterRPIs = (params: GenericRecord) => API.get("/api/factory/filters/get/RPI", { params });
export const getFactoryFilterFactoryMachineSerialNumbers = (params: GenericRecord) => API.get("/api/factory/filters/get/FactoryMachineSerialNumber", { params });




export const getFactoryFilterFactoryIds = (params: GenericRecord) => API.get("/api/factory/filters/factory/ids", { params });
export const getFactoryFilterIds = (params: GenericRecord) => API.get("/api/factory/filters/ids", { params });
export const getFactoryFilterClients = (params: GenericRecord) => API.get("/api/factory/filters/clients", { params });
export const getFactoryFilterSerialNumbers = (params: GenericRecord) => API.get("/api/factory/filters/serial_numbers", { params });
export const getFactoryFilterDispatchOrders = (params: GenericRecord) => API.get("/api/factory/filters/dispatch_orders", { params });

export const getFilterTypes = (params: GenericRecord) => API.get("/api/filters/get/Type", { params });
export const getFilterTypeInfos = (params: GenericRecord) => API.get("/api/filters/get/TypeInfo", { params });
export const getFilterProductDefinitions = (params: GenericRecord) => API.get("/api/filters/get/ProductDefinition", { params });
export const getFilterManufacturerSerialNumbers = (params: GenericRecord) => API.get("/api/filters/get/ManufacturerSerialNumber", { params });
export const getFilterSpareOrders = (params: GenericRecord) => API.get("/api/filters/get/SpareOrder", { params });

export const getFilterClientNumbers = (params: GenericRecord) => API.get("/api/filters/get/ClientNumber", { params });
export const getFilterMachineSerialNumbers = (params: GenericRecord) => API.get("/api/filters/get/MachineSerialNumber", { params });
export const getFilterRPIs = (params: GenericRecord) => API.get("/api/filters/get/RPI", { params });
export const getFilterGroupIds = (params: GenericRecord) => API.get("/api/filters/get/GroupId", { params });


export const getFilterFactoryIds = (params: GenericRecord) => API.get("/api/filters/factory/ids", { params });
export const getFilterIds = (params: GenericRecord) => API.get("/api/filters/ids", { params });
export const getFilterClients = (params: GenericRecord) => API.get("/api/filters/clients", { params });
export const getFilterSerialNumbers = (params: GenericRecord) => API.get("/api/filters/serial_numbers", { params });
export const getFilterDispatchOrders = (params: GenericRecord) => API.get("/api/filters/dispatch_orders", { params });
export const getSerialNumbers = (params: GenericRecord) => API.get("/api/filters/serial_numbers", { params });
