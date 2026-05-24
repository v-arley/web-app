import { AlertTriangle, Briefcase } from "lucide-react";
import type { ProfessionEntry } from "../utils/global-dashboard.types";
import { SectionHeader } from "./SectionHeader";

const DEFICIT_THRESHOLD_RATIO = 0.75;

export function ProfessionDistributionPanel({
    professionDistribution,
    deficitProfessions,
}: {
    professionDistribution: ProfessionEntry[];
    deficitProfessions: ProfessionEntry[];
}) {
    const maxCount = Math.max(...professionDistribution.map((e) => e.count), 1);
    const avgCount =
        professionDistribution.length > 0
            ? professionDistribution.reduce((s, e) => s + e.count, 0) / professionDistribution.length
            : 0;

    const hasDeficit = deficitProfessions.length > 0;

    return (
        <section className="bg-bg-primary border border-border-default shadow-lg p-1 text-left">
            <SectionHeader
                title="Distribución por Profesión"
                subtitle="Personal registrado por especialidad"
                icon={<Briefcase size={18} />}
                tag={hasDeficit ? `${deficitProfessions.length} DÉFICIT` : "COBERTURA OK"}
                tone={hasDeficit ? "fire" : "green"}
            />

            <div className="p-4 flex flex-col gap-2">
                {professionDistribution.length === 0 ? (
                    <div className="text-[10px] font-mono text-txt-disabled text-center py-6 uppercase tracking-widest">
                        Sin datos de profesión disponibles
                    </div>
                ) : (
                    professionDistribution.map((entry) => {
                        const widthPct = (entry.count / maxCount) * 100;
                        const isDeficit = entry.count < avgCount * DEFICIT_THRESHOLD_RATIO;
                        return (
                            <div key={entry.label} className="flex flex-col gap-0.5">
                                <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-widest">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        {isDeficit && (
                                            <AlertTriangle
                                                size={8}
                                                className="text-status-warning shrink-0"
                                            />
                                        )}
                                        <span
                                            className={`truncate ${isDeficit ? "text-status-warning" : "text-txt-secondary"}`}
                                            title={entry.label}
                                        >
                                            {entry.label.length > 22
                                                ? `${entry.label.slice(0, 22)}…`
                                                : entry.label}
                                        </span>
                                    </div>
                                    <span
                                        className={`ml-2 shrink-0 font-bold tabular-nums ${isDeficit ? "text-status-warning" : "text-accent"}`}
                                    >
                                        {entry.count}
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-bg-tertiary rounded-sm overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-700 rounded-sm ${
                                            isDeficit
                                                ? "bg-status-warning/70 shadow-[0_0_6px_rgba(234,179,8,0.4)]"
                                                : "bg-accent shadow-[0_0_6px_rgba(232,93,4,0.35)]"
                                        }`}
                                        style={{ width: `${widthPct}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })
                )}

                {hasDeficit && (
                    <div className="mt-3 px-3 py-2 border font-mono text-[9px] uppercase tracking-wider leading-relaxed bg-status-warning/10 border-status-warning/20 text-status-warning">
                        ALERTA: {deficitProfessions.length} profesión(es) con déficit de personal detectada(s).
                    </div>
                )}
            </div>
        </section>
    );
}
