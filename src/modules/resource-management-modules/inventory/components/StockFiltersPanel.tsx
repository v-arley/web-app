import { ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
    categories: string[];
    warehouses: { id: number; name: string }[];
    selectedCategory: string;
    selectedStatus: string;
    selectedWarehouse: number | null;
    onCategoryChange: (category: string) => void;
    onStatusChange: (status: string) => void;
    onWarehouseChange: (warehouseId: number | null) => void;
    onClear: () => void;
};

type SelectOption = {
    value: string;
    label: string;
};

type GlassSelectProps = {
    title: string;
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    className?: string;
};

function GlassSelect({ title, value, options, onChange, className = "" }: GlassSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const selectedOption = options.find((option) => option.value === value) ?? options[0];

    useEffect(() => {
        if (!isOpen) return;

        const handlePointerDown = (event: MouseEvent) => {
            if (!wrapperRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        window.addEventListener("mousedown", handlePointerDown);
        return () => window.removeEventListener("mousedown", handlePointerDown);
    }, [isOpen]);

    const handleSelect = (nextValue: string) => {
        onChange(nextValue);
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className={`glass-select ${className}`}>
            <button
                type="button"
                className="glass-select__trigger"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                title={title}
                onClick={() => setIsOpen((current) => !current)}
                onKeyDown={(event) => {
                    if (event.key === "Escape") {
                        setIsOpen(false);
                    }

                    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setIsOpen(true);
                    }
                }}
            >
                <span className="glass-select__value">{selectedOption.label}</span>
                <ChevronDown className="glass-select__chevron h-3.5 w-3.5" aria-hidden="true" />
            </button>

            {isOpen && (
                <div className="glass-select__panel" role="listbox" aria-label={title}>
                    {options.map((option) => {
                        const isSelected = option.value === value;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                className={`glass-select__option ${isSelected ? "glass-select__option--selected" : ""}`}
                                onClick={() => handleSelect(option.value)}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export function StockFiltersPanel({
    categories,
    warehouses,
    selectedCategory,
    selectedStatus,
    selectedWarehouse,
    onCategoryChange,
    onStatusChange,
    onWarehouseChange,
    onClear,
}: Props) {
    const hasActiveFilters = selectedCategory || selectedStatus || selectedWarehouse;
    const warehouseOptions = [
        { value: "", label: "WAREHOUSE: ALL_STATIONS" },
        ...warehouses.map((warehouse) => ({ value: String(warehouse.id), label: warehouse.name })),
    ];
    const categoryOptions = [
        { value: "", label: "CATEGORY: ALL_RESOURCES" },
        ...categories.map((category) => ({ value: category, label: category })),
    ];
    const statusOptions = [
        { value: "", label: "STATUS: TOTAL_SCAN" },
        { value: "OK", label: "LEVEL: NOMINAL" },
        { value: "LOW", label: "LEVEL: LOW_RESERVE" },
        { value: "CRITICAL", label: "LEVEL: CRITICAL_EMPT" },
    ];

    return (
        <div className="flex min-w-0 flex-wrap items-center gap-3">
            <div className="min-w-[min(100%,11rem)] flex-1 lg:flex-none">
                <GlassSelect
                    title="Warehouse"
                    value={selectedWarehouse !== null ? String(selectedWarehouse) : ""}
                    options={warehouseOptions}
                    onChange={(nextValue) => onWarehouseChange(nextValue ? Number(nextValue) : null)}
                    className="lg:min-w-[180px]"
                />
            </div>

            <div className="min-w-[min(100%,10rem)] flex-1 lg:flex-none">
                <GlassSelect
                    title="Categoria"
                    value={selectedCategory}
                    options={categoryOptions}
                    onChange={onCategoryChange}
                    className="lg:min-w-[160px]"
                />
            </div>

            <div className="min-w-[min(100%,9rem)] flex-1 lg:flex-none">
                <GlassSelect
                    title="Estado de Stock"
                    value={selectedStatus}
                    options={statusOptions}
                    onChange={onStatusChange}
                    className="lg:min-w-[140px]"
                />
            </div>

            {hasActiveFilters && (
                <button
                    type="button"
                    onClick={onClear}
                    className="h-8 min-w-[min(100%,7rem)] flex-1 lg:flex-none flex items-center justify-center gap-2 px-3 bg-black backdrop-blur-sm border-status-critical/40 font-mono text-[9px] font-bold text-status-critical uppercase tracking-widest hover:bg-status-critical/20 transition-all shadow-md group"
                    title="Limpiar filtros"
                >
                    <X className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
                    RESET
                </button>
            )}
        </div>
    );
}
