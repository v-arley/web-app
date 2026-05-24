import { FileText, Calendar, CheckCircle, XCircle } from "lucide-react";
import type { RationFormValues } from "../schemas/ration.schema";

type Props = {
    rations: RationFormValues[];
    personMap: Map<number, string>;
};

export function RationHistoryTable({ rations, personMap }: Props) {
    if (rations.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-txt-disabled font-mono text-xs">
                No hay historial de raciones para el período seleccionado
            </div>
        );
    }

    // Agrupar por fecha
    const groupedByDate = rations.reduce((acc, ration) => {
        const date = ration.ration_date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(ration);
        return acc;
    }, {} as Record<string, RationFormValues[]>);

    const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

    return (
        <div className="space-y-4">
            {sortedDates.map((date) => {
                const dayRations = groupedByDate[date];
                const deliveredCount = dayRations.filter((r) => r.completed === 'Y').length;
                const pendingCount = dayRations.filter((r) => r.completed === 'N').length;

                return (
                    <div key={date} className="bg-bg-secondary border border-border-default">
                        <div className="px-5 py-3 border-b border-border-default bg-bg-secondary/50 flex items-center justify-between">
                            <div className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-[0.15em] flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(date + 'T00:00:00').toLocaleDateString('es-CR', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-mono font-bold uppercase tracking-widest">
                                <span className="text-status-success flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    {deliveredCount} Entregadas
                                </span>
                                <span className="text-status-warning flex items-center gap-1">
                                    <XCircle className="w-3 h-3" />
                                    {pendingCount} Pendientes
                                </span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full font-mono text-[11px]">
                                <thead className="bg-bg-tertiary/50 border-b border-border-default">
                                    <tr>
                                        <th className="text-left px-4 py-2 text-[10px] font-bold text-txt-disabled uppercase tracking-widest">
                                            Persona
                                        </th>
                                        <th className="text-center px-4 py-2 text-[10px] font-bold text-txt-disabled uppercase tracking-widest">
                                            Estado
                                        </th>
                                        <th className="text-left px-4 py-2 text-[10px] font-bold text-txt-disabled uppercase tracking-widest">
                                            Notas
                                        </th>
                                        <th className="text-left px-4 py-2 text-[10px] font-bold text-txt-disabled uppercase tracking-widest">
                                            Registro
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-default">
                                    {dayRations.map((ration) => {
                                        const personName = personMap.get(ration.person_id) || `ID ${ration.person_id}`;
                                        const isDelivered = ration.completed === 'Y';
                                        const hasNotes = ration.notes && ration.notes.trim().length > 0;

                                        return (
                                            <tr
                                                key={ration.id}
                                                className={`hover:bg-bg-tertiary/30 transition-colors ${
                                                    isDelivered ? 'bg-status-success/5' : 'bg-status-warning/5'
                                                }`}
                                            >
                                                <td className="px-4 py-3 text-txt-primary">
                                                    {personName}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {isDelivered ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-status-success/20 text-status-success rounded-sm text-[10px] font-bold">
                                                            <CheckCircle className="w-3 h-3" />
                                                            ENTREGADA
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-status-warning/20 text-status-warning rounded-sm text-[10px] font-bold">
                                                            <XCircle className="w-3 h-3" />
                                                            PENDIENTE
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-txt-secondary text-[10px]">
                                                    {hasNotes ? (
                                                        <div className="flex items-start gap-2">
                                                            <FileText className="w-3 h-3 text-txt-disabled shrink-0 mt-0.5" />
                                                            <span className="line-clamp-2">{ration.notes}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-txt-disabled">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-txt-disabled text-[10px]">
                                                    {ration.created_at ? new Date(ration.created_at).toLocaleString('es-CR') : '-'}
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
