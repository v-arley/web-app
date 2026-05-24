import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { getAuthContextFromToken } from "../../../../utils/authAccess";
import { AlertsTable } from "../components/AlertsTable";
import { useAlertMutation } from "../hooks/useAlertMutation";
import { useAlertsQuery } from "../hooks/useAlertsQuery";

function AlertBanner({ tone, message }: { tone: "error" | "success" | "info"; message: string }) {
    const toneClassName =
        tone === "error"
            ? "bg-status-critical/10 border-status-critical/30 text-status-critical"
            : tone === "success"
            ? "bg-status-ok/10 border-status-ok/30 text-status-ok"
            : "bg-status-info/10 border-status-info/30 text-status-info";

    return (
        <div className={`px-4 py-3 border font-mono text-[11px] uppercase tracking-widest ${toneClassName}`}>
            {message}
        </div>
    );
}

function AlertsPageContent() {
    const authContext = getAuthContextFromToken();
    const campId = authContext.campId ?? 0;

    const [feedback, setFeedback] = useState<{ tone: "error" | "success" | "info"; message: string } | null>(null);

    const { query } = useAlertsQuery(campId, true);
    const alertMutation = useAlertMutation();

    const handleResolve = async (alertId: number) => {
        try {
            await alertMutation.resolve.mutateAsync(alertId);
            setFeedback({ tone: "success", message: "Alerta marcada como resuelta." });
        } catch (error) {
            setFeedback({
                tone: "error",
                message: error instanceof Error ? error.message : "No se pudo resolver la alerta.",
            });
        }
    };

    const handleViewDetail = (warehouseId: number, resourceId: number) => {
        // TODO: Implementar navegación a la vista de stock con el recurso seleccionado
        console.log("Ver detalle:", { warehouseId, resourceId });
    };

    return (
        <div className="flex h-full flex-col p-4 md:p-6 bg-bg-app gap-4">
            <div className="flex items-center justify-between">
                <div className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-[0.2em]">
                    Gestión de Inventario / Alertas de Stock
                </div>
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-status-critical" />
                    {query.data && query.data.length > 0 && (
                        <span className="font-mono text-[10px] font-bold text-status-critical uppercase tracking-widest">
                            {query.data.length} {query.data.length === 1 ? "alerta activa" : "alertas activas"}
                        </span>
                    )}
                </div>
            </div>

            {feedback && <AlertBanner tone={feedback.tone} message={feedback.message} />}
            {query.error && <AlertBanner tone="error" message={query.error.message} />}

            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-bg-secondary border border-border-default shadow-2xl">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50 z-10" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/50 z-10" />

                <div className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-status-critical/5">
                    <div className="font-mono text-[10px] font-bold text-txt-primary uppercase tracking-[0.15em]">
                        Alertas Activas (Stock Bajo / Crítico)
                    </div>
                    {query.data && query.data.length > 0 && (
                        <span className="whitespace-nowrap text-[10px] font-mono font-bold text-accent uppercase tracking-widest">
                            Total: {String(query.data.length).padStart(4, "0")}
                        </span>
                    )}
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    {query.isLoading ? (
                        <div className="flex flex-1 items-center justify-center bg-bg-primary/10">
                            <div className="h-4 w-4 animate-spin border-2 border-accent border-t-transparent rounded-full" />
                        </div>
                    ) : (
                        <AlertsTable
                            alerts={query.data ?? []}
                            onResolve={handleResolve}
                            onViewDetail={handleViewDetail}
                        />
                    )}
                </div>
            </div>

            <div className="px-4 py-3 bg-status-info/10 border border-status-info/30 font-mono text-[10px] text-txt-secondary leading-relaxed">
                <span className="font-bold text-status-info">NOTA:</span> Las alertas se generan automáticamente cuando
                la cantidad actual de un recurso cae por debajo del mínimo configurado. Una vez reabastecido el recurso,
                puedes marcar la alerta como resuelta.
            </div>
        </div>
    );
}

export function AlertsPage() {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: false,
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <AlertsPageContent />
        </QueryClientProvider>
    );
}
