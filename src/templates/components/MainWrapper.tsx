import useResponsive from "@/hooks/useResponsive";
import React, { memo, ReactNode } from "react";

/**
 * MainWrapper component.
 */
const MainWrapper = ({ children }: { children: ReactNode }) => {
  const size = useResponsive();
  if (size == "small") {
    return (
      <main className={`min-vh-100 vh-100 dvh-100 min-dvh-100 overflow-hidden d-flex flex-column`}>
        {children}
      </main>
    );
  } else {
    return <main className={`min-vh-100  d-flex flex-column`}>{children}</main>;
  }
};

export default memo(MainWrapper);
