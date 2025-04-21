const table = {
  token: "FACTORY_CLIENTS_TABLE",
  paginationRowsPerPageOptions: [50, 100],
  paginationRowsPerPage: 50,
  rowTitle: "Id",
  result: {
    apiFunction: "settings.getFactoryClientsPaginated"
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
      reorder: true
    }
  ],
};

export default table;
