
import { InventoryView } from "./InventoryView";

export function WarehouseView() {
    return (
        <div className="w-full h-full flex flex-col bg-[#f0f2f5] overflow-hidden">
            {/* Top Bar Navigation */}
            <div className="w-full bg-[#e5e7eb] px-8 py-3 flex items-center justify-between shrink-0">
                <div className="text-[12px] font-mono tracking-[0.2em] text-[#888] uppercase font-bold">
                    Warehouse
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 min-h-0 w-full">
                <InventoryView />
            </div>
        </div>
    );
}
