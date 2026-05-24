import { useState } from "react";
import { Check, X, Eye } from "lucide-react";
import type { CampRequestFormValues } from "../schemas/camp-request.schema";
import { RequestDetailModal } from "./RequestDetailModal";

interface IncomingRequestsTableProps {
  requests: CampRequestFormValues[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  isLoading?: boolean;
}

export function IncomingRequestsTable({
  requests,
  onApprove,
  onReject,
  isLoading = false,
}: IncomingRequestsTableProps) {
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-bg-tertiary/20 border-2 border-dashed border-border-default">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-txt-secondary italic">
          No hay solicitudes entrantes registradas
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      P: "bg-status-warning/10 text-status-warning border-status-warning/30",
      A: "bg-status-ok/10 text-status-ok border-status-ok/30",
      R: "bg-status-critical/10 text-status-critical border-status-critical/30",
    };
    const labels = {
      P: "P",
      A: "A",
      R: "R",
    };
    return (
      <span className={`px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-widest border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <>
      <div className="bg-bg-tertiary border border-border-default overflow-hidden">
        <div className="bg-bg-primary border-b border-border-default px-4 py-3 grid grid-cols-[1fr_1.5fr_0.9fr_0.9fr_1fr] gap-4">
          <div className="font-mono text-[9px] font-bold text-txt-secondary uppercase tracking-widest">ORIGEN</div>
          <div className="font-mono text-[9px] font-bold text-txt-secondary uppercase tracking-widest">DESCRIPCIÓN</div>
          <div className="font-mono text-[9px] font-bold text-txt-secondary uppercase tracking-widest text-center">ESTADO</div>
          <div className="font-mono text-[9px] font-bold text-txt-secondary uppercase tracking-widest">FECHA</div>
          <div className="font-mono text-[9px] font-bold text-txt-secondary uppercase tracking-widest text-right">ACCIONES</div>
        </div>

        <div className="divide-y divide-border-default">
          {requests.map((request) => (
            <div 
              key={request.id} 
              className="px-4 py-3 grid grid-cols-[1fr_1.5fr_0.9fr_0.9fr_1fr] gap-4 items-center hover:bg-bg-primary/30 transition-colors"
            >
              <div>
                <div className="font-mono text-[10px] font-bold text-txt-primary">
                  CAMP #{request.origin_camp_id}
                </div>
              </div>
              
              <div>
                <p className="font-mono text-[9px] text-txt-secondary line-clamp-1" title={request.description || ""}>
                  {request.description || "Sin descripción"}
                </p>
              </div>
              
              <div className="flex justify-center">
                {getStatusBadge(request.destination_approval_status || 'P')}
              </div>
              
              <div>
                <span className="font-mono text-[9px] text-txt-secondary">
                  {new Date(request.created_at || '').toLocaleDateString('es-ES')}
                </span>
              </div>
              
              <div className="flex justify-end items-center gap-2">
                <button
                  onClick={() => setSelectedRequestId(request.id!)}
                  className="p-1.5 hover:bg-accent/10 border border-accent/30 transition-all"
                  title="Ver recursos"
                >
                  <Eye className="h-3 w-3 text-accent" />
                </button>
                
                {request.destination_approval_status === 'P' && (
                  <>
                    <button
                      onClick={() => onApprove(request.id!)}
                      disabled={isLoading}
                      className="p-1.5 hover:bg-status-ok/10 border border-status-ok/30 transition-all disabled:opacity-50"
                      title="Aprobar Solicitud"
                    >
                      <Check className="h-3 w-3 text-status-ok" />
                    </button>
                    <button
                      onClick={() => onReject(request.id!)}
                      disabled={isLoading}
                      className="p-1.5 hover:bg-status-critical/10 border border-status-critical/30 transition-all disabled:opacity-50"
                      title="Rechazar Solicitud"
                    >
                      <X className="h-3 w-3 text-status-critical" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedRequestId && (
        <RequestDetailModal 
          requestId={selectedRequestId} 
          onClose={() => setSelectedRequestId(null)} 
        />
      )}
    </>
  );
}