import type { AdmissionRequest } from "../../../../../models/AdmissionRequest";
import type { Camp } from "../../../../../models/Camp";
import type { Person } from "../../../../../models/Person";
import type { ResourceAlert } from "../../../../../models/ResourceAlert";
import type { CampPoint, DemographicsData, FeedItem, GlobalDashboardSnapshot, HealthEntry, HeatCampPoint, PopulationCapacity, ProductionPoint, ProfessionEntry, WeeklyAdmissions } from "./global-dashboard.types";

export function isActiveCamp(camp: Camp) {
    return camp.state !== "I" && camp.active !== false;
}

export function isOpenAlert(alert: ResourceAlert) {
    return String(alert.resolved ?? "N").toUpperCase() !== "Y";
}

export function isPendingAdmission(request: AdmissionRequest) {
    const status = String(request.request_status ?? "").toUpperCase();
    return !["APPROVED", "REJECTED", "A", "R"].includes(status);
}

export function formatTime(value?: string | Date) {
    const date = value ? new Date(value) : new Date();
    if (Number.isNaN(date.getTime())) {
        return "--:--";
    }

    return date.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatCoord(value: number) {
    return value.toFixed(3);
}

export function getCampPoints(camps: Camp[]): CampPoint[] {
    return camps
        .filter((camp): camp is Camp & { id: number } => camp.id != null)
        .map((camp) => ({
            ...camp,
            id: camp.id,
            longitude: Number(camp.location_x),
            latitude: Number(camp.location_y),
        }))
        .filter(
            (camp) =>
                Number.isFinite(camp.longitude) &&
                Number.isFinite(camp.latitude) &&
                camp.longitude >= -180 &&
                camp.longitude <= 180 &&
                camp.latitude >= -90 &&
                camp.latitude <= 90,
        );
}

export function buildFeed(snapshot: GlobalDashboardSnapshot): FeedItem[] {
    const openAlerts = snapshot.alerts.filter(isOpenAlert);
    const pendingAdmissions = snapshot.admissions.filter(isPendingAdmission);
    const criticalResources = snapshot.resources.filter((resource) => resource.status === "C");
    const activeExplorations = snapshot.explorations.filter((exploration) => exploration.state === "A");
    const pendingShipments = snapshot.shipments.filter((shipment) => shipment.status === "P");

    const feed: FeedItem[] = [
        ...openAlerts.slice(0, 3).map((alert) => ({
            id: `alert-${alert.id ?? `${alert.resource_id}-${alert.warehouse_id}`}`,
            label: "Resource alert",
            detail: `Resource ${alert.resource_id} at ${alert.current_amount}/${alert.min_quantity}`,
            tone: "critical" as const,
            time: formatTime(alert.alert_date),
        })),
        ...pendingAdmissions.slice(0, 3).map((request) => ({
            id: `admission-${request.id ?? `${request.person_id}-${request.camp_id}`}`,
            label: "Admission pending",
            detail: `Person ${request.person_id} awaiting camp ${request.camp_id}`,
            tone: "warning" as const,
            time: formatTime(request.requested_at),
        })),
        ...criticalResources.slice(0, 3).map((resource) => ({
            id: `resource-${resource.id}`,
            label: "Inventory risk",
            detail: `${resource.code} / ${resource.name}`,
            tone: "critical" as const,
            time: formatTime(),
        })),
        ...activeExplorations.slice(0, 2).map((exploration) => ({
            id: `exploration-${exploration.id}`,
            label: "Active exploration",
            detail: `${exploration.name} - ${(exploration.objective ?? "").substring(0, 30)}...`,
            tone: "info" as const,
            time: formatTime(exploration.departure_date),
        })),
        ...pendingShipments.slice(0, 2).map((shipment) => ({
            id: `shipment-${shipment.id}`,
            label: "Inter-camp transfer",
            detail: `Transfer status: ${shipment.status} / ID: ${shipment.id}`,
            tone: "info" as const,
            time: formatTime(shipment.departure_date),
        })),
    ];

    if (feed.length > 0) {
        return feed.sort((left, right) => right.time.localeCompare(left.time)).slice(0, 10);
    }

    return [
        {
            id: "all-clear",
            label: "Operations nominal",
            detail: "No critical alerts detected",
            tone: "ok",
            time: formatTime(),
        },
    ];
}

export function buildProductionSeries(snapshot: GlobalDashboardSnapshot): ProductionPoint[] {
    const warehouseCampMap = new Map(
        snapshot.warehouses
            .filter((warehouse) => warehouse.id != null)
            .map((warehouse) => [warehouse.id as number, warehouse.camp_id]),
    );

    const movementByCamp = new Map<number, number>();
    for (const movement of snapshot.movements) {
        const campId = warehouseCampMap.get(movement.warehouse_id);
        if (campId == null) {
            continue;
        }

        const amount = Number(movement.amount ?? 0);
        movementByCamp.set(campId, (movementByCamp.get(campId) ?? 0) + Math.abs(amount));
    }

    const results = snapshot.camps
        .filter((camp): camp is Camp & { id: number } => camp.id != null)
        .map((camp) => {
            const value = movementByCamp.get(camp.id) ?? 0;
            return {
                campId: camp.id,
                code: camp.code ?? `CAMP-${camp.id}`,
                value,
                trend: value > 0 ? ("UP" as const) : ("DOWN" as const),
            };
        })
        .sort((left, right) => right.value - left.value)
        .slice(0, 5);

    if (results.length > 0 && results.some((item) => item.value > 0)) {
        return results;
    }

    return snapshot.camps
        .filter((camp): camp is Camp & { id: number } => camp.id != null)
        .slice(0, 5)
        .map((camp, index) => ({
            campId: camp.id,
            code: camp.code ?? `CAMP-${camp.id}`,
            value: Math.max(100, Number(camp.capacity ?? 0) - index * 25),
            trend: index % 2 === 0 ? ("UP" as const) : ("DOWN" as const),
        }));
}

export function buildHeatCampPoints(snapshot: GlobalDashboardSnapshot): HeatCampPoint[] {
    const campPoints = getCampPoints(snapshot.camps);
    const warehouseIdsByCamp = new Map<number, number[]>();

    for (const warehouse of snapshot.warehouses) {
        if (warehouse.camp_id == null || warehouse.id == null) {
            continue;
        }

        const current = warehouseIdsByCamp.get(warehouse.camp_id) ?? [];
        current.push(warehouse.id);
        warehouseIdsByCamp.set(warehouse.camp_id, current);
    }

    return campPoints.map((camp) => {
        const warehouseIds = new Set(warehouseIdsByCamp.get(camp.id) ?? []);
        const alerts = snapshot.alerts.filter(
            (alert) => warehouseIds.has(alert.warehouse_id) && isOpenAlert(alert),
        ).length;

        return {
            id: camp.id,
            code: camp.code ?? `CAMP-${camp.id}`,
            longitude: camp.longitude,
            latitude: camp.latitude,
            active: isActiveCamp(camp),
            alerts,
            level: alerts > 1 ? "critical" : alerts === 1 ? "warning" : "ok",
        };
    });
}

export function buildProfessionDistribution(people: Person[]): ProfessionEntry[] {
    const map = new Map<string, number>();
    for (const person of people) {
        const label = (person.description ?? "").trim() || "Sin especificar";
        map.set(label, (map.get(label) ?? 0) + 1);
    }
    return [...map.entries()]
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);
}

export function buildHealthConditionDistribution(people: Person[]): HealthEntry[] {
    const map = new Map<string, number>();
    for (const person of people) {
        const label = (person.conditions ?? "").trim() || "Sin condición";
        map.set(label, (map.get(label) ?? 0) + 1);
    }
    return [...map.entries()]
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count);
}

export function computeDemographics(people: Person[]): DemographicsData {
    if (people.length === 0) {
        return { avgAge: 0, maleCount: 0, femaleCount: 0, totalPeople: 0, maleRatio: 0, femaleRatio: 0 };
    }
    const now = Date.now();
    let totalAge = 0;
    let ageCount = 0;
    let maleCount = 0;
    let femaleCount = 0;
    for (const person of people) {
        const sex = (person.sex ?? "").toUpperCase();
        if (sex === "M") maleCount++;
        else if (sex === "F") femaleCount++;
        const birth = person.date_birth ? new Date(person.date_birth) : null;
        if (birth && !Number.isNaN(birth.getTime())) {
            const age = Math.floor((now - birth.getTime()) / (365.25 * 24 * 3600 * 1000));
            if (age >= 0 && age < 150) {
                totalAge += age;
                ageCount++;
            }
        }
    }
    const total = people.length;
    return {
        avgAge: ageCount > 0 ? Math.round(totalAge / ageCount) : 0,
        maleCount,
        femaleCount,
        totalPeople: total,
        maleRatio: total > 0 ? maleCount / total : 0,
        femaleRatio: total > 0 ? femaleCount / total : 0,
    };
}

export function computeWeeklyAdmissions(admissions: AdmissionRequest[]): WeeklyAdmissions {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recent = admissions.filter((a) => {
        if (!a.requested_at) return false;
        const date = new Date(a.requested_at);
        return !Number.isNaN(date.getTime()) && date >= oneWeekAgo;
    });
    const accepted = recent.filter((a) => {
        const s = String(a.request_status ?? "").toUpperCase();
        return s === "A" || s === "APPROVED";
    }).length;
    const rejected = recent.filter((a) => {
        const s = String(a.request_status ?? "").toUpperCase();
        return s === "R" || s === "REJECTED";
    }).length;
    return { accepted, rejected, total: recent.length };
}

export function computePopulationCapacity(camps: Camp[], people: Person[]): PopulationCapacity {
    const totalCapacity = camps.reduce((sum, camp) => sum + (Number(camp.capacity) || 0), 0);
    const totalPopulation = people.length;
    const percentUsed = totalCapacity > 0 ? Math.round((totalPopulation / totalCapacity) * 100) : 0;
    return { totalPopulation, totalCapacity, percentUsed };
}
