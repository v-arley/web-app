import { useState } from "react";
<<<<<<< HEAD
import { Check, Eye, X } from "lucide-react";
=======
>>>>>>> develop
import type { CampRequestFormValues } from "../schemas/camp-request.schema";
import { RequestDetailModal } from "./RequestDetailModal";

interface IncomingRequestsTableProps {
  requests: CampRequestFormValues[];
  campMap?: Map<number, string>;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  actionLoading?: boolean;
}

<<<<<<< HEAD
function formatStatus(status?: string | null) {
  const value = status ?? "P";

  const styles: Record<string, string> = {
    P: "border-status-warning/40 bg-status-warning/10 text-status-warning",
    A: "border-status-ok/40 bg-status-ok/10 text-status-ok",
    R: "border-status-critical/40 bg-status-critical/10 text-status-critical",
  };

  const labels: Record<string, string> = {
    P: "Pending",
    A: "Approved",
    R: "Rejected",
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

export function IncomingRequestsTable({
  requests,
  onApprove,
  onReject,
  isLoading = false,
}: IncomingRequestsTableProps) {
  const [selectedRequest, setSelectedRequest] =
    useState<CampRequestFormValues | null>(null);

  if (requests.length === 0) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center border border-border-default bg-bg-secondary px-6 py-10">
        <p className="text-[15px] font-bold uppercase tracking-[0.16em] text-txt-primary">
          No received requests recorded
        </p>

        <p className="mt-2 text-[13px] font-bold tracking-[0.04em] text-txt-secondary">
          Incoming inter-camp requests will appear here.
=======
const STATUS_META: Record<string, { label: string; style: string }> = {
  P: { label: "PENDING",  style: "text-status-warning" },
  A: { label: "APPROVED", style: "text-status-ok" },
  R: { label: "REJECTED", style: "text-status-critical" },
};

export function IncomingRequestsTable({ requests, campMap, onApprove, onReject, actionLoading = false }: IncomingRequestsTableProps) {
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="font-mono text-[11px] uppercase tracking-wide text-txt-secondary">
          NO INCOMING REQUESTS RECORDED
>>>>>>> develop
        </p>
      </div>
    );
  }

<<<<<<< HEAD
  return (
    <>
      <div className="overflow-hidden border border-border-default bg-bg-secondary">
        <div className="grid grid-cols-[1.1fr_2fr_1.1fr_1fr_1fr] gap-4 border-b border-border-default bg-bg-primary px-5 py-4">
          <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-txt-secondary">
            Origin
          </div>

          <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-txt-secondary">
            Description
          </div>

          <div className="text-center text-[12px] font-bold uppercase tracking-[0.14em] text-txt-secondary">
            Status
          </div>

          <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-txt-secondary">
            Date
          </div>

          <div className="text-right text-[12px] font-bold uppercase tracking-[0.14em] text-txt-secondary">
            Actions
          </div>
        </div>

        <div className="divide-y divide-border-default">
          {requests.map((request) => {
            const requestId = request.id;
            const currentStatus =
              request.destination_approval_status ?? request.status ?? "P";

            return (
              <div
                key={requestId}
                className="grid grid-cols-[1.1fr_2fr_1.1fr_1fr_1fr] items-center gap-4 px-5 py-4 transition-colors hover:bg-bg-primary/40"
              >
                <div>
                  <p className="text-[15px] font-bold uppercase tracking-[0.08em] text-txt-primary">
                    Camp #{request.origin_camp_id}
                  </p>
                </div>

                <div className="min-w-0">
                  <p
                    className="line-clamp-2 text-[14px] font-bold leading-relaxed tracking-[0.03em] text-txt-secondary"
                    title={request.description || ""}
                  >
                    {request.description || "No description"}
                  </p>
                </div>

                <div className="flex justify-center">
                  {formatStatus(currentStatus)}
                </div>

                <div>
                  <span className="text-[14px] font-bold tracking-[0.04em] text-txt-primary">
                    {formatDate(request.created_at)}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => requestId && setSelectedRequest(request)}
                    className="flex h-10 w-10 items-center justify-center border border-accent/40 bg-accent/10 text-accent transition-colors hover:bg-accent hover:text-accent-fg"
                    title="View request detail"
                    aria-label="View request detail"
                  >
                    <Eye size={17} />
                  </button>

                  {currentStatus === "P" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => requestId && onApprove(requestId)}
                        disabled={isLoading}
                        className="flex h-10 w-10 items-center justify-center border border-status-ok/40 bg-status-ok/10 text-status-ok transition-colors hover:bg-status-ok hover:text-accent-fg disabled:cursor-not-allowed disabled:opacity-50"
                        title="Approve request"
                        aria-label="Approve request"
                      >
                        <Check size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() => requestId && onReject(requestId)}
                        disabled={isLoading}
                        className="flex h-10 w-10 items-center justify-center border border-status-critical/40 bg-status-critical/10 text-status-critical transition-colors hover:bg-status-critical hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        title="Reject request"
                        aria-label="Reject request"
                      >
                        <X size={17} />
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedRequest?.id ? (
        <RequestDetailModal
          requestId={selectedRequest.id}
          description={selectedRequest.description}
          originLabel={`Camp #${selectedRequest.origin_camp_id}`}
          destinationLabel={`Camp #${selectedRequest.destination_camp_id}`}
          onClose={() => setSelectedRequest(null)}
=======
  const selectedRequest = requests.find((r) => r.id === selectedRequestId);

  return (
    <>
      <table className="rmm-table">
        <thead className="">
          <tr>
            <th className="">Origin</th>
            <th className="">Description</th>
            <th className="">Status</th>
            <th className="">Date</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => {
            const meta = STATUS_META[request.destination_approval_status || "P"] ?? STATUS_META["P"];
            return (
              <tr
                key={request.id}
                className="bg-status-critical/5 hover:bg-status-critical/10 transition-colors border-l-2 border-l-status-critical cursor-pointer select-none"
                onDoubleClick={() => setSelectedRequestId(request.id!)}
                title="Double-click to view detail"
              >
                <td>
                  <span className="font-mono text-[12px] font-bold text-txt-primary">
                    {campMap?.get(request.origin_camp_id!) ?? `CAMP #${request.origin_camp_id}`}
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
          requestStatus={selectedRequest?.destination_approval_status != null ? selectedRequest.destination_approval_status : undefined}
          onApprove={() => { onApprove(selectedRequestId); setSelectedRequestId(null); }}
          onReject={() => { onReject(selectedRequestId); setSelectedRequestId(null); }}
          isLoading={actionLoading}
>>>>>>> develop
        />
      ) : null}
    </>
  );
}