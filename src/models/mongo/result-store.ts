import { ResultMongoose } from "./result.js";

export type CreateResultInput = {
  userId: string;
  mrn: string;
  specimenNo: string;
  inputs: any;
  outputs: any;
  model: string;
  modelVersion: string;
};

export const resultStore = {
  async create(data: CreateResultInput) {
    return ResultMongoose.create(data);
  },

  async findByUser(userId: string) {
    return ResultMongoose.find({ userId }).sort({ createdAt: -1 }).lean();
  },

  async findAll() {
    return ResultMongoose.find().sort({ createdAt: -1 }).lean();
  },

  async deleteById(id: string) {
    return ResultMongoose.findByIdAndDelete(id);
  },
};
