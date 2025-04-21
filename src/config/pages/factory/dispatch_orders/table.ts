const table = {
  token: "DISPATCH_ORDERS_TABLE",
  paginationRowsPerPageOptions: [50, 100],
  paginationRowsPerPage: 50,
  rowTitle: "id",
  result: {
    apiFunction: "factoryDispatchOrders.getFactoryDispatchOrdersPaginated"
  },
  sort: { column: "created_at", direction: "desc" },


  columns: [
    {
      name: "",
      key: "actions",
      width: "50px",
      reorder: true,
    },

    {
      name: "number",
      key: "id_number",
      selector: true,
      sortable: true,
      reorder: true,
      width: "200px"
    },
    {
      name: "created_at",
      key: "created_at",
      selector: true,
      sortable: true,
      reorder: true,
      width: "200px"
    },
    {
      name: "ClientName",
      key: "ClientName",
      selector: true,
      sortable: true,
      reorder: true,
      width: "350px"
    },
    {
      name: "detail",
      key: "detail",
      selector: true,
      sortable: true,
      reorder: true,
      width: "150px"
    }
  ],
};

export default table;
