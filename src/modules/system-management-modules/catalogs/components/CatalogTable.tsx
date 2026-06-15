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
            <div className="app-loading-state app-animate-fade">
                <Loader2 className="animate-spin" size={18} style={{ marginRight: "0.5rem" }} />
                Loading...
            </div>
        );
    }

    if (records.length === 0) {
        return (
            <div className="app-empty-state app-animate-fade">
                <span>{emptyMessage}</span>
            </div>
        );
    }

    return (
        <div className="flex-1 min-h-0 overflow-auto app-table-frame">
            <table className="app-table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key}>
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="app-stagger-rows">
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
                                className={`app-table-row ${selected ? "app-table-row--selected" : ""}`}
                            >
                                {columns.map((column) => (
                                    <td key={column.key}>
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
