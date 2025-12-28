/**
 * Run manually to create the first admin user a admnin bootstrap script
 * * */

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { UserMongoose } from "../models/mongo/user.js";

dotenv.config();

async function createAdmin() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI not set");
  }

  await mongoose.connect(uri);

  const adminEmail = "admin@caremodelhub.com";
  const adminPassword = "AdminPass123!"; // change after first login

  // Check if an admin already exists
  const existingAdmin = await UserMongoose.findOne({ role: "admin" });

  if (existingAdmin) {
    console.log("Admin already exists:", existingAdmin.email);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await UserMongoose.create({
    email: adminEmail,
    passwordHash,
    role: "admin",
  });

  console.log("Admin user created");
  console.log("Email:", admin.email);
  console.log("Password:", adminPassword);
  console.log("CHANGE PASSWORD AFTER FIRST LOGIN");

  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("Admin bootstrap failed:", err);
  process.exit(1);
});
