
export const settings = {
  app_title: "Hardwarelink",
  user: {
    passwordMinLength: 6,
    passwordMaxLength: 20,
    emailMaxLength: 50,
    nameMinLength: 4,
    nameMaxLength: 15,
  },
  languages: [{ code: "en", name: "english" }, { code: "es", name: "spanish" }, { code: "ca", name: "catalan" }],
  default_language: "es",
  timezones: ["UTC", "Europe/Madrid"],
  locale: "es-ES",
  not_validated_whyactive: [257, 263],
  default_printing: {
    line0: { value: "Type", type: "data" },
    line1: { value: "TypeInfo", type: "data" },
    line2: { value: "Group:", type: "text" },
    line3: { value: "GroupId", type: "data" },
    line4: { value: "Machine:", type: "text" },
    line5: { value: "MachineId", type: "data" },
  },
  machine_position: {

    "-1": "single",
    "0": "host",

  }

};
