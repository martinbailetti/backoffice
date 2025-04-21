const filters = [
  {
    id: "LastActivatedDate",
    type: "date_range",
    label: "LastActivatedDate"
  },
  {
    id: "ValidationDate",
    type: "date_range",
    label: "ValidationDate"
  },
  {
    id: "Validated",
    type: "select",
    label: "Validated",
    options: [
      {
        label: "yes",
        value: "1"
      },
      {
        label: "no",
        value: "0"
      }
    ]
  },
];
export default filters;
