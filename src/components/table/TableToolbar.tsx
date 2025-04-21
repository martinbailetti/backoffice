import React, { memo } from "react";

import useResponsive from "@/hooks/useResponsive";
import TableToolbarSmall from "./TableToolbarSmall";
import TableToolbarMedium from "./TableToolbarMedium";
import { GenericRecord } from "@/types";

/**
 * Filters component.
 */

const TableToolbar = ({
  total = 0,
  customMultiActions = []
}: {
  total: number;
  customMultiActions?: GenericRecord[];
}) => {
  const size = useResponsive();

  return (
    <>
      {size === "small" && <TableToolbarSmall total={total} customMultiActions={customMultiActions}  />}
      {size !== "small" && <TableToolbarMedium total={total} customMultiActions={customMultiActions}  />}
    </>
  );
};

export default memo(TableToolbar);
