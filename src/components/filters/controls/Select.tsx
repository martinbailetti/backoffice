import React, { memo } from "react";

import { useTranslation } from "@/context/contextUtils";
import { useAppDispatch } from "@/redux/hooks";
import { applyFilter } from "@/slices/tableSlice";
import useResponsive from "@/hooks/useResponsive";
import { GenericRecord } from "@/types";

/**
 * Input Filter component.
 */

const Select = ({ filter }: GenericRecord) => {
  const t = useTranslation();

  const dispatch = useAppDispatch();

  const size = useResponsive();

  const handleSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(
      applyFilter({
        ...filter,
        value: e.target.value,
        value_label: e.target.options[e.target.selectedIndex].innerText,
      }),
    );
  };

  const options = filter.options.filter((option: GenericRecord) => {
    let id = option.id;
    if (typeof id === "number") {
      id = option.id.toString();
    }
    const i = filter.value.indexOf(id);
    return i < 0;
  });
  return (
    <select
      className={`form-control mt-1 mt-md-0 ${size === "medium" ? "w-auto" : ""}`}
      onChange={handleSelection}
    >
      <option value="">{t("select")}</option>
      {options.map((option: GenericRecord, idx: number) => (
        <option key={idx} value={option.value}>
          {t(option.label)}
        </option>
      ))}
    </select>
  );
}
export default memo(Select);
