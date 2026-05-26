import type { ProductionRuleFormValues } from "../schemas/production-rule.schema";

type Props = {
    rules: ProductionRuleFormValues[];
    professionMap: Map<number, string>;
    resourceMap: Map<number, string>;
    selectedKey?: string;
    onSelect: (rule: ProductionRuleFormValues) => void;
};

function ruleKey(rule: ProductionRuleFormValues): string {
    return `${rule.camp_id}-${rule.profession_id}-${rule.resource_id}-${rule.effective_date}`;
}

export function ProductionRulesTable({ rules, professionMap, resourceMap, selectedKey, onSelect }: Props) {
    if (rules.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-txt-secondary font-mono text-xs">
                No hay reglas de producción configuradas
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full font-mono text-[11px]">
                <thead className="bg-bg-secondary/50 border-b border-border-default">
                    <tr>
                        <th className="text-left px-4 py-2 text-[10px] font-bold text-txt-secondary uppercase tracking-widest">
                            Profesión
                        </th>
                        <th className="text-left px-4 py-2 text-[10px] font-bold text-txt-secondary uppercase tracking-widest">
                            Recurso
                        </th>
                        <th className="text-right px-4 py-2 text-[10px] font-bold text-txt-secondary uppercase tracking-widest">
                            Cantidad/Día
                        </th>
                        <th className="text-left px-4 py-2 text-[10px] font-bold text-txt-secondary uppercase tracking-widest">
                            Vigencia
                        </th>
                        <th className="text-center px-4 py-2 text-[10px] font-bold text-txt-secondary uppercase tracking-widest">
                            Estado
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                    {rules.map((rule) => {
                        const professionName = professionMap.get(rule.profession_id) || `ID ${rule.profession_id}`;
                        const resourceName = resourceMap.get(rule.resource_id) || `ID ${rule.resource_id}`;
                        const isActive = rule.state === 'A';
                        const isSelected = ruleKey(rule) === selectedKey;

                        return (
                            <tr
                                key={ruleKey(rule)}
                                onClick={() => onSelect(rule)}
                                className={`cursor-pointer transition-colors relative ${
                                    isSelected
                                        ? "bg-accent/8 border-l-2 border-accent"
                                        : "hover:bg-bg-secondary/40"
                                }`}
                            >
                                <td className={`px-4 py-2.5 ${isSelected ? "pl-3" : ""} text-txt-primary`}>
                                    {professionName}
                                </td>
                                <td className="px-4 py-2.5 text-txt-secondary">
                                    {resourceName}
                                </td>
                                <td className="px-4 py-2.5 text-right text-txt-primary font-bold">
                                    {rule.expected_amount}
                                </td>
                                <td className="px-4 py-2.5 text-txt-secondary">
                                    {rule.effective_date}
                                    {rule.end_date && <span className="text-txt-muted"> → {rule.end_date}</span>}
                                </td>
                                <td className="px-4 py-2.5 text-center">
                                    <span
                                        className={`inline-flex items-center px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border ${
                                            isActive
                                                ? "bg-status-ok/10 text-status-ok border-status-ok/30"
                                                : "bg-status-critical/10 text-status-critical border-status-critical/30"
                                        }`}
                                    >
                                        {isActive ? "Activa" : "Inactiva"}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="px-4 py-2 border-t border-border-subtle bg-bg-secondary/20 font-mono text-[9px] text-txt-muted uppercase tracking-widest">
                Selecciona una fila para editar &bull; {rules.length} regla{rules.length !== 1 ? 's' : ''}
            </div>
        </div>
    );
}
