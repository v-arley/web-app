import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

export type CatalogColumn<TRecord> = {
    key: string;
    label: string;
    render: (record: TRecord) => ReactNode;
    className?: string;
};

type CatalogTableProps<TRecord extends { id?: number | null }> = {
    records: TRecord[];
    columns: Array<CatalogColumn<TRecord>>;
    selectedId: number | null;
    isLoading: boolean;
    emptyMessage: string;
    onSelect: (id: number) => void;
};

export function CatalogTable<TRecord extends { id?: number | null }>({
    records,
    columns,
    selectedId,
    isLoading,
    emptyMessage,
    onSelect,
}: CatalogTableProps<TRecord>) {
    if (isLoading) {
        return (
            <div className="flex flex-1 items-center justify-center gap-2 p-6 text-txt-disabled font-mono text-xs uppercase tracking-wide">
                <Loader2 className="animate-spin" size={18} />
            </div>
        );
    }

    if (records.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center p-6 text-txt-disabled font-mono text-xs uppercase tracking-wide">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="flex-1 min-h-0 overflow-auto">
            <table className="rmm-table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key}>
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {records.map((record) => {
                        const id = record.id ?? null;
                        const selected = id != null && id === selectedId;

                        return (
                            <tr
                                key={id ?? JSON.stringify(record)}
                                tabIndex={0}
                                onClick={() => id != null && onSelect(id)}
                                onKeyDown={(event) => {
                                    if (id != null && (event.key === "Enter" || event.key === " ")) {
                                        event.preventDefault();
                                        onSelect(id);
                                    }
                                }}
                                className={`cursor-pointer select-none transition-colors ${
                                    selected
                                        ? "bg-accent/10 border-l-2 border-l-accent"
                                        : "hover:bg-bg-secondary/50 border-l-2 border-l-transparent"
                                }`}
                            >
                                {columns.map((column) => (
                                    <td key={column.key} className="font-mono text-txt-primary">
                                        {column.render(record)}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default CatalogTable;
