import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
// import { ArrowUpRight } from "lucide-react";
import { CampService } from "../../../../services/CampService";
import { useCampRequestMutation } from "../hooks/useCampRequestMutation";
import { useCampRequestsQuery } from "../hooks/useCampRequestsQuery";
import { OutgoingRequestsTable } from "../components/OutgoingRequestsTable";
import { useNavigation } from "../../../../shared/app/NavigationContext";
import { useToast } from "../../../../shared/hooks/useToast";
import type { Camp } from "../../../../models/Camp";
import { FilterBar } from "../../shared/components/FilterBar";
import PaginationFooter from "../../shared/components/PaginationFooter";
import PageHeader from "../../shared/components/PageHeader";

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

      <PageHeader
        icon={null}
        title="MY REQUESTS"
        subtitle={undefined}
        rightContent={<span className="font-mono text-[12px] uppercase tracking-widest">TOTAL: <span className="text-accent font-bold">{String(totalRecords).padStart(4, "0")}</span></span>}
      />

      {/* Filter bar — styled as part of the body */}
      <FilterBar wrapperClassName="px-4 pt-4 pb-0">
        <div className="bg-bg-secondary border border-border-default px-4 py-2 flex items-center gap-6 w-full">
          <label className="font-mono text-[12px] font-bold text-txt-disabled uppercase tracking-widest shrink-0">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as 'P' | 'A' | 'R' | ''); setPage(1); }}
            className="rmm-input text-[12px]!"
          >
            <option value="">All</option>
            <option value="P">Pending</option>
            <option value="A">Approved</option>
            <option value="R">Rejected</option>
          </select>

          <label className="font-mono text-[10px] font-bold text-txt-disabled uppercase tracking-widest shrink-0">Destination</label>
          <select
            value={destinationFilter}
            onChange={(e) => { setDestinationFilter(e.target.value ? Number(e.target.value) : ''); setPage(1); }}
            className="rmm-input text-[11px]!"
          >
            <option value="">All camps</option>
            {campOptions.map((c, idx) => (
              <option key={c.id ?? `camp-${idx}`} value={c.id ?? ""}>{c.description}</option>
            ))}
          </select>
        </div>

      </FilterBar>

      {/* Body */}
      <section className="flex-1 overflow-auto rmm-content-pad">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-10 w-10 border-4 border-accent/30 border-t-accent animate-spin" />
            <p className="font-mono text-[10px] uppercase tracking-wide text-txt-secondary animate-pulse">LOADING REQUESTS...</p>
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
      </section>

      {/* Pagination footer — modal footer style */}
      <PaginationFooter
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        leftContent={<div className="flex items-center gap-4 font-mono text-[11px] text-txt-muted uppercase tracking-widest">
          <span>Total: <span className="text-accent font-bold">{String(totalRecords).padStart(4, "0")}</span></span></div>}
        totalRecords={totalRecords}
      />
    </article>
  );
}
