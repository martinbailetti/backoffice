const table = {
  token: "SPV_CLIENTS_TABLE",
  paginationRowsPerPageOptions: [50, 100],
  paginationRowsPerPage: 50,
  rowTitle: "Id",
  result: {
    apiFunction: "spv.getPaginatedSpvClients"
  },
  sort: { column: "name", direction: "asc" },


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
