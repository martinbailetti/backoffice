const table = {
  token: "FACTORY_MODELS_TABLE",
  paginationRowsPerPageOptions: [50, 100],
  paginationRowsPerPage: 50,
  rowTitle: "id",
  result: {
    apiFunction: "settings.getFactoryModelsPaginated"
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
      name: "name",
      key: "name",
      selector: true,
      sortable: true,
      reorder: true
    }
  ],
};

export default table;
