import { useEffect } from "react";
import { GenericRecord } from "@/types";
import useResponsive from "@/hooks/useResponsive";
import { useAppSelector } from "@/redux/hooks";

const useTableScrollTop = (parentRef: React.RefObject<HTMLDivElement>, topScrollRef: React.RefObject<HTMLDivElement>, topScrollContentRef: React.RefObject<HTMLDivElement>, columns: GenericRecord[] | null, data: GenericRecord[]) => {
    const size = useResponsive();

  const tableDataFixedHeight = useAppSelector((state) => state.tableData.fixedHeight);
    useEffect(() => {
        if (size == "small") return;
        if (!parentRef.current) return;
        if (tableDataFixedHeight) return;

        const topScroll = topScrollRef.current;
        const topScrollContent = topScrollContentRef.current;

        const bottomScroll = document.querySelector(".sc-eUlrpB") as HTMLDivElement;

        if (bottomScroll && topScroll) {
            if (parentRef.current?.scrollWidth >= bottomScroll.scrollWidth) return;

            topScrollContent!.style.width = `${bottomScroll.scrollWidth}px`;
            // Escucha eventos de scroll
            const handleTopScroll = () => syncScroll(topScroll, bottomScroll);
            const handleBottomScroll = () => syncScroll(bottomScroll, topScroll);

            topScroll.addEventListener("scroll", handleTopScroll);
            bottomScroll.addEventListener("scroll", handleBottomScroll);

            return () => {
                // Limpia los event listeners al desmontar
                topScroll.removeEventListener("scroll", handleTopScroll);
                bottomScroll.removeEventListener("scroll", handleBottomScroll);
            };
        }
    }, [data, size, columns, tableDataFixedHeight, parentRef, topScrollRef, topScrollContentRef]);
    const syncScroll = (source: HTMLDivElement | null, target: HTMLDivElement | null) => {
        if (source && target) {
            target.scrollLeft = source.scrollLeft;
        }
    };
};

export default useTableScrollTop;
