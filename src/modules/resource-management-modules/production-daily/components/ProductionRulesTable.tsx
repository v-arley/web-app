import { Edit, Trash2 } from "lucide-react";
import type { ProductionRuleFormValues } from "../schemas/production-rule.schema";

type Props = {
    rules: ProductionRuleFormValues[];
    professionMap: Map<number, string>;
    resourceMap: Map<number, string>;
    onEdit: (rule: ProductionRuleFormValues) => void;
    onDelete: (id: number) => void;
};

export function ProductionRulesTable({ rules, professionMap, resourceMap, onEdit, onDelete }: Props) {
    if (rules.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-txt-disabled font-mono text-xs">
                No hay reglas de producción configuradas
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full font-mono text-[11px]">
                <thead className="bg-bg-secondary/50 border-b border-border-default">
                    <tr>
                        <th className="text-left px-4 py-3 text-[10px] font-bold text-txt-disabled uppercase tracking-widest">
                            Profesión
                        </th>
                        <th className="text-left px-4 py-3 text-[10px] font-bold text-txt-disabled uppercase tracking-widest">
                            Recurso
                        </th>
                        <th className="text-right px-4 py-3 text-[10px] font-bold text-txt-disabled uppercase tracking-widest">
                            Cantidad/Día
                        </th>
                        <th className="text-left px-4 py-3 text-[10px] font-bold text-txt-disabled uppercase tracking-widest">
                            Vigencia
                        </th>
                        <th className="text-center px-4 py-3 text-[10px] font-bold text-txt-disabled uppercase tracking-widest">
                            Estado
                        </th>
                        <th className="text-center px-4 py-3 text-[10px] font-bold text-txt-disabled uppercase tracking-widest">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                    {rules.map((rule) => {
                        const professionName = professionMap.get(rule.profession_id) || `ID ${rule.profession_id}`;
                        const resourceName = resourceMap.get(rule.resource_id) || `ID ${rule.resource_id}`;
                        const isActive = rule.state === 'A';

                        return (
                            <tr
                                key={rule.id}
                                className="hover:bg-bg-secondary/30 transition-colors"
                            >
                                <td className="px-4 py-3 text-txt-primary">
                                    {professionName}
                                </td>
                                <td className="px-4 py-3 text-txt-primary">
                                    {resourceName}
                                </td>
                                <td className="px-4 py-3 text-right text-txt-primary">
                                    {rule.expected_amount}
                                </td>
                                <td className="px-4 py-3 text-txt-secondary">
                                    {rule.effective_date}
                                    {rule.end_date && ` → ${rule.end_date}`}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span
                                        className={`inline-flex items-center px-2 py-1 text-[9px] font-bold uppercase tracking-widest ${
                                            isActive
                                                ? "bg-status-ok/10 text-status-ok"
                                                : "bg-status-critical/10 text-status-critical"
                                        }`}
                                    >
                                        {isActive ? "Activa" : "Inactiva"}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => onEdit(rule)}
                                            className="p-2 hover:bg-bg-tertiary border border-transparent hover:border-border-default transition-all text-txt-secondary hover:text-accent"
                                            title="Editar"
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => rule.id && onDelete(rule.id)}
                                            className="p-2 hover:bg-bg-tertiary border border-transparent hover:border-border-default transition-all text-txt-secondary hover:text-status-critical"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
