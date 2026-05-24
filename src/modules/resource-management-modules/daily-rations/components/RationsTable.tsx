import { useState } from "react";
import { CheckCircle, XCircle, User, Calendar } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { useRationMutation } from "../hooks/useRationMutation";
import { RationResourcesDetail } from "./RationResourcesDetail";
import type { RationFormValues } from "../schemas/ration.schema";

type Props = {
    rations: RationFormValues[];
    personMap: Map<number, string>;
    onRationClick?: (rationId: number) => void;
};

export function RationsTable({ rations, personMap, onRationClick }: Props) {
    const [expandedRationId, setExpandedRationId] = useState<number | null>(null);
    const { markAsDelivered, markAsNotDelivered } = useRationMutation();

    if (rations.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-txt-disabled font-mono text-xs">
                No hay raciones para mostrar
            </div>
        );
    }

    const handleToggleDelivery = async (ration: RationFormValues) => {
        if (!ration.id) return;

        try {
            if (ration.completed === 'N') {
                await markAsDelivered.mutateAsync({ id: ration.id });
            } else {
                await markAsNotDelivered.mutateAsync({ id: ration.id });
            }
        } catch (error) {
            console.error("Error al actualizar ración:", error);
        }
    };

    const handleRowClick = (rationId: number) => {
        setExpandedRationId(expandedRationId === rationId ? null : rationId);
        onRationClick?.(rationId);
    };

    return (
        <div className="bg-bg-secondary border border-border-default">
            <div className="overflow-x-auto">
                <table className="w-full font-mono text-[11px]">
                    <thead className="bg-bg-tertiary/50 border-b border-border-default">
                        <tr>
                            <th className="text-left px-4 py-2 text-[10px] font-bold text-txt-disabled uppercase tracking-widest">
                                Persona
                            </th>
                            <th className="text-left px-4 py-2 text-[10px] font-bold text-txt-disabled uppercase tracking-widest">
                                Fecha
                            </th>
                            <th className="text-center px-4 py-2 text-[10px] font-bold text-txt-disabled uppercase tracking-widest">
                                Estado
                            </th>
                            <th className="text-left px-4 py-2 text-[10px] font-bold text-txt-disabled uppercase tracking-widest">
                                Notas
                            </th>
                            <th className="text-center px-4 py-2 text-[10px] font-bold text-txt-disabled uppercase tracking-widest">
                                Acción
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default">
                        {rations.map((ration) => {
                            const personName = personMap.get(ration.person_id) || `ID ${ration.person_id}`;
                            const isDelivered = ration.completed === 'Y';
                            const isExpanded = expandedRationId === ration.id;

                            return (
                                <tr
                                    key={ration.id}
                                    className={`hover:bg-bg-tertiary/30 transition-colors cursor-pointer ${
                                        isDelivered ? 'bg-status-success/5' : ''
                                    }`}
                                    onClick={() => ration.id && handleRowClick(ration.id)}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-txt-disabled" />
                                            <span className="text-txt-primary">{personName}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-txt-disabled" />
                                            <span className="text-txt-secondary">
                                                {new Date(ration.ration_date + 'T00:00:00').toLocaleDateString('es-CR')}
                                            </span>
                                        </div>
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
                                        {ration.notes || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Button
                                            size="sm"
                                            variant={isDelivered ? "outline" : "default"}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleDelivery(ration);
                                            }}
                                            disabled={markAsDelivered.isPending || markAsNotDelivered.isPending}
                                        >
                                            {isDelivered ? 'Marcar Pendiente' : 'Marcar Entregada'}
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Detalle expandido de recursos */}
            {expandedRationId && (
                <div className="border-t border-border-default p-4 bg-bg-tertiary/20">
                    <RationResourcesDetail rationId={expandedRationId} />
                </div>
            )}
        </div>
    );
}
