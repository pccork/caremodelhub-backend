import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../models/db.js";
import type { ServerRoute } from "@hapi/hapi";
import type { Role } from "../types/user-types.js";


export const usersApi: {
  login: Pick<ServerRoute, "options" | "handler">;
  listUsers: Pick<ServerRoute, "options" | "handler">;
  createUser: Pick<ServerRoute, "options" | "handler">;
  deleteUser: Pick<ServerRoute, "options" | "handler">;
} = {
  
  
  login: {
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          
          // Joi apply strick public-TLD validation
          email: Joi.string().email().required(),
          // In Dev allow internal domain for testing and revert in deployment
          // email: Joi.string().email({ tlds: { allow: false } }).required(),
          password: Joi.string().min(8).required(),
        }).required(),

      failAction: (request, h, err) => {
        const joiError = err as any;
        console.error("Joi validation error:", joiError?.details);
        throw err; // debugging error in login
      },
      },
    },

    handler: async (request: any, h: any) => {
      const { email, password } = request.payload;

      const user = await db.userStore?.findByEmail(email);
      if (!user) {
        return h.response({ error: "Invalid credentials" }).code(401);
      }

      const passwordOk = await bcrypt.compare(password, user.passwordHash);
      if (!passwordOk) {
        return h.response({ error: "Invalid credentials" }).code(401);
      }


      const token = jwt.sign(
        { id: user._id.toString(), role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "2h" }
      );

      return { token, role: user.role };
    },
  },
  /* ===============================
     LIST USERS (admin + scientist)
     =============================== */
  listUsers: {
    options: {
      auth: {
        scope: ["admin", "scientist"],
      },
    },
    handler: async () => {
      return db.userStore?.listAll();
    },
  },

  /* ===============================
     CREATE USER (admin only)
     =============================== */
  createUser: {
    options: {
      auth: {
        scope: ["admin"],
      },
      validate: {
        payload: Joi.object({
          // Joi apply strick public-TLD validation
          email: Joi.string().email().required(),
          // In Dev allow internal domain for testing and revert in deployment

          // UPDATED: allow internal / clinical domains (e.g. .local, .internal)
          //email: Joi.string().email({ tlds: { allow: false } }).required(),

          password: Joi.string().min(8).required(),
          role: Joi.string()
            .valid("user", "admin", "scientist")
            .default("user"),
        }),
      },
    },
    handler: async (request: any, h: any) => {
      const { email, password, role } = request.payload as {
        email: string;
        password: string;
        role: Role;
      };

      const existing = await db.userStore?.findByEmail(email);
      if (existing) {
        return h.response({ error: "User already exists" }).code(400);
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await db.userStore?.create(email, passwordHash, role);

      return h.response(user).code(201);
    },
  },

  /* ===============================
     DELETE USER (admin only)
     =============================== */
  deleteUser: {
    options: {
      auth: {
        scope: ["admin"],
      },
    },
    handler: async (request: any, h: any) => {
      const { id } = request.params;

      const deleted = await db.userStore?.deleteById(id);
      if (!deleted) {
        return h.response({ error: "User not found" }).code(404);
      }

      return h.response().code(204);
    },
  },
};
