const table = {
  token: "PRINTINGS_TABLE",
  paginationRowsPerPageOptions: [50, 100],
  paginationRowsPerPage: 50,
  rowTitle: "Id",
  result: {
    apiFunction: "settings.getPaginatedPrintings"
  },
  sort: { column: "Id", direction: "asc" },


  columns: [
    {
      name: "",
      key: "actions",
      width: "50px",
      reorder: true,
    },

    {
      name: "name",
      key: "name",
      selector: true,
      sortable: true,
      reorder: true,
      width: "120px"
    },
    {
      name: "printer",
      key: "printer",
      selector: true,
      sortable: true,
      reorder: true,
      width: "120px"
    }
  ],
};

export default table;
