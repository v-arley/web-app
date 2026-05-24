import { ArrowRightLeft, CalendarCheck, CalendarX, Clock, Users } from "lucide-react";
import type { DemographicsData, PopulationCapacity, WeeklyAdmissions } from "../utils/global-dashboard.types";
import { SectionHeader } from "./SectionHeader";

export function DemographicsPanel({
    demographics,
    weeklyAdmissions,
    populationCapacity,
    activeTemporalCount,
}: {
    demographics: DemographicsData;
    weeklyAdmissions: WeeklyAdmissions;
    populationCapacity: PopulationCapacity;
    activeTemporalCount: number;
}) {
    const { avgAge, maleCount, femaleCount, maleRatio, femaleRatio } = demographics;
    const { accepted, rejected, total: weeklyTotal } = weeklyAdmissions;
    const { totalPopulation, totalCapacity, percentUsed } = populationCapacity;

    const capacityTone =
        percentUsed >= 90 ? "text-status-critical" : percentUsed >= 70 ? "text-status-warning" : "text-status-ok";

    return (
        <section className="bg-bg-primary border border-border-default shadow-lg p-1 text-left">
            <SectionHeader
                title="Demografía y Admisiones"
                subtitle="Estadísticas de población y solicitudes semanales"
                icon={<Users size={18} />}
                tag="RESUMEN"
                tone="blue"
            />

            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Población vs Capacidad */}
                <div className="flex flex-col gap-2 p-3 bg-bg-tertiary/40 border border-border-default/50 hover:border-accent/30 transition-all col-span-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold text-txt-disabled uppercase tracking-widest">
                            Población / Capacidad
                        </span>
                        <Users size={12} className="text-txt-disabled opacity-50" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-mono font-bold text-txt-primary tabular-nums">
                            {totalPopulation.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-mono text-txt-disabled">
                            / {totalCapacity.toLocaleString()}
                        </span>
                        <span className={`ml-auto text-sm font-mono font-bold tabular-nums ${capacityTone}`}>
                            {percentUsed}%
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-bg-tertiary rounded-sm overflow-hidden">
                        <div
                            className={`h-full transition-all duration-700 rounded-sm ${
                                percentUsed >= 90
                                    ? "bg-status-critical shadow-[0_0_6px_rgba(239,68,68,0.4)]"
                                    : percentUsed >= 70
                                      ? "bg-status-warning"
                                      : "bg-status-ok shadow-[0_0_6px_rgba(34,197,94,0.3)]"
                            }`}
                            style={{ width: `${Math.min(percentUsed, 100)}%` }}
                        />
                    </div>
                    <span className="text-[8px] font-mono text-txt-disabled uppercase tracking-widest">
                        {totalCapacity - totalPopulation > 0
                            ? `${(totalCapacity - totalPopulation).toLocaleString()} plazas disponibles`
                            : "Capacidad al límite"}
                    </span>
                </div>

                {/* Edad promedio */}
                <div className="flex flex-col gap-1 p-3 bg-bg-tertiary/40 border border-border-default/50 hover:border-status-info/30 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold text-txt-disabled uppercase tracking-widest">
                            Edad Promedio
                        </span>
                        <Clock size={11} className="text-txt-disabled opacity-50" />
                    </div>
                    <span className="text-2xl font-mono font-bold text-status-info tabular-nums">
                        {avgAge}
                    </span>
                    <span className="text-[8px] font-mono text-txt-disabled uppercase tracking-widest">años</span>
                </div>

                {/* Reasignaciones temporales */}
                <div className="flex flex-col gap-1 p-3 bg-bg-tertiary/40 border border-border-default/50 hover:border-accent/30 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold text-txt-disabled uppercase tracking-widest">
                            Reasig. Temp.
                        </span>
                        <ArrowRightLeft size={11} className="text-txt-disabled opacity-50" />
                    </div>
                    <span
                        className={`text-2xl font-mono font-bold tabular-nums ${activeTemporalCount > 0 ? "text-accent" : "text-txt-primary"}`}
                    >
                        {String(activeTemporalCount).padStart(2, "0")}
                    </span>
                    <span className="text-[8px] font-mono text-txt-disabled uppercase tracking-widest">
                        activas
                    </span>
                </div>

                {/* Ratio hombre / mujer */}
                <div className="flex flex-col gap-2 p-3 bg-bg-tertiary/40 border border-border-default/50 hover:border-status-ok/30 transition-all col-span-2">
                    <span className="text-[9px] font-mono font-bold text-txt-disabled uppercase tracking-widest">
                        Ratio Hombre / Mujer
                    </span>
                    <div className="flex items-center gap-3 text-[10px] font-mono font-bold uppercase tracking-widest">
                        <span className="text-status-info">{maleCount} H</span>
                        <span className="text-txt-disabled">/</span>
                        <span className="text-status-warning">{femaleCount} M</span>
                        {demographics.totalPeople > 0 && (
                            <span className="ml-auto text-txt-disabled text-[8px]">
                                {Math.round(maleRatio * 100)}% / {Math.round(femaleRatio * 100)}%
                            </span>
                        )}
                    </div>
                    <div className="h-2 w-full bg-bg-tertiary rounded-sm overflow-hidden flex">
                        <div
                            className="h-full bg-status-info transition-all duration-700"
                            style={{ width: `${Math.round(maleRatio * 100)}%` }}
                        />
                        <div
                            className="h-full bg-status-warning transition-all duration-700"
                            style={{ width: `${Math.round(femaleRatio * 100)}%` }}
                        />
                    </div>
                </div>

                {/* Admisiones esta semana */}
                <div className="flex flex-col gap-2 p-3 bg-bg-tertiary/40 border border-border-default/50 col-span-2">
                    <span className="text-[9px] font-mono font-bold text-txt-disabled uppercase tracking-widest">
                        Admisiones Esta Semana
                        <span className="ml-2 text-txt-disabled font-normal">(total: {weeklyTotal})</span>
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-0.5 p-2 bg-status-ok/10 border border-status-ok/20 hover:border-status-ok/40 transition-all">
                            <div className="flex items-center justify-between">
                                <span className="text-[8px] font-mono font-bold text-status-ok uppercase tracking-widest">
                                    Aceptadas
                                </span>
                                <CalendarCheck size={10} className="text-status-ok opacity-70" />
                            </div>
                            <span className="text-xl font-mono font-bold text-status-ok tabular-nums">
                                {String(accepted).padStart(2, "0")}
                            </span>
                        </div>
                        <div className="flex flex-col gap-0.5 p-2 bg-status-critical/10 border border-status-critical/20 hover:border-status-critical/40 transition-all">
                            <div className="flex items-center justify-between">
                                <span className="text-[8px] font-mono font-bold text-status-critical uppercase tracking-widest">
                                    Rechazadas
                                </span>
                                <CalendarX size={10} className="text-status-critical opacity-70" />
                            </div>
                            <span className="text-xl font-mono font-bold text-status-critical tabular-nums">
                                {String(rejected).padStart(2, "0")}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
