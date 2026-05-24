import { useCampRequestsQuery } from "../hooks/useCampRequestsQuery";
import { useCampRequestMutation } from "../hooks/useCampRequestMutation";
import { IncomingRequestsTable } from "../components/IncomingRequestsTable";
import { getAuthContextFromToken } from "../../../../utils/authAccess";

export function IncomingRequestsPage() {
  const authContext = getAuthContextFromToken();
  const destinationCampId = authContext.campId ?? 0;

  const { data: requests = [], isLoading } = useCampRequestsQuery({
    destinationCampId,
  });

  const { approveAsDestination, rejectAsDestination } = useCampRequestMutation();
  const userId = 1; // Obtener del contexto de autenticación

  const handleApprove = (id: number) => {
    approveAsDestination.mutate({ id, userId });
  };

  const handleReject = (id: number) => {
    rejectAsDestination.mutate({ id, userId });
  };

  return (
    <div className="flex h-full flex-col p-4 md:p-6 bg-bg-app gap-4">
      {/* <div className="flex items-center justify-between">
        <div className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-[0.2em]">
          Gestión Inter-Campamento / Solicitudes Entrantes
        </div>
        
      </div> */}

      <div className="relative flex min-h-0 flex-1 overflow-hidden bg-bg-secondary border border-border-default shadow-2xl">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50 z-10" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/50 z-10" />

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="h-10 w-10 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-txt-secondary animate-pulse">Cargando solicitudes...</p>
              </div>
            ) : (
              <IncomingRequestsTable
                requests={requests}
                onApprove={handleApprove}
                onReject={handleReject}
                isLoading={approveAsDestination.isPending || rejectAsDestination.isPending}
              />
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
