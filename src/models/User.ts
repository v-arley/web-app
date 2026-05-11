import type { Person } from "./Person";

export type UserRoleProfile = {
  id: number;
  name: string;
  description?: string | null;
  state: "A" | "I";
};

export class User {
  id?: number;
  name?: string;
  username?: string;
  password?: string;
  active?: boolean;
  state?: "A" | "I";
  profession?: string | null;
  person_id?: number;
  roles?: UserRoleProfile[];
  person?: Person;
  created_at?: string | Date;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }
}

export type CreateUser = Omit<
  User,
  "id" | "created_at" | "person" | "name" | "roles" | "active"
>;

export type UpdateUser = Partial<
  Omit<User, "id" | "created_at" | "person" | "roles" | "active" | "name">
>;

export type responseUser = User;