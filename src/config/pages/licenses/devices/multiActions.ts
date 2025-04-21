export const multiActions = [
  {
    label: "validate",
    className: "btn btn-success btn-lg w-100 mb-2",
    result: {
      apiFunction: "licenses.validateDevices",
    },
  },
  {
    label: "invalidate",
    className: "btn btn-danger btn-lg w-100 mb-2",
    result: {
      apiFunction: "licenses.invalidateDevices",
    },
  },
  {
    label: "request_delete",
    className: "btn btn-warning btn-lg w-100 mb-2",
    result: {
      apiFunction: "licenses.requestDeleteDevices",
    },
  },
  {
    label: "delete",
    className: "btn btn-outline-danger btn-lg w-100 mb-2",
    result: {
      apiFunction: "licenses.deleteDevices",
    },
  },
];
