const filters = [
  {
    id: "search",
    type: "text",
    label: "Search",
    selected: true,
  },
  {
    id: "Type_autofill_multi",
    type: "autofill",
    label: "Type",
    multi: true,
    result: {
      apiFunction: "filters.getFilterTypes",
      label: "Type",
      value: "Type",
    },
  },
  {
    id: "SerialNumber_autofill_multi",
    type: "autofill",
    label: "SerialNumber",
    multi: true,
    result: {
      apiFunction: "filters.getSerialNumbers",
      label: "SerialNumber",
      value: "SerialNumber",
    },
  },
  {
    id: "GroupId_autofill_multi",
    type: "autofill",
    label: "GroupId",
    multi: true,
    result: {
      apiFunction: "filters.getFilterGroupIds",
      label: "GroupId",
      value: "GroupId",
    },
  },
  {
    id: "Connected_select",
    type: "select",
    label: "connected",
    options: [{value:1, label:"yes"}, {value:0, label:"no"}],
  },
  {
    id: "TypeInfo_autofill_multi",
    type: "autofill",
    label: "TypeInfo",
    multi: true,
    result: {
      apiFunction: "filters.getFilterTypeInfos",
      label: "TypeInfo",
      value: "TypeInfo",
    },
  },
  {
    id: "Id_autofill_multi",
    type: "autofill",
    label: "device",
    multi: true,
    result: {
      apiFunction: "filters.getFilterIds",
      label: "Id",
      value: "Id",
    },
  },
  {
    id: "ProductDefinition_autofill_multi",
    type: "autofill",
    label: "ProductDefinition",
    multi: true,
    result: {
      apiFunction: "filters.getFilterProductDefinitions",
      label: "ProductDefinition",
      value: "ProductDefinition",
    },
  },
  {
    id: "ClientNumber_autofill_multi",
    type: "autofill",
    label: "ClientNumber",
    multi: true,
    result: {
      apiFunction: "filters.getFilterClientNumbers",
      label: "ClientNumber",
      value: "ClientNumber",
    },
  },
  {
    id: "SpareOrder_autofill_multi",
    type: "autofill",
    label: "SpareOrder",
    multi: true,
    result: {
      apiFunction: "filters.getFilterSpareOrders",
      label: "SpareOrder",
      value: "SpareOrder",
    },
  },
  {
    id: "ManufacturerSerialNumber_autofill_multi",
    type: "autofill",
    label: "ManufacturerSerialNumber",
    multi: true,
    result: {
      apiFunction: "filters.getFilterManufacturerSerialNumbers",
      label: "ManufacturerSerialNumber",
      value: "ManufacturerSerialNumber",
    },
  },
  {
    id: "MachineSerialNumber_autofill_multi",
    type: "autofill",
    label: "MachineSerialNumber",
    multi: true,
    result: {
      apiFunction: "filters.getFilterMachineSerialNumbers",
      label: "MachineSerialNumber",
      value: "MachineSerialNumber",
    },
  },
  {
    id: "RPI_autofill_multi",
    type: "autofill",
    label: "RPI",
    multi: true,
    result: {
      apiFunction: "filters.getFilterRPIs",
      label: "RPI",
      value: "RPI",
    },
  },
  {
    id: "Client_autofill_multi",
    type: "autofill",
    label: "Client",
    multi: true,
    result: {
      apiFunction: "filters.getFilterClients",
      label: "name",
      value: "id",
    },
  },
  {
    id: "OnlyFactory",
    type: "select",
    label: "in_factory",
    options: [{value:1, label:"yes"}, {value:0, label:"no"}],
  },
  {
    id: "IdLastActivatedDate",
    type: "date_range",
    label: "IdLastActivatedDate"
  },
  {
    id: "LastActivatedDate",
    type: "date_range",
    label: "LastActivatedDate"
  },
  {
    id: "LastMachineDate",
    type: "date_range",
    label: "LastMachineDate"
  },
  {
    id: "LastDate",
    type: "date_range",
    label: "LastDate"
  },
  {
    id: "FirstDate",
    type: "date_range",
    label: "FirstDate"
  },
  {
    id: "Expiration",
    type: "date_range",
    label: "Expiration"
  },
  {
    id: "LastLifeDate",
    type: "date_range",
    label: "LastLifeDate"
  }
];
export default filters;
