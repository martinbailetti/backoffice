const table = {
  token: "VALIDATION_RULES_TABLE",
  paginationRowsPerPageOptions: [50, 100],
  paginationRowsPerPage: 50,
  rowTitle: "name",
  result: {
    apiFunction: "validations.getValidationRules",
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
    },

    {
      name: "type",
      key: "filter_type",
      selector: true,
      sortable: true,
      reorder: true
    },

    {
      name: "value",
      key: "value",
      selector: true,
      sortable: true,
      reorder: true
    },

    {
      name: "active",
      key: "enabled",
      selector: true,
      sortable: true,
      reorder: true
    },
  ],
};

export default table;
