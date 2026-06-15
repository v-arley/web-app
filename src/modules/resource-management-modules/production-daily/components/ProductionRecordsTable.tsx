import type { ProductionRecordFormValues } from "../schemas/production-record.schema";
import { FileText } from "lucide-react";

type Props = {
    records: ProductionRecordFormValues[];
    personMap: Map<number, string>;
    warehouseMap: Map<number, string>;
    resourceMap: Map<number, string>;
};

export function ProductionRecordsTable({ records, personMap, warehouseMap, resourceMap }: Props) {
    if (records.length === 0) {
        return (
            <div className="app-empty-state app-animate-fade h-full min-h-64">
                <span>There are no production records for the selected period</span>
            </div>
        );
    }

    const groupedByDate = records.reduce((acc, record) => {
        const date = record.production_date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(record);
        return acc;
    }, {} as Record<string, ProductionRecordFormValues[]>);

    const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

    return (
        <div className="flex flex-col gap-4">
            {sortedDates.map((date) => {
                const dayRecords = groupedByDate[date];
                const totalProduced = dayRecords.reduce((sum, r) => sum + r.amount, 0);

                return (
                    <div key={date} className="flex flex-col bg-bg-secondary border border-border-default">
                        <div className="px-5 py-3 border-b border-border-default bg-bg-secondary/50 flex shrink-0 items-center justify-between">
                            <div className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-label">
                                {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className="text-[10px] font-mono font-bold text-txt-disabled uppercase tracking-widest">
                                {dayRecords.length} Record{dayRecords.length !== 1 ? 's' : ''} • Total: {totalProduced}
                            </div>
                        </div>

                        <div className="app-table-wrap">
                            <table className="app-table">
                                <thead>
                                    <tr>
                                        <th>Worker</th>
                                        <th>Resource</th>
                                        <th>Warehouse</th>
                                        <th className="text-right">Amount</th>
                                        <th>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dayRecords.map((record) => {
                                        const personName = personMap.get(record.person_id) || `ID ${record.person_id}`;
                                        const resourceName = resourceMap.get(record.resource_id) || `ID ${record.resource_id}`;
                                        const warehouseName = warehouseMap.get(record.warehouse_id) || `ID ${record.warehouse_id}`;
                                        const hasNotes = record.notes && record.notes.trim().length > 0;

                                        return (
                                            <tr
                                                key={record.id}
                                                className={hasNotes ? 'bg-status-warning/5' : ''}
                                            >
                                                <td className="app-table-cell--primary">{personName}</td>
                                                <td className="app-table-cell--primary">{resourceName}</td>
                                                <td className="app-table-cell--time">{warehouseName}</td>
                                                <td className="app-table-cell--number app-table-cell--primary font-bold">
                                                    {record.amount}
                                                </td>
                                                <td>
                                                    {hasNotes ? (
                                                        <div className="flex items-start gap-2">
                                                            <FileText className="w-3 h-3 text-status-warning shrink-0 mt-0.5" />
                                                            <span className="text-status-warning text-[10px]">{record.notes}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-txt-disabled/50">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
