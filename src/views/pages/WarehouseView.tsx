import type { Camp } from "../../models/Camp";
import { InventoryView } from "./InventoryView";

interface WarehouseViewProps {
  activeCamp?: Camp | null;
}

export function WarehouseView({ activeCamp: _activeCamp }: WarehouseViewProps) {
  return (
    <div className="w-full h-full flex flex-col bg-bg-app overflow-hidden">
      <div className="w-full bg-bg-secondary border-b border-border-default px-8 py-3 flex items-center justify-between shrink-0">
        <div className="text-[12px] font-mono tracking-[0.2em] text-txt-secondary uppercase font-bold">
          Warehouse
        </div>
      </div>
      <div className="flex flex-1 min-h-0 w-full">
        <InventoryView />
      </div>
    </div>
  );
}