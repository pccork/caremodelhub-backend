import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    /* ===============================
       ACTOR (who did it)
       =============================== */
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      required: true,
      ref: "User",
    },

    actorRole: {
      type: String,
      required: true,
      enum: ["user", "scientist", "admin"],
    },

    /* ===============================
       ACTION
       =============================== */
    action: {
      type: String,
      required: true,
      enum: [
        "CALCULATE_RESULT",
        "RECALCULATE_RESULT",
        "DELETE_RESULT",
        "LOGIN",
      ],
    },

    /* ===============================
       TARGET (what was acted on)
       =============================== */
    targetType: {
      type: String,
      enum: ["RESULT", "USER"],
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    /* ===============================
       CLINICAL CONTEXT (traceability)
       =============================== */
    mrn: {
      type: String,
      index: true,
    },

    specimenNo: {
      type: String,
      index: true,
    },

    /* ===============================
       MODEL TRACEABILITY
       =============================== */
    model: String,
    modelVersion: String,

    requestId: {
      type: String,
      index: true,
    },

    inputsHash: String,

    /* ===============================
       HUMAN & SYSTEM CONTEXT
       =============================== */
    summary: String,

    source: {
      type: String,
      enum: ["api", "script", "system"],
      default: "api",
    },

    metadata: {
      type: Object,
    },
  },
  { timestamps: true }
);

export const AuditMongoose = mongoose.model("Audit", auditSchema);
