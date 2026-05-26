export type CatalogTab = "resources" | "professions" | "achievements";

type CatalogsToolbarProps = {
    value: CatalogTab;
    onChange: (tab: CatalogTab) => void;
};

const TABS: Array<{ value: CatalogTab; label: string }> = [
    { value: "resources", label: "Recursos" },
    { value: "professions", label: "Profesiones" },
    { value: "achievements", label: "Logros" },
];

export function CatalogsToolbar({ value, onChange }: CatalogsToolbarProps) {
    return (
        <div className="flex flex-wrap gap-2 border-b border-border-default bg-bg-secondary/40 px-5 py-3">
            {TABS.map((tab) => {
                const isActive = tab.value === value;

                return (
                    <button
                        key={tab.value}
                        type="button"
                        onClick={() => onChange(tab.value)}
                        className={[
                            "px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-[0.15em] border transition-all",
                            isActive
                                ? "border-accent bg-accent/10 text-accent shadow-[0_0_10px_rgba(232,93,4,0.15)]"
                                : "border-border-default bg-bg-primary/40 text-txt-secondary hover:text-txt-primary hover:border-txt-disabled/30",
                        ].join(" ")}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}