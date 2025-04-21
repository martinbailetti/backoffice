const table = {
  token: "FILTERED_DEVICES_TABLE",
  paginationRowsPerPageOptions: [50, 100],
  paginationRowsPerPage: 50,
  rowTitle: "Id",
  result: {
    apiFunction: "validations.getValidationRulesResult",
    params: [
      { query: "name", url: "name" },
      { query: "value", url: "value" },
      { query: "filter_type", url: "filter_type" },
    ],
  },
  sort: { column: "Id", direction: "asc" },


  columns: [
   

    {
      name: "Id",
      key: "Id",
      selector: true,
      sortable: true,
      reorder: true
    },

    {
      name: "Type",
      key: "Type",
      selector: true,
      sortable: true,
      reorder: true
    },

    {
      name: "TypeInfo",
      key: "TypeInfo",
      selector: true,
      sortable: true,
      reorder: true
    },

    {
      name: "machine",
      key: "MachineId",
      selector: true,
      sortable: true,
      reorder: true
    },
    {
      name: "group",
      key: "GroupId",
      selector: true,
      sortable: true,
      reorder: true
    },
  ],
};

export default table;
