import { usersApi } from "./api/users-api.js";
import type { ServerRoute } from "@hapi/hapi";
import { resultsApi } from "./api/results-api.js";


export const apiRoutes: ServerRoute[] = [
  {
    method: "POST",path: "/api/users/login",...usersApi.login,
  },

  {
    method: "GET",path: "/api/me", // return information (role) of current authenticated user
    options: {
      auth: {
        scope: ["user", "scientist", "admin"],
      },
    },
    handler: (request: any) => ({
      userId: request.auth.credentials.userId,
      role: request.auth.credentials.role,
    }),
  },
  /* ===============
     USER MANAGEMENT
     ===============*/
  {
    method: "GET",path: "/api/users",...usersApi.listUsers,
  },

  {
    method: "POST",path: "/api/users",...usersApi.createUser,
  },

  {
    method: "DELETE",path: "/api/users/{id}",...usersApi.deleteUser,
  },

  // Results
  { method: "POST", path: "/api/results", ...resultsApi.create },
  { method: "GET", path: "/api/results", ...resultsApi.list },
  { method: "DELETE", path: "/api/results/{id}", ...resultsApi.delete },
  
];
console.log(usersApi.login);
