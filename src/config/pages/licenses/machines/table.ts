const table = {
  token: "MACHINES_TABLE",
  paginationRowsPerPageOptions: [50, 100],
  paginationRowsPerPage: 50,
  rowTitle: "MachineId",
  result: {
    apiFunction: "licenses.getMachines",
    params: [{ query: "GroupId", url: "gid" }],
  },
  sort: { column: "MachineId", direction: "asc" },
  customHeadStyles: {
    Total: { justifyContent: "flex-end" },
  },
  columns: [
    {
      name: "",
      key: "actions",
      selector: true,
      sortable: true,
      width: "60px",
      reorder: true,
    },
    {
      name: "MachineId",
      key: "MachineId",
      selector: true,
      sortable: true,
      width: "250px",
      reorder: true,
    },
    {
      name: "devices",
      key: "devices",
      selector: true,
      sortable: false,
      width: "200px",
      reorder: true,
    },
    {
      name: "Position",
      key: "Position",
      selector: true,
      sortable: true,
      reorder: true,
      width: "100px",
    },
    {
      name: "LastPingTimeStamp",
      key: "LastPingTimeStamp",
      selector: true,
      sortable: true,
      reorder: true,
      width: "180px",
    },
  ],
};

export default table;
