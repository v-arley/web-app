import { useMemo } from "react";
import { buildFeed } from "../utils/global-dashboard.mappers";
import type { GlobalDashboardSnapshot } from "../utils/global-dashboard.types";

export function useGlobalDashboardFeed(snapshot: GlobalDashboardSnapshot) {
    return useMemo(() => buildFeed(snapshot), [snapshot]);
}
