const table = {
  token: "OWNERS_RULES_TABLE",
  paginationRowsPerPageOptions: [50, 100],
  paginationRowsPerPage: 50,
  rowTitle: "Owner",
  result: {
    apiFunction: "validations.getOwnersRules",
  },
  sort: { column: "Owner", direction: "asc" },


  columns: [
    {
      name: "",
      key: "actions",
      width: "50px",
      reorder: true,
    },

    {
      name: "Owner",
      key: "Owner",
      selector: true,
      sortable: true,
      reorder: true
    },

    {
      name: "SubOwner",
      key: "SubOwner",
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
      name: "Enabled",
      key: "Enabled",
      selector: true,
      sortable: true,
      reorder: true
    },
  ],
};

export default table;
