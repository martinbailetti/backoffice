import React, { memo } from "react";

import { useTranslation } from "@/context/contextUtils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSelectedFilter } from "@/slices/tableSlice";
import { GenericRecord } from "@/types";
import useResponsive from "@/hooks/useResponsive";

/**
 * Filters component.
 */

const FilterSelector = () => {
  const t = useTranslation();

  const tableDataFilters = useAppSelector((state) => state.tableData.filters);
  const tableDataSelectedFilter = useAppSelector((state) => state.tableData.selectedFilter);
  const dispatch = useAppDispatch();

  const size = useResponsive();
  const handleSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = tableDataFilters.find((filter: GenericRecord) => filter.id === e.target.value);

    if (selected) {
      dispatch(setSelectedFilter(selected));
    } else {
      dispatch(setSelectedFilter(null));
    }
  };

  const renderFilters = () => {
    const filters = tableDataFilters.filter(
      (filter: GenericRecord) => !filter.applied || filter.multi,
    );
    return filters.map((option: GenericRecord, idx: number) => (
      <option key={idx} value={option.id}>
        {t(option.label)}
      </option>
    ));
  };
  return (
    <div className="pe-md-2 pb-1 pb-md-0">
      <select
        className={`form-control ${size == "medium" ? "w-auto" : ""}`}
        onChange={handleSelection}
        value={tableDataSelectedFilter ? tableDataSelectedFilter?.id : ""}
      >
        <option value="">{t("filters")}</option>
        {renderFilters()}
      </select>
    </div>
  );
};
export default memo(FilterSelector);
