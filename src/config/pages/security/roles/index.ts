const page = {
  title: "roles",
  permission: "view roles",
  createPath: {permission:"edit roles", path:"/security/roles/create"},
  initialStatus: "prepared",
  breadcrumb: [
    {
      name: "home",
      path: "/home",
    },
    {
      name: "security",
      path: "/security/users",
    },
  ],
};

export default page;
