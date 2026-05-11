import { useMemo } from "react";
import { Tent } from "lucide-react";

import type { Camp } from "../../../models/Camp";

import {
    Map,
    MapControls,
    MapMarker,
    MarkerContent,
    MarkerPopup,
} from "../../../components/ui/map";

type Props = {
    camps: Camp[];
    height?: number;
};

export default function CampMap({
    camps,
    height = 400,
}: Props) {
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
            return [-74.0, 4.6];
        }

        const avgLng =
            mappedCamps.reduce(
                (sum, camp) => sum + camp.location_x,
                0,
            ) / mappedCamps.length;

        const avgLat =
            mappedCamps.reduce(
                (sum, camp) => sum + camp.location_y,
                0,
            ) / mappedCamps.length;

        return [avgLng, avgLat];
    }, [mappedCamps]);

    if (mappedCamps.length === 0) {
        return (
            <div
                style={{ height }}
                className="flex items-center justify-center"
            >
                <span className="text-[11px] font-mono text-txt-disabled uppercase tracking-widest">
                    No camp coordinates available
                </span>
            </div>
        );
    }

    return (
        <div style={{ height }} className="w-full">
            <Map
                className="w-full h-full"
                theme="dark"
                center={center}
                zoom={mappedCamps.length === 1 ? 12 : 5}
            >
                <MapControls
                    position="top-right"
                    showZoom
                    showCompass={false}
                />

                {mappedCamps.map((camp) => (
                    <MapMarker
                        key={camp.id ?? camp.code}
                        longitude={camp.location_x}
                        latitude={camp.location_y}
                    >
                        <MarkerContent>
                            <div className="relative flex items-center justify-center">
                                <div
                                    className={`w-4 h-4 rounded-full border-2 ${
                                        camp.active
                                            ? "border-accent bg-accent/80 shadow-[0_0_8px_rgba(232,93,4,0.5)]"
                                            : "border-txt-disabled bg-bg-tertiary"
                                    }`}
                                />

                                <div
                                    className={`absolute w-7 h-7 rounded-full animate-ping opacity-30 ${
                                        camp.active
                                            ? "bg-accent"
                                            : "bg-txt-disabled"
                                    }`}
                                />
                            </div>
                        </MarkerContent>

                        <MarkerPopup
                            className="!p-0 !bg-transparent !border-none !shadow-none"
                            closeButton={false}
                        >
                            <div className="bg-bg-primary border border-border-accent p-3 min-w-[180px] font-mono">
                                <div className="flex items-center gap-2 mb-2">
                                    <Tent
                                        size={12}
                                        className="text-accent"
                                    />

                                    <span className="text-[11px] font-bold text-txt-primary uppercase tracking-wide">
                                        {camp.code}
                                    </span>
                                </div>

                                {camp.description && (
                                    <p className="text-[10px] text-txt-secondary mb-2 leading-relaxed">
                                        {camp.description}
                                    </p>
                                )}

                                <div className="flex flex-col gap-1 border-t border-border-default pt-2">
                                    <div className="flex justify-between">
                                        <span className="text-[10px] text-txt-disabled uppercase tracking-label">
                                            Capacity
                                        </span>

                                        <span className="text-[11px] text-txt-primary font-bold">
                                            {camp.capacity}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-[10px] text-txt-disabled uppercase tracking-label">
                                            Status
                                        </span>

                                        <span
                                            className={`text-[10px] font-bold uppercase px-1.5 py-0.5 ${
                                                camp.active
                                                    ? "text-status-ok bg-status-ok/10"
                                                    : "text-txt-disabled bg-bg-tertiary"
                                            }`}
                                        >
                                            {camp.active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-[10px] text-txt-disabled uppercase tracking-label">
                                            Coords
                                        </span>

                                        <span className="text-[10px] text-txt-secondary">
                                            {camp.location_y.toFixed(4)},{" "}
                                            {camp.location_x.toFixed(4)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </MarkerPopup>
                    </MapMarker>
                ))}
            </Map>
        </div>
    );
}