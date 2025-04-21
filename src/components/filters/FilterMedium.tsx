import React, { memo } from "react";

import FilterSelector from "./FilterSelector";
import FilterInputs from "./FilterInputs";
/**
 * Filters component.
 */

const FilterMedium = () => {

  return (
    <>
      <div className="d-md-flex flex-column flex-md-row align-items-center">
        <FilterSelector />
        <FilterInputs/>
      </div>
    </>
  );
}
export default memo(FilterMedium);
