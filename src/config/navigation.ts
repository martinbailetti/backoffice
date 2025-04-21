import { FaUserCircle } from "react-icons/fa";

const navigation = [
  { title: "home", path: "/home", permission: "view home" },
  { title: "search", path: "/search", permission: "search", size: "medium" },
  { title: "search", path: "/factory/search", permission: "factory search", size: "medium" },
  {
    title: "security",
    path: "/security",
    group: [
      { title: "permissions", path: "/security/permissions", permission: "view permissions" },
      { title: "roles", path: "/security/roles", permission: "view roles" },
      { title: "users", path: "/security/users", permission: "view users" },
    ],
  },
  {
    title: "groups",
    path: "/licenses/groups",
    permission: "view licenses",
    childrenPaths: [
      "/licenses/machines",
      "/licenses/devices",
      "/licenses/devices/device",
      "/licenses/groups/info",
      "/licenses/machines/info",
    ],
  },
  {
    title: "groups",
    path: "/factory/groups",
    permission: "view factory licenses",
    childrenPaths: [
      "/factory/machines",
      "/factory/devices",
      "/factory/devices/device",
      "/factory/groups/info",
      "/factory/machines/info",
    ],
  },
  {
    title: "new",
    path: "/factory/new_device",
    permission: "create factory device",
    meta: true,
  },
  {
    title: "dispatch_orders",
    path: "/factory/dispatch_orders",
    permission: "view dispatch orders",
    childrenPaths: ["/factory/dispatch_orders/create", "/factory/dispatch_orders/edit"],
  },
  {
    title: "dispatch_orders",
    path: "/spv/dispatch_orders",
    permission: "view spv dispatch orders",
    childrenPaths: ["/spv/dispatch_orders/create", "/spv/dispatch_orders/edit"],
  },
  { title: "devices", path: "/devices/", permission: "view devices", size: "small" },
  {
    title: "validations",
    path: "/validations",
    group: [
      { title: "owners_rules", path: "/validations/owners_rules", permission: "view owners rules" },
      { title: "validation_rules", path: "/validations/validation_rules", permission: "view validation rules" },
      { title: "serial_repeated_rules", path: "/validations/serial_repeated", permission: "view validation rules" },
      { title: "owners_validations_report", path: "/validations/owner_validation_report", permission: "view validation rules" },
      { title: "validations_report", path: "/validations/validation_report", permission: "view validation rules" }
    ],
  },
  {
    title: "settings",
    path: "/factory/settings",
    group: [
      { title: "clients", path: "/factory/settings/clients", permission: "view factory clients" },
      { title: "types", path: "/factory/settings/types", permission: "view factory types" },
      { title: "models", path: "/factory/settings/models", permission: "view factory models" },
      { title: "printings", path: "/factory/settings/printings", permission: "view printings" },
      { title: "IPs", path: "/factory/settings/ips", permission: "view ips" },
    ],
  },
  {
    title: "settings",
    path: "/spv/settings",
    group: [
      { title: "clients", path: "/spv/settings/clients", permission: "view spv clients" }
    ],
  },
  {
    title: "account",
    icon: FaUserCircle,
    path: "/profile",
    group: [
      { title: "modify_account", path: "/profile/edit" },
      { title: "password", path: "/profile/change-password" },
      { title: "logout", path: "/security/logout" },
    ],
  },
];

export default navigation;
