const filters = [
  {
    id: "type",
    type: "autofill",
    label: "type",
    result: {
      apiFunction: "spvDispatchOrders.getSpvDispatchOrderSearchTypes",
      data: "result",
      label: "type",
      value: "type",
    },
  },
  {
    id: "spv_client_id",
    type: "autofill",
    label: "client",
    result: {
      apiFunction: "spvDispatchOrders.getSpvDispatchOrderSearchClients",
      data: "result",
      label: "name",
      value: "id",
    },
  },
  {
    id: "id",
    type: "autofill",
    label: "number",
    multi: true,
    result: {
      apiFunction: "spvDispatchOrders.getSpvDispatchOrderSearchNumbers",
      label: "id_number",
      value: "id"
    },
  },
  {
    id: "LastPingTimeStamp_date_range",
    type: "date_range",
    label: "LastPingTimeStamp"
  },
];
export default filters;
