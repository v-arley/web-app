import { MapPin } from "lucide-react";
import { Map, MapControls, MapMarker, MarkerContent, MarkerPopup } from "../../../../../shared/components/ui/map";
import { formatCoord } from "../utils/global-dashboard.mappers";
import type { CampPoint, GlobalDashboardSnapshot, HeatCampPoint } from "../utils/global-dashboard.types";
import { SectionHeader } from "./SectionHeader";

export function StrategicMapPanel({
    campPoints,
    heatCampPoints,
    mapCenter,
    snapshot,
    isLoading,
}: {
    campPoints: CampPoint[];
    heatCampPoints: HeatCampPoint[];
    mapCenter: [number, number];
    snapshot: GlobalDashboardSnapshot;
    isLoading: boolean;
}) {
    return (
        <section className="bg-bg-primary border border-border-default shadow-lg overflow-hidden flex flex-col h-130">
            <SectionHeader
                title="Strategic Resource Distribution"
                subtitle="Sector coordinates / heatmap analysis"
                icon={<MapPin size={18} />}
                tag={campPoints.length > 0 ? "LIVE_MATRIX" : "ESTABLISHING"}
                tone={campPoints.length > 0 ? "blue" : "green"}
            />

            <div className="flex-1 relative bg-black/40">
                <Map
                    className="h-full w-full grayscale-[0.3] contrast-[1.1]"
                    theme="dark"
                    center={mapCenter}
                    zoom={campPoints.length > 1 ? 5.8 : 9}
                    pitch={30}
                    bearing={-10}
                    loading={isLoading}
                >
                    <MapControls position="bottom-right" showZoom showCompass />
                    {heatCampPoints.map((camp) => {
                        const campWarehouses = snapshot.warehouses.filter((warehouse) => warehouse.camp_id === camp.id);
                        const campPeople = snapshot.people.filter((person) => person.camp_id === camp.id);

                        return (
                            <MapMarker key={camp.id} longitude={camp.longitude} latitude={camp.latitude} anchor="bottom">
                                <MarkerContent>
                                    <div className="relative flex flex-col items-center group/marker">
                                        {camp.level === "critical" ? (
                                            <div className="absolute inset-0 h-4 w-4 -translate-x-0.5 -translate-y-0.5 rounded-full border border-status-critical animate-ping opacity-40" />
                                        ) : null}

                                        <div
                                            className={`h-3 w-3 rotate-45 border border-white/60 shadow-[0_0_12px_rgba(232,93,4,0.6)] ${
                                                camp.level === "critical"
                                                    ? "bg-status-critical"
                                                    : camp.active
                                                      ? "bg-accent"
                                                      : "bg-status-inactive"
                                            } group-hover/marker:scale-150 transition-transform cursor-pointer`}
                                        />
                                        <div className="mt-2.5 border border-border-default bg-bg-secondary/95 backdrop-blur-md px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.2em] text-txt-primary shadow-xl">
                                            {camp.code}
                                        </div>
                                    </div>
                                </MarkerContent>
                                <MarkerPopup className="border-border-default bg-bg-secondary text-txt-primary shadow-2xl opacity-100 scale-100 transition-all">
                                    <div className="min-w-50 font-mono p-1">
                                        <div className="flex items-center justify-between border-b border-border-subtle pb-2 mb-2">
                                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">{camp.code}</span>
                                            <span className="flex items-center gap-1.5 font-bold uppercase">
                                                <div className={`h-1.5 w-1.5 rounded-full ${camp.active ? "bg-status-ok" : "bg-status-critical"}`} />
                                                <span className={`text-[8px] ${camp.active ? "text-status-ok" : "text-status-critical"}`}>
                                                    {camp.active ? "ONLINE" : "OFFLINE"}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="space-y-1.5 text-[10px] uppercase tracking-widest text-txt-secondary">
                                            <div className="flex justify-between font-bold text-left">
                                                <span className="opacity-60">POP_DENSITY:</span>
                                                <span className="text-txt-primary">{campPeople.length} UNITS</span>
                                            </div>
                                            <div className="flex justify-between font-bold text-left">
                                                <span className="opacity-60">CRIT_ALERTS:</span>
                                                <span className={camp.alerts > 0 ? "text-status-critical" : "text-status-ok"}>{camp.alerts} NODES</span>
                                            </div>
                                            <div className="flex justify-between font-bold text-left">
                                                <span className="opacity-60">WAREHOUSES:</span>
                                                <span className="text-txt-primary">{campWarehouses.length}</span>
                                            </div>
                                            <div className="pt-2 flex justify-between opacity-50 text-[8px] italic">
                                                <span>POS_GEO:</span>
                                                <span>{formatCoord(camp.latitude)}, {formatCoord(camp.longitude)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </MarkerPopup>
                            </MapMarker>
                        );
                    })}
                </Map>
            </div>
        </section>
    );
}
