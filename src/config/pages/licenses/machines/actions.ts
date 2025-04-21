import { deleteUser } from "@/api/security";

  // Actions for selected rows
  export const rowActions = [
    { label: "delete", call: deleteUser, className: "btn btn-outline-danger btn-lg w-100 mb-2" },
  ];
