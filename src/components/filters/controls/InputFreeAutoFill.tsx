import React, { memo, useState } from "react";

import { GenericRecord } from "@/types";
import AsyncSelect from "react-select/async";
import { useAppDispatch } from "@/redux/hooks";
import { applyFilter } from "@/slices/tableSlice";
import { setError } from "@/slices/pageSlice";
import { SingleValue, StylesConfig } from "react-select";
import { useTranslation } from "@/context/contextUtils";
import { getApiFunction } from "@/api/apiFunctions";
import { getNestedProperty } from "@/utils";
import { FaSearch } from "react-icons/fa";

/**
 * Input Filter component.
 */
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
  input: (provided) => ({
    ...provided,
    width: "100%",
  }),
  container: (provided) => ({
    ...provided,
    width: "200px",
  }),
};
const InputFreeAutoFill = ({ filter }: GenericRecord) => {
  const [inputValue, setInputValue] = useState("");

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
    if (inputValue.length < 3) return [];
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
      const success = filter.result.success
        ? getNestedProperty(response.data, filter.result.success)
        : response.data.success;
      if (!success) {
        const message = filter.result.message
          ? getNestedProperty(response.data, filter.result.message)
          : response.data.message;
        dispatch(setError(t(message)));
        return [];
      }

      const result = filter.result.data
        ? getNestedProperty(response.data, filter.result.data)
        : response.data.result;
      return result.map((item: GenericRecord) => ({
        label: item[filter.result.label],
        value: item[filter.result.value],
      }));
    } catch (error) {
      dispatch(setError(t("undefined_error")));
      return [];
    }
  };
  interface KeyDownEvent extends React.KeyboardEvent<HTMLInputElement> {
    key: string;
  }
  const handleInputChange = (newValue: string) => {
    console.log("Input value changed:", newValue);
    if(newValue.length < 3) return;
    console.log("newValue:", newValue);
    setInputValue(newValue);
  };
  const handleKeyDown = (event: KeyDownEvent) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      event.preventDefault();
      console.log("Enter pressed with input:", inputValue);
      search();
    }
  };
  const search = () => {
    console.log("----->search with input:", inputValue);
    if (inputValue.length < 3) return;
    dispatch(
      applyFilter({
        ...filter,
        value: inputValue,
        value_label: inputValue,
      }),
    );
  };
  return (
    <>
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        placeholder={t("select")}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onChange={handleSelection}
        styles={customStyles}
      />
      <button className="ms-1 btn btn-primary" onClick={()=>search()}>
        <FaSearch />
      </button>
    </>
  );
};

export default memo(InputFreeAutoFill);
