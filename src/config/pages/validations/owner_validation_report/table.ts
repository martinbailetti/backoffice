const table = {
  token: "OWNER_VALIDATION_REPORT_TABLE",
  paginationRowsPerPageOptions: [50, 100],
  paginationRowsPerPage: 50,
  rowTitle: "LastActivatedDate",
  result: {
    apiFunction: "validations.getOwnersValidationsReport",
  },
  sort: { column: "LastActivatedDate", direction: "desc" },

  columns: [
    {
      name: "Owner",
      key: "Owner",
      selector: true,
      sortable: true,
      reorder: true,
      width:"150px"
    },

    {
      name: "AutoInc",
      key: "AutoInc",
      selector: true,
      sortable: true,
      reorder: true,
      width:"150px"
    },

    {
      name: "deviceId",
      key: "Id",
      selector: true,
      sortable: true,
      reorder: true,
      width:"400px"
    },

    {
      name: "MachineId",
      key: "MachineId",
      selector: true,
      sortable: true,
      reorder: true,
      width:"150px"
    },

    {
      name: "GroupId",
      key: "GroupId",
      selector: true,
      sortable: true,
      reorder: true,
      width:"150px"
    },
    {
      name: "Action",
      key: "Action",
      selector: true,
      sortable: true,
      reorder: true
    },
    {
      name: "ActionExtraInfo",
      key: "ActionExtraInfo",
      selector: true,
      sortable: true,
      reorder: true,
      width:"350px"
    },
    {
      name: "Description",
      key: "Description",
      selector: true,
      sortable: true,
      reorder: true,
      width:"400px"
    },
    {
      name: "validationdate",
      key: "InsertionTimestamp",
      selector: true,
      sortable: true,
      reorder: true,
      width:"180px"
    },
    {
      name: "Position",
      key: "Position",
      selector: true,
      sortable: true,
      reorder: true
    },
    {
      name: "SerialNumber",
      key: "SerialNumber",
      selector: true,
      sortable: true,
      reorder: true,
      width:"150px"
    },
    {
      name: "Software",
      key: "AppTitle",
      selector: true,
      sortable: true,
      reorder: true
    },
    {
      name: "Version",
      key: "AppVersion",
      selector: true,
      sortable: true,
      reorder: true
    },
    {
      name: "AppDateTime",
      key: "AppDateTime",
      selector: true,
      sortable: true,
      reorder: true,
      width:"180px"
    },
    {
      name: "LastActivatedDate",
      key: "LastActivatedDate",
      selector: true,
      sortable: true,
      reorder: true,
      width:"180px"
    },
    {
      name: "Arcade",
      key: "Arcade",
      selector: true,
      sortable: true,
      reorder: true,
      width:"250px"
    },
    {
      name: "Location",
      key: "Location",
      selector: true,
      sortable: true,
      reorder: true,
      width:"250px"
    },
    {
      name: "WebRepoUser",
      key: "WebRepoUser",
      selector: true,
      sortable: true,
      reorder: true,
      width:"200px"
    },
    {
      name: "Type",
      key: "Type",
      selector: true,
      sortable: true,
      reorder: true,
      width:"250px"
    },
    {
      name: "TypeInfo",
      key: "TypeInfo",
      selector: true,
      sortable: true,
      reorder: true,
      width:"250px"
    },
  ],
};

export default table;
