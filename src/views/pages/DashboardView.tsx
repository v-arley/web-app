import { useEffect, useMemo, useState } from "react";
import {
    Users, Package, ClipboardList,
    AlertTriangle, CheckCircle2, XCircle,
    TrendingUp, Activity, Tent, RefreshCw, MapPin,
} from "lucide-react";
import { Map, MapMarker, MarkerContent, MarkerPopup, MapControls } from "../../components/ui/map";
import { PersonService } from "../../services/PersonService";
import { ResourceService } from "../../services/ResourceService";
import { ExplorationService } from "../../services/ExplorationService";
import { TaskService } from "../../services/TaskService";
import { CampService } from "../../services/CampService";
import type { Person } from "../../models/Person";
import type { Resource } from "../../models/Resource";
import type { Exploration } from "../../models/Exploration";
import type { Task } from "../../models/Task";
import type { Camp } from "../../models/Camp";

const personSvc = new PersonService();
const resourceSvc = new ResourceService();
const explorationSvc = new ExplorationService();
const taskSvc = new TaskService();
const campSvc = new CampService();

/* ── helpers ─────────────────────────────────────────────────────── */

function KpiCard({ label, value, sub, accent = false, loading }: {
    label: string; value: string | number; sub?: string; accent?: boolean; loading?: boolean;
}) {
    return (
        <div className={`flex flex-col gap-2 p-5 border ${accent ? "border-accent bg-bg-primary" : "border-border-default bg-bg-primary"}`}>
            <span className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-label">{label}</span>
            {loading
                ? <span className="text-3xl font-mono font-bold text-txt-disabled animate-pulse">---</span>
                : <span className={`text-3xl font-mono font-bold leading-none ${accent ? "text-accent" : "text-txt-primary"}`}>{value}</span>
            }
            {sub && <span className="text-[11px] font-mono text-txt-disabled uppercase tracking-label">{sub}</span>}
        </div>
    );
}

/* ── SVG Chart Components ────────────────────────────────────────── */

type Segment = { label: string; value: number; color: string };

function DonutChart({ segments, size = 140, strokeWidth = 18, centerLabel, centerValue }: {
    segments: Segment[]; size?: number; strokeWidth?: number; centerLabel?: string; centerValue?: string | number;
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const total = segments.reduce((s, seg) => s + seg.value, 0);
    let accumulated = 0;

    return (
        <div className="flex flex-col items-center gap-3">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-sm">
                {/* background ring */}
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
                    stroke="#242424" strokeWidth={strokeWidth} />
                {total > 0 && segments.map((seg, i) => {
                    const pct = seg.value / total;
                    const dashLen = pct * circumference;
                    const offset = circumference - accumulated * circumference + circumference * 0.25;
                    accumulated += pct;
                    return (
                        <circle key={i} cx={size / 2} cy={size / 2} r={radius} fill="none"
                            stroke={seg.color} strokeWidth={strokeWidth}
                            strokeDasharray={`${dashLen} ${circumference - dashLen}`}
                            strokeDashoffset={offset}
                            strokeLinecap="butt"
                            className="transition-all duration-700"
                        />
                    );
                })}
                {centerValue !== undefined && (
                    <>
                        <text x={size / 2} y={size / 2 - 4} textAnchor="middle" dominantBaseline="middle"
                            className="fill-txt-primary text-[22px] font-mono font-bold">{centerValue}</text>
                        {centerLabel && (
                            <text x={size / 2} y={size / 2 + 14} textAnchor="middle" dominantBaseline="middle"
                                className="fill-txt-disabled text-[10px] font-mono uppercase tracking-widest">{centerLabel}</text>
                        )}
                    </>
                )}
            </svg>
            {/* legend */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                {segments.map((seg, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <span className="w-2 h-2 shrink-0" style={{ background: seg.color }} />
                        <span className="text-[10px] font-mono text-txt-secondary uppercase tracking-label">
                            {seg.label} ({seg.value})
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function VerticalBarChart({ bars, height = 120 }: {
    bars: { label: string; value: number; color: string }[]; height?: number;
}) {
    const maxVal = Math.max(...bars.map(b => b.value), 1);
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-end justify-center gap-3" style={{ height }}>
                {bars.map((bar, i) => {
                    const barH = Math.max((bar.value / maxVal) * (height - 20), 2);
                    return (
                        <div key={i} className="flex flex-col items-center gap-1 flex-1 max-w-[60px]">
                            <span className="text-[12px] font-mono font-bold text-txt-primary">{bar.value}</span>
                            <div
                                className="w-full transition-all duration-700 min-h-[2px]"
                                style={{ height: barH, background: bar.color }}
                            />
                            <span className="text-[9px] font-mono text-txt-disabled uppercase tracking-label text-center">
                                {bar.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function HorizontalStackedBar({ segments, height = 10 }: {
    segments: Segment[]; height?: number;
}) {
    const total = segments.reduce((s, seg) => s + seg.value, 0);
    return (
        <div className="flex flex-col gap-2">
            <div className="w-full bg-bg-tertiary overflow-hidden flex" style={{ height }}>
                {total > 0 && segments.map((seg, i) => (
                    <div
                        key={i}
                        className="h-full transition-all duration-700"
                        style={{ width: `${(seg.value / total) * 100}%`, background: seg.color }}
                    />
                ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
                {segments.map((seg, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <span className="w-2 h-2 shrink-0" style={{ background: seg.color }} />
                        <span className="text-[10px] font-mono text-txt-secondary uppercase tracking-label">
                            {seg.label}: {seg.value} {total > 0 ? `(${Math.round((seg.value / total) * 100)}%)` : ""}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MiniGauge({ value, max, label, color }: {
    value: number; max: number; label: string; color: string;
}) {
    const pct = max > 0 ? (value / max) * 100 : 0;
    const radius = 36;
    const stroke = 8;
    const circumference = Math.PI * radius; // half-circle
    const filled = (pct / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-1">
            <svg width={90} height={54} viewBox="0 0 90 54">
                {/* bg arc */}
                <path d="M 9 50 A 36 36 0 0 1 81 50" fill="none" stroke="#242424" strokeWidth={stroke} strokeLinecap="round" />
                {/* value arc */}
                <path d="M 9 50 A 36 36 0 0 1 81 50" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
                    strokeDasharray={`${filled} ${circumference}`}
                    className="transition-all duration-700"
                />
                <text x="45" y="46" textAnchor="middle" dominantBaseline="middle"
                    className="fill-txt-primary text-[14px] font-mono font-bold">{Math.round(pct)}%</text>
            </svg>
            <span className="text-[10px] font-mono text-txt-disabled uppercase tracking-label">{label}</span>
        </div>
    );
}

const EXPLORE_STATE: Record<string, { label: string; color: string }> = {
    P: { label: "Pending",   color: "text-status-warning bg-status-warning/10" },
    A: { label: "Active",    color: "text-status-ok bg-status-ok/10" },
    F: { label: "Finished",  color: "text-status-info bg-status-info/10" },
    C: { label: "Cancelled", color: "text-txt-disabled bg-bg-tertiary" },
};

const PRIORITY_COLOR: Record<string, string> = {
    H: "text-status-critical",
    M: "text-status-warning",
    L: "text-status-ok",
};

export function DashboardView() {
    const [persons, setPersons] = useState<Person[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [explorations, setExplorations] = useState<Exploration[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [camps, setCamps] = useState<Camp[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    // loadAll only calls setState after the first await — safe inside useEffect
    const loadAll = async () => {
        const [pRes, rRes, eRes, tRes, cRes] = await Promise.allSettled([
            personSvc.findAll(),
            resourceSvc.findAll(),
            explorationSvc.findAll(),
            taskSvc.findAll(),
            campSvc.findAll(),
        ]);
        if (pRes.status === "fulfilled" && pRes.value.getEstado())
            setPersons(pRes.value.getResultado<Person[]>("registros") ?? []);
        if (rRes.status === "fulfilled" && rRes.value.getEstado())
            setResources(rRes.value.getResultado<Resource[]>("registros") ?? []);
        if (eRes.status === "fulfilled" && eRes.value.getEstado())
            setExplorations(eRes.value.getResultado<Exploration[]>("registros") ?? []);
        if (tRes.status === "fulfilled" && tRes.value.getEstado())
            setTasks(tRes.value.getResultado<Task[]>("registros") ?? []);
        if (cRes.status === "fulfilled" && cRes.value.getEstado())
            setCamps(cRes.value.getResultado<Camp[]>("registros") ?? []);
        setLoading(false);
        setLastRefresh(new Date());
    };

    const handleRefresh = () => {
        setLoading(true);
        void loadAll();
    };

    useEffect(() => {
        let active = true;
        Promise.allSettled([
            personSvc.findAll(),
            resourceSvc.findAll(),
            explorationSvc.findAll(),
            taskSvc.findAll(),
            campSvc.findAll(),
        ]).then(([pRes, rRes, eRes, tRes, cRes]) => {
            if (!active) return;
            if (pRes.status === "fulfilled" && pRes.value.getEstado())
                setPersons(pRes.value.getResultado<Person[]>("registros") ?? []);
            if (rRes.status === "fulfilled" && rRes.value.getEstado())
                setResources(rRes.value.getResultado<Resource[]>("registros") ?? []);
            if (eRes.status === "fulfilled" && eRes.value.getEstado())
                setExplorations(eRes.value.getResultado<Exploration[]>("registros") ?? []);
            if (tRes.status === "fulfilled" && tRes.value.getEstado())
                setTasks(tRes.value.getResultado<Task[]>("registros") ?? []);
            if (cRes.status === "fulfilled" && cRes.value.getEstado())
                setCamps(cRes.value.getResultado<Camp[]>("registros") ?? []);
            setLoading(false);
            setLastRefresh(new Date());
        });
        return () => { active = false; };
    }, []);

    /* ── derived metrics ──────────────────────────────────────── */
    const activePersons  = persons.filter(p => p.state === "A").length;
    const inactivePersons = persons.filter(p => p.state === "I").length;

    const resourcesByStatus = {
        C: resources.filter(r => r.status === "C"),
        M: resources.filter(r => r.status === "M"),
        O: resources.filter(r => r.status === "O"),
        none: resources.filter(r => !r.status),
    };
    const totalResources = resources.length;

    const explorationsByState = {
        P: explorations.filter(e => e.state === "P"),
        A: explorations.filter(e => e.state === "A"),
        F: explorations.filter(e => e.state === "F"),
        C: explorations.filter(e => e.state === "C"),
    };

    const tasksByPriority = {
        H: tasks.filter(t => t.priority === "H"),
        M: tasks.filter(t => t.priority === "M"),
        L: tasks.filter(t => t.priority === "L"),
    };

    const formatRefresh = (d: Date) =>
        d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });

    return (
        <div className="w-full h-full flex flex-col bg-[#FBFBFB] overflow-hidden">

            {/* ── Top bar ──────────────────────────────────────────── */}
            <div className="w-full bg-bg-secondary border-b border-border-default px-6 py-3 flex items-center justify-between shrink-0">
                <span className="text-[12px] font-mono font-bold text-txt-secondary uppercase tracking-label">
                    System Overview
                </span>
                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 text-[11px] font-mono text-txt-disabled hover:text-accent uppercase tracking-label transition-colors"
                >
                    <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
                    {loading ? "Loading..." : `Updated ${formatRefresh(lastRefresh)}`}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
            <div className="flex flex-col gap-4 p-4 w-full">

                {/* ── KPI Row ───────────────────────────────────────── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <KpiCard label="Active Personnel" value={activePersons} sub={`${inactivePersons} inactive`} loading={loading} />
                    <KpiCard label="Total Resources" value={totalResources} sub={`${resourcesByStatus.C.length} critical`} accent={resourcesByStatus.C.length > 0} loading={loading} />
                    <KpiCard label="Active Explorations" value={explorationsByState.A.length} sub={`${explorationsByState.P.length} pending`} accent={explorationsByState.A.length > 0} loading={loading} />
                    <KpiCard label="High Priority Tasks" value={tasksByPriority.H.length} sub={`${tasks.length} total tasks`} accent={tasksByPriority.H.length > 0} loading={loading} />
                </div>

                {/* ── MAP-CENTRIC LAYOUT ─────────────────────────────── */}
                <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr_280px] gap-4">

                    {/* ── LEFT SIDEBAR ───────────────────────────────── */}
                    <div className="flex flex-col gap-3">

                        {/* Resource donut */}
                        <div className="bg-bg-primary border border-border-default p-3 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-label">Resources</span>
                                <Package size={12} className="text-accent" />
                            </div>
                            {loading ? (
                                <span className="text-[11px] font-mono text-txt-disabled animate-pulse">Loading...</span>
                            ) : totalResources === 0 ? (
                                <span className="text-[11px] font-mono text-txt-disabled uppercase tracking-label">No resources.</span>
                            ) : (
                                <DonutChart
                                    size={110}
                                    strokeWidth={14}
                                    segments={[
                                        { label: "Critical", value: resourcesByStatus.C.length, color: "#E85D04" },
                                        { label: "Moderate", value: resourcesByStatus.M.length, color: "#FACC15" },
                                        { label: "Ok", value: resourcesByStatus.O.length, color: "#F59E0B" },
                                        ...(resourcesByStatus.none.length > 0 ? [{ label: "N/A", value: resourcesByStatus.none.length, color: "#555555" }] : []),
                                    ]}
                                    centerValue={totalResources}
                                    centerLabel="Total"
                                />
                            )}
                        </div>

                        {/* Critical resources */}
                        <div className="bg-bg-primary border border-border-default p-3 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-label">Critical Resources</span>
                                <AlertTriangle size={12} className="text-status-critical" />
                            </div>
                            {loading ? (
                                <span className="text-[11px] font-mono text-txt-disabled animate-pulse">Loading...</span>
                            ) : resourcesByStatus.C.length === 0 ? (
                                <div className="flex items-center gap-2 py-1">
                                    <CheckCircle2 size={11} className="text-status-ok" />
                                    <span className="text-[10px] font-mono text-status-ok uppercase tracking-label">All clear</span>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-1">
                                    {resourcesByStatus.C.slice(0, 4).map(r => (
                                        <div key={r.id} className="flex items-center justify-between py-1 border-b border-border-subtle last:border-0">
                                            <span className="text-[11px] font-mono font-bold text-txt-primary uppercase truncate">{r.name}</span>
                                            <span className="text-[9px] font-mono font-bold text-status-critical bg-status-critical/10 px-1.5 py-0.5 uppercase shrink-0">CRIT</span>
                                        </div>
                                    ))}
                                    {resourcesByStatus.C.length > 4 && (
                                        <span className="text-[9px] font-mono text-txt-disabled uppercase tracking-label">+{resourcesByStatus.C.length - 4} more</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Tasks bar chart */}
                        <div className="bg-bg-primary border border-border-default p-3 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-label">Tasks by Priority</span>
                                <ClipboardList size={12} className="text-accent" />
                            </div>
                            {loading ? (
                                <span className="text-[11px] font-mono text-txt-disabled animate-pulse">Loading...</span>
                            ) : tasks.length === 0 ? (
                                <span className="text-[11px] font-mono text-txt-disabled uppercase tracking-label">No tasks.</span>
                            ) : (
                                <VerticalBarChart
                                    bars={[
                                        { label: "High", value: tasksByPriority.H.length, color: "#E85D04" },
                                        { label: "Med", value: tasksByPriority.M.length, color: "#FACC15" },
                                        { label: "Low", value: tasksByPriority.L.length, color: "#F59E0B" },
                                        { label: "N/A", value: tasks.filter(t => !t.priority).length, color: "#555555" },
                                    ]}
                                    height={90}
                                />
                            )}
                        </div>

                        {/* Personnel gauges */}
                        <div className="bg-bg-primary border border-border-default p-3 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-label">Personnel</span>
                                <Users size={12} className="text-accent" />
                            </div>
                            {loading ? (
                                <span className="text-[11px] font-mono text-txt-disabled animate-pulse">Loading...</span>
                            ) : persons.length === 0 ? (
                                <span className="text-[11px] font-mono text-txt-disabled uppercase tracking-label">No personnel.</span>
                            ) : (
                                <div className="flex items-center justify-center gap-4">
                                    <MiniGauge value={activePersons} max={persons.length} label="Active" color="#F59E0B" />
                                    <MiniGauge value={inactivePersons} max={persons.length} label="Inactive" color="#6B7280" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── CENTER: MAP ────────────────────────────────── */}
                    <div className="flex flex-col gap-3">
                        <div className="bg-bg-primary border border-border-default flex flex-col flex-1 min-h-0">
                            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-default">
                                <div className="flex items-center gap-2">
                                    <MapPin size={13} className="text-accent" />
                                    <span className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-label">Camp Locations</span>
                                </div>
                                <span className="text-[11px] font-mono text-txt-disabled uppercase tracking-label">
                                    {camps.filter(c => c.location_x && c.location_y).length} mapped
                                </span>
                            </div>
                            {loading ? (
                                <div className="h-[520px] flex items-center justify-center">
                                    <span className="text-[11px] font-mono text-txt-disabled animate-pulse uppercase tracking-widest">Loading map...</span>
                                </div>
                            ) : (
                                <CampMap camps={camps} height={520} />
                            )}
                        </div>

                        {/* Exploration stacked bar below map */}
                        <div className="bg-bg-primary border border-border-default p-3 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-label">Exploration Summary</span>
                                <TrendingUp size={12} className="text-accent" />
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {(["P", "A", "F", "C"] as const).map(st => {
                                    const info = EXPLORE_STATE[st];
                                    return (
                                        <div key={st} className="flex flex-col items-center gap-1 py-2 bg-bg-secondary border border-border-subtle">
                                            <span className={`text-lg font-mono font-bold ${info.color.split(" ")[0]}`}>
                                                {explorationsByState[st].length}
                                            </span>
                                            <span className="text-[9px] font-mono text-txt-disabled uppercase tracking-label">{info.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            {!loading && explorations.length > 0 && (
                                <HorizontalStackedBar
                                    segments={[
                                        { label: "Pending", value: explorationsByState.P.length, color: "#FACC15" },
                                        { label: "Active", value: explorationsByState.A.length, color: "#F59E0B" },
                                        { label: "Finished", value: explorationsByState.F.length, color: "#38BDF8" },
                                        { label: "Cancelled", value: explorationsByState.C.length, color: "#555555" },
                                    ]}
                                    height={10}
                                />
                            )}
                        </div>
                    </div>

                    {/* ── RIGHT SIDEBAR ──────────────────────────────── */}
                    <div className="flex flex-col gap-3">

                        {/* System Activity */}
                        <div className="bg-bg-primary border border-border-default p-3 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-label">Activity</span>
                                <Activity size={12} className="text-status-ok" />
                            </div>
                            <div className="flex flex-col gap-1">
                                {[
                                    { label: "Cancelled Expl.", value: explorationsByState.C.length, icon: <XCircle size={10} className="text-txt-disabled" /> },
                                    { label: "Finished Expl.", value: explorationsByState.F.length, icon: <CheckCircle2 size={10} className="text-status-info" /> },
                                    { label: "Consumable Res.", value: resources.filter(r => r.consumable).length, icon: <Package size={10} className="text-status-warning" /> },
                                    { label: "Inactive Res.", value: resources.filter(r => r.state === "I").length, icon: <XCircle size={10} className="text-txt-disabled" /> },
                                ].map(item => (
                                    <div key={item.label} className="flex items-center justify-between py-1 border-b border-border-subtle last:border-0 gap-1">
                                        <div className="flex items-center gap-1.5">
                                            {item.icon}
                                            <span className="text-[10px] font-mono text-txt-secondary uppercase tracking-label">{item.label}</span>
                                        </div>
                                        <span className="text-[12px] font-mono font-bold text-txt-primary">{loading ? "—" : item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            </div>
        </div>
    );
}

/* ── Camp Map Component ─────────────────────────────────────────── */

function CampMap({ camps, height = 400 }: { camps: Camp[]; height?: number }) {
    const mappedCamps = useMemo(
        () => camps.filter(c => c.location_x != null && c.location_y != null && (c.location_x !== 0 || c.location_y !== 0)),
        [camps],
    );

    const center = useMemo<[number, number]>(() => {
        if (mappedCamps.length === 0) return [-74.0, 4.6]; // default
        const avgLng = mappedCamps.reduce((s, c) => s + c.location_x, 0) / mappedCamps.length;
        const avgLat = mappedCamps.reduce((s, c) => s + c.location_y, 0) / mappedCamps.length;
        return [avgLng, avgLat];
    }, [mappedCamps]);

    if (mappedCamps.length === 0) {
        return (
            <div style={{ height }} className="flex items-center justify-center">
                <span className="text-[11px] font-mono text-txt-disabled uppercase tracking-widest">No camp coordinates available</span>
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
            <MapControls position="top-right" showZoom showCompass={false} />
            {mappedCamps.map((camp) => (
                <MapMarker
                    key={camp.id ?? camp.code}
                    longitude={camp.location_x}
                    latitude={camp.location_y}
                >
                    <MarkerContent>
                        <div className="relative flex items-center justify-center">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                                camp.active
                                    ? "border-accent bg-accent/80 shadow-[0_0_8px_rgba(232,93,4,0.5)]"
                                    : "border-txt-disabled bg-bg-tertiary"
                            }`} />
                            <div className={`absolute w-7 h-7 rounded-full animate-ping opacity-30 ${
                                camp.active ? "bg-accent" : "bg-txt-disabled"
                            }`} />
                        </div>
                    </MarkerContent>
                    <MarkerPopup className="!p-0 !bg-transparent !border-none !shadow-none" closeButton={false}>
                        <div className="bg-bg-primary border border-border-accent p-3 min-w-[180px] font-mono">
                            <div className="flex items-center gap-2 mb-2">
                                <Tent size={12} className="text-accent" />
                                <span className="text-[11px] font-bold text-txt-primary uppercase tracking-wide">{camp.code}</span>
                            </div>
                            {camp.description && (
                                <p className="text-[10px] text-txt-secondary mb-2 leading-relaxed">{camp.description}</p>
                            )}
                            <div className="flex flex-col gap-1 border-t border-border-default pt-2">
                                <div className="flex justify-between">
                                    <span className="text-[10px] text-txt-disabled uppercase tracking-label">Capacity</span>
                                    <span className="text-[11px] text-txt-primary font-bold">{camp.capacity}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[10px] text-txt-disabled uppercase tracking-label">Status</span>
                                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 ${camp.active ? "text-status-ok bg-status-ok/10" : "text-txt-disabled bg-bg-tertiary"}`}>
                                        {camp.active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[10px] text-txt-disabled uppercase tracking-label">Coords</span>
                                    <span className="text-[10px] text-txt-secondary">{camp.location_y.toFixed(4)}, {camp.location_x.toFixed(4)}</span>
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
