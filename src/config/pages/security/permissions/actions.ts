export const rowActions = [
  {
    label: "delete",
    className: "btn btn-outline-danger btn-lg w-100 mb-2",
    result: {
      apiFunction: "security.deletePermission",
      data: "result",
      success: "success",
      message: "message",
      params: [
        { query: "GroupId", url: "gid" },
        { query: "MachineId", url: "mid" },
      ],
    },
  },
];
