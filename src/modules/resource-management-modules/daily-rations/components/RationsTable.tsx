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
        <div className="table-system-wrap h-full">
            <table className="table-system">
                <thead className="table-system-head">
                    <tr>
                        <th className="table-system-th">Id</th>
                        <th className="table-system-th">Person</th>
                        <th className="table-system-th">Date</th>
                        <th className="table-system-th">Status</th>
                        <th className="table-system-th">Notes</th>
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
                                className={`table-system-row ${isSelected ? 'table-system-row--selected' : ''}`}
                                onClick={() => ration.id && handleRowClick(ration.id)}
                            >
                                <td className="table-system-td table-system-td--primary">
                                    <div className="flex items-center justify-center gap-2 uppercase">
                                        {ration.id}
                                    </div>
                                </td>
                                <td className="table-system-td table-system-td--primary">
                                    <div className="flex items-center justify-center gap-2 uppercase">
                                        {personName}
                                    </div>
                                </td>
                                <td className="table-system-td table-system-td--time">
                                    {new Date(ration.ration_date + 'T00:00:00').toLocaleDateString('en-US')}
                                </td>
                                <td className="table-system-td">
                                    {isDelivered ? (
                                        <span className="table-system-badge table-system-badge--online">DELIVERED</span>
                                    ) : (
                                        <span className="table-system-badge table-system-badge--pending">PENDING</span>
                                    )}
                                </td>
                                <td className="table-system-td uppercase">
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
