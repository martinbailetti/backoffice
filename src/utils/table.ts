import { GenericRecord } from "@/types";

export const getSerializedColumns = (columns: GenericRecord[]): GenericRecord[] => {
  return columns.map((column) => {
    const serializableColumn: GenericRecord = {};
    for (const key in column) {
      if (Object.prototype.hasOwnProperty.call(column, key)) {
        const value = column[key];

        if(key=="selector"){
          serializableColumn[key] = true;
        }else if (typeof value !== "function" && typeof value !== "symbol") {
          serializableColumn[key] = value;
        }
      }
    }
    return serializableColumn;
  });
};

export const getColumns = (
  columns: GenericRecord[],
  serializedColumns: GenericRecord[],
  t: (key: string) => string = (key) => key,
): GenericRecord[] => {
  const serializedColumnKeys = serializedColumns.map((col) => col.key);
  return columns
    .map((column) => {
      const serializedColumn = serializedColumns.find((col) => col.key === column.key);
      if (serializedColumn) {
        return {
          ...column,
          omit: serializedColumn.omit || false,
          name: t(column.name),
        };
      }
      return column;
    })
    .sort((a, b) => serializedColumnKeys.indexOf(a.key) - serializedColumnKeys.indexOf(b.key));
};

export const getColumnsWithMeta = (
  columns: GenericRecord[],
  metaColumns: GenericRecord[],
): GenericRecord[] => {
  return columns.map((baseColumn) => {
    const metaColumn = metaColumns.find((meta) => meta.key === baseColumn.key);
    return metaColumn ? { ...baseColumn, ...metaColumn } : baseColumn;
  });
};

export const getFormattedDateTime = (dateTime: string): string => {
  if(!dateTime) return "";
  return dateTime.replace("T", " ").substring(0, 19);
};

export const getColumnIndexByKey = (columns: GenericRecord[], key: string): number => {
  return columns.findIndex((col) => col.key === key);
}
