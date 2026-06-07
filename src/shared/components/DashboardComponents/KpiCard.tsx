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
            className={[
                "flex min-h-[104px] flex-col justify-between border bg-bg-secondary px-5 py-4",
                accent
                    ? "border-accent shadow-[inset_2px_0_0_0_rgba(232,93,4,1)]"
                    : "border-border-default",
            ].join(" ")}
        >
            <span className="text-[11px] font-bold uppercase tracking-[0.17em] text-txt-secondary">
                {label}
            </span>

            {loading ? (
                <span className="text-[28px] font-bold leading-none text-txt-disabled animate-pulse">
                    ---
                </span>
            ) : (
                <span
                    className={[
                        "text-[30px] font-bold leading-none",
                        accent ? "text-accent" : "text-txt-primary",
                    ].join(" ")}
                >
                    {value}
                </span>
            )}

            {sub ? (
                <span className="text-[10px] uppercase tracking-[0.14em] text-txt-disabled">
                    {sub}
                </span>
            ) : null}
        </div>
    );
}