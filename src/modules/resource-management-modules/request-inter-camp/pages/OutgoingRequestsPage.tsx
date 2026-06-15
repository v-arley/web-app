import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CampService } from "../../../../services/CampService";
import { useCampRequestMutation } from "../hooks/useCampRequestMutation";
import { useCampRequestsQuery } from "../hooks/useCampRequestsQuery";
import { OutgoingRequestsTable } from "../components/OutgoingRequestsTable";
import { useNavigation } from "../../../../shared/app/NavigationContext";
import { useToast } from "../../../../shared/hooks/useToast";
import type { Camp } from "../../../../models/Camp";
import PaginationFooter from "../../shared/components/PaginationFooter";

const campService = new CampService();

export function OutgoingRequestsPage() {
  const { authContext } = useNavigation();
  const originCampId = authContext.campId ?? 0;

  const { toast } = useToast();
  const { data: requests = [], isLoading } = useCampRequestsQuery({ originCampId, requestType: "R" }, originCampId > 0);
  const { approveAsOrigin, rejectAsOrigin } = useCampRequestMutation();
  const [statusFilter, setStatusFilter] = useState<'P' | 'A' | 'R' | ''>('');
  const [destinationFilter, setDestinationFilter] = useState<number | ''>('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data: campsData = [] } = useQuery({
    queryKey: ["camps-list-for-requests"],
    queryFn: async () => {
      const res = await campService.findAllForRequests();
      return res.getResultado<Camp[]>("registros") ?? [];
    },
  });

  const campMap = useMemo(
    () => new Map(campsData.map((c) => [c.id!, c.description])),
    [campsData]
  );

  const campOptions = useMemo(
    () => campsData.filter((c) => c.id !== originCampId),
    [campsData, originCampId]
  );

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (statusFilter && r.origin_approval_status !== statusFilter) return false;
      if (destinationFilter && r.destination_camp_id !== destinationFilter) return false;
      return true;
    });
  }, [requests, statusFilter, destinationFilter]);

  const totalRecords = filteredRequests.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const pagedRequests = filteredRequests.slice((page - 1) * pageSize, page * pageSize);

  const handleApprove = async (id: number) => {
    try {
      await approveAsOrigin.mutateAsync(id);
      toast({ tone: "success", title: "Request approved", message: "Outgoing request approved as origin camp." });
    } catch (error) {
      toast({
        tone: "error",
        title: "Approval failed",
        message: error instanceof Error ? error.message : "Failed to approve the outgoing request.",
      });
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectAsOrigin.mutateAsync(id);
      toast({ tone: "info", title: "Request rejected", message: "Outgoing request rejected as origin camp." });
    } catch (error) {
      toast({
        tone: "error",
        title: "Rejection failed",
        message: error instanceof Error ? error.message : "Failed to reject the outgoing request.",
      });
    }
  };

  return (
    <article className="flex h-full flex-col overflow-hidden bg-transparent">
      <section className="app-split app-split--glass" style={{ flexDirection: "column" }}>
        <header className="app-panel-header">
          <div>
            <div className="app-panel-title">My Requests</div>
          </div>

          <div className="app-panel-actions">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as 'P' | 'A' | 'R' | ''); setPage(1); }}
              className="app-input-default"
              aria-label="Filter by status"
            >
              <option value="">STATUS: ALL</option>
              <option value="P">STATUS: PENDING</option>
              <option value="A">STATUS: APPROVED</option>
              <option value="R">STATUS: REJECTED</option>
            </select>

            {/* <select
              value={destinationFilter}
              onChange={(e) => { setDestinationFilter(e.target.value ? Number(e.target.value) : ''); setPage(1); }}
              className="app-input-default"
              aria-label="Filter by destination"
            >
              <option value="">DESTINATION: ALL_CAMPS</option>
              {campOptions.map((c, idx) => (
                <option key={c.id ?? `camp-${idx}`} value={c.id ?? ""}>{c.description}</option>
              ))}
            </select> */}
          </div>
        </header>

        <div className="app-table-region app-table-frame">
          {isLoading ? (
            <div className="app-loading-state" style={{ flexDirection: "column", gap: "0.5rem" }}>
              <div className="app-spinner app-spinner--lg" />
              <span className="app-eyebrow" style={{ letterSpacing: "0.35em" }}>Loading Requests...</span>
            </div>
          ) : (
            <OutgoingRequestsTable
              requests={pagedRequests}
              campMap={campMap}
              onApprove={handleApprove}
              onReject={handleReject}
              actionLoading={approveAsOrigin.isPending || rejectAsOrigin.isPending}
            />
          )}
        </div>

        <PaginationFooter
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
        />
      </section>
    </article>
  );
}
