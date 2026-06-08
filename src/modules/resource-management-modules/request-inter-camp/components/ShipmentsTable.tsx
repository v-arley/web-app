import type { ShipmentFormValues } from "../schemas/shipment.schema";

interface ShipmentsTableProps {
  shipments: ShipmentFormValues[];
  onViewDetail: (shipment: ShipmentFormValues) => void;
  isLoading?: boolean;
}

const STATUS_META: Record<string, { label: string; style: string }> = {
  P: { label: "PENDING", style: "text-status-warning" },
  I: { label: "IN TRANSIT", style: "text-accent" },
  D: { label: "DELIVERED", style: "text-status-ok" },
  C: { label: "CANCELLED", style: "text-status-critical" },
};

function getShipmentCampLabel(
  shipment: ShipmentFormValues,
  side: "sender" | "receiver",
) {
  const request = shipment.request;
  const camp =
    side === "sender" ? request?.destination_camp : request?.origin_camp;

  return camp?.code || camp?.description || "UNRESOLVED CAMP";
}

export function ShipmentsTable({
  shipments,
  onViewDetail,
}: ShipmentsTableProps) {
  if (shipments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="font-mono text-[10px] uppercase tracking-wide text-txt-secondary">
          NO SHIPMENTS HAVE BEEN REGISTERED YET
        </p>
      </div>
    );
  }

  return (
    <table className="rmm-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Request</th>
          <th>Sender</th>
          <th>Receiver</th>
          <th>Status</th>
          <th>Departure</th>
          <th>Arrival</th>
        </tr>
      </thead>

      <tbody>
        {shipments.map((shipment) => {
          const meta = STATUS_META[shipment.status] ?? STATUS_META.P;

          return (
            <tr
              key={shipment.id}
              className="cursor-pointer select-none border-l-2 border-l-status-critical bg-status-critical/5 transition-colors hover:bg-status-critical/10"
              onDoubleClick={() => onViewDetail(shipment)}
              title="Double-click to view detail"
            >
              <td>
                <span className="font-mono text-[12px] font-bold text-txt-primary">
                  {String(shipment.id ?? "")}
                </span>
              </td>

              <td>
                <span className="font-mono text-[12px] text-txt-secondary">
                  REQ-{shipment.request_id}
                </span>
              </td>

              <td>
                <span className="font-mono text-[12px] font-bold text-txt-primary">
                  {getShipmentCampLabel(shipment, "sender")}
                </span>
              </td>

              <td>
                <span className="font-mono text-[12px] font-bold text-txt-primary">
                  {getShipmentCampLabel(shipment, "receiver")}
                </span>
              </td>

              <td>
                <span
                  className={`px-2 py-1 font-mono text-[12px] font-bold uppercase tracking-widest ${meta.style}`}
                >
                  {meta.label}
                </span>
              </td>

              <td>
                <span className="font-mono text-[12px] text-txt-secondary">
                  {shipment.departure_date
                    ? new Date(shipment.departure_date).toLocaleDateString(
                        "es-ES",
                      )
                    : "—"}
                </span>
              </td>

              <td>
                <span className="font-mono text-[12px] text-txt-secondary">
                  {shipment.arrival_date
                    ? new Date(shipment.arrival_date).toLocaleDateString(
                        "es-ES",
                      )
                    : "—"}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
