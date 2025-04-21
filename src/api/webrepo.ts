import API from "@/api/api";
import { GenericRecord } from "@/types";



export const getWebRepoGroup = (params: GenericRecord) => API.get("/api/webrepo/get", { params });
