const table = {
  token: "VALIDATIONS_REPORT_TABLE",
  paginationRowsPerPageOptions: [50, 100],
  paginationRowsPerPage: 50,
  rowTitle: "LastActivatedDate",
  result: {
    apiFunction: "validations.getValidationsReport",
  },
  sort: { column: "LastActivatedDate", direction: "desc" },

columns: [
  {
    name: "DeviceId",
    key: "DeviceId",
    selector: true,
    sortable: true,
    reorder: true,
    width:"300px"
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
    name: "Position",
    key: "Position",
    selector: true,
    sortable: true,
    reorder: true,
    width:"100px"
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
    name: "version",
    key: "AppVersion",
    selector: true,
    sortable: true,
    reorder: true,
    width:"150px"
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
    name: "ValidationDate",
    key: "ValidationDate",
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
    key: "WebRepoArcade",
    selector: true,
    sortable: true,
    reorder: true,
    width:"250px"
  },
  {
    name: "Location",
    key: "WebRepoLocation",
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
  {
    name: "UserName",
    key: "UserName",
    selector: true,
    sortable: true,
    reorder: true,
    width:"250px"
  },
],
};

export default table;
