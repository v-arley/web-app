import { useShipmentsQuery } from "../hooks/useShipmentsQuery";
import { useShipmentMutation } from "../hooks/useShipmentMutation";
import { ShipmentsTable } from "../components/ShipmentsTable";
import { useToast } from "../../../../shared/hooks/useToast";

export function ShipmentsPage() {
  const { toast } = useToast();
  const { data: shipments = [], isLoading } = useShipmentsQuery({});
  const { startTransit, confirmDelivery, cancelShipment } = useShipmentMutation();

  const handleStartTransit = async (id: number) => {
    try {
      await startTransit.mutateAsync(id);
      toast({ tone: "success", title: "Shipment dispatched", message: "Shipment marked as in transit." });
    } catch (error) {
      toast({
        tone: "error",
        title: "Dispatch failed",
        message: error instanceof Error ? error.message : "Failed to update shipment status.",
      });
    }
  };

  const handleConfirmDelivery = async (id: number) => {
    try {
      await confirmDelivery.mutateAsync({ id, observations: undefined });
      toast({ tone: "success", title: "Delivery confirmed", message: "Shipment received and delivery confirmed." });
    } catch (error) {
      toast({
        tone: "error",
        title: "Confirmation failed",
        message: error instanceof Error ? error.message : "Failed to confirm delivery.",
      });
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await cancelShipment.mutateAsync({ id, observations: undefined });
      toast({ tone: "info", title: "Shipment cancelled", message: "Shipment has been cancelled." });
    } catch (error) {
      toast({
        tone: "error",
        title: "Cancellation failed",
        message: error instanceof Error ? error.message : "Failed to cancel the shipment.",
      });
    }
  };

  return (
    <article className="flex h-full flex-col overflow-hidden bg-bg-app">
      <section className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-10 w-10 border-4 border-accent/30 border-t-accent animate-spin" />
            <p className="font-mono text-[10px] uppercase tracking-wide text-txt-secondary animate-pulse">LOADING SHIPMENTS...</p>
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
