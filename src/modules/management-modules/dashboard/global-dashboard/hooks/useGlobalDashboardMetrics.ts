import { useMemo } from "react";
import {
    buildHealthConditionDistribution,
    buildProfessionDistribution,
    buildProductionSeries,
    computeDemographics,
    computePopulationCapacity,
    computeWeeklyAdmissions,
    isActiveCamp,
    isOpenAlert,
    isPendingAdmission,
} from "../utils/global-dashboard.mappers";
import type { GlobalDashboardSnapshot } from "../utils/global-dashboard.types";

export function useGlobalDashboardMetrics(snapshot: GlobalDashboardSnapshot, mappedCampCount: number) {
    const activeCamps = useMemo(() => snapshot.camps.filter(isActiveCamp), [snapshot.camps]);
    const inactiveCampsCount = useMemo(
        () => snapshot.camps.length - activeCamps.length,
        [activeCamps.length, snapshot.camps.length],
    );
    const totalPopulation = useMemo(() => snapshot.people.length, [snapshot.people.length]);
    const openAlerts = useMemo(() => snapshot.alerts.filter(isOpenAlert), [snapshot.alerts]);
    const pendingAdmissions = useMemo(
        () => snapshot.admissions.filter(isPendingAdmission),
        [snapshot.admissions],
    );
    const criticalResources = useMemo(
        () => snapshot.resources.filter((resource) => resource.status === "C"),
        [snapshot.resources],
    );
    const activeExplorations = useMemo(
        () => snapshot.explorations.filter((exploration) => exploration.state === "A"),
        [snapshot.explorations],
    );
    const pendingShipments = useMemo(
        () => snapshot.shipments.filter((shipment) => shipment.status === "P"),
        [snapshot.shipments],
    );
    const activeShipments = useMemo(
        () => snapshot.shipments.filter((shipment) => shipment.status === "A"),
        [snapshot.shipments],
    );
    const topCampsProduction = useMemo(
        () => buildProductionSeries(snapshot),
        [snapshot],
    );
    const mappedCoverage = snapshot.camps.length > 0 ? Math.round((mappedCampCount / snapshot.camps.length) * 100) : 0;

    const professionDistribution = useMemo(
        () => buildProfessionDistribution(snapshot.people),
        [snapshot.people],
    );

    const healthConditions = useMemo(
        () => buildHealthConditionDistribution(snapshot.people),
        [snapshot.people],
    );

    const demographics = useMemo(
        () => computeDemographics(snapshot.people),
        [snapshot.people],
    );

    const weeklyAdmissions = useMemo(
        () => computeWeeklyAdmissions(snapshot.admissions),
        [snapshot.admissions],
    );

    const populationCapacity = useMemo(
        () => computePopulationCapacity(snapshot.camps, snapshot.people),
        [snapshot.camps, snapshot.people],
    );

    const activeTemporalAssignments = useMemo(
        () => snapshot.userRoles.filter((ur) => ur.temporal === true && ur.active === true),
        [snapshot.userRoles],
    );

    const avgProfessionCount = useMemo(() => {
        if (professionDistribution.length === 0) return 0;
        const total = professionDistribution.reduce((s, e) => s + e.count, 0);
        return total / professionDistribution.length;
    }, [professionDistribution]);

    const deficitProfessions = useMemo(
        () => professionDistribution.filter((e) => e.count < avgProfessionCount),
        [professionDistribution, avgProfessionCount],
    );

    return {
        activeCamps,
        inactiveCampsCount,
        totalPopulation,
        openAlerts,
        pendingAdmissions,
        criticalResources,
        activeExplorations,
        pendingShipments,
        activeShipments,
        topCampsProduction,
        mappedCoverage,
        professionDistribution,
        healthConditions,
        demographics,
        weeklyAdmissions,
        populationCapacity,
        activeTemporalAssignments,
        deficitProfessions,
    };
}
