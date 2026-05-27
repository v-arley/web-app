import { Package, CheckCircle, X } from "lucide-react";
import type { ShipmentFormValues } from "../schemas/shipment.schema";

interface ShipmentsTableProps {
  shipments: ShipmentFormValues[];
  onStartTransit: (id: number) => void;
  onConfirmDelivery: (id: number) => void;
  onCancel: (id: number) => void;
  isLoading?: boolean;
}

export function ShipmentsTable({
  shipments,
  onStartTransit,
  onConfirmDelivery,
  onCancel,
  isLoading = false,
}: ShipmentsTableProps) {
  if (shipments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-txt-secondary">
          NO SHIPMENTS HAVE BEEN REGISTERED YET
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      P: "bg-status-warning/10 text-status-warning border-status-warning/30",
      I: "bg-status-info/10 text-status-info border-status-info/30",
      D: "bg-status-ok/10 text-status-ok border-status-ok/30",
      C: "bg-status-critical/10 text-status-critical border-status-critical/30",
    };
    const labels = {
      P: "P",
      I: "I",
      D: "D",
      C: "C",
    };
    return (
      <span className={`px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-widest border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="bg-bg-tertiary border border-border-default overflow-hidden">
      <div className="bg-bg-primary border-b border-border-default px-4 py-3 grid grid-cols-[0.6fr_0.7fr_0.8fr_0.9fr_0.9fr_1.2fr] gap-4">
        <div className="font-mono text-[9px] font-bold text-txt-secondary uppercase tracking-widest">ID</div>
        <div className="font-mono text-[9px] font-bold text-txt-secondary uppercase tracking-widest">REQUEST</div>
        <div className="font-mono text-[9px] font-bold text-txt-secondary uppercase tracking-widest text-center">STATUS</div>
        <div className="font-mono text-[9px] font-bold text-txt-secondary uppercase tracking-widest">DEPARTURE</div>
        <div className="font-mono text-[9px] font-bold text-txt-secondary uppercase tracking-widest">ARRIVAL</div>
        <div className="font-mono text-[9px] font-bold text-txt-secondary uppercase tracking-widest text-right">ACTIONS</div>
      </div>

      <div className="divide-y divide-border-default">
        {shipments.map((shipment) => (
          <div 
            key={shipment.id} 
            className="px-4 py-3 grid grid-cols-[0.6fr_0.7fr_0.8fr_0.9fr_0.9fr_1.2fr] gap-4 items-center hover:bg-bg-primary/30 transition-colors"
          >
            <div>
              <span className="font-mono text-[10px] font-bold text-txt-primary">#{shipment.id}</span>
            </div>
            
            <div>
              <span className="font-mono text-[9px] text-txt-secondary">REQ #{shipment.request_id}</span>
            </div>
            
            <div className="flex justify-center">
              {getStatusBadge(shipment.status)}
            </div>
            
            <div>
              <span className="font-mono text-[9px] text-txt-secondary">
                {shipment.departure_date ? new Date(shipment.departure_date).toLocaleDateString('es-ES') : '--'}
              </span>
            </div>
            
            <div>
              <span className="font-mono text-[9px] text-txt-secondary">
                {shipment.arrival_date ? new Date(shipment.arrival_date).toLocaleDateString('es-ES') : '--'}
              </span>
            </div>
            
            <div className="flex justify-end items-center gap-2">
              {shipment.status === 'P' && (
                <button
                  onClick={() => onStartTransit(shipment.id!)}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-status-info/10 border border-status-info/30 font-mono text-[9px] font-bold text-status-info uppercase tracking-widest hover:bg-status-info/20 transition-all disabled:opacity-50"
                >
                  START
                </button>
              )}
              
              {shipment.status === 'I' && (
                <button
                  onClick={() => onConfirmDelivery(shipment.id!)}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-status-ok/10 border border-status-ok/30 font-mono text-[9px] font-bold text-status-ok uppercase tracking-widest hover:bg-status-ok/20 transition-all disabled:opacity-50"
                >
                  CONFIRM
                </button>
              )}

              {['P', 'I'].includes(shipment.status) && (
                <button
                  onClick={() => onCancel(shipment.id!)}
                  disabled={isLoading}
                  className="p-1.5 hover:bg-status-critical/10 border border-status-critical/30 transition-all disabled:opacity-50"
                  title="Cancel Shipment"
                >
                  <X className="h-3 w-3 text-status-critical" />
                </button>
              )}
              
              {shipment.status === 'D' && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-status-ok/10 border border-status-ok/30">
                  <CheckCircle className="h-3 w-3 text-status-ok" />
                  <span className="font-mono text-[9px] font-bold text-status-ok uppercase tracking-widest">OK</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}