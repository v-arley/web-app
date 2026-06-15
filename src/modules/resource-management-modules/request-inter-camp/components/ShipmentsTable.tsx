import type { ShipmentFormValues } from "../schemas/shipment.schema";

interface ShipmentsTableProps {
  shipments: ShipmentFormValues[];
  onViewDetail: (shipment: ShipmentFormValues) => void;
  isLoading?: boolean;
}

const STATUS_META: Record<string, { label: string; badgeClass: string }> = {
  P: { label: "PENDING",    badgeClass: "app-table-badge--warn" },
  I: { label: "IN TRANSIT", badgeClass: "app-table-badge--warn" },
  D: { label: "DELIVERED",  badgeClass: "app-table-badge--ok" },
  C: { label: "CANCELLED",  badgeClass: "app-table-badge--error" },
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
      <div className="app-empty-state app-animate-fade h-full min-h-64">
        <span>No shipments have been registered yet</span>
      </div>
    );
  }

  return (
    <div className="app-table-wrap">
      <table className="app-table">
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

        <tbody className="app-stagger-rows">
          {shipments.map((shipment) => {
            const meta = STATUS_META[shipment.status] ?? STATUS_META.P;

            return (
              <tr
                key={shipment.id}
                className="app-table-row select-none border-l-2 border-l-status-critical bg-status-critical/5 hover:bg-status-critical/10"
                onDoubleClick={() => onViewDetail(shipment)}
                title="Double-click to view detail"
              >
                <td className="app-table-cell--primary">
                  {String(shipment.id ?? "")}
                </td>

                <td className="app-table-cell--time">
                  REQ-{shipment.request_id}
                </td>

                <td className="app-table-cell--primary">
                  {getShipmentCampLabel(shipment, "sender")}
                </td>

                <td className="app-table-cell--primary">
                  {getShipmentCampLabel(shipment, "receiver")}
                </td>

                <td>
                  <span className={`app-table-badge ${meta.badgeClass}`}>
                    {meta.label}
                  </span>
                </td>

                <td className="app-table-cell--time">
                  {shipment.departure_date
                    ? new Date(shipment.departure_date).toLocaleDateString("es-ES")
                    : "—"}
                </td>

                <td className="app-table-cell--time">
                  {shipment.arrival_date
                    ? new Date(shipment.arrival_date).toLocaleDateString("es-ES")
                    : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
