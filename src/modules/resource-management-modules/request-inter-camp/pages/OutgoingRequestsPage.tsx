import { useCampRequestsQuery } from "../hooks/useCampRequestsQuery";
import { useCampRequestMutation } from "../hooks/useCampRequestMutation";
import { OutgoingRequestsTable } from "../components/OutgoingRequestsTable";
import { useNavigation } from "../../../../shared/app/NavigationContext";
import { useToast } from "../../../../shared/hooks/useToast";

export function OutgoingRequestsPage() {
  const { authContext } = useNavigation();
  const originCampId = authContext.campId ?? 0;
  const userId = authContext.userId ?? 0;

  const { toast } = useToast();
  const { data: requests = [], isLoading } = useCampRequestsQuery({ originCampId });
  const { approveAsOrigin, rejectAsOrigin } = useCampRequestMutation();

  const handleApprove = async (id: number) => {
    try {
      await approveAsOrigin.mutateAsync({ id, userId });
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
      await rejectAsOrigin.mutateAsync({ id, userId });
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
    <article className="flex h-full flex-col overflow-hidden bg-bg-app">
      <section className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-10 w-10 border-4 border-accent/30 border-t-accent animate-spin" />
            <p className="font-mono text-[10px] uppercase tracking-wide text-txt-secondary animate-pulse">LOADING REQUESTS...</p>
          </div>
        ) : (
          <OutgoingRequestsTable
            requests={requests}
            onApprove={handleApprove}
            onReject={handleReject}
            isLoading={approveAsOrigin.isPending || rejectAsOrigin.isPending}
          />
        )}
      </section>
    </article>
  );
}
