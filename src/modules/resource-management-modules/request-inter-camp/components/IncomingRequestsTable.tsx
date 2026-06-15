import { useState } from "react";
import type { CampRequestFormValues } from "../schemas/camp-request.schema";
import { RequestDetailModal } from "./RequestDetailModal";

interface IncomingRequestsTableProps {
  requests: CampRequestFormValues[];
  campMap?: Map<number, string>;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  actionLoading?: boolean;
}

const STATUS_META: Record<string, { label: string; badgeClass: string }> = {
  P: { label: "PENDING",  badgeClass: "app-table-badge--warn" },
  A: { label: "APPROVED", badgeClass: "app-table-badge--ok" },
  R: { label: "REJECTED", badgeClass: "app-table-badge--error" },
};

function getCampLabel(request: CampRequestFormValues, side: "origin" | "destination", campMap?: Map<number, string>) {
  const camp = side === "origin" ? request.origin_camp : request.destination_camp;
  const campId = side === "origin" ? request.origin_camp_id : request.destination_camp_id;
  return camp?.code || camp?.description || campMap?.get(campId) || "UNRESOLVED CAMP";
}

export function IncomingRequestsTable({ requests, campMap, onApprove, onReject, actionLoading = false }: IncomingRequestsTableProps) {
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);

  if (requests.length === 0) {
    return (
      <div className="app-empty-state app-animate-fade h-full min-h-64">
        <span>No incoming requests recorded</span>
      </div>
    );
  }

  const selectedRequest = requests.find((r) => r.id === selectedRequestId);

  return (
    <>
      <div className="app-table-wrap">
        <table className="app-table">
          <thead>
            <tr>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Description</th>
              <th>Origin approval</th>
              <th>Destination approval</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody className="app-stagger-rows">
            {requests.map((request) => {
              const meta = STATUS_META[request.destination_approval_status || "P"] ?? STATUS_META["P"];
              const originMeta = STATUS_META[request.origin_approval_status || "P"] ?? STATUS_META["P"];
              return (
                <tr
                  key={request.id}
                  className="app-table-row select-none border-l-2 border-l-status-critical bg-status-critical/5 hover:bg-status-critical/10"
                  onDoubleClick={() => setSelectedRequestId(request.id!)}
                  title="Double-click to view detail"
                >
                  <td className="app-table-cell--primary">
                    {getCampLabel(request, "origin", campMap)}
                  </td>
                  <td className="app-table-cell--primary">
                    {getCampLabel(request, "destination", campMap)}
                  </td>
                  <td>
                    <p className="truncate max-w-xs" title={request.description || ""}>
                      {request.description || "No description"}
                    </p>
                  </td>
                  <td>
                    <span className={`app-table-badge ${originMeta.badgeClass}`}>
                      {originMeta.label}
                    </span>
                  </td>
                  <td>
                    <span className={`app-table-badge ${meta.badgeClass}`}>
                      {meta.label}
                    </span>
                  </td>
                  <td className="app-table-cell--time">
                    {new Date(request.created_at || "").toLocaleDateString("en-US")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedRequestId != null && (
        <RequestDetailModal
          requestId={selectedRequestId}
          onClose={() => setSelectedRequestId(null)}
          requestStatus={selectedRequest?.destination_approval_status != null ? selectedRequest.destination_approval_status : undefined}
          onApprove={() => { onApprove(selectedRequestId); setSelectedRequestId(null); }}
          onReject={() => { onReject(selectedRequestId); setSelectedRequestId(null); }}
          isLoading={actionLoading}
          canViewResourceAvailability
        />
      )}
    </>
  );
}
