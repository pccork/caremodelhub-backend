export type Role = "user" | "admin" | "scientist";

export type User = {
  _id: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
};

// What we return to UI / API responses (never expose passwordHash)
export type SafeUser = {
  _id: string;
  email: string;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
};
