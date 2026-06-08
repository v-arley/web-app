import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CampService } from "../../../../services/CampService";
import type { Camp } from "../../../../models/Camp";
import { useNavigation } from "../../../../shared/app/NavigationContext";
import { useToast } from "../../../../shared/hooks/useToast";
import { FilterBar } from "../../shared/components/FilterBar";
import PageHeader from "../../shared/components/PageHeader";
import PaginationFooter from "../../shared/components/PaginationFooter";
import { useCampRequestMutation } from "../hooks/useCampRequestMutation";
import { useCampRequestsQuery } from "../hooks/useCampRequestsQuery";
import type { CampRequestFormValues } from "../schemas/camp-request.schema";
import { PersonRequestDetailModal } from "../components/PersonRequestDetailModal";
import { requestPersonService } from "../services/RequestPersonService";

const campService = new CampService();

const STATUS_META: Record<string, { label: string; style: string }> = {
  P: { label: "PENDING", style: "text-status-warning" },
  A: { label: "APPROVED", style: "text-status-ok" },
  R: { label: "REJECTED", style: "text-status-critical" },
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

  const title = direction === "outgoing" ? "MY PEOPLE REQUESTS" : "PEOPLE REQUESTED FROM ME";
  const campFilterLabel = direction === "outgoing" ? "Provider" : "Requester";
  const actionLoading =
    approveAsOrigin.isPending ||
    rejectAsOrigin.isPending ||
    approveAsDestination.isPending ||
    rejectAsDestination.isPending;

  return (
    <article className="flex h-full flex-col overflow-hidden bg-transparent">
      <PageHeader
        icon={null}
        title={title}
        subtitle={undefined}
        rightContent={<span className="font-mono text-[12px] uppercase tracking-widest">TOTAL: <span className="text-accent font-bold">{String(totalRecords).padStart(4, "0")}</span></span>}
      />

      <FilterBar wrapperClassName="px-4 pt-4 pb-0">
        <div className="flex w-full flex-col gap-3 border border-border-default bg-bg-secondary px-4 py-2 sm:flex-row sm:items-center sm:gap-6">
          <label className="font-mono text-[12px] font-bold uppercase tracking-widest text-txt-disabled">Status</label>
          <select
            value={statusFilter}
            onChange={(event) => { setStatusFilter(event.target.value as "P" | "A" | "R" | ""); setPage(1); }}
            className="rmm-input text-[12px]!"
          >
            <option value="">All</option>
            <option value="P">Pending</option>
            <option value="A">Approved</option>
            <option value="R">Rejected</option>
          </select>

          <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-txt-disabled">{campFilterLabel}</label>
          <select
            value={campFilter}
            onChange={(event) => { setCampFilter(event.target.value ? Number(event.target.value) : ""); setPage(1); }}
            className="rmm-input text-[11px]!"
          >
            <option value="">All camps</option>
            {campOptions.map((camp, index) => (
              <option key={camp.id ?? `camp-${index}`} value={camp.id ?? ""}>{camp.description}</option>
            ))}
          </select>
        </div>
      </FilterBar>

      <section className="flex-1 overflow-auto rmm-content-pad">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <div className="h-10 w-10 animate-spin border-4 border-accent/30 border-t-accent" />
            <p className="font-mono text-[10px] uppercase tracking-wide text-txt-secondary animate-pulse">LOADING PEOPLE REQUESTS...</p>
          </div>
        ) : pagedRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="font-mono text-[10px] uppercase tracking-wide text-txt-secondary">NO PEOPLE REQUESTS RECORDED</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="rmm-table min-w-[760px]">
              <thead className="rmm-table-head">
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
                      className="cursor-pointer select-none border-l-2 border-l-accent bg-accent/5 transition-colors hover:bg-accent/10"
                      onDoubleClick={() => setSelectedRequestId(request.id!)}
                      title="Double-click to view detail"
                    >
                      <td><span className="font-mono text-[12px] font-bold text-txt-primary">{getCampLabel(request, "origin", campMap)}</span></td>
                      <td><span className="font-mono text-[12px] font-bold text-txt-primary">{getCampLabel(request, "destination", campMap)}</span></td>
                      <td>
                        <p className="max-w-xs truncate font-mono text-[12px] text-txt-secondary" title={request.description || ""}>
                          {request.description || "No description"}
                        </p>
                      </td>
                      <td><span className={`px-2 py-1 font-mono text-[12px] font-bold uppercase tracking-widest ${originMeta.style}`}>{originMeta.label}</span></td>
                      <td><span className={`px-2 py-1 font-mono text-[12px] font-bold uppercase tracking-widest ${destinationMeta.style}`}>{destinationMeta.label}</span></td>
                      <td><span className="font-mono text-[12px] text-txt-secondary">{new Date(request.created_at || "").toLocaleDateString("en-US")}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <PaginationFooter
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        leftContent={<div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest text-txt-muted">
          <span>Total: <span className="font-bold text-accent">{String(totalRecords).padStart(4, "0")}</span></span>
        </div>}
        totalRecords={totalRecords}
      />

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
