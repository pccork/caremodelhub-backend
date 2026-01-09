/**
 * MongoDB connection logic.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import type { Db } from "../db.js";
import { userStore } from "./user-store.js";
import { resultStore } from "./result-store.js";
import { auditStore } from "./audit-store.js";

dotenv.config();

export async function connectMongo(db: Db) {
  const uri = process.env.MONGO_URI;
 
  if (!uri) {
    throw new Error("MONGO_URI not set in environment");
  }

  // Recommended mongoose settings
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(uri);

    // Attach stores
    db.userStore = userStore;
    db.resultStore = resultStore;
    db.auditStore = auditStore;

    console.log("MongoDB connected");
    console.log(`Database: ${mongoose.connection.name}`);
    console.log(`Host: ${mongoose.connection.host}`);

    // Stores will be attached here later now removed
    //db.userStore = null;
    //db.resultStore = null;

  } catch (err) {
    console.error("MongoDB connection error", err);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    console.warn(" MongoDB disconnected");
  });
}
