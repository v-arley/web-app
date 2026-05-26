import { MapPin, TrendingUp } from "lucide-react";

import type { Camp } from "../../../models/Camp";
import type { Exploration } from "../../../models/Exploration";

import CampMap from "./CampMap";
import { HorizontalStackedBar } from "./DashboardCharts";

type ExploreStateKey = "P" | "A" | "F" | "C";

type Props = {
    loading: boolean;
    camps: Camp[];
    explorations: Exploration[];
    explorationsByState: Record<ExploreStateKey, Exploration[]>;
};

const EXPLORE_STATE: Record<ExploreStateKey, { label: string; color: string }> = {
    P: {
        label: "Pending",
        color: "text-status-warning bg-status-warning/10",
    },
    A: {
        label: "Active",
        color: "text-status-ok bg-status-ok/10",
    },
    F: {
        label: "Finished",
        color: "text-status-info bg-status-info/10",
    },
    C: {
        label: "Cancelled",
        color: "text-txt-disabled bg-bg-tertiary",
    },
};

export default function DashboardMapSection({
    loading,
    camps,
    explorations,
    explorationsByState,
}: Props) {
    const mappedCamps = camps.filter(
        (camp) => camp.location_x && camp.location_y,
    ).length;

    return (
        <div className="flex flex-col gap-3">
            <div className="bg-bg-primary border border-border-default flex flex-col flex-1 min-h-0">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-default">
                    <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-accent" />

                        <span className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-label">
                            Camp Locations
                        </span>
                    </div>

                    <span className="text-[11px] font-mono text-txt-disabled uppercase tracking-label">
                        {mappedCamps} mapped
                    </span>
                </div>

                {loading ? (
                    <div className="h-[520px] flex items-center justify-center">
                        <span className="text-[11px] font-mono text-txt-disabled animate-pulse uppercase tracking-widest">
                            Loading map...
                        </span>
                    </div>
                ) : (
                    <CampMap camps={camps} height={520} />
                )}
            </div>

            <div className="bg-bg-primary border border-border-default p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-label">
                        Exploration Summary
                    </span>

                    <TrendingUp size={12} className="text-accent" />
                </div>

                <div className="grid grid-cols-4 gap-2">
                    {(["P", "A", "F", "C"] as ExploreStateKey[]).map(
                        (state) => {
                            const info = EXPLORE_STATE[state];

                            return (
                                <div
                                    key={state}
                                    className="flex flex-col items-center gap-1 py-2 bg-bg-secondary border border-border-subtle"
                                >
                                    <span
                                        className={`text-lg font-mono font-bold ${
                                            info.color.split(" ")[0]
                                        }`}
                                    >
                                        {explorationsByState[state].length}
                                    </span>

                                    <span className="text-[9px] font-mono text-txt-disabled uppercase tracking-label">
                                        {info.label}
                                    </span>
                                </div>
                            );
                        },
                    )}
                </div>

                {!loading && explorations.length > 0 && (
                    <HorizontalStackedBar
                        segments={[
                            {
                                label: "Pending",
                                value: explorationsByState.P.length,
                                color: "#FACC15",
                            },
                            {
                                label: "Active",
                                value: explorationsByState.A.length,
                                color: "#F59E0B",
                            },
                            {
                                label: "Finished",
                                value: explorationsByState.F.length,
                                color: "#38BDF8",
                            },
                            {
                                label: "Cancelled",
                                value: explorationsByState.C.length,
                                color: "#555555",
                            },
                        ]}
                        height={10}
                    />
                )}
            </div>
        </div>
    );
}