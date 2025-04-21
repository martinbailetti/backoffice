import API from "@/api/api";
import { GenericRecord } from "@/types";


// Users

export const getUsers = (params: GenericRecord) => API.get("/api/security/users", { params });
export const getUser = (params: GenericRecord) => API.get("/api/security/users/get", { params });

export const createUser = (params: GenericRecord) => API.post("/api/security/users/create", { params });
export const updateUser = (params: GenericRecord) => API.post("/api/security/users/update", { params });
export const deleteUser = (params: GenericRecord) => API.post("/api/security/users/delete", { params });

// Roles

export const getRoles = (params: GenericRecord) => API.get("/api/security/roles", { params });
export const getAllRoles = () => API.get("/api/security/roles/all");
export const getRole = (params: GenericRecord) => API.get("/api/security/roles/get", { params });

export const createRole = (params: GenericRecord) => API.post("/api/security/roles/create", { params });
export const updateRole = (params: GenericRecord) => API.post("/api/security/roles/update", { params });
export const deleteRole = (params: GenericRecord) => API.post("/api/security/roles/delete", { params });


// Permissions
export const getPermissions = (params: GenericRecord) => API.get("/api/security/permissions", { params });
export const getAllPermissions = () => API.get("/api/security/permissions/all");
export const getPermission = (params: GenericRecord) =>
  API.get("/api/security/permissions/get", { params });

export const createPermission = (params: GenericRecord) =>
  API.post("/api/security/permissions/create", { params });
export const updatePermission = (params: GenericRecord) =>
  API.post("/api/security/permissions/update", { params });
export const deletePermission = (params: GenericRecord) =>
  API.post("/api/security/permissions/delete", { params });

