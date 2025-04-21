import { useEffect } from "react";
import useResponsive from "@/hooks/useResponsive";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { GenericRecord } from "@/types";
import { setLoading, setSelectedRows } from "@/slices/tableSlice";
import { getApiFunction } from "@/api/apiFunctions";
import { getNestedProperty } from "@/utils";
import { setError } from "@/slices/pageSlice";
import { useTranslation } from "@/context/contextUtils";

const useFetchData = (setResult: React.Dispatch<React.SetStateAction<GenericRecord>>, setTotal: (total: number) => void, setClearSelectedRows: React.Dispatch<React.SetStateAction<boolean>>, params: GenericRecord | null, scrollHeight: string, clearSelectedRows: boolean
) => {
    const size = useResponsive();

    const tableDataFilters = useAppSelector((state) => state.tableData.filters);
    const tableDataRowsPerPage = useAppSelector((state) => state.tableData.paginationRowsPerPage);
    const tableDataFixedHeight = useAppSelector((state) => state.tableData.fixedHeight);
    const tableDataPage = useAppSelector((state) => state.tableData.page);
    const tableDataRefresh = useAppSelector((state) => state.tableData.refresh);
    const tableDataLoading = useAppSelector((state) => state.tableData.loading);
    const tableDataSort = useAppSelector((state) => state.tableData.sort);
    const tableDataResult = useAppSelector((state) => state.tableData.result);

    const dispatch = useAppDispatch();

    const t = useTranslation();
    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        if ((scrollHeight !== "" || (size !== "small" && !tableDataFixedHeight)) && !tableDataLoading) {
            let filters = tableDataFilters.filter((filter: GenericRecord) => filter.applied);

            filters = filters.map((filter: GenericRecord) => {
                if (!filter.multi && filter.value.length == 1) {
                    return { id: filter.id, value: filter.value[0] };
                }
                return { id: filter.id, value: filter.value };
            });
            const fetchData = async () => {
                dispatch(setLoading(true));
                const searchParams = new URLSearchParams(window.location.search);
                const initialParams: GenericRecord = {};
                if (tableDataResult.params && tableDataResult.params.length > 0) {
                    tableDataResult.params.forEach((param: GenericRecord) => {
                        initialParams[param.query] = searchParams.get(param.url);
                    });
                }
                try {
                    const f = getApiFunction(tableDataResult.apiFunction);
                    const response = await f({
                        per_page: tableDataRowsPerPage,
                        page: tableDataPage,
                        filters: filters,
                        sort_by: tableDataSort?.column,
                        sort_direction: tableDataSort?.direction,
                        ...initialParams,
                    });

                    const success = getNestedProperty(response.data, tableDataResult.success ?? "success");
                    if (!success) {
                        const message = getNestedProperty(response.data, tableDataResult.message ?? "message");
                        dispatch(setError(t(message)));
                    }

                    const data = getNestedProperty(response.data, tableDataResult.data ?? "result");
                    setResult(data);
                    setTotal(data.total);
                    dispatch(setLoading(false));
                } catch (error) {
                    dispatch(setError(t("undefined_error")));
                }
            };
            setClearSelectedRows(!clearSelectedRows);
            dispatch(setSelectedRows([]));
            fetchData();
        }
    }, [
        tableDataRowsPerPage,
        tableDataPage,
        tableDataFilters,
        tableDataRefresh,
        tableDataSort,
        tableDataResult,
        params,
        scrollHeight
    ]);
    /* eslint-enable react-hooks/exhaustive-deps */

};

export default useFetchData;
