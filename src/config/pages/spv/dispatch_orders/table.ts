const table = {
  token: "SPV_DISPATCH_ORDERS_TABLE",
  paginationRowsPerPageOptions: [50, 100],
  paginationRowsPerPage: 50,
  rowTitle: "Id",
  result: {
    apiFunction: "spvDispatchOrders.getSpvDispatchOrdersPaginated"
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
      key: "id",
      selector: true,
      sortable: true,
      reorder: true,
      width: "150px"
    },
    {
      name: "created_at",
      key: "created_at",
      selector: true,
      sortable: true,
      reorder: true,
      width: "170px"
    },
    {
      name: "type",
      key: "type",
      selector: true,
      sortable: true,
      reorder: true,
      width: "150px"
    },
    {
      name: "client",
      key: "name",
      selector: true,
      sortable: true,
      reorder: true,
      width: "300px"
    },
    {
      name: "manufacturer_serial_number",
      key: "manufacturer_serial_number",
      selector: true,
      sortable: true,
      reorder: true,
      width: "150px"
    },
    {
      name: "rpi",
      key: "rpi",
      selector: true,
      sortable: true,
      reorder: true,
      width: "150px"
    },
    {
      name: "information",
      key: "type_info",
      selector: true,
      sortable: true,
      reorder: true,
      width: "150px"
    }
  ],
};

export default table;
