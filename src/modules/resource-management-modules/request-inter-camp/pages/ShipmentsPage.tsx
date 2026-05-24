import { useShipmentsQuery } from "../hooks/useShipmentsQuery";
import { useShipmentMutation } from "../hooks/useShipmentMutation";
import { ShipmentsTable } from "../components/ShipmentsTable";

export function ShipmentsPage() {
  const { data: shipments = [], isLoading } = useShipmentsQuery({});

  const { startTransit, confirmDelivery, cancelShipment } = useShipmentMutation();

  const handleStartTransit = (id: number) => {
    if (confirm("¿Confirmar que el envío ha salido del campamento origen?")) {
      startTransit.mutate(id);
    }
  };

  const handleConfirmDelivery = (id: number) => {
    const observations = prompt("Observaciones de la recepción (opcional):");
    confirmDelivery.mutate({ id, observations: observations || undefined });
  };

  const handleCancel = (id: number) => {
    const observations = prompt("Motivo de cancelación:");
    if (observations) {
      cancelShipment.mutate({ id, observations });
    }
  };

  return (
    <div className="flex h-full flex-col p-4 md:p-6 bg-bg-app gap-4">
      {/* <div className="flex items-center justify-between">
        <div className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-[0.2em]">
          Gestión Inter-Campamento / Envíos
        </div>
        
      </div> */}

      <div className="relative flex min-h-0 flex-1 overflow-hidden bg-bg-secondary border border-border-default shadow-2xl">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50 z-10" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/50 z-10" />

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="h-10 w-10 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-txt-secondary animate-pulse">Cargando envíos...</p>
              </div>
            ) : (
              <ShipmentsTable
                shipments={shipments}
                onStartTransit={handleStartTransit}
                onConfirmDelivery={handleConfirmDelivery}
                onCancel={handleCancel}
                isLoading={
                  startTransit.isPending ||
                  confirmDelivery.isPending ||
                  cancelShipment.isPending
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
