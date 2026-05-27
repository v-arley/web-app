import { useCampRequestsQuery } from "../hooks/useCampRequestsQuery";
import { useCampRequestMutation } from "../hooks/useCampRequestMutation";
import { IncomingRequestsTable } from "../components/IncomingRequestsTable";
import { getAuthContextFromToken } from "../../../../shared/utils/authAccess";
import { useToast } from "../../../../shared/hooks/useToast";

export function IncomingRequestsPage() {
  const authContext = getAuthContextFromToken();
  const destinationCampId = authContext.campId ?? 0;
  const userId = authContext.userId ?? 0;

  const { toast } = useToast();
  const { data: requests = [], isLoading } = useCampRequestsQuery({ destinationCampId });
  const { approveAsDestination, rejectAsDestination } = useCampRequestMutation();

  const handleApprove = async (id: number) => {
    try {
      await approveAsDestination.mutateAsync({ id, userId });
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
      await rejectAsDestination.mutateAsync({ id, userId });
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
    <article className="flex h-full flex-col overflow-hidden bg-bg-app">
      <section className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-10 w-10 border-4 border-accent/30 border-t-accent animate-spin" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-txt-secondary animate-pulse">LOADING REQUESTS...</p>
          </div>
        ) : (
          <IncomingRequestsTable
            requests={requests}
            onApprove={handleApprove}
            onReject={handleReject}
            isLoading={approveAsDestination.isPending || rejectAsDestination.isPending}
          />
        )}
      </section>
    </article>
  );
}
