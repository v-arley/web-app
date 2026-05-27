import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Utensils } from "lucide-react";
import { getAuthContextFromToken } from "../../../../shared/utils/authAccess";
import { ResourceService } from "../../../../services/ResourceService";
import { RationGenerationPanel } from "../components/RationGenerationPanel";

const queryClient = new QueryClient();
const resourceService = new ResourceService();

function GenerateRationsPageContent() {
    const authContext = getAuthContextFromToken();
    const campId = authContext.campId ?? 0;
    
    const [rationDate, setRationDate] = useState<string>(new Date().toISOString().split('T')[0]);

    // Obtener recursos
    const { data: resourcesData } = useQuery({
        queryKey: ["resources"],
        queryFn: async () => {
            const response = await resourceService.findAll();
            return response.getResultado<{ id: number; name: string }[]>("registros") ?? [];
        },
    });

    const resourceMap = useMemo(() => {
        return new Map(resourcesData?.map((r) => [r.id, r.name]) ?? []);
    }, [resourcesData]);

    return (
        <div className="flex flex-1 min-h-0 flex-col p-4 md:p-6 bg-bg-app gap-4">
            {/* <div className="flex items-center justify-between">
                <div className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-[0.2em]">
                    Raciones Diarias / Generar Raciones
                </div>
                <Utensils className="h-5 w-5 text-accent" />
            </div> */}

            <div className="relative flex min-h-0 flex-1 overflow-hidden bg-bg-secondary border border-border-default shadow-2xl">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50 z-10" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/50 z-10" />
                
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                {/* <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-accent-primary/10 border border-accent-primary/30">
                        <Utensils className="w-6 h-6 text-accent-primary" />
                    </div>
                    <div>
                        <h1 className="font-mono text-xl font-bold text-txt-primary uppercase tracking-wide">
                            Generar Raciones Diarias
                        </h1>
                        <p className="font-mono text-xs text-txt-secondary mt-1">
                            Generar raciones para todas las personas activas del campamento
                        </p>
                    </div>
                </div> */}

                {/* Panel de generación */}
                <RationGenerationPanel
                    campId={campId}
                    rationDate={rationDate}
                    onDateChange={setRationDate}
                    resourceMap={resourceMap}
                />

                {/* Información */}
                <div className="bg-bg-secondary border border-border-default p-5">
                    <div className="font-mono text-[10px] font-bold text-txt-disabled uppercase tracking-widest mb-3">
                        Information
                    </div>
                    <div className="space-y-2 font-mono text-xs text-txt-secondary">
                        <p>• Rations are automatically generated for all active camp members.</p>
                        <p>• Each ration includes, by default: 5L of drinking water and 1 combat ration.</p>
                        <p>• Resources are automatically deducted from the inventory.</p>
                        <p>• If there is insufficient inventory, ration generation will be blocked.</p>
                        <p>• Rations can only be generated once per date and camp.</p>
                    </div>
                </div>
            </div>
        </div>
            </div>
        </div>
    );
}

export function GenerateRationsPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <GenerateRationsPageContent />
        </QueryClientProvider>
    );
}
