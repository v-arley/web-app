type Props = {
    totalExplorations: number;
    activeCount: number;
    highRiskCount: number;
};

const metricCardClass =
    "border border-[#d7d7d7] bg-[#f7f7f7] px-6 py-5 shadow-sm";

export default function ExplorationStats({
    totalExplorations,
    activeCount,
    highRiskCount,
}: Props) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className={metricCardClass}>
                <p className="text-[11px] uppercase tracking-[0.25em] text-[#7b8794]">
                    Total explorations
                </p>
                <p className="mt-3 text-4xl font-bold text-[#111]">
                    {totalExplorations}
                </p>
            </div>

            <div className={metricCardClass}>
                <p className="text-[11px] uppercase tracking-[0.25em] text-[#7b8794]">
                    Active explorations
                </p>
                <p className="mt-3 text-4xl font-bold text-[#f05a28]">
                    {activeCount}
                </p>
            </div>

            <div className={metricCardClass}>
                <p className="text-[11px] uppercase tracking-[0.25em] text-[#7b8794]">
                    High risk
                </p>
                <p className="mt-3 text-4xl font-bold text-[#111]">
                    {highRiskCount}
                </p>
            </div>
        </div>
    );
}
