import type { Request } from "@hapi/hapi";
import { db } from "../models/db.js";

type JwtPayload = {
  id: string;
  role: "user" | "admin" | "scientist";
};

/**
 * To be imported - Hapi validation of JET (token) function runs automatically on every protected request.
 */
export async function validateJwt(
  artifacts: any, // A Hapi JWT object contains decoded headee, payload and raw token
  request: Request
) {
  const decoded = artifacts.decoded.payload as JwtPayload;
  // Check user still exists in DB with async wait
  const user = await db.userStore?.findById(decoded.id);

  if (!user) {
    return { isValid: false };
  }

  return {
    isValid: true,
    credentials: { 
      userId: user._id,  // who is the user
      role: user.role,  // what rule or credentials
      scope: [user.role],
    },
  };
}
