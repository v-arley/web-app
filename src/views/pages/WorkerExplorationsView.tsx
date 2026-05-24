import {
    AlertTriangle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Clock,
    Compass,
    Map,
    RefreshCw,
    Search,
    ShieldAlert,
    UserCheck,
    X,
} from "lucide-react";
import { useState } from "react";
import { useWorkerExplorations } from "../../hooks/useWorkerExplorations";
import type { Exploration } from "../../models/Exploration";

function formatDate(value?: string | Date | null) {
    if (!value) return "N/A";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("es-CR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

function formatDateTime(value?: string | Date | null) {
    if (!value) return "N/A";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleString("es-CR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getDepartureDate(exploration: Exploration) {
    return exploration.departureDate ?? exploration.departure_date;
}

function getReturnDate(exploration: Exploration) {
    return exploration.estimatedReturnDate ?? exploration.estimated_return_date;
}

function getDuration(exploration: Exploration) {
    return exploration.durationDays ?? exploration.duration_days;
}

function getRiskLevel(exploration: Exploration) {
    return exploration.riskLevel ?? exploration.risk_level;
}

function getCampId(exploration: Exploration) {
    return exploration.campId ?? exploration.camp_id;
}

function getStateLabel(exploration: Exploration) {
    if (exploration.stateLabel) return exploration.stateLabel;

    if (exploration.state === "P") return "Pending";
    if (exploration.state === "A") return "Active";
    if (exploration.state === "F") return "Finished";
    if (exploration.state === "C") return "Cancelled";

    return "N/A";
}

function getRiskLabel(exploration: Exploration) {
    if (exploration.riskLevelLabel) return exploration.riskLevelLabel;

    const risk = getRiskLevel(exploration);

    if (risk === "L") return "Low";
    if (risk === "M") return "Medium";
    if (risk === "H") return "High";

    return "N/A";
}

function getStateStyle(state?: string) {
    if (state === "A") {
        return "bg-[#E85D04]/10 border-[#E85D04]/60 text-[#E85D04]";
    }

    if (state === "F") {
        return "bg-[#22C55E]/10 border-[#22C55E]/50 text-[#22C55E]";
    }

    if (state === "C") {
        return "bg-[#EF4444]/10 border-[#EF4444]/50 text-[#EF4444]";
    }

    return "bg-[#FACC15]/10 border-[#FACC15]/50 text-[#FACC15]";
}

function getRiskStyle(risk?: string) {
    if (risk === "H") {
        return "bg-[#EF4444]/10 border-[#EF4444]/60 text-[#EF4444]";
    }

    if (risk === "M") {
        return "bg-[#FACC15]/10 border-[#FACC15]/50 text-[#FACC15]";
    }

    if (risk === "L") {
        return "bg-[#22C55E]/10 border-[#22C55E]/50 text-[#22C55E]";
    }

    return "bg-[#111111] border-[#3a3a3a] text-[#6B7280]";
}

function ExplorationCard({
    exploration,
    expanded,
    onToggle,
}: {
    exploration: Exploration;
    expanded: boolean;
    onToggle: () => void;
}) {
    const risk = getRiskLevel(exploration);
    const duration = getDuration(exploration);

    return (
        <article className="border border-[#3a3a3a] bg-[#1a1a1a] overflow-hidden hover:border-[#E85D04]/50 transition-colors shadow-[0_0_18px_rgba(0,0,0,0.35)]">
            <button
                type="button"
                onClick={onToggle}
                className="w-full p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-[#242424]/60 transition-colors text-left"
            >
                <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 font-mono">
                        <span className="text-[#E85D04] font-bold text-xs uppercase tracking-label">
                            {exploration.code || `EXP-${exploration.id}`}
                        </span>

                        <span className="text-[#6B7280]">//</span>

                        <span className="text-white font-bold text-sm uppercase tracking-label">
                            {exploration.name || "Exploración sin nombre"}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#C0C0C0] font-mono">
                        <span className="flex items-center gap-1">
                            <UserCheck size={14} className="text-[#38BDF8]" />
                            Rol:{" "}
                            <strong className="text-white font-medium">
                                {exploration.roleName || "N/A"}
                            </strong>
                        </span>

                        <span className="text-[#3a3a3a] font-bold">•</span>

                        <span className="flex items-center gap-1">
                            <Clock size={14} className="text-[#FACC15]" />
                            Duración:{" "}
                            <strong className="text-white font-medium">
                                {duration ? `${duration} día(s)` : "N/A"}
                            </strong>
                        </span>

                        <span className="text-[#3a3a3a] font-bold">•</span>

                        <span className="flex items-center gap-1">
                            <Map size={14} className="text-[#E85D04]" />
                            Campamento:{" "}
                            <strong className="text-[#38BDF8] font-medium">
                                {getCampId(exploration) ?? "N/A"}
                            </strong>
                        </span>
                    </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                    <span
                        className={`px-2.5 py-0.5 tracking-label font-mono text-[9px] border uppercase font-bold ${getRiskStyle(
                            risk,
                        )}`}
                    >
                        Riesgo {getRiskLabel(exploration)}
                    </span>

                    <span
                        className={`px-2.5 py-0.5 tracking-label font-mono text-[9px] border uppercase font-bold ${getStateStyle(
                            exploration.state,
                        )}`}
                    >
                        {getStateLabel(exploration)}
                    </span>

                    <span className="p-1 text-[#C0C0C0]">
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                </div>
            </button>

            {expanded && (
                <div className="border-t border-[#3a3a3a] bg-[#111111] p-5 font-mono text-xs text-[#C0C0C0] space-y-4">
                    <div className="p-3 bg-[#1a1a1a] border border-[#3a3a3a] leading-normal">
                        <span className="text-[#6B7280] text-[10px] uppercase block mb-1 font-bold tracking-label">
                            Objetivo
                        </span>

                        <p className="text-white text-xs leading-relaxed">
                            {exploration.objective || "Sin objetivo registrado."}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border border-[#3a3a3a] p-3 bg-[#1a1a1a]">
                            <span className="text-[#6B7280] text-[9px] block uppercase tracking-label">
                                Calendario
                            </span>

                            <div className="mt-2 space-y-2 font-medium text-white">
                                <p className="flex items-center justify-between gap-3 border-b border-[#3a3a3a] pb-1">
                                    <span className="text-[#6B7280]">Asignación</span>
                                    <span className="text-[#38BDF8]">
                                        {formatDateTime(exploration.assignedAt)}
                                    </span>
                                </p>

                                <p className="flex items-center justify-between gap-3 border-b border-[#3a3a3a] pb-1">
                                    <span className="text-[#6B7280]">Salida</span>
                                    <span>{formatDateTime(getDepartureDate(exploration))}</span>
                                </p>

                                <p className="flex items-center justify-between gap-3">
                                    <span className="text-[#6B7280]">Retorno</span>
                                    <span>{formatDateTime(getReturnDate(exploration))}</span>
                                </p>
                            </div>
                        </div>

                        <div className="border border-[#3a3a3a] p-3 bg-[#1a1a1a] md:col-span-2">
                            <span className="text-[#6B7280] text-[9px] block uppercase tracking-label">
                                Notas
                            </span>

                            <p className="mt-2 text-xs text-[#FACC15] bg-[#FACC15]/10 p-3 border border-[#FACC15]/30 leading-relaxed">
                                {exploration.notes || "Sin notas registradas."}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="border border-[#3a3a3a] bg-[#1a1a1a] p-3">
                            <span className="text-[#6B7280] block text-[9px] uppercase">
                                ID
                            </span>
                            <strong className="text-[#38BDF8]">#{exploration.id}</strong>
                        </div>

                        <div className="border border-[#3a3a3a] bg-[#1a1a1a] p-3">
                            <span className="text-[#6B7280] block text-[9px] uppercase">
                                Estado
                            </span>
                            <strong className="text-white">{getStateLabel(exploration)}</strong>
                        </div>

                        <div className="border border-[#3a3a3a] bg-[#1a1a1a] p-3">
                            <span className="text-[#6B7280] block text-[9px] uppercase">
                                Riesgo
                            </span>
                            <strong className="text-white">{getRiskLabel(exploration)}</strong>
                        </div>

                        <div className="border border-[#3a3a3a] bg-[#1a1a1a] p-3">
                            <span className="text-[#6B7280] block text-[9px] uppercase">
                                Creada
                            </span>
                            <strong className="text-white">
                                {formatDate(exploration.createdAt)}
                            </strong>
                        </div>
                    </div>
                </div>
            )}
        </article>
    );
}

export function WorkerExplorationsView() {
    const {
        data,
        page,
        setPage,
        name,
        setName,
        state,
        setState,
        riskLevel,
        setRiskLevel,
        loading,
        error,
        reload,
        clearFilters,
    } = useWorkerExplorations();

    const [expandedId, setExpandedId] = useState<number | null>(null);

    function toggleExpand(id?: number) {
        if (!id) return;
        setExpandedId((current) => (current === id ? null : id));
    }

    return (
        <div className="w-full h-full flex flex-col bg-[#111111] overflow-hidden">
            <div className="w-full bg-[#242424] border-b border-[#3a3a3a] px-6 py-3 flex items-center justify-between shrink-0">
                <div className="flex flex-col">
                    <span className="text-[12px] font-mono font-bold text-[#C0C0C0] uppercase tracking-label">
                        Exploraciones
                    </span>
                    <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-label">
                        Worker exploration registry / assigned expeditions
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => void reload()}
                    className="flex items-center gap-2 text-[11px] font-mono text-[#6B7280] hover:text-[#E85D04] uppercase tracking-label transition-colors"
                >
                    <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                    {loading ? "Loading..." : "Refresh"}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
                <div className="p-4 space-y-4">
                    <section className="border border-[#E85D04]/45 bg-[#1a1a1a] p-5 shadow-[0_0_18px_rgba(232,93,4,0.1)]">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <span className="text-[10px] text-[#6B7280] font-mono tracking-label block uppercase">
                                    Reconnaissance directory // bitácora de expediciones
                                </span>

                                <h2 className="text-lg font-mono font-bold text-white uppercase flex items-center gap-2 mt-1">
                                    <Compass className="text-[#E85D04]" size={20} />
                                    <span>Mis misiones de exploración exterior</span>
                                </h2>
                            </div>

                            <div className="border border-[#38BDF8]/50 bg-[#38BDF8]/10 px-4 py-2 text-[#38BDF8] font-mono text-xs uppercase tracking-label font-bold">
                                Total asignadas: {data.total}
                            </div>
                        </div>
                    </section>

                    <section className="border border-[#3a3a3a] bg-[#1a1a1a] p-4 font-mono text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                                <label className="text-[#6B7280] block mb-1 uppercase text-[9px]">
                                    Buscar expedición
                                </label>

                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Nombre de exploración"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        className="w-full bg-[#111111] border border-[#3a3a3a] focus:border-[#E85D04] p-3 pl-9 outline-none text-white text-xs placeholder:text-[#6B7280]"
                                    />

                                    <Search
                                        size={15}
                                        className="absolute left-3 top-3 text-[#6B7280]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[#6B7280] block mb-1 uppercase text-[9px]">
                                    Estado
                                </label>

                                <select
                                    value={state}
                                    onChange={(event) => setState(event.target.value)}
                                    className="w-full bg-[#111111] border border-[#3a3a3a] focus:border-[#E85D04] p-3 outline-none text-white text-xs"
                                >
                                    <option value="">Todos</option>
                                    <option value="P">Pendientes</option>
                                    <option value="A">Activas</option>
                                    <option value="F">Finalizadas</option>
                                    <option value="C">Canceladas</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[#6B7280] block mb-1 uppercase text-[9px]">
                                    Riesgo
                                </label>

                                <select
                                    value={riskLevel}
                                    onChange={(event) => setRiskLevel(event.target.value)}
                                    className="w-full bg-[#111111] border border-[#3a3a3a] focus:border-[#E85D04] p-3 outline-none text-white text-xs"
                                >
                                    <option value="">Todos</option>
                                    <option value="L">Bajo</option>
                                    <option value="M">Medio</option>
                                    <option value="H">Alto</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="px-3 py-2 border border-[#3a3a3a] text-[#C0C0C0] hover:border-[#E85D04] hover:text-[#E85D04] uppercase tracking-label transition-colors"
                            >
                                <X size={13} className="inline mr-1" />
                                Limpiar filtros
                            </button>
                        </div>
                    </section>

                    {error && (
                        <div className="border border-[#E85D04] bg-[#E85D04]/10 text-[#E85D04] px-4 py-3 font-mono text-xs uppercase tracking-label flex items-center gap-2">
                            <AlertTriangle size={15} />
                            {error}
                        </div>
                    )}

                    <section className="space-y-4">
                        {loading && (
                            <div className="border border-[#3a3a3a] bg-[#1a1a1a] p-6 text-[#6B7280] font-mono text-xs uppercase tracking-label">
                                Loading exploration data...
                            </div>
                        )}

                        {!loading && data.items.length === 0 && (
                            <div className="border border-[#FACC15]/40 bg-[#FACC15]/10 p-8 text-center space-y-2 font-mono">
                                <ShieldAlert size={28} className="text-[#FACC15] mx-auto" />
                                <p className="text-sm text-[#FACC15] uppercase">
                                    No se hallaron exploraciones con los filtros actuales.
                                </p>
                            </div>
                        )}

                        {!loading &&
                            data.items.map((exploration) => (
                                <ExplorationCard
                                    key={exploration.id}
                                    exploration={exploration}
                                    expanded={expandedId === exploration.id}
                                    onToggle={() => toggleExpand(exploration.id)}
                                />
                            ))}
                    </section>

                    <section className="p-4 border border-[#3a3a3a] bg-[#1a1a1a] flex justify-between items-center font-mono text-xs">
                        <span className="text-[10px] text-[#6B7280] uppercase tracking-label">
                            Página {data.page} de {data.totalPages || 1} // Total: {data.total}
                        </span>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page <= 1}
                                className="px-3 py-1.5 text-xs border border-[#3a3a3a] hover:border-[#E85D04] disabled:opacity-40 disabled:hover:border-[#3a3a3a] text-white transition-colors font-mono uppercase flex items-center gap-1"
                            >
                                <ChevronLeft size={13} />
                                Anterior
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setPage(Math.min(data.totalPages || 1, page + 1))
                                }
                                disabled={page >= (data.totalPages || 1)}
                                className="px-3 py-1.5 text-xs border border-[#3a3a3a] hover:border-[#E85D04] disabled:opacity-40 disabled:hover:border-[#3a3a3a] text-white transition-colors font-mono uppercase flex items-center gap-1"
                            >
                                Siguiente
                                <ChevronRight size={13} />
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}