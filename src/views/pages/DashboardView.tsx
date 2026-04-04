import {
    Map,
    MapMarker,
    MarkerContent,
    MarkerPopup,
    MarkerTooltip,
} from "@/components/ui/map";

const costaRicaBounds: [[number, number], [number, number]] = [
    [-85.95, 8.0],
    [-82.55, 11.25],
];

const locations = [
    {
        id: 1,
        name: "San Jose",
        lng: -84.0907,
        lat: 9.9281,
    },
    {
        id: 2,
        name: "Liberia",
        lng: -85.4377,
        lat: 10.6346,
    },
    {
        id: 3,
        name: "Limon",
        lng: -83.035,
        lat: 9.9907,
    },
];

export function DashboardView() {
    return (

        <div className="h-[300px] aspect-video border border-[#3a3a3a] rounded-md shadow-lg overflow-hidden">
            <Map
                center={[-84.09, 9.93]}
                zoom={7}
                minZoom={6.5}
                maxZoom={16}
                maxBounds={costaRicaBounds}
                renderWorldCopies={false}
                dragRotate={false}
                pitchWithRotate={false}
            >
                {locations.map((location) => (
                    <MapMarker
                        key={location.id}
                        longitude={location.lng}
                        latitude={location.lat}
                    >
                        <MarkerContent>
                            <div className="bg-primary size-4 rounded-full border-2 border-white shadow-lg" />
                        </MarkerContent>
                        <MarkerTooltip>{location.name}</MarkerTooltip>
                        <MarkerPopup>
                            <div className="space-y-1">
                                <p className="text-foreground font-medium">{location.name}</p>
                                <p className="text-muted-foreground text-xs">
                                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                                </p>
                            </div>
                        </MarkerPopup>
                    </MapMarker>
                ))}
            </Map>
        </div>
    );
}