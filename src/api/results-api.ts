import type { ServerRoute } from "@hapi/hapi";
import Boom from "@hapi/boom";
import Joi from "joi";
import { db } from "../models/db.js";
import { capabilities } from "../auth/capabilities.js";
import { hasCapability } from "../auth/authorise.js";
import { calculateKfre } from "../services/kfre-client.js";

export const resultsApi: {
  create: Pick<ServerRoute, "options" | "handler">;
  list: Pick<ServerRoute, "options" | "handler">;
  delete: Pick<ServerRoute, "options" | "handler">;
} = {
  /* ===============================
     CREATE RESULT (user)
     =============================== */
  create: {
    options: {
      auth: { scope: ["user"] },// only users reach handler
      validate: {
        payload: Joi.object({
          mrn: Joi.string()
            .trim()
            .max(32)
            .required(),

          specimenNo: Joi.string()
            .trim()
            .max(32)
            .required(),

          inputs: Joi.object({
            age: Joi.number().integer().min(18).max(110).required(),
            sex: Joi.string().valid("male", "female").required(),
            egfr: Joi.number().min(1).max(200).required(),
            acr: Joi.number().positive().required(),
          }).required(),
        }),
      },
    },

    handler: async (request: any, h: any) => {
      const { userId, role } = request.auth.credentials;
      // RBAC check
      if (!hasCapability(role, capabilities.RESULTS_CREATE)) {
        throw Boom.forbidden("Not allowed to create results");
      }

      const { mrn, specimenNo, inputs } = request.payload;

      // const kfreResult = await calculateKfre(inputs);
      const kfreResult = await calculateKfre(inputs);

      /**Persist result with ownership*/

      const result = await db.resultStore?.create({
        userId,
        mrn: request.payload.mrn,
        specimenNo: request.payload.specimenNo,
        inputs: request.payload.inputs,
        outputs: { kfre: kfreResult },
        model: kfreResult.model,
        modelVersion: kfreResult.model_version,
      });

      return h.response(result).code(201);
    },
  },

  /* ===============================
     LIST RESULTS (RBAC)
     =============================== */
  list: {
    options: {
      auth: { scope: ["user", "scientist", "admin"] },
    },

    handler: async (request: any) => {
      const { role, userId } = request.auth.credentials;

      if (hasCapability(role, capabilities.RESULTS_READ_ALL)) {
        return db.resultStore?.findAll();
      }

      if (hasCapability(role, capabilities.RESULTS_READ_OWN)) {
        return db.resultStore?.findByUser(userId);
      }

      throw Boom.forbidden("Not allowed to view results");
    },
  },

  /* ===============================
     DELETE RESULT (admin)
     =============================== */
  delete: {
    options: {
      auth: { scope: ["admin"] },
    },

    handler: async (request: any, h: any) => {
      const { role } = request.auth.credentials;
      const { id } = request.params;

      if (!hasCapability(role, capabilities.RESULTS_DELETE)) {
        throw Boom.forbidden("Not allowed to delete results");
      }

      await db.resultStore?.deleteById(request.params.id);
      return h.response().code(204);
    },
  },
};
