
import { GenericRecord, GenericRecordValueType } from "@/types";

export const storeTableConfig = (token: string, reduxTableConfig: GenericRecord): void => {

  const tableColumns = reduxTableConfig.columns.map((column: GenericRecord) => {
    return {
      key: column.key,
      omit: column.omit,
    };
  });

  const data = {
    paginationRowsPerPage: reduxTableConfig.paginationRowsPerPage,
    page: reduxTableConfig.page,
    columns: tableColumns,
    sort: reduxTableConfig.sort,
    filters: [],
  };

  localStorage.setItem(token, JSON.stringify(data));
};



export const getStoredJson = (token: string): GenericRecord | null => {

  const table = localStorage.getItem(token);

  try {
    if (table) {
      return JSON.parse(table);
    }
  } catch (error) {
    localStorage.removeItem(token);
  }
  return null;
};

export const hasStoredTableConfig = (token: string, tableConfig: GenericRecord): boolean => {

  const data = localStorage.getItem(token);
  let storedTableConfig = null;
  if (!data) {
    return false;
  }
  try {
    storedTableConfig = JSON.parse(data);
  } catch (error) {
    return false;
  }


  if (typeof storedTableConfig.paginationRowsPerPage !== "number") {
    return false;
  }

  if (typeof storedTableConfig.page !== "number" || storedTableConfig.page < 1) {
    return false;
  }

  if (!storedTableConfig.columns || storedTableConfig.columns.length === 0) {
    return false;
  }


  const storedColumns = storedTableConfig.columns;
  const storedColumnsKeys = storedColumns.map((obj: GenericRecord) => obj.key).sort();

  const currentColumnsKeys = tableConfig.columns.map((obj: GenericRecord) => obj.key).sort();

  if (storedColumnsKeys.length !== currentColumnsKeys.length) {
    return false;
  }

  for (let i = 0; i < storedColumnsKeys.length; i++) {
    if (storedColumnsKeys[i] !== currentColumnsKeys[i]) {
      return false;
    }
  }
  return true;
};


export const areEqualArrays = (arr1: GenericRecord[], arr2: GenericRecord[]): boolean => {
  if (JSON.stringify(arr1) !== JSON.stringify(arr2)) {
    return false;
  }

  return true;
};


export const storeColumns = (token: string, columns: GenericRecord[]): void => {

  const tableColumns = columns.map((column) => {
    return {
      key: column.key,
      omit: column.omit,
    };
  });

  storeTableConfigProperty(token, "columns", tableColumns);
};

export const storeTableConfigProperty = (
  token: string,
  property: string,
  value: GenericRecordValueType,
): void => {

  const table = getStoredJson(token);

  if (table) {
    table[property] = value;
    localStorage.setItem(token, JSON.stringify(table));
  }
};

export const storeFilters = (
  token: string,
  filters: GenericRecord[]
): void => {
  const applied_filters = filters
    .filter((filter) => filter.applied)
    .map((filter) => ({
      id: filter.id,
      value: filter.value,
      value_label: filter.value_label,
    }));

  storeTableConfigProperty(token, "filters", applied_filters);
};
