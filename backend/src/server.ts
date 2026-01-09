/**
 * src/server.ts
 *
 * Entry point for the CareModel Hub backend.
 * This file is responsible for:
 * creating the Hapi server, loading environment variables and HTTP server
 */

import Hapi from "@hapi/hapi";
import Jwt from "@hapi/jwt";
import { validateJwt } from "./api/jwt-utils.js";
import dotenv from "dotenv";
import { connectDb } from "./models/db.js";
import { apiRoutes } from "./api-routes.js";
// Load variables from .env into process.env
dotenv.config();

/**
 * Create and start the server
 */
async function startServer() {

  // Create a Hapi server instance
  const server = Hapi.server({
    port: Number(process.env.PORT) || 4000,
    host: "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"], // allow all origins for now (lock down later)
      },
    },
  });
  // Connect to database
  connectDb("mongo");

  /* ===============================
     AUTHENTICATION (JWT)
     =============================== */
  await server.register(Jwt); // register JWT with hapi/jwt plugin
  // Set up a reusable authentication strategies name jwt 
  server.auth.strategy("jwt", "jwt", {
    keys: process.env.JWT_SECRET,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      exp: true,
    },
    validate: validateJwt,
  });

  // JWT is required by default for all routes
  server.auth.default("jwt");

  
  
  /**
   * Basic health check route
   * Verify the server is running
   */
  server.route({
    method: "GET",
    path: "/health",
    options: {
      auth: false, // no auth required
    },
   handler: async () => ({
      status: "ok",
      service: "caremodelhub-backend",
      timestamp: new Date().toISOString(),
    }),
    
  });
  server.route(apiRoutes);
  // Start the server
  await server.start();

  console.log(` Server running at: ${server.info.uri}`);
}

/**
 * Catch startup errors
 */
process.on("unhandledRejection", (err) => {
  console.error(" Unhandled error:", err);
  process.exit(1);
});

// Start the application
startServer();
