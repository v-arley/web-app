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
                There is no ration history for the selected period
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
                    <div key={date} className="border border-border-default">
                        <div className="px-4 sm:px-5 py-3 border-b border-border-default flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-[0.15em] flex items-start sm:items-center gap-2 min-w-0">
                                <Calendar className="w-4 h-4" />
                                <span className="min-w-0 break-words">
                                    {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[10px] font-mono font-bold uppercase tracking-widest">
                                <span className="text-status-success flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    {deliveredCount} Delivered
                                </span>
                                <span className="text-status-warning flex items-center gap-1">
                                    <XCircle className="w-3 h-3" />
                                    {pendingCount} Pending
                                </span>
                            </div>
                        </div>

                        <div className="hidden overflow-x-auto md:block">
                            <table className="rmm-table">
                                <thead className="">
                                    <tr>
                                        <th className="">Person</th>
                                        <th className="">Status</th>
                                        <th className="">Notes</th>
                                        <th className="">Record</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dayRations.map((ration) => {
                                        const personName = personMap.get(ration.person_id) || `ID ${ration.person_id}`;
                                        const isDelivered = ration.completed === 'Y';
                                        const hasNotes = ration.notes && ration.notes.trim().length > 0;

                                        return (
                                            <tr
                                                key={ration.id}
                                                className={`transition-colors border-l-2 ${
                                                    isDelivered
                                                        ? "bg-status-success/5 hover:bg-status-success/10 border-l-status-success"
                                                        : "bg-status-warning/5 hover:bg-status-warning/10 border-l-status-warning"
                                                }`}
                                            >
                                                <td>
                                                    {personName}
                                                </td>
                                                <td>
                                                    {isDelivered ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-status-success text-[10px] font-bold uppercase tracking-wider">
                                                            <div className="w-1.5 h-1.5" /> DELIVERED
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-status-warning text-[10px] font-bold uppercase tracking-wider">
                                                            <div className="w-1.5 h-1.5" /> PENDING
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    {hasNotes ? (
                                                        <div className="flex items-start gap-2">
                                                            <FileText className="w-3 h-3 text-txt-disabled shrink-0 mt-0.5" />
                                                            <span className="line-clamp-2">{ration.notes}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-txt-disabled">-</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {ration.created_at ? new Date(ration.created_at).toLocaleString('es-CR') : '-'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="grid gap-3 p-3 md:hidden">
                            {dayRations.map((ration) => {
                                const personName = personMap.get(ration.person_id) || `ID ${ration.person_id}`;
                                const isDelivered = ration.completed === 'Y';
                                const hasNotes = ration.notes && ration.notes.trim().length > 0;

                                return (
                                    <div
                                        key={ration.id}
                                        className={`border border-border-default border-l-2 p-3 ${
                                            isDelivered ? "border-l-status-success bg-status-success/5" : "border-l-status-warning bg-status-warning/5"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="font-mono text-[10px] text-txt-disabled uppercase tracking-widest">
                                                    Person
                                                </div>
                                                <div className="mt-1 break-words font-mono text-xs font-bold uppercase text-txt-primary">
                                                    {personName}
                                                </div>
                                            </div>
                                            {isDelivered ? (
                                                <span className="table-system-badge table-system-badge--online shrink-0">DELIVERED</span>
                                            ) : (
                                                <span className="table-system-badge table-system-badge--pending shrink-0">PENDING</span>
                                            )}
                                        </div>

                                        <div className="mt-3 grid gap-2 font-mono text-[11px] text-txt-secondary">
                                            <div>
                                                <span className="block text-txt-disabled uppercase">Notes</span>
                                                {hasNotes ? (
                                                    <div className="mt-1 flex items-start gap-2">
                                                        <FileText className="w-3 h-3 text-txt-disabled shrink-0 mt-0.5" />
                                                        <span className="break-words">{ration.notes}</span>
                                                    </div>
                                                ) : (
                                                    <span className="mt-1 block text-txt-disabled">-</span>
                                                )}
                                            </div>
                                            <div className="border-t border-border-default pt-2">
                                                <span className="block text-txt-disabled uppercase">Record</span>
                                                <span className="mt-1 block break-words">
                                                    {ration.created_at ? new Date(ration.created_at).toLocaleString('es-CR') : '-'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
