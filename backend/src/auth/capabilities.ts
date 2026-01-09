import type { Role } from "../types/user-types.js";

/**All supported capability key*/
export type Capability =
  | "RESULTS_READ_OWN"
  | "RESULTS_READ_ALL"
  | "RESULTS_CREATE"
  | "RESULTS_DELETE";

/**
 * Centralised RBAC capability map
 * Can change/ set permissions in this file
 */
export const capabilities: Record<Capability, Role[]> = {
  RESULTS_READ_OWN: ["user"],
  RESULTS_READ_ALL: ["scientist", "admin"],
  RESULTS_CREATE: ["user"],
  RESULTS_DELETE: ["admin"],
};
