<<<<<<< HEAD
import { FileText, Package, X } from "lucide-react";
=======
import { CheckCircle, Package, XCircle } from "lucide-react";
import ResourcesSidebar from "../../shared/components/ResourcesSidebar";
import { useRequestResourcesQuery } from "../hooks/useRequestResourcesQuery";
>>>>>>> develop
import { useQuery } from "@tanstack/react-query";

import { ResourceService } from "../../../../services/ResourceService";
<<<<<<< HEAD
import { useRequestResourcesQuery } from "../hooks/useRequestResourcesQuery";
=======
import type { Resource } from "../../../../models/Resource";
>>>>>>> develop

const resourceService = new ResourceService();

const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  P: { label: "PENDING",  color: "text-status-warning", bg: "bg-status-warning/10", border: "border-status-warning/30" },
  A: { label: "APPROVED", color: "text-status-ok",      bg: "bg-status-ok/10",      border: "border-status-ok/30" },
  R: { label: "REJECTED", color: "text-status-critical", bg: "bg-status-critical/10", border: "border-status-critical/30" },
};

interface RequestDetailModalProps {
  requestId: number;
  description?: string | null;
  originLabel?: string;
  destinationLabel?: string;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  requestStatus?: string;
  isLoading?: boolean;
}

<<<<<<< HEAD
export function RequestDetailModal({
  requestId,
  description,
  originLabel,
  destinationLabel,
  onClose,
}: RequestDetailModalProps) {
  const { data: resources = [], isLoading } = useRequestResourcesQuery(requestId);
=======
export function RequestDetailModal({ requestId, onClose, onApprove, onReject, requestStatus, isLoading = false }: RequestDetailModalProps) {
  const statusMeta = STATUS_META[requestStatus ?? "P"] ?? STATUS_META["P"];
  const { data: resources = [] } = useRequestResourcesQuery(requestId);
>>>>>>> develop

  const { data: availableResources = [] } = useQuery({
    queryKey: ["resources-list"],
    queryFn: async () => {
      const res = await resourceService.findAll();
<<<<<<< HEAD
      return res.getResultado<any[]>("registros") ?? [];
    },
  });

  const getResourceName = (id: number) => {
    return (
      availableResources.find((resource: any) => resource.id === id)?.name ||
      `Resource #${id}`
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 font-mono backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden border border-border-default bg-bg-secondary shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-border-default bg-bg-primary px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center bg-accent text-accent-fg">
              <Package size={22} />
            </div>

            <div>
              <h2 className="text-[20px] font-bold uppercase tracking-[0.16em] text-txt-primary">
                Request Detail #{requestId}
              </h2>

              <p className="mt-1 text-[13px] font-bold uppercase tracking-[0.12em] text-txt-secondary">
                Requested resources for inter-camp transfer
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close request detail"
            title="Close request detail"
            className="flex h-11 w-11 items-center justify-center border border-border-strong text-txt-primary transition-colors hover:border-accent hover:bg-accent hover:text-accent-fg"
          >
            <X size={19} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <div className="mb-5 grid gap-4 md:grid-cols-2">
            <div className="border border-border-default bg-bg-primary px-4 py-3">
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-txt-disabled">
                Origin
              </p>

              <p className="mt-2 text-[16px] font-bold tracking-[0.04em] text-txt-primary">
                {originLabel || "Not specified"}
              </p>
            </div>

            <div className="border border-border-default bg-bg-primary px-4 py-3">
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-txt-disabled">
                Destination
              </p>

              <p className="mt-2 text-[16px] font-bold tracking-[0.04em] text-txt-primary">
                {destinationLabel || "Not specified"}
              </p>
            </div>
          </div>

          <div className="mb-5 border border-border-default bg-bg-primary px-4 py-4">
            <div className="mb-3 flex items-center gap-2">
              <FileText size={17} className="text-accent" />

              <p className="text-[14px] font-bold uppercase tracking-[0.15em] text-txt-primary">
                Request Description
              </p>
            </div>

            <p className="min-h-[52px] whitespace-pre-wrap text-[15px] font-bold leading-relaxed tracking-[0.04em] text-txt-secondary">
              {description?.trim() || "No description registered for this request."}
            </p>
          </div>

          {isLoading ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center gap-4 border border-border-default bg-bg-primary">
              <div className="h-10 w-10 animate-spin border-4 border-accent/30 border-t-accent" />

              <p className="text-[14px] font-bold uppercase tracking-[0.16em] text-txt-secondary">
                Loading resources...
              </p>
            </div>
          ) : resources.length === 0 ? (
            <div className="flex min-h-[220px] items-center justify-center border border-dashed border-border-default bg-bg-primary px-6 py-10">
              <p className="text-[14px] font-bold uppercase tracking-[0.16em] text-txt-secondary">
                No resources found for this request
              </p>
            </div>
          ) : (
            <div className="overflow-hidden border border-border-default bg-bg-primary">
              <div className="grid grid-cols-[minmax(0,1fr)_160px] gap-4 border-b border-border-default bg-bg-secondary px-5 py-4">
                <div className="text-[13px] font-bold uppercase tracking-[0.14em] text-txt-secondary">
                  Resource
                </div>

                <div className="text-center text-[13px] font-bold uppercase tracking-[0.14em] text-txt-secondary">
                  Quantity
                </div>
              </div>

              <div className="divide-y divide-border-default">
                {resources.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[minmax(0,1fr)_160px] items-center gap-4 px-5 py-4 transition-colors hover:bg-bg-secondary/70"
                  >
                    <div>
                      <p className="text-[16px] font-bold tracking-[0.04em] text-txt-primary">
                        {getResourceName(item.resource_id)}
                      </p>

                      <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.12em] text-txt-disabled">
                        Resource ID: {item.resource_id}
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <span className="inline-flex min-w-[80px] justify-center border border-accent/40 bg-accent/10 px-4 py-2 text-[15px] font-bold tracking-[0.08em] text-accent">
                        {item.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <footer className="flex shrink-0 justify-end border-t border-border-default bg-bg-primary px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="border border-border-strong bg-bg-secondary px-7 py-3 text-[14px] font-bold uppercase tracking-[0.13em] text-txt-primary transition-colors hover:border-accent hover:text-accent"
          >
            Close
          </button>
        </footer>
=======
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
>>>>>>> develop
      </div>
    </div>
  );
}