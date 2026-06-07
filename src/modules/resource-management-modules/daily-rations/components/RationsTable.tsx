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
        <div className="rmm-table">
            <table className="">
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
                                className="bg-status-critical/5 hover:bg-status-critical/10 transition-colors border-l-2 border-l-status-critical cursor-pointer select-none"
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
                                    {ration.notes || '—'}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
