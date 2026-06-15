import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ResourceService } from "../../../../services/ResourceService";
import { ResourceSearchPicker } from "../../shared/components/ResourceSearchPicker";

const resourceService = new ResourceService();

interface ResourceItem {
  resource_id: number;
  amount: number;
  name?: string;
}

interface AvailableResource {
  id: number;
  name: string;
  unit_of_measure?: string;
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
      return res.getResultado<AvailableResource[]>("registros") ?? [];
    }
  });
  const resourceOptions = useMemo(() => {
    return availableResources.map((resource) => ({
      id: resource.id,
      label: `${resource.name} (${resource.unit_of_measure})`,
      name: resource.name,
      unit: resource.unit_of_measure,
    }));
  }, [availableResources]);

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
      <div className="flex flex-wrap gap-2 items-end">
        <div className="min-w-[min(100%,12rem)] flex-1">
          <label htmlFor="resource-id" className="app-label mb-1.5">
            RESOURCE
          </label>
          <ResourceSearchPicker
            selectedId={resourceId}
            onChange={setResourceId}
            options={resourceOptions}
            placeholder="SELECT_RESOURCE..."
          />
        </div>
        <div className="min-w-[5rem] flex-1 sm:flex-none">
          <label htmlFor="amount" className="app-label mb-1.5">
            QTY
          </label>
          <input
            id="amount"
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="app-input w-full"
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={resourceId === 0}
          className="app-btn app-btn--primary app-btn--sm"
        >
          <Plus className="h-3.5 w-3.5" />
          ADD
        </button>
      </div>

      {resources.length > 0 && (
        <div className="bg-bg-tertiary border border-border-default overflow-hidden">
          <div className="bg-bg-primary border-b border-border-default px-4 py-3 grid grid-cols-[minmax(0,1fr)_minmax(4rem,0.6fr)_minmax(3rem,0.4fr)] gap-4">
            <div className="font-mono text-[9px] font-bold text-txt-secondary uppercase tracking-widest">RECURSO</div>
            <div className="font-mono text-[9px] font-bold text-txt-secondary uppercase tracking-widest text-center">CANTIDAD</div>
            <div className="font-mono text-[9px] font-bold text-txt-secondary uppercase tracking-widest text-center">ACCIONES</div>
          </div>

          <div className="divide-y divide-border-default">
            {resources.map((item, index) => (
              <div 
                key={index} 
                className="px-4 py-3 grid grid-cols-[minmax(0,1fr)_minmax(4rem,0.6fr)_minmax(3rem,0.4fr)] gap-4 items-center hover:bg-bg-primary/30 transition-colors"
              >
                <div>
                  <span className="font-mono text-[10px] text-txt-primary break-words">{item.name || `ID: ${item.resource_id}`}</span>
                </div>
                
                <div className="text-center">
                  <span className="font-mono text-[10px] font-bold text-txt-primary">{item.amount}</span>
                </div>
                
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="app-btn app-btn--icon app-btn--sm app-btn--danger"
                    title="Quitar recurso"
                  >
                    <Trash2 className="h-3 w-3" />
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
