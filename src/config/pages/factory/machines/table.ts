const table = {
  token: "FACTORY_MACHINES_TABLE",
  paginationRowsPerPageOptions: [50, 100],
  paginationRowsPerPage: 50,
  rowTitle: "MachineId",
  fixedHeight: true,
  result: {
    apiFunction: "factory.getFactoryMachines",
    params: [{ query: "GroupId", url: "gid" }],
  },
  sort: { column: "MachineId", direction: "asc" },
  customHeadStyles: {
    Total: { justifyContent: "flex-end" },
    Position: { justifyContent: "flex-end" },
  },
  columns: [
    {
      key: "actions",
      selector: true,
      sortable: true,
      width: "150px",
      reorder: true,
    },
    {
      name: "MachineId",
      key: "MachineId",
      selector: true,
      sortable: true,
      width: "150px",
      reorder: true,
    },
    {
      name: "Position",
      key: "Position",
      selector: true,
      sortable: true,
      reorder: true,
      width: "100px",
      style: { justifyContent: "flex-end" },
    },
    {
      name: "Total",
      key: "Total",
      selector: true,
      sortable: true,
      reorder: true,
      width: "100px",
      style: { justifyContent: "flex-end" },
    },
    {
      name: "LastPingTimeStamp",
      key: "LastPingTimeStamp",
      selector: true,
      sortable: true,
      reorder: true,
      width: "180px",
    },
    {
      name: "ModelName",
      key: "ModelName",
      selector: true,
      sortable: true,
      reorder: true,
      width: "300px",
    }
  ],
};

export default table;
