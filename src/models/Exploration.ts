export class Exploration {
  id?: number;
  code!: string;
  name!: string;
  objective!: string;
  notes!: string;
  departure_date!: Date | string;
  estimated_return_date!: Date | string | null;
  duration_days!: number;
  risk_level!: string;
  state!: string;

  camp_id!: number;

  departureDate?: Date | string;
  estimatedReturnDate?: Date | string | null;
  durationDays?: number;
  riskLevel?: string;
  stateLabel?: string;
  riskLevelLabel?: string;
  createdAt?: Date | string;
  assignedAt?: Date | string;
  roleName?: string;
  campId?: number;

  constructor(data?: Partial<Exploration>) {
    if (!data) return;

    Object.assign(this, data);

    this.code = data.code ?? "";
    this.name = data.name ?? "";
    this.objective = data.objective ?? "";
    this.notes = data.notes ?? "";
    this.state = data.state ?? "";
    this.stateLabel = data.stateLabel;

    this.risk_level = data.risk_level ?? data.riskLevel ?? "";
    this.riskLevel = data.riskLevel ?? data.risk_level;
    this.riskLevelLabel = data.riskLevelLabel;

    this.departure_date = data.departure_date ?? data.departureDate ?? "";
    this.departureDate = data.departureDate ?? data.departure_date;

    this.estimated_return_date =
      data.estimated_return_date ?? data.estimatedReturnDate ?? null;
    this.estimatedReturnDate =
      data.estimatedReturnDate ?? data.estimated_return_date ?? null;

    this.duration_days = data.duration_days ?? data.durationDays ?? 0;
    this.durationDays = data.durationDays ?? data.duration_days;

    this.camp_id = data.camp_id ?? data.campId ?? 0;
    this.campId = data.campId ?? data.camp_id;

    this.createdAt = data.createdAt;
    this.assignedAt = data.assignedAt;
    this.roleName = data.roleName;
  }
}

export type CreateExploration = Omit<Exploration, "id">;
export type UpdateExploration = Partial<Omit<Exploration, "id">>;

export type WorkerExplorationFilters = {
  page?: number;
  limit?: number;
  name?: string;
  state?: string;
  riskLevel?: string;
};

export type WorkerExplorationPage = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: Exploration[];
};

export type responseExploration = Exploration;
