import type { Request } from "@hapi/hapi";
import { db } from "../models/db.js";

type JwtPayload = {
  id: string;
  role: "user" | "admin" | "scientist";
};

/**
 * Hapi JWT validation function runs automatically on every protected request.
 */
export async function validateJwt(
  artifacts: any,
  request: Request
) {
  const decoded = artifacts.decoded.payload as JwtPayload;
  // Check user still exists in DB
  const user = await db.userStore?.findById(decoded.id);

  if (!user) {
    return { isValid: false };
  }

  return {
    isValid: true,
    credentials: {
      userId: user._id,
      role: user.role,
      scope: [user.role],
    },
  };
}
