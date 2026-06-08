import { useState } from "react";
import type { CampRequestFormValues } from "../schemas/camp-request.schema";
import { RequestDetailModal } from "./RequestDetailModal";

interface OutgoingRequestsTableProps {
  requests: CampRequestFormValues[];
  campMap?: Map<number, string>;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  actionLoading?: boolean;
}

const STATUS_META: Record<string, { label: string; style: string }> = {
  P: { label: "PENDING",  style: "text-status-warning" },
  A: { label: "APPROVED", style: "text-status-ok" },
  R: { label: "REJECTED", style: "text-status-critical" },
};

function getCampLabel(request: CampRequestFormValues, side: "origin" | "destination", campMap?: Map<number, string>) {
  const camp = side === "origin" ? request.origin_camp : request.destination_camp;
  const campId = side === "origin" ? request.origin_camp_id : request.destination_camp_id;
  return camp?.code || camp?.description || campMap?.get(campId) || "UNRESOLVED CAMP";
}

export function OutgoingRequestsTable({ requests, campMap, onApprove, onReject, actionLoading = false }: OutgoingRequestsTableProps) {
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const selectedRequest = requests.find((r) => r.id === selectedRequestId);

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="font-mono text-[10px] uppercase tracking-wide text-txt-secondary">
          NO OUTGOING REQUESTS RECORDED
        </p>
      </div>
    );
  }

  return (
    <>
      <table className="rmm-table">
        <thead  className="rmm-table-head">
          <tr>
            <th className="">Sender</th>
            <th className="">Receiver</th>
            <th className="">Description</th>
            <th className="">Origin approval</th>
            <th className="">Destination approval</th>
            <th className="">Date</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => {
            const meta = STATUS_META[request.origin_approval_status || "P"] ?? STATUS_META["P"];
            const destinationMeta = STATUS_META[request.destination_approval_status || "P"] ?? STATUS_META["P"];
            return (
              <tr
                key={request.id}
                className="bg-status-critical/5 hover:bg-status-critical/10 transition-colors border-l-2 border-l-status-critical cursor-pointer select-none"
                onDoubleClick={() => setSelectedRequestId(request.id!)}
                title="Double-click to view detail"
              >
                <td>
                  <span className="font-mono text-[12px] font-bold text-txt-primary">
                    {getCampLabel(request, "origin", campMap)}
                  </span>
                </td>
                <td>
                  <span className="font-mono text-[12px] font-bold text-txt-primary">
                    {getCampLabel(request, "destination", campMap)}
                  </span>
                </td>
                <td>
                  <p className="font-mono text-[12px] text-txt-secondary truncate max-w-xs" title={request.description || ""}>
                    {request.description || "No description"}
                  </p>
                </td>
                <td>
                  <span className={`px-2 py-1 font-mono text-[12px] font-bold uppercase tracking-widest ${meta.style}`}>
                    {meta.label}
                  </span>
                </td>
                <td>
                  <span className={`px-2 py-1 font-mono text-[12px] font-bold uppercase tracking-widest ${destinationMeta.style}`}>
                    {destinationMeta.label}
                  </span>
                </td>
                <td>
                  <span className="font-mono text-[12px] text-txt-secondary">
                    {new Date(request.created_at || "").toLocaleDateString("en-US")}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedRequestId != null && (
        <RequestDetailModal
          requestId={selectedRequestId}
          onClose={() => setSelectedRequestId(null)}
          requestStatus={selectedRequest?.origin_approval_status != null ? selectedRequest.origin_approval_status : undefined}
          onApprove={() => { onApprove(selectedRequestId); setSelectedRequestId(null); }}
          onReject={() => { onReject(selectedRequestId); setSelectedRequestId(null); }}
          isLoading={actionLoading}
        />
      )}
    </>
  );
}
