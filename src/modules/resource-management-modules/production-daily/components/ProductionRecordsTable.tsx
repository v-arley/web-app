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
            <div className="flex items-center justify-center h-64 text-txt-disabled font-mono text-xs">
                No hay registros de producción para el período seleccionado
            </div>
        );
    }

    // Agrupar por fecha
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
        <div className="space-y-4">
            {sortedDates.map((date) => {
                const dayRecords = groupedByDate[date];
                const totalProduced = dayRecords.reduce((sum, r) => sum + r.amount, 0);

                return (
                    <div key={date} className="bg-bg-secondary border border-border-default">
                        <div className="px-5 py-3 border-b border-border-default bg-bg-secondary/50 flex items-center justify-between">
                            <div className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-[0.15em]">
                                {new Date(date + 'T00:00:00').toLocaleDateString('es-CR', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </div>
                            <div className="text-[10px] font-mono font-bold text-txt-disabled uppercase tracking-widest">
                                {dayRecords.length} Registro{dayRecords.length !== 1 ? 's' : ''} • Total: {totalProduced}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full font-mono text-[11px]">
                                <thead className="bg-bg-tertiary/50 border-b border-border-default">
                                    <tr>
                                        <th className="text-left px-4 py-2 text-[10px] font-bold text-txt-disabled uppercase tracking-widest">
                                            Trabajador
                                        </th>
                                        <th className="text-left px-4 py-2 text-[10px] font-bold text-txt-disabled uppercase tracking-widest">
                                            Recurso
                                        </th>
                                        <th className="text-left px-4 py-2 text-[10px] font-bold text-txt-disabled uppercase tracking-widest">
                                            Bodega
                                        </th>
                                        <th className="text-right px-4 py-2 text-[10px] font-bold text-txt-disabled uppercase tracking-widest">
                                            Cantidad
                                        </th>
                                        <th className="text-left px-4 py-2 text-[10px] font-bold text-txt-disabled uppercase tracking-widest">
                                            Notas
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-default">
                                    {dayRecords.map((record) => {
                                        const personName = personMap.get(record.person_id) || `ID ${record.person_id}`;
                                        const resourceName = resourceMap.get(record.resource_id) || `ID ${record.resource_id}`;
                                        const warehouseName = warehouseMap.get(record.warehouse_id) || `ID ${record.warehouse_id}`;
                                        const hasNotes = record.notes && record.notes.trim().length > 0;

                                        return (
                                            <tr
                                                key={record.id}
                                                className={`hover:bg-bg-tertiary/30 transition-colors ${hasNotes ? 'bg-status-warning/5' : ''}`}
                                            >
                                                <td className="px-4 py-3 text-txt-primary">
                                                    {personName}
                                                </td>
                                                <td className="px-4 py-3 text-txt-primary">
                                                    {resourceName}
                                                </td>
                                                <td className="px-4 py-3 text-txt-secondary">
                                                    {warehouseName}
                                                </td>
                                                <td className="px-4 py-3 text-right text-txt-primary font-bold">
                                                    {record.amount}
                                                </td>
                                                <td className="px-4 py-3 text-txt-secondary text-[10px]">
                                                    {hasNotes ? (
                                                        <div className="flex items-start gap-2">
                                                            <FileText className="w-3 h-3 text-status-warning shrink-0 mt-0.5" />
                                                            <span className="text-status-warning">{record.notes}</span>
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
