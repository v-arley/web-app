import { useState } from "react";
import { useShipmentsQuery } from "../hooks/useShipmentsQuery";
import { useShipmentMutation } from "../hooks/useShipmentMutation";
import { ShipmentsTable } from "../components/ShipmentsTable";
import { ShipmentDetailModal } from "../components/ShipmentDetailModal";
import { useToast } from "../../../../shared/hooks/useToast";
import type { ShipmentFormValues } from "../schemas/shipment.schema";
import { FilterBar } from "../../shared/components/FilterBar";
import PaginationFooter from "../../shared/components/PaginationFooter";
import PageHeader from "../../shared/components/PageHeader";
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
      <PageHeader
        icon={null}
        title="SHIPMENTS"
        subtitle={undefined}
        rightContent={<div className="flex items-center gap-4 font-mono text-[12px] text-txt-muted uppercase tracking-widest"><span>Total: <span className="text-accent font-bold">{String(totalRecords).padStart(4, "0")}</span></span><span className="opacity-30">|</span><span className="text-status-ok font-bold">[SHIPMENTS]</span></div>}
      />
      <FilterBar wrapperClassName="px-4 pt-4 pb-0">
        <div className="bg-bg-secondary border border-border-default px-4 py-2 flex items-center gap-6 w-full">
          <label className="font-mono text-[12px] font-bold text-txt-disabled uppercase tracking-widest shrink-0">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as 'P' | 'I' | 'D' | 'C' | ''); setPage(1); }}
            className="rmm-input text-[12px]!"
          >
            <option value="">All</option>
            <option value="P">Pending</option>
            <option value="I">In Transit</option>
            <option value="D">Delivered</option>
            <option value="C">Cancelled</option>
          </select>
        </div>
      </FilterBar>
      <section className="flex-1 overflow-auto rmm-content-pad">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-10 w-10 border-4 border-accent/30 border-t-accent animate-spin" />
            <p className="font-mono text-[10px] uppercase tracking-wide text-txt-secondary animate-pulse">LOADING SHIPMENTS...</p>
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
      </section>
      <PaginationFooter
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        leftContent={<div className="flex items-center gap-4 font-mono text-[11px] text-txt-muted uppercase tracking-widest">
          <span>Total: <span className="text-accent font-bold">{String(totalRecords).padStart(4, "0")}</span></span></div>}
        compact
        className="px-4"
      />

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
