import useResponsive from "@/hooks/useResponsive";
import React, { memo, ReactNode } from "react";

/**
 * MainWrapper component.
 */
const ContentWrapper = ({ children }: { children: ReactNode }) => {
  const size = useResponsive();
  if (size === "small") {
    return children;
  } else {
    return (
      <div className="d-flex flex-column container flex-grow-1">
        {children}
      </div>
    );
  }
};

export default memo(ContentWrapper);
