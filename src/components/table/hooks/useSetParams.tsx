import { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { GenericRecord } from "@/types";

const useSetParams = (setParams: React.Dispatch<React.SetStateAction<GenericRecord | null>>) => {

    const tableDataResult = useAppSelector((state) => state.tableData.result);
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const initialParams: GenericRecord = {};
        if (tableDataResult.params && tableDataResult.params.length > 0) {
          tableDataResult.params.forEach((param: GenericRecord) => {
            initialParams[param.query] = searchParams.get(param.url);
          });
        }
        setParams(initialParams);
      }, [tableDataResult.params, setParams]);
};

export default useSetParams;
