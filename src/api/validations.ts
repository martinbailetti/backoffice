import API from "@/api/api";
import { GenericRecord } from "@/types";


// Users

export const getOwnersRules = (params: GenericRecord) => API.get("/api/validations/owners_rules", { params });
export const getOwnersRule = (params: GenericRecord) => API.get("/api/validations/owners_rules/get", { params });

export const createOwnersRule = (params: GenericRecord) => API.post("/api/validations/owners_rules/create", { params });
export const updateOwnersRule = (params: GenericRecord) => API.post("/api/validations/owners_rules/update", { params });
export const deleteOwnersRule = (params: GenericRecord) => API.post("/api/validations/owners_rules/delete", { params });

export const getValidationRules = (params: GenericRecord) => API.get("/api/validations/validation_rules", { params });
export const getValidationRule = (params: GenericRecord) => API.get("/api/validations/validation_rules/get", { params });

export const createValidationRule = (params: GenericRecord) => API.post("/api/validations/validation_rules/create", { params });
export const updateValidationRule = (params: GenericRecord) => API.post("/api/validations/validation_rules/update", { params });
export const deleteValidationRule = (params: GenericRecord) => API.post("/api/validations/validation_rules/delete", { params });

export const getValidationRulesResult = (params: GenericRecord) => API.get("/api/validations/validation_rules/result", { params });


export const getValidationSerialRepeatedRules = (params: GenericRecord) => API.get("/api/validations/validation_repeated_rules", { params });
export const getValidationSerialRepeatedRule = (params: GenericRecord) => API.get("/api/validations/validation_repeated_rules/get", { params });

export const createValidationSerialRepeatedRule = (params: GenericRecord) => API.post("/api/validations/validation_repeated_rules/create", { params });
export const updateValidationSerialRepeatedRule = (params: GenericRecord) => API.post("/api/validations/validation_repeated_rules/update", { params });
export const deleteValidationSerialRepeatedRule = (params: GenericRecord) => API.post("/api/validations/validation_repeated_rules/delete", { params });

export const getOwnersValidationsReport = (params: GenericRecord) => API.get("/api/validations/owners_validations_report", { params });
export const getOwners = (params: GenericRecord) => API.get("/api/validations/owners_validations_report/owners", { params });

export const getValidationsReport = (params: GenericRecord) => API.get("/api/validations/validations_report", { params });
