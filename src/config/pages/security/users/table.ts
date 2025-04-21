const table = {
  token: "USERS_TABLE",
  paginationRowsPerPageOptions: [50, 100],
  paginationRowsPerPage: 50,
  rowTitle: "name",
  result: {
    apiFunction: "security.getUsers",
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
    { name: "name", key: "name", selector: true, sortable: true, reorder: true },
    { name: "email", key: "email", selector: true, sortable: true, reorder: true },
    { name: "timezone", key: "timezone", selector: true, sortable: true, reorder: true },
    { name: "language_code", key: "language_code", selector: true, sortable: true, reorder: true },
    { name: "created_at", key: "created_at", selector: true, sortable: true, reorder: true },
    { name: "updated_at", key: "updated_at", selector: true, sortable: true, reorder: true },
  ],
};

export default table;
