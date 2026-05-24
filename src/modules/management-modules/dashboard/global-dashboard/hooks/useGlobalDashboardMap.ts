import { useMemo } from "react";
import { buildHeatCampPoints, getCampPoints } from "../utils/global-dashboard.mappers";
import type { GlobalDashboardSnapshot } from "../utils/global-dashboard.types";

export function useGlobalDashboardMap(snapshot: GlobalDashboardSnapshot) {
    const campPoints = useMemo(() => getCampPoints(snapshot.camps), [snapshot.camps]);
    const heatCampPoints = useMemo(() => buildHeatCampPoints(snapshot), [snapshot]);

    const mapCenter = campPoints[0]
        ? ([campPoints[0].longitude, campPoints[0].latitude] as [number, number])
        : ([-84.0907, 9.9281] as [number, number]);

    return {
        campPoints,
        heatCampPoints,
        mapCenter,
    };
}
