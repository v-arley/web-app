import KpiCard from "./KpiCard";

export type AnalyticsTab = "professions" | "health" | "demographics";

export type CountItem = {
    label: string;
    value: number;
};

export type StaffDeficitItem = {
    code: string;
    name: string;
};

type Props = {
    activeTab: AnalyticsTab;
    setActiveTab: (tab: AnalyticsTab) => void;
    professionDistribution: CountItem[];
    healthDistribution: CountItem[];
    staffDeficits: StaffDeficitItem[];
    averageAge: number;
    maleCount: number;
    femaleCount: number;
    otherSexCount: number;
    totalPersons: number;
    activeTemporaryAssignments: number;
};

function getMaxValue(items: CountItem[]) {
    return Math.max(...items.map((item) => item.value), 1);
}

function BarList({ items }: { items: CountItem[] }) {
    const max = getMaxValue(items);

    if (!items.length) {
        return (
            <div className="flex h-32 items-center justify-center border border-border-default bg-bg-primary">
                <span className="text-[12px] font-mono uppercase tracking-[0.14em] text-txt-disabled">
                    No data available
                </span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {items.slice(0, 7).map((item) => {
                const width = Math.max((item.value / max) * 100, 8);

                return (
                    <div key={item.label} className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                            <span className="truncate text-[12px] font-mono uppercase tracking-[0.14em] text-txt-primary">
                                {item.label}
                            </span>

                            <span className="text-[13px] font-mono font-bold text-txt-primary">
                                {item.value}
                            </span>
                        </div>

                        <div className="h-3.5 overflow-hidden bg-bg-primary">
                            <div
                                className="h-full bg-accent transition-all"
                                style={{ width: `${width}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function HealthSummary({ items }: { items: CountItem[] }) {
    const total = items.reduce((sum, item) => sum + item.value, 0);
    const main = items[0];
    const mainPercent =
        main && total > 0 ? Math.round((main.value / total) * 100) : 0;

    return (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[210px_minmax(0,1fr)]">
            <div className="flex items-center justify-center border border-border-default bg-bg-primary p-4">
                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full border-[12px] border-accent">
                    <span className="text-3xl font-mono font-bold text-txt-primary">
                        {mainPercent}%
                    </span>

                    <span className="mt-1 text-center text-[10px] font-mono uppercase tracking-[0.14em] text-txt-disabled">
                        {main?.label ?? "No data"}
                    </span>
                </div>
            </div>

            <BarList items={items} />
        </div>
    );
}

function StaffDeficitBox({
    staffDeficits,
    activeTemporaryAssignments,
}: {
    staffDeficits: StaffDeficitItem[];
    activeTemporaryAssignments: number;
}) {
    return (
        <div className="flex flex-col gap-4">
            <div className="border border-border-default bg-bg-primary p-4">
                <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-txt-disabled">
                    Staff deficit
                </p>

                {staffDeficits.length === 0 ? (
                    <div className="mt-4 border border-border-default bg-bg-secondary px-4 py-3">
                        <p className="text-[13px] font-mono font-bold uppercase tracking-[0.14em] text-txt-primary">
                            All professions covered
                        </p>

                        <p className="mt-2 text-[12px] leading-relaxed text-txt-secondary">
                            Every active profession has at least one active
                            assigned user.
                        </p>
                    </div>
                ) : (
                    <div className="mt-4 flex max-h-[360px] flex-col gap-3 overflow-y-auto pr-1">
                        {staffDeficits.map((item) => (
                            <div
                                key={item.code}
                                className="border border-accent bg-bg-secondary px-4 py-3"
                            >
                                <p className="text-[13px] font-mono font-bold uppercase tracking-[0.16em] text-accent">
                                    ⚠ {item.name}
                                </p>

                                <p className="mt-2 text-[12px] text-txt-secondary">
                                    No active personnel assigned.
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <KpiCard
                label="Temporary assignments"
                value={activeTemporaryAssignments}
                sub="active reassignments"
                accent
            />
        </div>
    );
}

export default function DashboardAnalyticsSection({
    activeTab,
    setActiveTab,
    professionDistribution,
    healthDistribution,
    staffDeficits,
    averageAge,
    maleCount,
    femaleCount,
    otherSexCount,
    totalPersons,
    activeTemporaryAssignments,
}: Props) {
    const tabs: Array<{ id: AnalyticsTab; label: string }> = [
        { id: "professions", label: "Professions" },
        { id: "health", label: "Health" },
        { id: "demographics", label: "Demographics" },
    ];

    return (
        <section className="border border-border-default bg-bg-secondary">
            <div className="flex flex-col gap-4 border-b border-border-default px-5 py-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <p className="text-[13px] font-mono font-bold uppercase tracking-[0.18em] text-txt-primary">
                        CAMP ANALYTICS
                    </p>

                    <p className="mt-1 text-[11px] font-mono uppercase tracking-[0.16em] text-txt-disabled">
                        PROFESSIONS, HEALTH AND DEMOGRAPHICS
                    </p>
                </div>

                <div className="flex gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={[
                                "border px-5 py-2 text-[11px] font-mono uppercase tracking-[0.16em] transition-colors",
                                activeTab === tab.id
                                    ? "border-accent bg-accent text-black"
                                    : "border-border-default bg-bg-primary text-txt-disabled hover:text-txt-primary",
                            ].join(" ")}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4">
                {activeTab === "professions" && (
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
                        <div>
                            <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.16em] text-txt-disabled">
                                DISTRIBUTION BY PROFESSION
                            </p>

                            <BarList items={professionDistribution} />
                        </div>

                        <StaffDeficitBox
                            staffDeficits={staffDeficits}
                            activeTemporaryAssignments={
                                activeTemporaryAssignments
                            }
                        />
                    </div>
                )}

                {activeTab === "health" && (
                    <div>
                        <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.16em] text-txt-disabled">
                            PEOPLE BY HEALTH CONDITION
                        </p>

                        <HealthSummary items={healthDistribution} />
                    </div>
                )}

                {activeTab === "demographics" && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <KpiCard
                            label="Average age"
                            value={averageAge || "N/A"}
                            sub="registered personnel"
                        />

                        <KpiCard
                            label="Male"
                            value={maleCount}
                            sub={`${totalPersons} total people`}
                        />

                        <KpiCard
                            label="Female"
                            value={femaleCount}
                            sub={`${totalPersons} total people`}
                        />

                        <KpiCard
                            label="Other / N/A"
                            value={otherSexCount}
                            sub="not classified"
                        />
                    </div>
                )}
            </div>
        </section>
    );
}