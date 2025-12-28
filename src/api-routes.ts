import { usersApi } from "./api/users-api.js";
import type { ServerRoute } from "@hapi/hapi";

export const apiRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/api/users/login",
    ...usersApi.login,
  },

  {
    method: "GET",
    path: "/api/me",
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
    method: "GET",
    path: "/api/users",
    ...usersApi.listUsers,
  },

  {
    method: "POST",
    path: "/api/users",
    ...usersApi.createUser,
  },

  {
    method: "DELETE",
    path: "/api/users/{id}",
    ...usersApi.deleteUser,
  },
  
];
console.log(usersApi.login);
