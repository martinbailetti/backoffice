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
      apiFunction: "filters.getFactoryFilterTypes",
      label: "Type",
      value: "Type",
    },
  },
  {
    id: "TypeInfo_autofill_multi",
    type: "autofill",
    label: "TypeInfo",
    multi: true,
    result: {
      apiFunction: "filters.getFactoryFilterTypeInfos",
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
      apiFunction: "filters.getFactoryFilterIds",
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
      apiFunction: "filters.getFactoryFilterProductDefinitions",
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
      apiFunction: "filters.getFactoryFilterClientNumbers",
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
      apiFunction: "filters.getFactoryFilterSpareOrders",
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
      apiFunction: "filters.getFactoryFilterManufacturerSerialNumbers",
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
      apiFunction: "filters.getFactoryFilterMachineSerialNumbers",
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
      apiFunction: "filters.getFactoryFilterRPIs",
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
      apiFunction: "filters.getFactoryFilterClients",
      label: "name",
      value: "id",
    },
  },
];
export default filters;
