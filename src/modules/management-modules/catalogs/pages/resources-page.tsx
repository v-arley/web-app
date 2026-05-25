import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Search } from "lucide-react";
import { ResourceForm } from "../components/ResourceForm";
import { ResourceTable } from "../components/ResourceTable";
import { useResourceCatalogTab } from "../hooks/useResourceCatalogTab";

function AlertBanner({
    tone,
    message,
}: {
    tone: "error" | "success" | "info";
    message: string;
}) {
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

function ResourcesPageContent() {
    const [feedback, setFeedback] = useState<{ tone: "error" | "success" | "info"; message: string } | null>(null);

    const callbacks = {
        onSuccess: (message: string) => setFeedback({ tone: "success", message }),
        onError: (message: string) => setFeedback({ tone: "error", message }),
    };

    const resources = useResourceCatalogTab(true, callbacks);

    return (
        <div className="mm-scope flex h-full flex-col overflow-hidden">
            {feedback ? (
                <div className="px-5 py-2">
                    <AlertBanner tone={feedback.tone} message={feedback.message} />
                </div>
            ) : null}
            {resources.error ? (
                <div className="px-5 py-2">
                    <AlertBanner tone="error" message={resources.error.message} />
                </div>
            ) : null}

            <div className="flex min-h-0 flex-1 flex-col lg:flex-row overflow-hidden">
                <div className="flex flex-1 flex-col border-b lg:border-b-0 lg:border-r border-border-default overflow-hidden">
                    {/* SEARCH BAR */}
                    <div className="flex items-center gap-2 px-5 py-3 border-b border-border-default bg-bg-primary/30">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-txt-disabled" />
                            <input
                                type="search"
                                placeholder="BUSCAR POR CODIGO, NOMBRE O CATEGORIA..."
                                className="w-full bg-bg-tertiary border border-border-default pl-9 pr-4 py-2.5 text-[11px] font-mono text-txt-primary placeholder:text-txt-disabled/50 focus:border-accent outline-none transition-all uppercase tracking-wider"
                                value={resources.search}
                                onChange={(event) => resources.setSearch(event.target.value)}
                            />
                        </div>
                        <div className="flex h-10 items-center whitespace-nowrap text-[10px] font-mono font-bold text-accent uppercase tracking-widest border-l border-border-default pl-4 ml-2">
                            REGISTROS: {String(resources.filteredRecords.length).padStart(4, "0")}
                        </div>
                    </div>

                    {resources.isLoading ? (
                        <div className="flex flex-1 items-center justify-center bg-bg-primary/10">
                            <div className="h-4 w-4 animate-spin border-2 border-accent border-t-transparent rounded-full" />
                        </div>
                    ) : (
                        <ResourceTable
                            resources={resources.filteredRecords}
                            selectedId={resources.selected?.id ?? null}
                            onSelect={resources.selectById}
                        />
                    )}
                </div>

                <aside className="flex w-full flex-col lg:w-[400px] xl:w-[450px] shrink-0 bg-bg-primary/20 overflow-hidden">
                    <ResourceForm
                        key={resources.selected?.id ?? "new-resource"}
                        initialData={resources.selected}
                        onSave={resources.handleSave}
                        onDelete={resources.handleDelete}
                        onClear={resources.handleClear}
                    />
                </aside>
            </div>
        </div>
    );
}

export function ResourcesPage() {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: false,
                        refetchOnWindowFocus: false,
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            <ResourcesPageContent />
        </QueryClientProvider>
    );
}
