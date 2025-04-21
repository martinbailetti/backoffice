import React, { memo } from "react";

import FilterSelector from "./FilterSelector";
import FiltersApplied from "./FiltersApplied";
import FilterInputs from "./FilterInputs";
/**
 * Filters component.
 */

const FilterSmall = () => {
  return (
    <>
      <div className="d-md-flex flex-column flex-md-row align-items-center">
        <FilterSelector />
        <FilterInputs />
      </div>
      <FiltersApplied />
    </>
  );
};
export default memo(FilterSmall);
