import MapLibreGL from "maplibre-gl";
import { Check, MapPin, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { Map, MapControls, MapMarker, MarkerContent, useMap } from "../../../../shared/components/ui/map";

type LatLng = { lng: number; lat: number };

function MapClickCatcher({ onClick }: { onClick: (lngLat: LatLng) => void }) {
  const { map, isLoaded } = useMap();
  const onClickRef = useRef(onClick);
  onClickRef.current = onClick;

  useEffect(() => {
    if (!map || !isLoaded) return;
    map.getCanvas().style.cursor = "crosshair";
    const handler = (e: MapLibreGL.MapMouseEvent) => {
      onClickRef.current({ lng: e.lngLat.lng, lat: e.lngLat.lat });
    };
    map.on("click", handler);
    return () => {
      map.getCanvas().style.cursor = "";
      map.off("click", handler);
    };
  }, [map, isLoaded]);

  return null;
}

type Props = {
  location_x: number;
  location_y: number;
  onChange: (coords: { location_x: number; location_y: number }) => void;
  disabled?: boolean;
};

export function MapLocationPicker({ location_x, location_y, onChange, disabled = false }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<LatLng | null>(null);

  const hasLocation = location_x !== 0 || location_y !== 0;

  const handleOpen = () => {
    setPending(hasLocation ? { lng: location_x, lat: location_y } : null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPending(null);
  };

  const handleConfirm = () => {
    if (pending) {
      onChange({ location_x: pending.lng, location_y: pending.lat });
    }
    setOpen(false);
    setPending(null);
  };

  const displayLabel = hasLocation ? `${location_y.toFixed(5)}, ${location_x.toFixed(5)}` : "";
  const initialCenter: [number, number] = hasLocation ? [location_x, location_y] : [-74.0721, 4.711];
  const initialZoom = hasLocation ? 10 : 5;

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        className="app-input flex w-full items-center justify-between gap-3 text-left disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={`truncate font-mono text-[11px] ${hasLocation ? "text-txt-primary" : "text-txt-disabled"}`}>
          {displayLabel || "[ CLICK TO SELECT LOCATION ]"}
        </span>
        <MapPin size={14} className="shrink-0 text-txt-muted" />
      </button>

      {open
        ? createPortal(
            <div className="fixed inset-0 z-120 flex items-stretch justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center sm:p-6">
              <button
                type="button"
                className="fixed inset-0 cursor-default"
                onClick={handleClose}
                aria-label="Close map picker"
              />
              <section
                className="app-modal app-card--glass relative flex h-[min(38rem,92vh)] w-full max-w-3xl flex-col overflow-hidden border border-border-default bg-bg-secondary shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-label="Select Location"
              >
                <header className="app-panel-header border-b border-border-default bg-bg-secondary/80">
                  <div className="flex min-w-0 items-center gap-2">
                    <MapPin size={14} className="shrink-0 text-accent" />
                    <span className="app-panel-title">Select Location</span>
                    <span className="font-mono text-[10px] text-txt-disabled">
                      {pending
                        ? `${pending.lat.toFixed(5)}, ${pending.lng.toFixed(5)}`
                        : "Click on the map to place a marker"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="app-btn app-btn--ghost app-btn--icon app-btn--sm"
                    title="Close"
                  >
                    <X size={16} />
                  </button>
                </header>

                <div className="relative min-h-0 flex-1">
                  <Map className="h-full w-full" center={initialCenter} zoom={initialZoom}>
                    <MapClickCatcher onClick={setPending} />
                    <MapControls showZoom position="bottom-right" />
                    {pending ? (
                      <MapMarker
                        longitude={pending.lng}
                        latitude={pending.lat}
                        draggable
                        onDragEnd={(lngLat) => setPending(lngLat)}
                      >
                        <MarkerContent>
                          <div
                            className="h-4 w-4 rounded-full border-2 border-white shadow-lg"
                            style={{ background: "var(--color-accent)" }}
                          />
                        </MarkerContent>
                      </MapMarker>
                    ) : null}
                  </Map>
                </div>

                <footer className="flex items-center gap-3 border-t border-border-default bg-bg-secondary/80 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    {pending ? (
                      <span className="font-mono text-[11px] text-txt-secondary">
                        <span className="text-txt-muted">Lat:</span> {pending.lat.toFixed(6)}
                        <span className="ml-3 text-txt-muted">Lng:</span> {pending.lng.toFixed(6)}
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-txt-disabled">No location selected</span>
                    )}
                  </div>
                  <button type="button" onClick={handleClose} className="app-btn app-btn--outline app-btn--sm">
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={!pending}
                    className="app-btn app-btn--primary app-btn--sm"
                  >
                    <Check size={13} />
                    Confirm
                  </button>
                </footer>
              </section>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

export default MapLocationPicker;
