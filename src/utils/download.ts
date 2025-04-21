import { getApiFunction } from "@/api/apiFunctions";
import { GenericRecord } from "@/types";

export const downloadExcel = async (url: string, filters: GenericRecord[], filename: string) => {
  try {
    const f = getApiFunction(url);
    const response = await f({
      filters: filters,
    });
    // Crear un enlace para descargar el archivo
    const urlObj = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlObj;
    link.setAttribute("download", filename); // Nombre del archivo descargado
    document.body.appendChild(link);
    link.click();

    // Limpieza
    document.body.removeChild(link);
    window.URL.revokeObjectURL(urlObj);
  } catch (error) {
    console.error("Error descargando el archivo:", error);
  }
};

export default downloadExcel;
