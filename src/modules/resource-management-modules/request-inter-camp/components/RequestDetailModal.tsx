import { FileText, Package, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { ResourceService } from "../../../../services/ResourceService";
import { useRequestResourcesQuery } from "../hooks/useRequestResourcesQuery";

const resourceService = new ResourceService();

interface RequestDetailModalProps {
  requestId: number;
  description?: string | null;
  originLabel?: string;
  destinationLabel?: string;
  onClose: () => void;
}

export function RequestDetailModal({
  requestId,
  description,
  originLabel,
  destinationLabel,
  onClose,
}: RequestDetailModalProps) {
  const { data: resources = [], isLoading } = useRequestResourcesQuery(requestId);

  const { data: availableResources = [] } = useQuery({
    queryKey: ["resources-list"],
    queryFn: async () => {
      const res = await resourceService.findAll();
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
      </div>
    </div>
  );
}