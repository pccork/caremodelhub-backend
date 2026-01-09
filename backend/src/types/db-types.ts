import type { userStore } from "../models/mongo/user-store.js";
import type { resultStore } from "../models/mongo/result-store.js";

export type Db = {
  userStore: typeof userStore | null;
  resultStore: typeof resultStore | null;
};
