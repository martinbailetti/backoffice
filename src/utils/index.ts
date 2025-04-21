import { settings } from "@/config";
import { GenericRecord } from "@/types";

export const getLocaleDate = (date_str: string) => {
  const dateObj = new Date(date_str);
  if (dateObj) {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return dateObj.toLocaleString(undefined, options);
  } else {
    return "";
  }
};
export const isImage = (path: string) => {
  if (
    path.toUpperCase().endsWith(".JPG") ||
    path.toUpperCase().endsWith(".JPEG") ||
    path.toUpperCase().endsWith(".SVG") ||
    path.toUpperCase().endsWith(".BMP") ||
    path.toUpperCase().endsWith(".GIF") ||
    path.toUpperCase().endsWith(".PNG")
  ) {
    return true;
  }
  return false;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getNestedProperty = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export const formatNumber = (
  num: number,
  locale: string = "en-US",
  options: Intl.NumberFormatOptions = {},
): string => {
  return new Intl.NumberFormat(locale, options).format(num);
};

export const getPrintStyles = (
  style: GenericRecord
): string => {
  return `

      .printable {
        min-width: ${style.pageWidth}cm;
        max-width: ${style.pageWidth}cm;
        font-size: ${style.fontSize}cm;
        line-height: ${style.lineHeight}cm;
      }
      .printable-content-row {
        width: ${style.pageWidth}cm;
        height: ${style.pageHeight}cm;
      }
      .printable-content-row .data {
        min-width: ${style.pageWidth / 2}cm;
        max-width: ${style.pageWidth / 2}cm;
        height: ${style.pageHeight / 2}cm;
      }
      .printable-content-row .data .qr{
        min-width: ${style.qrSize}cm;
        min-height: ${style.qrSize}cm;
        max-width: ${style.qrSize}cm;
        max-height: ${style.qrSize}cm;
        margin-left: ${style.qrMarginLeft}cm;
        margin-right: ${style.qrMarginRight}cm;
        margin-top: ${style.qrMarginTop}cm;
      }
      .printable-content-row .data .info{
        min-width: ${style.infoWidth}cm;
        max-width: ${style.infoWidth}cm;
        margin-top: ${style.infoMarginTop}cm;
      }

      @media print {
        @page {
          size: ${style.pageWidth}cm ${style.pageHeight}cm;
          margin: 0;
        }
      }
    `
};

export const getMachinePosition = (
  num: number,
): string => {

  const key = num.toString() as keyof typeof settings.machine_position;
  return settings.machine_position[key] ? settings.machine_position[key] : num.toString();
};

// 2022-04-28T17:46:09.000000Z
export const formatMySqlDatetime = (datetime_str: string) => {
  return datetime_str.replace("T", " ").split(".")[0];


}
