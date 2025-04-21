import React, { memo } from "react";

import { useAppSelector } from "@/redux/hooks";
import Input from "./controls/Input";
import Select from "./controls/Select";
import InputAutoFill from "./controls/InputAutoFill";
import DateRange from "./controls/DateRange";
import InputFreeAutoFill from "./controls/InputFreeAutoFill";
/**
 * Filters component.
 */

const FilterInputs = () => {
  const tableDataSelectedFilter = useAppSelector((state) => state.tableData.selectedFilter);


  return (
    <>
      {(tableDataSelectedFilter?.type === "text" ||
        tableDataSelectedFilter?.type === "email" ||
        tableDataSelectedFilter?.type === "date") && <Input filter={tableDataSelectedFilter} />}
      {tableDataSelectedFilter?.type === "select" && <Select filter={tableDataSelectedFilter} />}
      {tableDataSelectedFilter?.type === "autofill_free" && <InputFreeAutoFill filter={tableDataSelectedFilter} />}
      {tableDataSelectedFilter?.type === "autofill" && (
        <InputAutoFill filter={tableDataSelectedFilter} />
      )}
      {tableDataSelectedFilter?.type === "date_range" && (
        <DateRange filter={tableDataSelectedFilter} />
      )}
    </>
  );
};
export default memo(FilterInputs);
