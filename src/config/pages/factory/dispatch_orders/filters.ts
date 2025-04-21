const filters = [
  {
    id: "id",
    type: "autofill",
    label: "number",
    result: {
      apiFunction: "factory.getFactoryDispatchOrderNumbers",
      label: "id_number",
      value: "id",
    },
  },
  {
    id: "factory_client_id",
    type: "autofill",
    label: "client",
    result: {
      apiFunction: "factory.getFactoryDispatchOrderClients",
      label: "name",
      value: "id",
    },
  },
  {
    id: "type",
    type: "autofill",
    label: "Type",
    result: {
      apiFunction: "factory.getFactoryDispatchOrderTypes",
      label: "type",
      value: "type",
    },
  },
  {
    id: "manufacturer_serial_number",
    type: "autofill",
    label: "manufacturer_serial_number",
    result: {
      apiFunction: "factory.getFactoryDispatchOrderManufacturerSerialNumbers",
      label: "manufacturer_serial_number",
      value: "manufacturer_serial_number",
    },
  },
  {
    id: "created_at",
    type: "date_range",
    label: "LastPingTimeStamp"
  },
];
export default filters;
