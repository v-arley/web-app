export type Segment = {
    label: string;
    value: number;
    color: string;
};

type DonutChartProps = {
    segments: Segment[];
    size?: number;
    strokeWidth?: number;
    centerLabel?: string;
    centerValue?: string | number;
};

export function DonutChart({
    segments,
    size = 140,
    strokeWidth = 18,
    centerLabel,
    centerValue,
}: DonutChartProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const total = segments.reduce((s, seg) => s + seg.value, 0);
    let accumulated = 0;

    return (
        <div className="flex flex-col items-center gap-3">
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="drop-shadow-sm"
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#242424"
                    strokeWidth={strokeWidth}
                />

                {total > 0 &&
                    segments.map((seg, i) => {
                        const pct = seg.value / total;
                        const dashLen = pct * circumference;
                        const offset =
                            circumference -
                            accumulated * circumference +
                            circumference * 0.25;

                        accumulated += pct;

                        return (
                            <circle
                                key={i}
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="none"
                                stroke={seg.color}
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${dashLen} ${circumference - dashLen}`}
                                strokeDashoffset={offset}
                                strokeLinecap="butt"
                                className="transition-all duration-700"
                            />
                        );
                    })}

                {centerValue !== undefined && (
                    <>
                        <text
                            x={size / 2}
                            y={size / 2 - 4}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-txt-primary text-[22px] font-mono font-bold"
                        >
                            {centerValue}
                        </text>

                        {centerLabel && (
                            <text
                                x={size / 2}
                                y={size / 2 + 14}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="fill-txt-disabled text-[10px] font-mono uppercase tracking-widest"
                            >
                                {centerLabel}
                            </text>
                        )}
                    </>
                )}
            </svg>

            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                {segments.map((seg, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <span
                            className="w-2 h-2 shrink-0"
                            style={{ background: seg.color }}
                        />

                        <span className="text-[10px] font-mono text-txt-secondary uppercase tracking-label">
                            {seg.label} ({seg.value})
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

type VerticalBarChartProps = {
    bars: {
        label: string;
        value: number;
        color: string;
    }[];
    height?: number;
};

export function VerticalBarChart({
    bars,
    height = 120,
}: VerticalBarChartProps) {
    const maxVal = Math.max(...bars.map((b) => b.value), 1);

    return (
        <div className="flex flex-col gap-2">
            <div
                className="flex items-end justify-center gap-3"
                style={{ height }}
            >
                {bars.map((bar, i) => {
                    const barH = Math.max(
                        (bar.value / maxVal) * (height - 20),
                        2,
                    );

                    return (
                        <div
                            key={i}
                            className="flex flex-col items-center gap-1 flex-1 max-w-[60px]"
                        >
                            <span className="text-[12px] font-mono font-bold text-txt-primary">
                                {bar.value}
                            </span>

                            <div
                                className="w-full transition-all duration-700 min-h-[2px]"
                                style={{
                                    height: barH,
                                    background: bar.color,
                                }}
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

type HorizontalStackedBarProps = {
    segments: Segment[];
    height?: number;
};

export function HorizontalStackedBar({
    segments,
    height = 10,
}: HorizontalStackedBarProps) {
    const total = segments.reduce((s, seg) => s + seg.value, 0);

    return (
        <div className="flex flex-col gap-2">
            <div
                className="w-full bg-bg-tertiary overflow-hidden flex"
                style={{ height }}
            >
                {total > 0 &&
                    segments.map((seg, i) => (
                        <div
                            key={i}
                            className="h-full transition-all duration-700"
                            style={{
                                width: `${(seg.value / total) * 100}%`,
                                background: seg.color,
                            }}
                        />
                    ))}
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1">
                {segments.map((seg, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <span
                            className="w-2 h-2 shrink-0"
                            style={{ background: seg.color }}
                        />

                        <span className="text-[10px] font-mono text-txt-secondary uppercase tracking-label">
                            {seg.label}: {seg.value}{" "}
                            {total > 0
                                ? `(${Math.round((seg.value / total) * 100)}%)`
                                : ""}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

type MiniGaugeProps = {
    value: number;
    max: number;
    label: string;
    color: string;
};

export function MiniGauge({
    value,
    max,
    label,
    color,
}: MiniGaugeProps) {
    const pct = max > 0 ? (value / max) * 100 : 0;
    const radius = 36;
    const stroke = 8;
    const circumference = Math.PI * radius;
    const filled = (pct / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-1">
            <svg width={90} height={54} viewBox="0 0 90 54">
                <path
                    d="M 9 50 A 36 36 0 0 1 81 50"
                    fill="none"
                    stroke="#242424"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                />

                <path
                    d="M 9 50 A 36 36 0 0 1 81 50"
                    fill="none"
                    stroke={color}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={`${filled} ${circumference}`}
                    className="transition-all duration-700"
                />

                <text
                    x="45"
                    y="46"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-txt-primary text-[14px] font-mono font-bold"
                >
                    {Math.round(pct)}%
                </text>
            </svg>

            <span className="text-[10px] font-mono text-txt-disabled uppercase tracking-label">
                {label}
            </span>
        </div>
    );
}