const filters = [
  {
    id: "owner",
    type: "autofill",
    label: "owner",
    result: {
      apiFunction: "validations.getOwners",
      data: "result",
      success: "success",
      message: "message",
      label: "Owner",
      value: "Owner"
    },
  },
  {
    id: "InsertionTimestamp",
    type: "date_range",
    label: "InsertionTimestamp"
  },
];
export default filters;
