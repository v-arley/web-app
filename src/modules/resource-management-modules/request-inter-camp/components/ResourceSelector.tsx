import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ResourceService } from "../../../../services/ResourceService";

const resourceService = new ResourceService();

interface ResourceItem {
  resource_id: number;
  amount: number;
  name?: string;
}

interface ResourceSelectorProps {
  resources: ResourceItem[];
  onChange: (resources: ResourceItem[]) => void;
}

export function ResourceSelector({ resources, onChange }: ResourceSelectorProps) {
  const [resourceId, setResourceId] = useState<number>(0);
  const [amount, setAmount] = useState<number>(1);

  const { data: availableResources = [] } = useQuery({
    queryKey: ["resources-list"],
    queryFn: async () => {
      const res = await resourceService.findAll();
      return res.getResultado<any[]>("registros") ?? [];
    }
  });

  const handleAdd = () => {
    if (resourceId > 0 && amount > 0) {
      const alreadyAdded = resources.find(r => r.resource_id === resourceId);
      if (alreadyAdded) {
        alert("Este recurso ya ha sido agregado.");
        return;
      }

      const resource = availableResources.find(r => r.id === resourceId);
      onChange([...resources, { 
        resource_id: resourceId, 
        amount, 
        name: resource?.name || `Recurso #${resourceId}` 
      }]);
      setResourceId(0);
      setAmount(1);
    }
  };

  const handleRemove = (index: number) => {
    onChange(resources.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end">
        <div className="flex-1 min-w-0">
          <label htmlFor="resource-id" className="rmm-label mb-1.5">
            RESOURCE
          </label>
          <select
            id="resource-id"
            value={resourceId}
            onChange={(e) => setResourceId(Number(e.target.value))}
            className="rmm-input w-full"
          >
            <option value={0}>SELECT_RESOURCE...</option>
            {availableResources.map((r: any) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.unit_of_measure})
              </option>
            ))}
          </select>
        </div>
        <div className="w-20">
          <label htmlFor="amount" className="rmm-label mb-1.5">
            QTY
          </label>
          <input
            id="amount"
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="rmm-input w-full"
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={resourceId === 0}
          className="rmm-btn border border-accent/30 bg-accent/5 text-accent hover:bg-accent/15 h-[32px] px-3 disabled:opacity-30"
        >
          <Plus className="h-3.5 w-3.5" />
          ADD
        </button>
      </div>

      {resources.length > 0 && (
        <div className="bg-bg-tertiary border border-border-default overflow-hidden">
          <div className="bg-bg-primary border-b border-border-default px-4 py-3 grid grid-cols-[1fr_0.6fr_0.4fr] gap-4">
            <div className="font-mono text-[9px] font-bold text-txt-secondary uppercase tracking-widest">RECURSO</div>
            <div className="font-mono text-[9px] font-bold text-txt-secondary uppercase tracking-widest text-center">CANTIDAD</div>
            <div className="font-mono text-[9px] font-bold text-txt-secondary uppercase tracking-widest text-center">ACCIONES</div>
          </div>

          <div className="divide-y divide-border-default">
            {resources.map((item, index) => (
              <div 
                key={index} 
                className="px-4 py-3 grid grid-cols-[1fr_0.6fr_0.4fr] gap-4 items-center hover:bg-bg-primary/30 transition-colors"
              >
                <div>
                  <span className="font-mono text-[10px] text-txt-primary">{item.name || `ID: ${item.resource_id}`}</span>
                </div>
                
                <div className="text-center">
                  <span className="font-mono text-[10px] font-bold text-txt-primary">{item.amount}</span>
                </div>
                
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="p-1.5 hover:bg-status-critical/10 border border-status-critical/30 transition-all"
                    title="Quitar recurso"
                  >
                    <Trash2 className="h-3 w-3 text-status-critical" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
