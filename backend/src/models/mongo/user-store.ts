import { UserMongoose } from "./user.js";
import type { Role, SafeUser } from "../../types/user-types.js";

function toSafeUser(u: any): SafeUser {
  return {
    _id: u._id.toString(),
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt
  };
}

export const userStore = {
  async create(email: string, passwordHash: string, role: Role): Promise<SafeUser> {
    const doc = await UserMongoose.create({ email, passwordHash, role });
    return toSafeUser(doc);
  },

  async findByEmail(email: string) {
    // include passwordHash for login verification
    return UserMongoose.findOne({ email: email.toLowerCase().trim() }).lean();
  },

  async findById(id: string): Promise<SafeUser | null> {
    const doc = await UserMongoose.findById(id).lean();
    return doc ? toSafeUser(doc) : null;
  },

  async listAll(): Promise<SafeUser[]> {
    const docs = await UserMongoose.find().sort({ createdAt: -1 }).lean();
    return docs.map(toSafeUser);
  },

  async deleteById(id: string): Promise<boolean> {
    const res = await UserMongoose.findByIdAndDelete(id);
    return !!res;
  }
};
