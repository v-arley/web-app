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
            <div className="app-empty-state app-animate-fade h-full min-h-64">
                <span>There are no production rules configured yet. Create a new rule using the form on the right.</span>
            </div>
        );
    }

    return (
        <div className="app-table-wrap">
            <table className="app-table">
                <thead>
                    <tr>
                        <th>Profession</th>
                        <th>Resource</th>
                        <th>Quantity/Day</th>
                        <th>Effective Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody className="app-stagger-rows">
                    {rules.map((rule) => {
                        const professionName = professionMap.get(rule.profession_id) || `ID ${rule.profession_id}`;
                        const resourceName = resourceMap.get(rule.resource_id) || `ID ${rule.resource_id}`;
                        const isActive = rule.state === 'A';
                        const isSelected = ruleKey(rule) === selectedKey;

                        return (
                            <tr
                                key={ruleKey(rule)}
                                onClick={() => onSelect(rule)}
                                className={`app-table-row ${isSelected ? "app-table-row--selected" : ""}`}
                            >
                                <td>{professionName}</td>
                                <td>{resourceName}</td>
                                <td className="app-table-cell--number">{rule.expected_amount}</td>
                                <td>
                                    {rule.effective_date}
                                    {rule.end_date && <span className="app-table-cell--time"> → {rule.end_date}</span>}
                                </td>
                                <td>
                                    <span className={`app-table-badge ${isActive ? "app-table-badge--ok" : "app-table-badge--error"}`}>
                                        {isActive ? "Activa" : "Inactiva"}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="app-table-footer">
                <div className="app-table-footer-meta">
                    Select a row to edit &bull; {rules.length} rule{rules.length !== 1 ? 's' : ''}
                </div>
            </div>
        </div>
    );
}
