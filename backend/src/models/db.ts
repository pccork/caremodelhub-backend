/**
 * Central database abstraction.
 * This allows swap MongoDB later between local and online*/
import { connectMongo } from "./mongo/connect.js";
import type { userStore } from "./mongo/user-store.js";
import type { resultStore } from "./mongo/result-store.js";
import type { auditStore } from "./mongo/audit-store.js";


export type Db = {
  // Stores will be attached here later
  userStore: typeof userStore | null;
  resultStore: typeof resultStore | null;
  auditStore: typeof auditStore | null;
};

// Singleton DB object
export const db: Db = {
  userStore: null,
  resultStore: null,
  auditStore: null,
};

/**
 * Entry point for DB connection.
 * For now, only MongoDB is supported.
 */
export function connectDb(dbType: "mongo") {
  if (dbType === "mongo") {
    connectMongo(db);
  }
}
