const filters = [
  {
    id: "Type_autofill_multi",
    type: "autofill",
    label: "Type",
    multi: true,
    result: {
      apiFunction: "licenses.getDevicesTypes",
      data: "result",
      success: "success",
      message: "message",
      label: "Type",
      value: "Type",
      params: [{query:"GroupId", url:"gid"}, {query:"MachineId", url:"mid"}],
    },
  },
  {
    id: "TypeInfo_autofill_multi",
    type: "autofill",
    label: "TypeInfo",
    multi: true,
    result: {
      apiFunction: "licenses.getDevicesTypeInfos",
      data: "result",
      success: "success",
      message: "message",
      label: "TypeInfo",
      value: "TypeInfo",
      params: [{query:"GroupId", url:"gid"}, {query:"MachineId", url:"mid"}],
    },
  },
  {
    id: "LastPingTimeStamp_date_range",
    type: "date_range",
    label: "LastPingTimeStamp"
  },
];
export default filters;
