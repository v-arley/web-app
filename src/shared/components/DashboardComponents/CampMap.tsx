import { useMemo } from "react";
import { Tent } from "lucide-react";

import type { Camp } from "../../../models/Camp";

import {
    Map,
    MapControls,
    MapMarker,
    MarkerContent,
    MarkerPopup,
} from "../ui/map";

type Props = {
    camps: Camp[];
    height?: number;
};

export default function CampMap({ camps, height = 400 }: Props) {
    const mappedCamps = useMemo(
        () =>
            camps.filter(
                (camp) =>
                    camp.location_x != null &&
                    camp.location_y != null &&
                    (camp.location_x !== 0 || camp.location_y !== 0),
            ),
        [camps],
    );

    const center = useMemo<[number, number]>(() => {
        if (mappedCamps.length === 0) {
            return [-84.092, 9.928];
        }

        const avgLng =
            mappedCamps.reduce((sum, camp) => sum + Number(camp.location_x), 0) /
            mappedCamps.length;

        const avgLat =
            mappedCamps.reduce((sum, camp) => sum + Number(camp.location_y), 0) /
            mappedCamps.length;

        return [avgLng, avgLat];
    }, [mappedCamps]);

    if (mappedCamps.length === 0) {
        return (
            <div
                style={{ height }}
                className="flex items-center justify-center bg-bg-primary"
            >
                <span className="text-[12px] font-mono text-txt-disabled uppercase tracking-[0.18em]">
                    No camp coordinates available
                </span>
            </div>
        );
    }

    return (
        <div style={{ height }} className="w-full overflow-hidden bg-bg-primary">
            <Map
                className="w-full h-full"
                theme="dark"
                center={center}
                zoom={mappedCamps.length === 1 ? 12 : 8}
            >
                <MapControls
                    position="top-right"
                    showZoom
                    showCompass={false}
                />

                {mappedCamps.map((camp) => {
                    const active =
                        camp.active === true ||
                        camp.state === "A" ||
                        camp.state === undefined;

                    return (
                        <MapMarker
                            key={camp.id ?? camp.code}
                            longitude={Number(camp.location_x)}
                            latitude={Number(camp.location_y)}
                        >
                            <MarkerContent>
                                <div className="relative flex items-center justify-center">
                                    <div
                                        className={[
                                            "h-5 w-5 rounded-full border-2",
                                            active
                                                ? "border-red-300 bg-red-600 shadow-[0_0_14px_rgba(239,68,68,0.95)]"
                                                : "border-red-900 bg-red-950 shadow-[0_0_10px_rgba(127,29,29,0.7)]",
                                        ].join(" ")}
                                    />

                                    <div
                                        className={[
                                            "absolute h-9 w-9 rounded-full animate-ping opacity-30",
                                            active ? "bg-red-500" : "bg-red-900",
                                        ].join(" ")}
                                    />
                                </div>
                            </MarkerContent>

                            <MarkerPopup>
                                <div className="min-w-[190px] border border-border-default bg-bg-secondary p-3 font-mono text-txt-primary">
                                    <div className="flex items-center gap-2 border-b border-border-subtle pb-2">
                                        <Tent size={14} className="text-red-500" />

                                        <div>
                                            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-txt-primary">
                                                {camp.code}
                                            </p>

                                            <p className="text-[10px] uppercase tracking-[0.14em] text-txt-disabled">
                                                Camp registry
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-3 space-y-2">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.14em] text-txt-disabled">
                                                Description
                                            </p>

                                            <p className="mt-1 text-[12px] text-txt-secondary">
                                                {camp.description || "No description"}
                                            </p>
                                        </div>

                                        <div className="flex justify-between gap-3">
                                            <span className="text-[10px] uppercase tracking-[0.14em] text-txt-disabled">
                                                Capacity
                                            </span>

                                            <span className="text-[11px] font-bold text-txt-primary">
                                                {camp.capacity ?? "-"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-3">
                                            <span className="text-[10px] uppercase tracking-[0.14em] text-txt-disabled">
                                                Status
                                            </span>

                                            <span
                                                className={[
                                                    "text-[11px] font-bold uppercase",
                                                    active
                                                        ? "text-status-ok"
                                                        : "text-status-critical",
                                                ].join(" ")}
                                            >
                                                {active ? "Active" : "Inactive"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-3">
                                            <span className="text-[10px] uppercase tracking-[0.14em] text-txt-disabled">
                                                Coords
                                            </span>

                                            <span className="text-[10px] text-txt-secondary">
                                                {Number(camp.location_y).toFixed(4)},{" "}
                                                {Number(camp.location_x).toFixed(4)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </MarkerPopup>
                        </MapMarker>
                    );
                })}
            </Map>
        </div>
    );
}