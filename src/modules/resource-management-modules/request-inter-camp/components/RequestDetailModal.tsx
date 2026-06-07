import { CheckCircle, Package, XCircle } from "lucide-react";
import ResourcesSidebar from "../../shared/components/ResourcesSidebar";
import { useRequestResourcesQuery } from "../hooks/useRequestResourcesQuery";
import { useQuery } from "@tanstack/react-query";
import { ResourceService } from "../../../../services/ResourceService";
import type { Resource } from "../../../../models/Resource";

const resourceService = new ResourceService();

const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  P: { label: "PENDING",  color: "text-status-warning", bg: "bg-status-warning/10", border: "border-status-warning/30" },
  A: { label: "APPROVED", color: "text-status-ok",      bg: "bg-status-ok/10",      border: "border-status-ok/30" },
  R: { label: "REJECTED", color: "text-status-critical", bg: "bg-status-critical/10", border: "border-status-critical/30" },
};

interface RequestDetailModalProps {
  requestId: number;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  requestStatus?: string;
  isLoading?: boolean;
}

export function RequestDetailModal({ requestId, onClose, onApprove, onReject, requestStatus, isLoading = false }: RequestDetailModalProps) {
  const statusMeta = STATUS_META[requestStatus ?? "P"] ?? STATUS_META["P"];
  const { data: resources = [] } = useRequestResourcesQuery(requestId);

  const { data: availableResources = [] } = useQuery({
    queryKey: ["resources-list"],
    queryFn: async () => {
      const res = await resourceService.findAll();
      return res.getResultado<Resource[]>("registros") ?? [];
    }
  });

  const getResourceName = (id: number) => availableResources.find((r) => r.id === id)?.name || `ID: ${id}`;

  function handleClose() {
    if (!isLoading) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="relative w-full max-w-4xl bg-bg-tertiary/90 backdrop-blur-lg border border-border-strong shadow-2xl flex flex-col md:flex-row max-h-[85vh]">

        <div className="flex-1 flex flex-col min-w-0">
          <header className="px-5 py-4 border-b border-border-subtle bg-bg-secondary/50 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-0.5 self-stretch bg-accent" />
              <Package size={16} className="text-accent" />
              <div>
                <div className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-widest">REQUEST DETAIL</div>
              </div>
            </div>
          </header>

          {/* Main Information */}
          <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">

            <div className="flex items-center justify-center gap-3">
              <span className="font-mono text-[11px] text-txt-disabled uppercase tracking-widest w-24">STATUS</span>
              <span className={` font-mono text-[11px] font-bold uppercase tracking-widest ${statusMeta.color} `}>{statusMeta.label}</span>
            </div>

            <div className="border-t border-border-subtle" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <div className="font-mono text-[11px] text-txt-disabled uppercase tracking-widest mb-1">Request ID</div>
                <div className="font-mono text-[11px] font-bold text-txt-primary">{String(requestId)}</div>
              </div>
              <div>
                <div className="font-mono text-[11px] text-txt-disabled uppercase tracking-widest mb-1">Approval</div>
                <div className="font-mono text-[11px] text-txt-secondary">{statusMeta.label}</div>
              </div>
              <div>
                <div className="font-mono text-[11px] text-txt-disabled uppercase tracking-widest mb-1">Resources</div>
                <div className="font-mono text-[11px] text-txt-secondary">{resources.length}</div>
              </div>
              <div>
                <div className="font-mono text-[11px] text-txt-disabled uppercase tracking-widest mb-1">Action mode</div>
                <div className="font-mono text-[11px] text-txt-secondary">{onApprove || onReject ? "INTERACTIVE" : "READ-ONLY"}</div>
              </div>
            </div>

            <div className="border-t border-border-subtle" />

          </div>

          <footer className="px-5 py-4 bg-bg-secondary/30 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex flex-wrap items-center gap-2">
              {onApprove && requestStatus === "P" && (
                <button
                  onClick={() => { onApprove(); onClose(); }}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-4 py-2 bg-status-ok/10 border border-status-ok/40 font-mono text-[10px] font-bold text-status-ok uppercase tracking-widest hover:bg-status-ok/20 transition-all disabled:opacity-50"
                >
                  <CheckCircle size={12} />
                  APPROVE
                </button>
              )}

              {onReject && requestStatus === "P" && (
                <button
                  onClick={() => { onReject(); onClose(); }}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-4 py-2 bg-status-critical/10 border border-status-critical/40 font-mono text-[10px] font-bold text-status-critical uppercase tracking-widest hover:bg-status-critical/20 transition-all disabled:opacity-50"
                >
                  <XCircle size={12} />
                  REJECT
                </button>
              )}

              {requestStatus && requestStatus !== "P" && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-secondary border border-border-default text-[10px] font-mono text-txt-secondary uppercase tracking-widest">
                  {statusMeta.label}
                </div>
              )}
            </div>

            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-5 py-2 bg-bg-secondary/50 border border-border-default font-mono text-[10px] font-bold text-txt-primary uppercase tracking-widest hover:border-accent hover:text-accent transition-all disabled:opacity-50"
            >
              CLOSE
            </button>
          </footer>
        </div>

        <ResourcesSidebar
          title="REQUESTED RESOURCES"
          items={resources.map((r) => ({ id: r.id ?? `${r.resource_id}`, label: getResourceName(r.resource_id), value: r.amount }))}
          className="w-full md:w-72"
          renderItem={(it) => <span className="truncate">{it.label}</span>}
        />
      </div>
    </div>
  );
}
