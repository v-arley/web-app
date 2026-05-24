import { HeartPulse } from "lucide-react";
import type { HealthEntry } from "../utils/global-dashboard.types";
import { SectionHeader } from "./SectionHeader";

const SEGMENT_COLORS = [
    "var(--color-status-ok)",
    "var(--color-status-info)",
    "var(--color-status-warning)",
    "var(--color-status-critical)",
    "var(--color-accent)",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
];

const RADIUS = 58;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = 72;
const STROKE_WIDTH = 18;

export function HealthConditionPanel({ healthConditions }: { healthConditions: HealthEntry[] }) {
    const total = healthConditions.reduce((s, e) => s + e.count, 0);

    const segments = (() => {
        let cumulativeAngle = 0;
        return healthConditions.map((entry, i) => {
            const ratio = total > 0 ? entry.count / total : 0;
            const segmentLength = ratio * CIRCUMFERENCE;
            const startAngle = cumulativeAngle - 90;
            cumulativeAngle += ratio * 360;
            return {
                ...entry,
                ratio,
                segmentLength,
                startAngle,
                color: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
            };
        });
    })();

    const hasCritical = healthConditions.some((e) => {
        const lbl = e.label.toLowerCase();
        return lbl !== "sin condición" && lbl !== "sin condicion" && e.count > 0;
    });

    return (
        <section className="bg-bg-primary border border-border-default shadow-lg p-1 text-left">
            <SectionHeader
                title="Condición de Salud"
                subtitle="Distribución del estado médico del personal"
                icon={<HeartPulse size={18} />}
                tag={hasCritical ? "CON CONDICIONES" : "NOMINAL"}
                tone={hasCritical ? "fire" : "green"}
            />

            <div className="p-4">
                {total === 0 ? (
                    <div className="text-[10px] font-mono text-txt-disabled text-center py-6 uppercase tracking-widest">
                        Sin datos de salud disponibles
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {/* Donut SVG */}
                        <div className="flex justify-center">
                            <svg
                                width={CENTER * 2}
                                height={CENTER * 2}
                                viewBox={`0 0 ${CENTER * 2} ${CENTER * 2}`}
                                aria-label="Gráfico de condición de salud"
                            >
                                {/* Background ring */}
                                <circle
                                    cx={CENTER}
                                    cy={CENTER}
                                    r={RADIUS}
                                    fill="none"
                                    stroke="var(--color-border-default)"
                                    strokeWidth={STROKE_WIDTH}
                                    opacity={0.3}
                                />
                                {segments.map((seg) => (
                                    <circle
                                        key={seg.label}
                                        cx={CENTER}
                                        cy={CENTER}
                                        r={RADIUS}
                                        fill="none"
                                        stroke={seg.color}
                                        strokeWidth={STROKE_WIDTH}
                                        strokeDasharray={`${seg.segmentLength} ${CIRCUMFERENCE - seg.segmentLength}`}
                                        strokeDashoffset={0}
                                        transform={`rotate(${seg.startAngle} ${CENTER} ${CENTER})`}
                                        strokeLinecap="butt"
                                        opacity={0.9}
                                    />
                                ))}
                                {/* Center label */}
                                <text
                                    x={CENTER}
                                    y={CENTER - 6}
                                    textAnchor="middle"
                                    className="font-mono"
                                    fontSize="18"
                                    fontWeight="bold"
                                    fill="var(--color-txt-primary)"
                                    fontFamily="monospace"
                                >
                                    {total}
                                </text>
                                <text
                                    x={CENTER}
                                    y={CENTER + 10}
                                    textAnchor="middle"
                                    fontSize="7"
                                    fontWeight="bold"
                                    fill="var(--color-txt-disabled)"
                                    fontFamily="monospace"
                                    letterSpacing="1.5"
                                >
                                    PERSONAS
                                </text>
                            </svg>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-col gap-1.5">
                            {segments.map((seg) => (
                                <div
                                    key={seg.label}
                                    className="flex items-center justify-between text-[9px] font-mono uppercase tracking-widest"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span
                                            className="w-2.5 h-2.5 rounded-sm shrink-0"
                                            style={{ backgroundColor: seg.color }}
                                        />
                                        <span className="text-txt-secondary truncate" title={seg.label}>
                                            {seg.label.length > 20 ? `${seg.label.slice(0, 20)}…` : seg.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 ml-2">
                                        <span className="text-txt-disabled">
                                            {Math.round(seg.ratio * 100)}%
                                        </span>
                                        <span className="font-bold text-txt-primary tabular-nums">
                                            {seg.count}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
