const table = {
  token: "FACTORY_PRINTINGS_TABLE",
  paginationRowsPerPageOptions: [50, 100],
  paginationRowsPerPage: 50,
  rowTitle: "Id",
  result: {
    apiFunction: "settings.getPaginatedPrintings"
  },
  sort: { column: "name", direction: "asc" },


  columns: [
    {
      name: "",
      key: "actions",
      width: "50px",
      reorder: true,
      permission: "edit printings",
    },

    {
      name: "name",
      key: "name",
      selector: true,
      sortable: true,
      reorder: true
    },
    {
      name: "printer",
      key: "printer",
      selector: true,
      sortable: true,
      reorder: true
    }
  ],
};

export default table;
