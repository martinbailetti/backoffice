const table = {
  token: "IPS_TABLE",
  paginationRowsPerPageOptions: [50, 100],
  paginationRowsPerPage: 50,
  rowTitle: "ip",
  result: {
    apiFunction: "settings.getPaginatedIps",
  },
  sort: { column: "ip", direction: "asc" },

  columns: [
    {
      name: "",
      key: "actions",
      width: "50px",
      reorder: true,
      permission: "edit ips",
    },

    {
      name: "ip",
      key: "ip",
      selector: true,
      sortable: true,
      reorder: true,
    },
  ],
};

export default table;
