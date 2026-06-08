import type { Camp } from "../../../../models/Camp";
import type { Profession } from "../../../../models/Profession";
import type { Resource } from "../../../../models/Resource";
import type { User } from "../../../../models/User";

export type SystemDashboardData = {
    camps: Camp[];
    users: User[];
    resources: Resource[];
    professions: Profession[];
};

export type SystemMetric = {
    label: string;
    value: string | number;
    subtitle: string;
    tone: "default" | "success" | "warning" | "critical" | "info";
};
