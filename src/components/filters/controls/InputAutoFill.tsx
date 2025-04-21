import React, { memo } from "react";

import { GenericRecord } from "@/types";
import AsyncSelect from "react-select/async";
import { useAppDispatch } from "@/redux/hooks";
import { applyFilter } from "@/slices/tableSlice";
import { setError } from "@/slices/pageSlice";
import { SingleValue, StylesConfig } from "react-select";
import { useTranslation } from "@/context/contextUtils";
import { getApiFunction } from "@/api/apiFunctions";
import { getNestedProperty } from "@/utils";

/**
 * Input Filter component.
 */

const InputAutoFill = ({ filter }: GenericRecord) => {
  interface Option {
    value: string;
    label: string;
  }
  const customStyles: StylesConfig<Option, false> = {
    menu: (provided) => ({
      ...provided,
      width: "auto", // Ajusta el ancho del menú al contenido
      minWidth: "100%", // Asegura que el menú sea tan ancho como el selector
      whiteSpace: "nowrap", // Evita saltos de línea
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "none", // Elimina restricciones de altura
    }),
  };

  const t = useTranslation();

  const dispatch = useAppDispatch();

  const handleSelection = (newValue: SingleValue<GenericRecord>) => {
    if (newValue) {
      dispatch(
        applyFilter({
          ...filter,
          value: newValue.value,
          value_label: newValue.label,
        }),
      );
    }
  };

  const loadOptions = async (inputValue: string) => {

    if(inputValue.length < 3) return [];
    const searchParams = new URLSearchParams(window.location.search);
    const initialParams: GenericRecord = {};
    if (filter.result.params && filter.result.params.length > 0) {
      filter.result.params.forEach((param: GenericRecord) => {
        initialParams[param.query] = searchParams.get(param.url);
      });
    }
    try {
      const f = getApiFunction(filter.result.apiFunction);

      const response = await f({
        search: inputValue,
        column: filter.result.value,
        ...initialParams,
      });
      const success = filter.result.success?getNestedProperty(response.data, filter.result.success):response.data.success;
      if (!success) {
        const message = filter.result.message?getNestedProperty(response.data, filter.result.message):response.data.message;
        dispatch(setError(t(message)));
        return [];
      }

      const result = filter.result.data?getNestedProperty(response.data, filter.result.data):response.data.result;
      return result.map((item: GenericRecord) => ({
        label: item[filter.result.label],
        value: item[filter.result.value],
      }));
    } catch (error) {
      dispatch(setError(t("undefined_error")));
      return [];
    }
  };

  return (
    <AsyncSelect
      cacheOptions
      loadOptions={loadOptions}
      placeholder={t("select")}
      isClearable
      onChange={handleSelection}
      styles={customStyles}
    />
  );
};

export default memo(InputAutoFill);
