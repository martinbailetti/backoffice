
const table = {
  token: "PERMISSIONS_TABLE",
  paginationRowsPerPageOptions: [50, 100],
  paginationRowsPerPage: 50,
  rowTitle: "name",
  result:{
    apiFunction: "security.getPermissions",
    data: "result",
    success: "success",
    message: "message",
  },
  columns: [
    {
      name: "",
      key: "actions",
      width: "50px",
    },
    { name: "name", key: "name", selector: true, sortable: true },
  ],
};

export default table;
