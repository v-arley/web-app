import type { RationFormValues } from "../schemas/ration.schema";

type Props = {
    rations: RationFormValues[];
    personMap: Map<number, string>;
    selectedRationId?: number | null;
    onRationSelect?: (rationId: number | null) => void;
};

export function RationsTable({ rations, personMap, selectedRationId, onRationSelect }: Props) {
    if (rations.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-txt-disabled font-mono text-xs">
                There are no rations to show
            </div>
        );
    }

    const handleRowClick = (rationId: number) => {
        onRationSelect?.(selectedRationId === rationId ? null : rationId);
    };

    return (
        <>
        <div className="hidden min-w-0 overflow-x-auto md:block">
            <table className="rmm-table w-full">
                <thead className="">
                    <tr>
                        <th className="">Id</th>
                        <th className="">Person</th>
                        <th className="">Date</th>
                        <th className="">Status</th>
                        <th className="">Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {rations.map((ration) => {
                        const personName = personMap.get(ration.person_id) || `ID ${ration.person_id}`;
                        const isDelivered = ration.completed === 'Y';
                        const isSelected = selectedRationId === ration.id;

                        return (
                            <tr
                                key={ration.id}
                                className={`transition-colors border-l-2 cursor-pointer select-none ${
                                    isSelected
                                        ? "bg-accent/10 border-l-accent"
                                        : isDelivered
                                            ? "bg-status-success/5 hover:bg-status-success/10 border-l-status-success"
                                            : "bg-status-warning/5 hover:bg-status-warning/10 border-l-status-warning"
                                }`}
                                onClick={() => ration.id && handleRowClick(ration.id)}
                            >
                                <td>
                                    <div className="flex items-center justify-center gap-2 uppercase">
                                        {ration.id}
                                    </div>
                                </td>
                                <td>
                                    <div className="flex items-center justify-center gap-2 uppercase">
                                        {personName}
                                    </div>
                                </td>
                                <td>
                                    {new Date(ration.ration_date + 'T00:00:00').toLocaleDateString('en-US')}
                                </td>
                                <td>
                                    {isDelivered ? (
                                        <span className="table-system-badge table-system-badge--online">DELIVERED</span>
                                    ) : (
                                        <span className="table-system-badge table-system-badge--pending">PENDING</span>
                                    )}
                                </td>
                                <td>
                                    {ration.notes || '-'}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
        <div className="grid gap-3 md:hidden">
            {rations.map((ration) => {
                const personName = personMap.get(ration.person_id) || `ID ${ration.person_id}`;
                const isDelivered = ration.completed === 'Y';
                const isSelected = selectedRationId === ration.id;

                return (
                    <button
                        key={ration.id}
                        type="button"
                        onClick={() => ration.id && handleRowClick(ration.id)}
                        className={`border-l-2 p-3 text-left transition-colors ${
                            isSelected
                                ? "border-l-accent bg-accent/10"
                                : isDelivered
                                    ? "border-l-status-success bg-status-success/5"
                                    : "border-l-status-warning bg-status-warning/5"
                        } border border-border-default`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="font-mono text-[10px] text-txt-disabled uppercase tracking-widest">
                                    Ration #{ration.id}
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
                            <div className="flex justify-between gap-3">
                                <span className="text-txt-disabled uppercase">Date</span>
                                <span>{new Date(ration.ration_date + 'T00:00:00').toLocaleDateString('en-US')}</span>
                            </div>
                            <div className="border-t border-border-default pt-2">
                                <span className="block text-txt-disabled uppercase">Notes</span>
                                <span className="mt-1 block break-words text-txt-secondary">{ration.notes || '-'}</span>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
        </>
    );
}
