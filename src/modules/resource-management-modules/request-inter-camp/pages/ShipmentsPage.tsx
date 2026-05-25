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
    <article className="flex h-full flex-col overflow-hidden bg-bg-app">
      <section className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-10 w-10 border-4 border-accent/30 border-t-accent animate-spin" />
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
      </section>
    </article>
  );
}
