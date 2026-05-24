import type { AdmissionRequest } from "../../../../../models/AdmissionRequest";
import type { Camp } from "../../../../../models/Camp";
import type { Exploration } from "../../../../../models/Exploration";
import type { Person } from "../../../../../models/Person";
import type { ResourceAlert } from "../../../../../models/ResourceAlert";
import type { ResourceMovement } from "../../../../../models/ResourceMovement";
import type { Resource } from "../../../../../models/Resource";
import type { Shipment } from "../../../../../models/Shipment";
import type { UserRol } from "../../../../../models/UserRol";
import type { Warehouse } from "../../../../../models/Warehouse";

export type GlobalDashboardSnapshot = {
    camps: Camp[];
    warehouses: Warehouse[];
    resources: Resource[];
    alerts: ResourceAlert[];
    admissions: AdmissionRequest[];
    people: Person[];
    explorations: Exploration[];
    shipments: Shipment[];
    movements: ResourceMovement[];
    userRoles: UserRol[];
};

export type GlobalDashboardQueryData = {
    failedMessage: string | null;
    snapshot: GlobalDashboardSnapshot;
};

export type CampPoint = Camp & {
    id: number;
    longitude: number;
    latitude: number;
};

export type FeedItem = {
    id: string;
    label: string;
    detail: string;
    tone: "ok" | "warning" | "critical" | "info";
    time: string;
};

export type ProductionPoint = {
    campId: number;
    code: string;
    value: number;
    trend: "UP" | "DOWN";
};

export type HeatCampPoint = {
    id: number;
    code: string;
    longitude: number;
    latitude: number;
    active: boolean;
    alerts: number;
    level: "critical" | "warning" | "ok";
};

export type ProfessionEntry = { label: string; count: number };

export type HealthEntry = { label: string; count: number };

export type DemographicsData = {
    avgAge: number;
    maleCount: number;
    femaleCount: number;
    totalPeople: number;
    maleRatio: number;
    femaleRatio: number;
};

export type WeeklyAdmissions = { accepted: number; rejected: number; total: number };

export type PopulationCapacity = { totalPopulation: number; totalCapacity: number; percentUsed: number };
