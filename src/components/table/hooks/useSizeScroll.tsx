import { useEffect, useState } from "react";
import useResponsive from "@/hooks/useResponsive";

const useSizeScroll = (parentRef: React.RefObject<HTMLDivElement>, fixedHeight: boolean) => {
  const size = useResponsive();
  const tableFooterHeight = size === "small" ? 56 : 95;
  const [scrollHeight, setScrollHeight] = useState<string>("");

  useEffect(() => {
    if (parentRef.current && (size === "small" || fixedHeight)) {
      const screenHeight = window.innerHeight;

      const parentTopPosition = parentRef.current.getBoundingClientRect().top;
      console.log(parentTopPosition);

      const h = screenHeight - parentTopPosition - tableFooterHeight;
      setScrollHeight(`${h}px`);
    }


  }, [size, parentRef, setScrollHeight, fixedHeight, tableFooterHeight]);

  return scrollHeight;
};

export default useSizeScroll;
