import { AuditMongoose } from "./audit.js";

export const auditStore = {
  async record(entry: {
    actorId: string;
    actorRole: "user" | "scientist" | "admin";
    action: string;
    targetType: "RESULT" | "USER";
    targetId?: string;
    mrn?: string;
    specimenNo?: string;
    model?: string;
    modelVersion?: string;
    requestId?: string;
    inputsHash?: string;
    summary?: string;
    source?: "api" | "script" | "system";
    metadata?: any;
  }) {
    return AuditMongoose.create(entry);
  },

  async findByUser(userId: string) {
    return AuditMongoose.find({ actorUserId: userId })
      .sort({ createdAt: -1 })
      .lean();
  },

  async findByMrn(mrn: string) {
    return AuditMongoose.find({ mrn }).sort({ createdAt: -1 }).lean();
  },

  async findBySpecimen(specimenNo: string) {
    return AuditMongoose.find({ specimenNo }).sort({ createdAt: -1 }).lean();
  },

  async listAll() {
    return AuditMongoose.find().sort({ createdAt: -1 }).lean();
  },
};
