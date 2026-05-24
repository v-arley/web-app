import React from "react";
import { Users, Map as MapIcon, AlertCircle, TrendingUp, Activity, Zap, Package } from "lucide-react";
import CampMap from "../../../../../views/components/DashboardComponents/CampMap";
import { Map, MapMarker, MarkerContent, MapControls } from "../../../../../components/ui/map";
import type { Camp } from "../../../../../models/Camp";

const PRODUCTION_DATA = [40, 65, 45, 90, 85, 55, 75, 95, 80, 60, 45, 70];
const MONTHS = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

const MOCK_MAP_CAMPS: Camp[] = [
    { id: 1, code: "CAMP-001", description: "Base Central",     capacity: 500, location_x: -74.006,  location_y: 40.7128, active: true,  state: "A" },
    { id: 2, code: "CAMP-002", description: "Puesto Norte",      capacity: 200, location_x: -73.9352, location_y: 40.7306, active: true,  state: "A" },
    { id: 3, code: "CAMP-003", description: "Retiro Monta\u00f1a",  capacity: 100, location_x: -74.1724, location_y: 40.6413, active: false, state: "I" },
    { id: 4, code: "CAMP-004", description: "Zona Sur",          capacity: 350, location_x: -74.05,   location_y: 40.68,   active: true,  state: "A" },
];

const MOCK_ALERT_CAMPS = [
    { code: "CAMP-001", lng: -74.006,  lat: 40.7128, alerts: 3, level: "critical" as const },
    { code: "CAMP-002", lng: -73.9352, lat: 40.7306, alerts: 1, level: "warning"  as const },
    { code: "CAMP-003", lng: -74.1724, lat: 40.6413, alerts: 0, level: "ok"       as const },
    { code: "CAMP-004", lng: -74.05,   lat: 40.68,   alerts: 2, level: "warning"  as const },
];

const ALERT_COLOR: Record<"critical" | "warning" | "ok", string> = {
    critical: "bg-status-critical shadow-[0_0_8px_rgba(239,68,68,0.6)]",
    warning:  "bg-status-warning  shadow-[0_0_8px_rgba(234,179,8,0.5)]",
    ok:       "bg-status-ok       shadow-[0_0_8px_rgba(34,197,94,0.4)]",
};

const ACTIVIDAD_RECIENTE = [
    { time: "14:30", origin: "CAMP-01", msg: "Envío de suministros confirmado", type: "info" },
    { time: "13:12", origin: "CAMP-03", msg: "Nueva admisión registrada", type: "info" },
    { time: "11:45", origin: "CAMP-02", msg: "Movimiento de recursos: +200 AGUA", type: "info" },
    { time: "09:20", origin: "CAMP-01", msg: "Alerta crítica de recursos abierta", type: "error" },
];

export function GlobalDashboardView() {
    return (
        <div className="flex h-full flex-col p-4 md:p-6 bg-bg-app gap-4 overflow-y-auto">
            <div className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-[0.2em]">
                DASHBOARD GLOBAL
            </div>

            {/* Métricas principales del sistema */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                    { label: "Campamentos Activos", value: "08", sub: "Estado A", icon: <Map className="w-4 h-4" />, color: "border-l-status-ok" },
                    { label: "Campamentos Inactivos", value: "02", sub: "Estado I", icon: <Map className="w-4 h-4" />, color: "border-l-border-default" },
                    { label: "Población Total", value: "12,842", sub: "Personas registradas", icon: <Users className="w-4 h-4" />, color: "border-l-accent" },
                    { label: "Alertas de Recursos Críticos", value: "03", sub: "Alertas abiertas", icon: <AlertCircle className="w-4 h-4" />, color: "border-l-status-critical" },
                    { label: "Exploraciones Activas", value: "14", sub: "En curso", icon: <Zap className="w-4 h-4" />, color: "border-l-status-warning" },
                    { label: "Solicitudes Pendientes", value: "07", sub: "Inter-campamento", icon: <Package className="w-4 h-4" />, color: "border-l-status-info" },
                ].map(kpi => (
                    <div key={kpi.label} className={`flex flex-col gap-1.5 border-l-2 ${kpi.color} bg-bg-secondary border border-border-default px-4 py-3 transition-all hover:-translate-y-0.5`}>
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] font-mono font-bold text-txt-disabled uppercase tracking-widest leading-tight">{kpi.label}</span>
                            <div className="text-txt-disabled opacity-40 shrink-0 ml-1">{kpi.icon}</div>
                        </div>
                        <div className="text-2xl font-mono font-black text-txt-primary tabular-nums">{kpi.value}</div>
                        <div className="text-[9px] font-mono font-bold text-accent uppercase tracking-tighter italic">{kpi.sub}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
                {/* Área de análisis */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                    {/* Top campamentos por producción */}
                    <div className="relative bg-bg-secondary border border-border-default overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50" />
                        <div className="flex items-center justify-between p-5 border-b border-border-default">
                            <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 text-txt-primary">
                                <TrendingUp className="w-4 h-4 text-accent" /> Top Campamentos por Producción
                            </h2>
                            <div className="flex gap-2">
                                <span className="text-[9px] font-mono font-bold border border-border-default px-2 py-0.5 text-txt-secondary">2026</span>
                                <span className="text-[9px] font-mono font-bold border border-border-default bg-bg-tertiary px-2 py-0.5 text-accent">ANUAL</span>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="h-48 w-full flex items-end justify-between gap-1 sm:gap-2">
                                {PRODUCTION_DATA.map((h, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <div
                                            style={{ height: `${h}%` }}
                                            className={`w-full transition-all cursor-pointer relative group ${i % 2 === 0 ? "bg-accent/30 hover:bg-accent/60 border-t-2 border-accent" : "bg-txt-secondary/20 hover:bg-txt-secondary/40 border-t-2 border-border-default"
                                                }`}
                                        >
                                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-bg-secondary border border-border-default text-txt-primary text-[8px] px-1.5 py-0.5 hidden group-hover:block z-20 whitespace-nowrap font-mono">
                                                {h * 123}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-3 text-[8px] font-mono font-black text-txt-disabled uppercase tracking-[2px]">
                                {MONTHS.map(m => <span key={m}>{m}</span>)}
                            </div>
                        </div>
                    </div>

                    {/* Mapa de campamentos */}
                    <div className="relative bg-bg-secondary border border-border-default overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50 z-10" />
                        <div className="flex items-center justify-between p-4 border-b border-border-default">
                            <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 text-txt-primary">
                                <MapIcon className="w-4 h-4 text-accent" /> Mapa de Campamentos
                            </h2>
                            <span className="text-[9px] font-mono font-bold border border-border-default px-2 py-0.5 text-txt-secondary">
                                {MOCK_MAP_CAMPS.filter(c => c.active).length} ACTIVOS / {MOCK_MAP_CAMPS.length} TOTAL
                            </span>
                        </div>
                        <CampMap camps={MOCK_MAP_CAMPS} height={280} />
                    </div>
                </div>

                {/* Panel lateral */}
                <aside className="lg:col-span-4 flex flex-col gap-4">
                    {/* Actividad reciente */}
                    <div className="relative bg-bg-secondary border border-border-default p-5">
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50" />
                        <div className="flex items-center gap-2 mb-4 border-b border-border-default pb-3">
                            <Activity className="w-4 h-4 text-accent animate-pulse" />
                            <h3 className="text-[11px] font-mono font-bold tracking-widest uppercase text-txt-primary">Actividad Reciente</h3>
                            <span className="ml-auto text-[9px] font-mono text-status-ok border border-status-ok/30 bg-status-ok/10 px-2">EN VIVO</span>
                        </div>
                        <div className="flex flex-col gap-3 font-mono text-[10px]">
                            {ACTIVIDAD_RECIENTE.map((log, i) => (
                                <div key={i} className="border-l-2 border-border-default pl-3 py-0.5 flex flex-col gap-0.5 hover:bg-bg-tertiary/30 transition-colors">
                                    <div className="flex justify-between items-center">
                                        <span className="text-txt-disabled text-[8px] font-bold">{log.time} | {log.origin}</span>
                                        {log.type === "error" && <span className="w-1.5 h-1.5 rounded-full bg-status-critical animate-ping" />}
                                    </div>
                                    <span className={`uppercase font-bold tracking-tighter text-[9px] ${log.type === "error" ? "text-status-critical" : "text-txt-primary"}`}>
                                        {log.msg}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mapa de calor de recursos críticos */}
                    <div className="flex-1 relative bg-bg-secondary border border-border-default overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50 z-10" />
                        <div className="flex items-center justify-between p-4 border-b border-border-default">
                            <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 text-txt-primary">
                                <AlertCircle className="w-3.5 h-3.5 text-status-critical" /> Mapa de Calor — Recursos
                            </h3>
                            <div className="flex items-center gap-2 text-[8px] font-mono font-bold uppercase">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-critical inline-block" />Crítico</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-warning inline-block" />Alerta</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-ok inline-block" />Normal</span>
                            </div>
                        </div>
                        <div className="h-52">
                            <Map
                                className="w-full h-full"
                                theme="dark"
                                center={[-74.006, 40.7128]}
                                zoom={10}
                            >
                                <MapControls position="top-right" showZoom showCompass={false} />
                                {MOCK_ALERT_CAMPS.map(camp => (
                                    <MapMarker key={camp.code} longitude={camp.lng} latitude={camp.lat}>
                                        <MarkerContent>
                                            <div className="relative flex items-center justify-center">
                                                <div className={`w-5 h-5 rounded-full border-2 border-white/80 ${ALERT_COLOR[camp.level]}`} />
                                                <div className={`absolute w-8 h-8 rounded-full animate-ping opacity-25 ${ALERT_COLOR[camp.level].split(" ")[0]}`} />
                                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold text-white/90 whitespace-nowrap bg-bg-primary/80 px-1">{camp.code}</span>
                                            </div>
                                        </MarkerContent>
                                    </MapMarker>
                                ))}
                            </Map>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-bg-tertiary border-t border-border-default">
                            <span className="text-[8px] font-mono text-txt-disabled uppercase tracking-widest">
                                {MOCK_ALERT_CAMPS.filter(c => c.level === "critical").length} CRÍTICO &bull; {MOCK_ALERT_CAMPS.filter(c => c.level === "warning").length} ALERTA
                            </span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};
