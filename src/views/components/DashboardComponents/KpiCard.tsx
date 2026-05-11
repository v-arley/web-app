type Props = {
    label: string;
    value: string | number;
    sub?: string;
    accent?: boolean;
    loading?: boolean;
};

export default function KpiCard({
    label,
    value,
    sub,
    accent = false,
    loading,
}: Props) {
    return (
        <div
            className={`flex flex-col gap-2 p-5 border ${
                accent
                    ? "border-accent bg-bg-primary"
                    : "border-border-default bg-bg-primary"
            }`}
        >
            <span className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-label">
                {label}
            </span>

            {loading ? (
                <span className="text-3xl font-mono font-bold text-txt-disabled animate-pulse">
                    ---
                </span>
            ) : (
                <span
                    className={`text-3xl font-mono font-bold leading-none ${
                        accent ? "text-accent" : "text-txt-primary"
                    }`}
                >
                    {value}
                </span>
            )}

            {sub && (
                <span className="text-[11px] font-mono text-txt-disabled uppercase tracking-label">
                    {sub}
                </span>
            )}
        </div>
    );
}