import { CheckCircle2, Eye } from "lucide-react";

interface Shipment {
  id?: number;
  request_id?: number;
  status?: string;
  departure_date?: string | null;
  arrival_date?: string | null;
  observations?: string | null;
  created_at?: string;
}

interface ShipmentsTableProps {
  shipments: Shipment[];
  onMarkDelivered?: (id: number) => void;
  onView?: (id: number) => void;
  isLoading?: boolean;
}

function formatStatus(status?: string | null) {
  const value = status ?? "P";

  const styles: Record<string, string> = {
    P: "border-status-warning/40 bg-status-warning/10 text-status-warning",
    D: "border-status-info/40 bg-status-info/10 text-status-info",
    A: "border-status-ok/40 bg-status-ok/10 text-status-ok",
    F: "border-status-ok/40 bg-status-ok/10 text-status-ok",
    C: "border-status-critical/40 bg-status-critical/10 text-status-critical",
  };

  const labels: Record<string, string> = {
    P: "Pending",
    D: "Dispatched",
    A: "Arrived",
    F: "Finished",
    C: "Cancelled",
  };

  return (
    <span
      className={[
        "inline-flex min-w-[92px] justify-center border px-3 py-1.5",
        "text-[12px] font-bold uppercase tracking-[0.12em]",
        styles[value] ?? styles.P,
      ].join(" ")}
    >
      {labels[value] ?? value}
    </span>
  );
}

function formatDate(value?: string | null) {
  if (!value) return "No date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "No date";
  }

  return date.toLocaleDateString("en-US");
}

export function ShipmentsTable({
  shipments,
  onMarkDelivered,
  onView,
  isLoading = false,
}: ShipmentsTableProps) {
  if (shipments.length === 0) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center border border-border-default bg-bg-secondary px-6 py-10">
        <p className="text-[15px] font-bold uppercase tracking-[0.16em] text-txt-primary">
          No shipments recorded
        </p>

        <p className="mt-2 text-[13px] font-bold tracking-[0.04em] text-txt-secondary">
          Shipments created from approved requests will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-border-default bg-bg-secondary">
      <div className="grid grid-cols-[0.7fr_1fr_1.1fr_1.1fr_1.1fr_1fr] gap-4 border-b border-border-default bg-bg-primary px-5 py-4">
        <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-txt-secondary">
          ID
        </div>

        <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-txt-secondary">
          Request
        </div>

        <div className="text-center text-[12px] font-bold uppercase tracking-[0.14em] text-txt-secondary">
          Status
        </div>

        <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-txt-secondary">
          Departure
        </div>

        <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-txt-secondary">
          Arrival
        </div>

        <div className="text-right text-[12px] font-bold uppercase tracking-[0.14em] text-txt-secondary">
          Actions
        </div>
      </div>

      <div className="divide-y divide-border-default">
        {shipments.map((shipment) => {
          const shipmentId = shipment.id ?? 0;
          const currentStatus = shipment.status ?? "P";

          return (
            <div
              key={shipmentId}
              className="grid grid-cols-[0.7fr_1fr_1.1fr_1.1fr_1.1fr_1fr] items-center gap-4 px-5 py-4 transition-colors hover:bg-bg-primary/40"
            >
              <div>
                <p className="text-[15px] font-bold uppercase tracking-[0.08em] text-txt-primary">
                  #{shipmentId}
                </p>
              </div>

              <div>
                <p className="text-[14px] font-bold uppercase tracking-[0.06em] text-txt-secondary">
                  Req #{shipment.request_id ?? "--"}
                </p>
              </div>

              <div className="flex justify-center">
                {formatStatus(currentStatus)}
              </div>

              <div>
                <span className="text-[14px] font-bold tracking-[0.04em] text-txt-primary">
                  {formatDate(shipment.departure_date ?? shipment.created_at)}
                </span>
              </div>

              <div>
                <span className="text-[14px] font-bold tracking-[0.04em] text-txt-primary">
                  {formatDate(shipment.arrival_date)}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2">
                {onView ? (
                  <button
                    type="button"
                    onClick={() => onView(shipmentId)}
                    className="flex h-10 w-10 items-center justify-center border border-accent/40 bg-accent/10 text-accent transition-colors hover:bg-accent hover:text-accent-fg"
                    title="View shipment"
                    aria-label="View shipment"
                  >
                    <Eye size={17} />
                  </button>
                ) : null}

                {onMarkDelivered && currentStatus !== "A" && currentStatus !== "F" ? (
                  <button
                    type="button"
                    onClick={() => onMarkDelivered(shipmentId)}
                    disabled={isLoading}
                    className="flex h-10 items-center justify-center gap-2 border border-status-ok/40 bg-status-ok/10 px-3 text-[12px] font-bold uppercase tracking-[0.12em] text-status-ok transition-colors hover:bg-status-ok hover:text-accent-fg disabled:cursor-not-allowed disabled:opacity-50"
                    title="Mark as delivered"
                    aria-label="Mark as delivered"
                  >
                    <CheckCircle2 size={16} />
                    OK
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}