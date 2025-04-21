import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { resetToken, setTable } from "@/slices/tableSlice";
import { GenericRecord } from "@/types";
import { getSerializedColumns } from "@/utils/table";
import { useEffect } from "react";

const useSetTable = (
  status: string,
  setReady: () => void,
  tableConfig: GenericRecord,
  filters?: GenericRecord[],
  rowActions?: GenericRecord[],
  multiActions?: GenericRecord[],
) => {
  const userDataData = useAppSelector((state) => state.userData.data);
  const dispatch = useAppDispatch();

  const tableData = useAppSelector((state) => state.tableData);


  useEffect(() => {

    dispatch(resetToken());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {

    if (tableData.token == tableConfig.token) return;

    if (userDataData == null || status != "prepared") return;

    dispatch(
      setTable({
        ...tableConfig,
        filters: filters ?? [],
        columns: getSerializedColumns(tableConfig.columns),
        rowActions: rowActions ?? [],
        multiActions: multiActions ?? [],
      }),
    );

    setReady();
  }, [dispatch, status, userDataData, tableConfig, filters, rowActions, multiActions, tableData.token, setReady]);
};

export default useSetTable;
