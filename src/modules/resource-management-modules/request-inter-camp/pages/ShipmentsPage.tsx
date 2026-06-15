import { useState } from "react";
import { useShipmentsQuery } from "../hooks/useShipmentsQuery";
import { useShipmentMutation } from "../hooks/useShipmentMutation";
import { ShipmentsTable } from "../components/ShipmentsTable";
import { ShipmentDetailModal } from "../components/ShipmentDetailModal";
import { useToast } from "../../../../shared/hooks/useToast";
import type { ShipmentFormValues } from "../schemas/shipment.schema";
import PaginationFooter from "../../shared/components/PaginationFooter";
import { useNavigation } from "../../../../shared/app/NavigationContext";

export function ShipmentsPage() {
  const { toast } = useToast();
  const { authContext } = useNavigation();
  const campId = authContext.campId ?? 0;
  const [statusFilter, setStatusFilter] = useState<'P' | 'I' | 'D' | 'C' | ''>('');
  const [page, setPage] = useState(1);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentFormValues | null>(null);
  const pageSize = 20;

  const { data: shipments = [], isLoading } = useShipmentsQuery(
    {
      requestType: "R",
      ...(statusFilter ? { status: statusFilter } : {}),
    },
    campId > 0,
  );

  const totalRecords = shipments.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const pagedShipments = shipments.slice((page - 1) * pageSize, page * pageSize);
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
    <article className="flex h-full flex-col overflow-hidden bg-transparent">
      <section className="app-split app-split--glass" style={{ flexDirection: "column" }}>
        <header className="app-panel-header">
          <div>
            <div className="app-panel-title">Shipments</div>
          </div>

          <div className="app-panel-actions">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as 'P' | 'I' | 'D' | 'C' | ''); setPage(1); }}
              className="app-input-default"
              aria-label="Filter by shipment status"
            >
              <option value="">STATUS: ALL</option>
              <option value="P">STATUS: PENDING</option>
              <option value="I">STATUS: IN_TRANSIT</option>
              <option value="D">STATUS: DELIVERED</option>
              <option value="C">STATUS: CANCELLED</option>
            </select>
          </div>
        </header>

        <div className="app-table-region app-table-frame">
          {isLoading ? (
            <div className="app-loading-state" style={{ flexDirection: "column", gap: "0.5rem" }}>
              <div className="app-spinner app-spinner--lg" />
              <span className="app-eyebrow" style={{ letterSpacing: "0.35em" }}>Loading Shipments...</span>
            </div>
          ) : (
            <ShipmentsTable
              shipments={pagedShipments}
              onViewDetail={(shipment) => {
                setSelectedShipment(shipment);
              }}
              isLoading={
                startTransit.isPending ||
                confirmDelivery.isPending ||
                cancelShipment.isPending
              }
            />
          )}
        </div>

        <PaginationFooter
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
        />
      </section>

      {selectedShipment && (
        <ShipmentDetailModal
          shipment={selectedShipment}
          onClose={() => setSelectedShipment(null)}
          onStartTransit={handleStartTransit}
          onConfirmDelivery={handleConfirmDelivery}
          onCancel={handleCancel}
          isLoading={startTransit.isPending || confirmDelivery.isPending || cancelShipment.isPending}
        />
      )}
    </article>
  );
}
