import API from "@/api/api";

export const getGroupPrintPdf = (gid: string) =>
  API.get(`/api/print/${gid}`);

export const getMachinePrintPdf = (gid: string, mid: string) =>
  API.get(`/api/print/${gid}/${mid}`);

export const getDevicePrintPdf = (gid: string, mid: string, id: string) =>
  API.get(`/api/print/${gid}/${mid}/${id}`);

export const getPdf = (filename: string) =>
  API.get(`/api/print/pdf/${filename}`, { responseType: "blob" });
