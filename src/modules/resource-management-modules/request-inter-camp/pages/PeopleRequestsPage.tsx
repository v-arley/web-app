import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CampService } from "../../../../services/CampService";
import type { Camp } from "../../../../models/Camp";
import { useNavigation } from "../../../../shared/app/NavigationContext";
import { useToast } from "../../../../shared/hooks/useToast";
import PaginationFooter from "../../shared/components/PaginationFooter";
import { useCampRequestMutation } from "../hooks/useCampRequestMutation";
import { useCampRequestsQuery } from "../hooks/useCampRequestsQuery";
import type { CampRequestFormValues } from "../schemas/camp-request.schema";
import { PersonRequestDetailModal } from "../components/PersonRequestDetailModal";
import { requestPersonService } from "../services/RequestPersonService";

const campService = new CampService();

const STATUS_META: Record<string, { label: string; badgeClass: string }> = {
  P: { label: "PENDING", badgeClass: "app-table-badge--warn" },
  A: { label: "APPROVED", badgeClass: "app-table-badge--ok" },
  R: { label: "REJECTED", badgeClass: "app-table-badge--error" },
};

interface PeopleRequestsPageProps {
  direction: "outgoing" | "incoming";
}

function getCampLabel(request: CampRequestFormValues, side: "origin" | "destination", campMap?: Map<number, string>) {
  const camp = side === "origin" ? request.origin_camp : request.destination_camp;
  const campId = side === "origin" ? request.origin_camp_id : request.destination_camp_id;
  return camp?.code || camp?.description || campMap?.get(campId) || "UNRESOLVED CAMP";
}

export function PeopleRequestsPage({ direction }: PeopleRequestsPageProps) {
  const { authContext } = useNavigation();
  const campId = authContext.campId ?? 0;
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<"P" | "A" | "R" | "">("");
  const [campFilter, setCampFilter] = useState<number | "">("");
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const filters = direction === "outgoing"
    ? { originCampId: campId, requestType: "P" as const }
    : { destinationCampId: campId, requestType: "P" as const };

  const { data: requests = [], isLoading } = useCampRequestsQuery(filters, campId > 0);
  const { approveAsOrigin, rejectAsOrigin, approveAsDestination, rejectAsDestination } = useCampRequestMutation();

  const { data: campsData = [] } = useQuery({
    queryKey: ["camps-list-for-requests"],
    queryFn: async () => {
      const res = await campService.findAllForRequests();
      return res.getResultado<Camp[]>("registros") ?? [];
    },
  });

  const campMap = useMemo(() => new Map(campsData.map((camp) => [camp.id!, camp.description])), [campsData]);
  const campOptions = useMemo(() => campsData.filter((camp) => camp.id !== campId), [campsData, campId]);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const status = direction === "outgoing" ? request.origin_approval_status : request.destination_approval_status;
      const otherCampId = direction === "outgoing" ? request.destination_camp_id : request.origin_camp_id;
      if (statusFilter && status !== statusFilter) return false;
      if (campFilter && otherCampId !== campFilter) return false;
      return true;
    });
  }, [campFilter, direction, requests, statusFilter]);

  const totalRecords = filteredRequests.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const pagedRequests = filteredRequests.slice((page - 1) * pageSize, page * pageSize);
  const selectedRequest = requests.find((request) => request.id === selectedRequestId);

  const handleApprove = async (id: number, persons?: Array<{ person_id: number }>) => {
    try {
      if (direction === "outgoing") {
        await approveAsOrigin.mutateAsync(id);
      } else {
        if (!persons || persons.length === 0) {
          throw new Error("Select at least one available person before approving.");
        }
        await requestPersonService.replaceRequestPersons(id, persons);
        await approveAsDestination.mutateAsync(id);
      }
      toast({ tone: "success", title: "People request approved", message: "The people request was approved successfully." });
    } catch (error) {
      toast({
        tone: "error",
        title: "Approval failed",
        message: error instanceof Error ? error.message : "Failed to approve the people request.",
      });
    }
  };

  const handleReject = async (id: number) => {
    try {
      if (direction === "outgoing") await rejectAsOrigin.mutateAsync(id);
      else await rejectAsDestination.mutateAsync(id);
      toast({ tone: "info", title: "People request rejected", message: "The people request was rejected." });
    } catch (error) {
      toast({
        tone: "error",
        title: "Rejection failed",
        message: error instanceof Error ? error.message : "Failed to reject the people request.",
      });
    }
  };

  const title = direction === "outgoing" ? "My People Requests" : "People Requested From Me";
  const campFilterLabel = direction === "outgoing" ? "PROVIDER" : "REQUESTER";
  const actionLoading =
    approveAsOrigin.isPending ||
    rejectAsOrigin.isPending ||
    approveAsDestination.isPending ||
    rejectAsDestination.isPending;

  return (
    <article className="flex h-full flex-col overflow-hidden bg-transparent">
      <section className="app-split app-split--glass" style={{ flexDirection: "column" }}>
        <header className="app-panel-header">
          <div>
            <div className="app-panel-title">{title}</div>
          </div>

          <div className="app-panel-actions">
            <select
              value={statusFilter}
              onChange={(event) => { setStatusFilter(event.target.value as "P" | "A" | "R" | ""); setPage(1); }}
              className="app-input-default"
              aria-label="Filter by status"
            >
              <option value="">STATUS: ALL</option>
              <option value="P">STATUS: PENDING</option>
              <option value="A">STATUS: APPROVED</option>
              <option value="R">STATUS: REJECTED</option>
            </select>

            <select
              value={campFilter}
              onChange={(event) => { setCampFilter(event.target.value ? Number(event.target.value) : ""); setPage(1); }}
              className="app-input-default"
              aria-label={`Filter by ${campFilterLabel.toLowerCase()}`}
            >
              <option value="">{campFilterLabel}: ALL_CAMPS</option>
              {campOptions.map((camp, index) => (
                <option key={camp.id ?? `camp-${index}`} value={camp.id ?? ""}>{camp.description}</option>
              ))}
            </select>
          </div>
        </header>

        <div className="app-table-region app-table-frame">
          {isLoading ? (
            <div className="app-loading-state" style={{ flexDirection: "column", gap: "0.5rem" }}>
              <div className="app-spinner app-spinner--lg" />
              <span className="app-eyebrow" style={{ letterSpacing: "0.35em" }}>Loading People Requests...</span>
            </div>
          ) : pagedRequests.length === 0 ? (
            <div className="app-loading-state">
              <span className="app-eyebrow">No people requests recorded</span>
            </div>
          ) : (
            <div className="app-table-wrap h-full min-h-0">
              <table className="app-table min-w-[760px]">
                <thead className="app-table-head">
                  <tr>
                    <th>Requester</th>
                    <th>Provider</th>
                    <th>Description</th>
                    <th>Origin approval</th>
                    <th>Destination approval</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedRequests.map((request) => {
                    const originMeta = STATUS_META[request.origin_approval_status || "P"] ?? STATUS_META.P;
                    const destinationMeta = STATUS_META[request.destination_approval_status || "P"] ?? STATUS_META.P;
                    return (
                      <tr
                        key={request.id}
                        className="app-table-row"
                        onDoubleClick={() => setSelectedRequestId(request.id!)}
                        title="Double-click to view detail"
                      >
                        <td className="app-table-cell--primary">{getCampLabel(request, "origin", campMap)}</td>
                        <td className="app-table-cell--primary">{getCampLabel(request, "destination", campMap)}</td>
                        <td>
                          <p className="max-w-xs truncate app-table-cell--time" title={request.description || ""}>
                            {request.description || "No description"}
                          </p>
                        </td>
                        <td>
                          <span className={`app-table-badge ${originMeta.badgeClass}`}>{originMeta.label}</span>
                        </td>
                        <td>
                          <span className={`app-table-badge ${destinationMeta.badgeClass}`}>{destinationMeta.label}</span>
                        </td>
                        <td className="app-table-cell--time">{new Date(request.created_at || "").toLocaleDateString("en-US")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <PaginationFooter
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
        />
      </section>

      {selectedRequestId != null && (
        <PersonRequestDetailModal
          requestId={selectedRequestId}
          onClose={() => setSelectedRequestId(null)}
          requestStatus={direction === "outgoing" ? selectedRequest?.origin_approval_status ?? undefined : selectedRequest?.destination_approval_status ?? undefined}
          canSelectPeople={direction === "incoming"}
          onApprove={(persons) => { handleApprove(selectedRequestId, persons); setSelectedRequestId(null); }}
          onReject={() => { handleReject(selectedRequestId); setSelectedRequestId(null); }}
          isLoading={actionLoading}
        />
      )}
    </article>
  );
}
