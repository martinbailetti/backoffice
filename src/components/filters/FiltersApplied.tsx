import React, { memo } from "react";

import { useTranslation } from "@/context/contextUtils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { removeFilter } from "@/slices/tableSlice";
import { GenericRecord } from "@/types";

/**
 * Filters component.
 */

const FiltersApplied = () => {
  const t = useTranslation();

  const tableDataFilters = useAppSelector((state) => state.tableData.filters);
  const dispatch = useAppDispatch();

  const handleClick = (filter: GenericRecord) => {
    dispatch(removeFilter(filter));
  };
  const getValue = (filter: GenericRecord) => {
    if (filter.type === "select" || filter.type === "autofill") {
      return filter.value_label.join(", ");
    }else if(filter.type === "date_range"){
      return `${filter.value[0].from ? filter.value[0].from : "..."} - ${filter.value[0].to ? filter.value[0].to : "..."}`;
    }
    
    return filter.value.join(", ");
  };
  const renderFilters = (filters:GenericRecord[]) => {
    return filters.map((filter: GenericRecord, idx: number) => (
      <span className="badge text-bg-dark me-2 mt-1 text-wrap" key={idx} onClick={() => handleClick(filter)}>
        {t(filter.label)}: {getValue(filter)}{" "}
        <span className="ms-2 float-end">x</span>
      </span>
    ));
  };

  const filters = tableDataFilters.filter((filter: GenericRecord) => filter.applied);
  return (
    <>
      {filters.length > 0 && (
        <div>
          <div className="d-flex my-2 flex-wrap">{renderFilters(filters)}</div>
        </div>
      )}
      {tableDataFilters.length == 0 && null}
    </>
  );
}
export default memo(FiltersApplied);
