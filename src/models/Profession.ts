import type { Resource } from "./Resource";

export class Profession {
  id?: number;
  code!: string;
  name!: string;
  description?: string | null;
  default_resource_id?: number | null;
  default_production_amount?: number | null;
  state!: "A" | "I";
  created_at?: Date | string;

  defaultResource?: Resource | null;

  constructor(data?: Partial<Profession>) {
    if (!data) return;
    Object.assign(this, data);
  }
}

export type CreateProfession = {
  code: string;
  name: string;
  description?: string | null;
  default_resource_id?: number | null;
  default_production_amount?: number | null;
  state?: "A" | "I";
};

export type UpdateProfession = Partial<CreateProfession>;

export type responseProfession = Profession;
