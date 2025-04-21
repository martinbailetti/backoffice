import { GenericRecord } from "@/types";
import API from "./api";

export const updatePassword = (params: GenericRecord) =>
  API.post("/api/profile/update/password", { params });

export const updateProfile = (params: GenericRecord) => API.post("/api/profile/update", { params });
