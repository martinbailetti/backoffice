import { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { can } from "@/utils/auth";
import { GenericRecord } from "@/types";

const useSetColumns = (setColumns: React.Dispatch<React.SetStateAction<GenericRecord[] | null>>) => {

    const user = useAppSelector((state) => state.userData.data);
    const tableDataColumns = useAppSelector((state) => state.tableData.columns);
    useEffect(() => {
        const updatedColumns = tableDataColumns.filter((column) => {
            if (column.permission) {
                if (can(user, column.permission)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        });

        setColumns(
            updatedColumns.map((column) => ({
                ...column,
                ...(column.selector && { selector: (row: GenericRecord) => row[column.key] }),
            })),
        );
    }, [tableDataColumns, user, setColumns]);
};

export default useSetColumns;
