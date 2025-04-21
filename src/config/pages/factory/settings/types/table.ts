const table = {
  token: "FACTORY_TYPES_TABLE",
  paginationRowsPerPageOptions: [50, 100],
  paginationRowsPerPage: 50,
  rowTitle: "id",
  result: {
    apiFunction: "settings.getPaginatedFactoryTypes"
  },
  sort: { column: "id", direction: "asc" },


  columns: [
    {
      name: "",
      key: "actions",
      width: "50px",
      reorder: true,
    },

    {
      name: "id",
      key: "id",
      selector: true,
      sortable: true,
      reorder: true
    }
  ],
};

export default table;
