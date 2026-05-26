import { useCampRequestsQuery } from "../hooks/useCampRequestsQuery";
import { useCampRequestMutation } from "../hooks/useCampRequestMutation";
import { OutgoingRequestsTable } from "../components/OutgoingRequestsTable";
import { getAuthContextFromToken } from "../../../../shared/utils/authAccess";

export function OutgoingRequestsPage() {
  const authContext = getAuthContextFromToken();
  const originCampId = authContext.campId ?? 0;

  const { data: requests = [], isLoading } = useCampRequestsQuery({
    originCampId,
  });

  const { approveAsOrigin, rejectAsOrigin } = useCampRequestMutation();
  const userId = authContext.userId ?? 0;

  const handleApprove = (id: number) => {
    approveAsOrigin.mutate({ id, userId });
  };

  const handleReject = (id: number) => {
    rejectAsOrigin.mutate({ id, userId });
  };

  return (
    <article className="flex h-full flex-col overflow-hidden bg-bg-app">
      <section className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-10 w-10 border-4 border-accent/30 border-t-accent animate-spin" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-txt-secondary animate-pulse">Cargando solicitudes...</p>
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
