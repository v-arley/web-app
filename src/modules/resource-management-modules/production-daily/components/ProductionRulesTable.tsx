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
                There are no production rules configured yet. Create a new rule using the form on the right.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="table-system">
                <thead className="table-system-head">
                    <tr>
                        <th className="table-system-th">Profession</th>
                        <th className="table-system-th">Resource</th>
                        <th className="table-system-th">Quantity/Day</th>
                        <th className="table-system-th">Effective Date</th>
                        <th className="table-system-th">Status</th>
                    </tr>
                </thead>
                <tbody>
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
                                <td className="table-system-td table-system-td--primary">
                                    {professionName}
                                </td>
                                <td className="table-system-td table-system-td--primary">
                                    {resourceName}
                                </td>
                                <td className="table-system-td table-system-td--primary">
                                    {rule.expected_amount}
                                </td>
                                <td className="table-system-td table-system-td--primary">
                                    {rule.effective_date}
                                    {rule.end_date && <span className="text-txt-muted"> → {rule.end_date}</span>}
                                </td>
                                <td className="table-system-td table-system-td--primary">
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
                Select a row to edit &bull; {rules.length} rule{rules.length !== 1 ? 's' : ''}
            </div>
        </div>
    );
}
