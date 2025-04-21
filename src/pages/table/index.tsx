
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { GenericRecord } from "@/types";
import { getPermissions } from "@/api/security";

export default function Table() {
  const [result, setResult] = useState<GenericRecord>({ total: 0, data: [] });
  const [page, setPage] = useState<number>(1);


  const columns = [
    {
      name: "ID",
      selector: (row: GenericRecord) => row.id,
    },
    {
      name: "Name",
      selector: (row: GenericRecord) => row.name,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPermissions({
          per_page: 5,
          page: page,
          filters: [],
          sort_by: "id",
          sort_direction: "asc",
        });

        const data = response.data.result;
        setResult(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [page]);

  return (
    <div>
      <div className="my-5">hola</div>
      <DataTable
        columns={columns}
        onColumnOrderChange={() => {
          () => null;
        }}
        data={result.data}
        pagination
        paginationPerPage={5}
        paginationDefaultPage={1}
        paginationServer
        paginationTotalRows={result.total}
        customStyles={{
          tableWrapper: {
            style: {
              border: "1px solid lightgray",
              borderRadius: "6px",
            },
          },
        }}
        onChangePage={(pag) => {
          setPage(pag);
        }}
        onSort={() => {}}
        sortServer
        defaultSortFieldId={"GroupId"}
        defaultSortAsc={true}
        fixedHeader={true}
        fixedHeaderScrollHeight={`200px`}
      />
    </div>
  );
}
