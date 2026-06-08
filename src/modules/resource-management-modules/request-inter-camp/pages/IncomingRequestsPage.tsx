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
import { FilterBar } from "../../shared/components/FilterBar";
import PaginationFooter from "../../shared/components/PaginationFooter";
import PageHeader from "../../shared/components/PageHeader";

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
      {/* <div className="relative flex-1 flex flex-col overflow-hidden bg-bg-tertiary/90 backdrop-blur-lg border border-border-strong shadow-2xl"> */}
      <PageHeader
        icon={null}
        title="RECEIVED FROM"
        subtitle={undefined}
        rightContent={<span className="font-mono text-[12px] uppercase tracking-widest">TOTAL: <span className="text-accent font-bold">{String(totalRecords).padStart(4, "0")}</span></span>}
      />

      <FilterBar wrapperClassName="px-3 py-2 sm:px-4">
        <div className="grid w-full grid-cols-1 gap-2 border border-border-default bg-bg-secondary/80 p-3 sm:grid-cols-[auto_minmax(9rem,13rem)] sm:items-center sm:gap-x-3 sm:gap-y-0 sm:px-4 sm:py-2">
          <label className="font-mono text-[10px] font-bold text-txt-disabled uppercase tracking-widest shrink-0">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as 'P' | 'A' | 'R' | ''); setPage(1); }}
            className="rmm-input min-h-9 text-[11px]!"
          >
            <option value="">All</option>
            <option value="P">Pending</option>
            <option value="A">Approved</option>
            <option value="R">Rejected</option>
          </select>
        </div>

      </FilterBar>

      <section className="flex-1 overflow-auto rmm-content-pad">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-10 w-10 border-4 border-accent/30 border-t-accent animate-spin" />
            <p className="font-mono text-[12px] uppercase tracking-wide text-txt-secondary animate-pulse">LOADING REQUESTS...</p>
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
      </section>

      <PaginationFooter
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        leftContent={<div className="flex items-center gap-4 font-mono text-[11px] text-txt-muted uppercase tracking-widest">
          <span>Total: <span className="text-accent font-bold">{String(totalRecords).padStart(4, "0")}</span></span></div>}
          totalRecords={totalRecords}
      />
      {/* </div> */}
    </article>
  );
}
