/**
 * Central database abstraction.
 * This allows swap MongoDB later between local and online*/
import { connectMongo } from "./mongo/connect.js";
import type { userStore } from "./mongo/user-store.js";

export type Db = {
  // Stores will be attached here later
  userStore: typeof userStore | null;
  resultStore: any;
};

// Singleton DB object
export const db: Db = {
  userStore: null,
  resultStore: null,
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
