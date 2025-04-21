import { memo, useRef, useState } from "react";
import { GenericRecord } from "@/types";

import { useTranslation } from "@/context/contextUtils";
import AsyncSelect from "react-select/async";
import { getGroupsAll } from "@/api/licenses";
import { SingleValue, StylesConfig } from "react-select";
import { getDevicesListTypes } from "@/api/devices";

export const ListFilters = ({
  applyFilters,
  filters,
}: {
  applyFilters: (recs: GenericRecord[]) => void;
  filters: GenericRecord[];
}) => {
  const t = useTranslation();

  const searchRef = useRef<HTMLInputElement>(null);

  const [groupId, setGroupId] = useState<string>(
    filters.find((f) => f.id === "GroupId")?.value || "",
  );
  const [serialNumber, setSerialNumber] = useState<string>(
    filters.find((f) => f.id === "SerialNumber")?.value || "",
  );
  const [type, setType] = useState<string>(filters.find((f) => f.id === "Type")?.value || "");

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
      backgroundColor: "black",
    }),
    input: (provided) => ({
      ...provided,
      backgroundColor: "black",
      color: "white",
      opacity: 1,
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: "black",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "black" : provided.backgroundColor, // Cambia el fondo de la opción seleccionada
      color: state.isSelected ? "white" : provided.color, // Cambia el color del texto de la opción seleccionada
    }),
  };

  const loadGroupsOptions = async (inputValue: string, column: string) => {
    if(inputValue.length < 3) return [];
    try {
      const response = await getGroupsAll({
        search: inputValue,
        column: column,
      });

      if (!response.data.success) {
        console.log("error", response.data.message);
        return [];
      }

      return response.data.result.map((item: GenericRecord) => ({
        label: item[column],
        value: item[column],
      }));
    } catch (error) {
      console.log("error", error);
      return [];
    }
  };
  const loadTypesOptions = async (inputValue: string) => {
    if(inputValue.length < 3) return [];
    try {
      const response = await getDevicesListTypes({
        search: inputValue,
      });

      if (!response.data.success) {
        console.log("error", response.data.message);
        return [];
      }

      return response.data.result.map((item: GenericRecord) => ({
        label: item["Type"],
        value: item["Type"],
      }));
    } catch (error) {
      console.log("error", error);
      return [];
    }
  };
  const handleGroupIdSelection = (newValue: SingleValue<GenericRecord>) => {
    if (newValue) {
      setGroupId(newValue.value);
    }
  };
  const handleSerialNumberSelection = (newValue: SingleValue<GenericRecord>) => {
    if (newValue) {
      setSerialNumber(newValue.value);
    }
  };
  const handleTypeSelection = (newValue: SingleValue<GenericRecord>) => {
    if (newValue) {
      setType(newValue.value);
    }
  };

  const setFilters = () => {
    const currentFilters = [];

    if (searchRef.current && searchRef.current.value) {
      currentFilters.push({ id: "search", value: searchRef.current.value });
    }
    if (groupId) {
      currentFilters.push({ id: "GroupId", value: groupId });
    }
    if (serialNumber) {
      currentFilters.push({ id: "SerialNumber", value: serialNumber });
    }
    if (type) {
      currentFilters.push({ id: "Type", value: type });
    }
    applyFilters(currentFilters);
  };

  const clear = () => {
    applyFilters([]);
  };

  return (
    <div className={"flex-grow-1 bg-dark overflow-auto p-2 d-flex flex-column"}>
      <div className="d-flex flex-row justify-content-between align-items-center mt-1">
        <div className="text-info">FILTERS</div>
        <div className="text-info"></div>
      </div>
      <label className="pt-2" htmlFor="search_input">
        {t("search")}
      </label>

      <input
        ref={searchRef}
        type="text"
        id="search_input"
        className="bg-black text-light form-control"
        autoComplete="off"
        defaultValue={filters.find((f) => f.id === "search")?.value}
      />

      <label className="pt-2">{t("GroupId")}</label>
      {groupId == "" ? (
        <AsyncSelect
          cacheOptions
          loadOptions={(inputValue) => loadGroupsOptions(inputValue, "GroupId")}
          placeholder={t("select")}
          onChange={(newValue) => handleGroupIdSelection(newValue)}
          styles={customStyles}
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: "blue",
              primary: "black",
            },
          })}
        />
      ) : (
        <div className="bg-black text-light form-control" onClick={() => setGroupId("")}>
          {groupId}
          <span className="float-end">x</span>
        </div>
      )}
      <label className="pt-2">{t("SerialNumber")}</label>
      {serialNumber == "" ? (
        <AsyncSelect
          cacheOptions
          loadOptions={(inputValue) => loadGroupsOptions(inputValue, "SerialNumber")}
          placeholder={t("select")}
          onChange={(newValue) => handleSerialNumberSelection(newValue)}
          styles={customStyles}
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: "blue",
              primary: "black",
            },
          })}
        />
      ) : (
        <div className="bg-black text-light form-control" onClick={() => setSerialNumber("")}>
          {serialNumber}
          <span className="float-end">x</span>
        </div>
      )}
      <label className="pt-2">{t("Type")}</label>
      {type == "" ? (
        <AsyncSelect
          cacheOptions
          loadOptions={(inputValue) => loadTypesOptions(inputValue)}
          placeholder={t("select")}
          onChange={(newValue) => handleTypeSelection(newValue)}
          styles={customStyles}
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: "blue",
              primary: "black",
            },
          })}
        />
      ) : (
        <div className="bg-black text-light form-control" onClick={() => setType("")}>
          {type}
          <span className="float-end">x</span>
        </div>
      )}
      <div className="pt-4 text-center">
        <button className="btn btn-info w-100" onClick={setFilters}>
          {t("search")}
        </button>
        <button className="btn btn-secondary w-100 mt-3" onClick={clear}>
          {t("clear")}
        </button>
      </div>
    </div>
  );
};

export default memo(ListFilters);
