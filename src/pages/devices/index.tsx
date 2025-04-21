import { useEffect, useRef, useState } from "react";
import { GenericRecord } from "@/types";

import { useVirtualizer } from "@tanstack/react-virtual";
import { LuRefreshCw } from "react-icons/lu";

import { IoHome } from "react-icons/io5";
import BarcodeAndQRCodeScanner from "@/components/scanner/BarcodeAndQRCodeScanner";
import { getDevicesList } from "@/api/devices";
import { IoArrowBackSharp } from "react-icons/io5";
import BackofficeBasicTemplate from "@/templates/BackofficeBasicTemplate";
import ListItem from "@/components/devices_list/ListItem";
import ListItemDetail from "@/components/devices_list/ListItemDetail";
import { useRouter } from "next/router";
import { useAppSelector } from "@/redux/hooks";
import ListFilters from "@/components/devices_list/ListFilters";
import { useTranslation } from "@/context/contextUtils";
import { settings } from "@/config";
import { formatNumber } from "@/utils";
import ListFooter from "@/components/devices_list/ListFooter";

const itemHeight: number = 200;

export const DevicesList = () => {
  const [data, setData] = useState<GenericRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [totalRows, setTotalRows] = useState(-1);
  const parentRef = useRef<HTMLDivElement>(null);

  const t = useTranslation();

  const [view, setView] = useState("list");
  const [filters, setFilters] = useState<GenericRecord[]>([]);
  const [selected, setSelected] = useState<null | GenericRecord>(null);

  const router = useRouter();

  const userDataData = useAppSelector((state) => state.userData.data);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight, // Estima el tamaño de cada fila
  });

  const applyFilters = (newFilters: GenericRecord[]) => {
    setFilters(newFilters);
    setData([]);
    setPage(1);
    setView("list");
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getDevicesList({
          per_page: rowsPerPage,
          page: page,
          filters: filters, // Asegúrate de pasar los filtros correctos
          sort_by: "LastPingTimeStamp",
          sort_direction: "desc",
        });
        setData((prevData) => [...prevData, ...result.data.result.data]);
        setTotalRows(result.data.result.total);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [page, rowsPerPage, filters]);

  useEffect(() => {
    const handleScroll = () => {
      if (parentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = parentRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 5 && !loading && data.length < totalRows) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };
    const scrollElement = parentRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => {
        scrollElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, [loading, data.length, totalRows, view, selected]);

  useEffect(() => {
    const checkIfNeedsMoreData = () => {

      if (parentRef.current) {
        const { scrollHeight, clientHeight } = parentRef.current;
        // Si el contenido no llena el contenedor visible, carga más datos
        if (scrollHeight <= clientHeight && !loading && data.length < totalRows) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };
    checkIfNeedsMoreData();
  }, [data, totalRows, loading]);

  return (
    <BackofficeBasicTemplate>
      <div className="w-100 h-100 dvh-100 d-flex flex-column bg-dark text-light">
        <div className="border-bottom border-light px-2 d-flex justify-content-between align-items-center px-2 d-flex justify-content-between align-items-center">
          {selected == null ? (
            <h3 className="m-0 h5 text-info text-uppercase">{settings.app_title}</h3>
          ) : (
            <div className={`overflow-hidden text-info text-nowrap me-3`}>{selected.Id}</div>
          )}
          {selected == null && data.length > 0 && (
            <div className="flex-grow-1 pe-2 text-end">
              <small className="badge rounded bg-info text-dark fs-very-small">
                {t("total")}
                <div className="text-black fs-small">
                  {formatNumber(totalRows, settings.locale)}
                </div>
              </small>
            </div>
          )}
          <div>
            {selected == null && (
              <a
                className="btn btn-outline-info h4 btn-sm my-2 me-2  "
                onClick={() => applyFilters(filters)}
              >
                <LuRefreshCw />
              </a>
            )}

            <a
              className="btn btn-outline-info h4 btn-sm my-2  "
              onClick={() => {
                setSelected(null);
              }}
            >
              {selected && <IoArrowBackSharp />}
              {selected == null && (
                <IoHome
                  onClick={() => {
                    router.push(userDataData?.roles[0].home_path);
                  }}
                />
              )}
            </a>
          </div>
        </div>

        {view == "list" && selected == null && (
          <div ref={parentRef} className="flex-grow-1 overflow-auto">
            {loading && (
              <div
                className="position-fixed bg-black p-2 rounded"
                style={{ zIndex: 100, bottom: "70px", left: "50%", transform: "translateX(-50%)" }}
              >
                <div className="loader"></div>
              </div>
            )}
            {data.length == 0 && totalRows == 0 && !loading && (
              <div className="p-3 text-white text-center">{t("no_results")}</div>
            )}
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const item = data[virtualRow.index];
                return (
                  <div
                    key={virtualRow.key}
                    className="fs-small px-2 py-1 d-flex justify-content-center align-items-center bg-black flex-column"
                    onClick={() => setSelected(item)}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualRow.start}px)`,
                      height: `${virtualRow.size}px`,
                    }}
                  >
                    <ListItem item={item} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === "scanner" && (
          <div className={"flex-grow-1 bg-black overflow-hidden"}>
            <BarcodeAndQRCodeScanner
              setCode={(code: string) => setFilters([{ id: "search", value: code }])}
            />
          </div>
        )}
        {view === "search" && <ListFilters applyFilters={applyFilters} filters={filters} />}

        {view === "list" && selected !== null && <ListItemDetail item={selected} />}

        {selected == null && <ListFooter view={view} setView={setView} filters={filters} />}
      </div>
    </BackofficeBasicTemplate>
  );
};

export default DevicesList;
