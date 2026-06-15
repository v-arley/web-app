import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
// import { ArrowDownRight } from "lucide-react";
import { CampService } from "../../../../services/CampService";
import { useCampRequestMutation } from "../hooks/useCampRequestMutation";
import { useCampRequestsQuery } from "../hooks/useCampRequestsQuery";
import { IncomingRequestsTable } from "../components/IncomingRequestsTable";
import { useNavigation } from "../../../../shared/app/NavigationContext";
import { useToast } from "../../../../shared/hooks/useToast";
import type { Camp } from "../../../../models/Camp";
import PaginationFooter from "../../shared/components/PaginationFooter";

const campService = new CampService();

export function IncomingRequestsPage() {
  const { authContext } = useNavigation();
  const destinationCampId = authContext.campId ?? 0;

  const { toast } = useToast();
  const { data: requests = [], isLoading } = useCampRequestsQuery({ destinationCampId, requestType: "R" }, destinationCampId > 0);
  const { approveAsDestination, rejectAsDestination } = useCampRequestMutation();
  const [statusFilter, setStatusFilter] = useState<'P' | 'A' | 'R' | ''>('');
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

  const filteredRequests = useMemo(() => {
    if (!statusFilter) return requests;
    return requests.filter((r) => r.destination_approval_status === statusFilter);
  }, [requests, statusFilter]);

  const totalRecords = filteredRequests.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const pagedRequests = filteredRequests.slice((page - 1) * pageSize, page * pageSize);

  const handleApprove = async (id: number) => {
    try {
      await approveAsDestination.mutateAsync(id);
      toast({ tone: "success", title: "Request approved", message: "The inter-camp request has been approved." });
    } catch (error) {
      toast({
        tone: "error",
        title: "Approval failed",
        message: error instanceof Error ? error.message : "Failed to approve the request.",
      });
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectAsDestination.mutateAsync(id);
      toast({ tone: "info", title: "Request rejected", message: "The inter-camp request has been rejected." });
    } catch (error) {
      toast({
        tone: "error",
        title: "Rejection failed",
        message: error instanceof Error ? error.message : "Failed to reject the request.",
      });
    }
  };

  return (
    <article className="flex h-full flex-col overflow-hidden bg-transparent">
      <section className="app-split app-split--glass" style={{ flexDirection: "column" }}>
        <header className="app-panel-header">
          <div>
            <div className="app-panel-title">Received From</div>
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
          </div>
        </header>

        <div className="app-table-region app-table-frame">
          {isLoading ? (
            <div className="app-loading-state" style={{ flexDirection: "column", gap: "0.5rem" }}>
              <div className="app-spinner app-spinner--lg" />
              <span className="app-eyebrow" style={{ letterSpacing: "0.35em" }}>Loading Requests...</span>
            </div>
          ) : (
            <IncomingRequestsTable
              requests={pagedRequests}
              campMap={campMap}
              onApprove={handleApprove}
              onReject={handleReject}
              actionLoading={approveAsDestination.isPending || rejectAsDestination.isPending}
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
