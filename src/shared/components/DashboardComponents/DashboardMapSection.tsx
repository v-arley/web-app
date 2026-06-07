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

const EXPLORE_STATE: Record<
    ExploreStateKey,
    { label: string; textClass: string }
> = {
    P: {
        label: "Pending",
        textClass: "text-status-warning",
    },
    A: {
        label: "Active",
        textClass: "text-status-ok",
    },
    F: {
        label: "Finished",
        textClass: "text-status-info",
    },
    C: {
        label: "Cancelled",
        textClass: "text-txt-disabled",
    },
};

export default function DashboardMapSection({
    loading,
    camps,
    explorations,
    explorationsByState,
}: Props) {
    const mappedCamps = camps.filter(
        (camp) =>
            camp.location_x != null &&
            camp.location_y != null &&
            (camp.location_x !== 0 || camp.location_y !== 0),
    ).length;

    return (
        <section className="flex flex-col border border-border-default bg-bg-secondary">
            <div className="flex shrink-0 items-center justify-between border-b border-border-default px-5 py-3">
                <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-accent" />

                    <div>
                        <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-txt-primary">
                            CAMP LOCATIONS
                        </p>

                        <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-txt-disabled">
                            STRATEGIC MAP / CAMP POSITIONS
                        </p>
                    </div>
                </div>

                <span className="border border-status-info/30 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-status-info">
                    {mappedCamps} MAPPED
                </span>
            </div>

            <div className="shrink-0 bg-bg-primary">
                {loading ? (
                    <div className="flex h-[430px] items-center justify-center">
                        <span className="text-[12px] uppercase tracking-[0.18em] text-txt-disabled animate-pulse">
                            LOADING MAP...
                        </span>
                    </div>
                ) : (
                    <CampMap camps={camps} height={430} />
                )}
            </div>

            <div className="shrink-0 border-t border-border-default bg-bg-secondary px-5 py-4">
                <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={14} className="text-accent" />

                        <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-txt-primary">
                            EXPLORATION SUMMARY
                        </p>
                    </div>

                    <span className="text-[11px] uppercase tracking-[0.16em] text-txt-disabled">
                        TOTAL: {explorations.length}
                    </span>
                </div>

                <div className="grid grid-cols-4 gap-3">
                    {(["P", "A", "F", "C"] as ExploreStateKey[]).map((state) => {
                        const info = EXPLORE_STATE[state];

                        return (
                            <div
                                key={state}
                                className="border border-border-subtle bg-bg-primary px-3 py-3 text-center"
                            >
                                <p
                                    className={`text-2xl font-bold leading-none ${info.textClass}`}
                                >
                                    {explorationsByState[state].length}
                                </p>

                                <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-txt-disabled">
                                    {info.label}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {!loading && explorations.length > 0 ? (
                    <div className="mt-4">
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
                                    color: "#6B7280",
                                },
                            ]}
                            height={14}
                        />
                    </div>
                ) : null}
            </div>
        </section>
    );
}