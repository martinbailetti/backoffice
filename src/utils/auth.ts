import { GenericRecord } from "@/types";

export const can = (userDataData: GenericRecord | null, permission: string): boolean => {

  if (userDataData == null) return false;
  if (!permission) return true;

  const allowed = userDataData.roles.find((role: GenericRecord) => {
    return role.permissions.find((p: GenericRecord) => {
      return p.name === permission;
    });
  })
    ? true
    : false;

  return allowed;
};

export const canAny = (userDataData: GenericRecord | null, permissions: string[]): boolean => {

  if (userDataData === null) return false;
  if (permissions.length === 0) return true;
  const allowed = userDataData.roles.find((role: GenericRecord) => {
    return role.permissions.find((p: GenericRecord) => {
      return permissions.indexOf(p.name) >= 0 ? true : false;
    });
  })
    ? true
    : false;
  return allowed;
};


export const hasRole = (userDataData: GenericRecord | null, role: string): boolean => {
  if (userDataData === null) return false;
  if (!role) return true;
  const allowed = userDataData.roles.find((r: GenericRecord) => {
    return r.name === role;
  })
    ? true
    : false;
  return allowed;
}

