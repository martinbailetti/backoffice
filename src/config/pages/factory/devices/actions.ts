export const rowActions = [
  {
    label: "validate",
    className: "btn btn-outline-success btn-lg w-100 mb-2",
    result: {
      apiFunction: "licenses.validateDevice",

    },
  },
  {
    label: "invalidate",
    className: "btn btn-outline-danger btn-lg w-100 mb-2",
    result: {
      apiFunction: "licenses.invalidateDevice",

    },
  },
  {
    label: "delete",
    className: "btn btn-danger btn-lg w-100 mb-2",
    result: {
      apiFunction: "factory.deleteFactoryDevice",

    },
  },
];
