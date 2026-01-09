import type { Role } from "../types/user-types.js";

export function hasCapability(
  role: Role,
  allowedRoles: Role[]
): boolean {
  return allowedRoles.includes(role);
}
