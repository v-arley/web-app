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
      <div className="flex flex-col items-center justify-center py-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-txt-secondary">
          NO INCOMING REQUESTS RECORDED
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
          <div className="font-mono text-[9px] font-bold text-txt-secondary uppercase tracking-widest">ORIGIN</div>
          <div className="font-mono text-[9px] font-bold text-txt-secondary uppercase tracking-widest">DESCRIPTION</div>
          <div className="font-mono text-[9px] font-bold text-txt-secondary uppercase tracking-widest text-center">STATUS</div>
          <div className="font-mono text-[9px] font-bold text-txt-secondary uppercase tracking-widest">DATE</div>
          <div className="font-mono text-[9px] font-bold text-txt-secondary uppercase tracking-widest text-right">ACTIONS</div>
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
                  {request.description || "No description"}
                </p>
              </div>
              
              <div className="flex justify-center">
                {getStatusBadge(request.destination_approval_status || 'P')}
              </div>
              
              <div>
                <span className="font-mono text-[9px] text-txt-secondary">
                  {new Date(request.created_at || '').toLocaleDateString('en-US')}
                </span>
              </div>
              
              <div className="flex justify-end items-center gap-2">
                <button
                  onClick={() => setSelectedRequestId(request.id!)}
                  className="p-1.5 hover:bg-accent/10 border border-accent/30 transition-all"
                  title="View resources"
                >
                  <Eye className="h-3 w-3 text-accent" />
                </button>
                
                {request.destination_approval_status === 'P' && (
                  <>
                    <button
                      onClick={() => onApprove(request.id!)}
                      disabled={isLoading}
                      className="p-1.5 hover:bg-status-ok/10 border border-status-ok/30 transition-all disabled:opacity-50"
                      title="Approve Request"
                    >
                      <Check className="h-3 w-3 text-status-ok" />
                    </button>
                    <button
                      onClick={() => onReject(request.id!)}
                      disabled={isLoading}
                      className="p-1.5 hover:bg-status-critical/10 border border-status-critical/30 transition-all disabled:opacity-50"
                      title="Reject Request"
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