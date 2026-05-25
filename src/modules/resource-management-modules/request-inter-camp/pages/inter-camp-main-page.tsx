import { useState } from "react";
import { Inbox, Send, Truck } from "lucide-react";
import { getAuthContextFromToken } from "../../../../utils/authAccess";
import { IncomingRequestsPage } from "./IncomingRequestsPage";
import { OutgoingRequestsPage } from "./OutgoingRequestsPage";
import { ShipmentsPage } from "./ShipmentsPage";
import { useQuery } from "@tanstack/react-query";
import { useCampRequestMutation } from "../hooks/useCampRequestMutation";
import { ResourceSelector } from "../components/ResourceSelector";
import { requestResourceService } from "../services/RequestResourceService";
import { CampService } from "../../../../services/CampService";
import { Camp } from "../../../../models/Camp";

const campService = new CampService();

type InterCampTab = "incoming" | "outgoing" | "shipments";

export function InterCampMainPage() {
    const [activeTab, setActiveTab] = useState<InterCampTab>("outgoing");
    const authContext = getAuthContextFromToken();
    const originCampId = authContext.campId ?? 0;

    const [destinationCampId, setDestinationCampId] = useState<number>(0);
    const [description, setDescription] = useState<string>("");
    const [resources, setResources] = useState<Array<{ resource_id: number; amount: number }>>([]);

    const { createRequest } = useCampRequestMutation();

    const { data: camps = [], isLoading: isLoadingCamps } = useQuery({
        queryKey: ["camps-list-for-requests"],
        queryFn: async () => {
            const res = await campService.findAllForRequests();
            return res.getResultado<Camp[]>("registros") ?? [];
        },
    });

    const originCampName = camps.find((c) => c.id === originCampId)?.code ?? "Cargando...";
    const availableDestinations = camps.filter((c) => c.id !== originCampId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (destinationCampId === 0) {
            alert("Debes seleccionar un campamento destino");
            return;
        }
        if (originCampId === destinationCampId) {
            alert("El campamento de origen y destino no pueden ser el mismo");
            return;
        }
        if (resources.length === 0) {
            alert("Debes seleccionar al menos un recurso");
            return;
        }

        try {
            const request = await createRequest.mutateAsync({
                origin_camp_id: originCampId,
                destination_camp_id: destinationCampId,
                request_type: "R",
                status: "P",
                origin_approval_status: "P",
                destination_approval_status: "P",
                description: description.trim() || null,
            });

            if (request.id) {
                await requestResourceService.createRequestResources(
                    request.id,
                    resources.map((r) => ({ resource_id: r.resource_id, amount: r.amount }))
                );
                alert("Solicitud creada exitosamente");
                setDestinationCampId(0);
                setDescription("");
                setResources([]);
            }
        } catch (error) {
            alert(`Error al crear solicitud: ${error}`);
        }
    };

    const tabs: Array<{ key: InterCampTab; label: string; icon: React.ReactNode; description: string }> = [
        { key: "outgoing",  label: "Sent",      icon: <Send size={16} />,  description: "Solicitudes enviadas"  },
        { key: "incoming",  label: "Received",  icon: <Inbox size={16} />, description: "Solicitudes recibidas" },
        { key: "shipments", label: "Shipments", icon: <Truck size={16} />, description: "Envios en transito"    },
    ];

    return (
        <article className="rmm-scope flex h-screen flex-col bg-bg-app overflow-hidden relative">
            <div className="rmm-bracket rmm-bracket-tl"></div>
            <div className="rmm-bracket rmm-bracket-tr"></div>
            <div className="rmm-bracket rmm-bracket-bl"></div>
            <div className="rmm-bracket rmm-bracket-br"></div>

            {/* Topbar */}
            <header className="flex items-stretch border-b border-border-default bg-bg-tertiary shrink-0 z-10">
                <div className="flex items-center gap-3 shrink-0">
                    <div className="w-0.75 self-stretch bg-accent"></div>
                    <div className="py-2">
                        <h3 className="text-xl font-bold uppercase tracking-widest text-txt-primary leading-none">
                            Inter-Camp
                        </h3>
                        <p className="font-mono text-[9px] text-txt-muted uppercase tracking-[0.18em] mt-0.5">
                            Logistics Transfer <span className="text-accent"> | </span> RMM-04
                        </p>
                    </div>
                </div>

                <nav className="flex items-stretch flex-1 justify-end">
                    {tabs.map((tab, i) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`relative flex items-center gap-2.5 px-5 border-r border-border-subtle transition-all group ${
                                activeTab === tab.key
                                    ? "bg-bg-app/60 text-accent"
                                    : "text-txt-muted hover:bg-bg-secondary/40 hover:text-txt-primary"
                            }`}
                        >
                            {activeTab === tab.key && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                            )}
                            <span className={`font-mono text-[9px] opacity-40 ${activeTab === tab.key ? "text-accent opacity-60" : ""}`}>
                                {String(i + 1).padStart(2, "00")}
                            </span>
                            <span className={activeTab === tab.key ? "text-accent" : "text-txt-disabled group-hover:text-txt-secondary"}>
                                {tab.icon}
                            </span>
                            <div className="text-left">
                                <div className="font-mono text-[10px] font-bold uppercase tracking-widest">{tab.label}</div>
                                <div className="font-mono text-[8px] text-txt-disabled uppercase tracking-wide">{tab.description}</div>
                            </div>
                        </button>
                    ))}
                </nav>
            </header>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">

                {/* Main Content */}
                <main className="flex-1 overflow-hidden flex flex-col">
                    <section className="flex-1 overflow-y-auto">
                        {activeTab === "incoming"  && <IncomingRequestsPage />}
                        {activeTab === "outgoing"  && <OutgoingRequestsPage />}
                        {activeTab === "shipments" && <ShipmentsPage />}
                    </section>
                </main>

                {/* Right panel: Generate Provision form */}
                <aside className="w-72 shrink-0 border-l border-border-default bg-bg-secondary/20 flex flex-col overflow-hidden">
                    <header className="px-4 py-2 border-b border-border-default bg-bg-tertiary shrink-0">
                        <div className="font-mono text-[10px] font-bold text-accent uppercase tracking-[0.2em] flex items-center gap-2">
                            <Send size={12} />
                            Generate Provision
                        </div>
                        <p className="font-mono text-[8px] text-txt-muted uppercase tracking-widest mt-0.5">
                            Source: <span className="text-accent">{originCampName}</span>
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3">
                        <div>
                            <label className="rmm-label mb-1.5">TARGET_NODE</label>
                            {isLoadingCamps ? (
                                <div className="rmm-input w-full flex items-center gap-2 opacity-50">
                                    <div className="h-3 w-3 border-2 border-accent/30 border-t-accent animate-spin" />
                                    SCANNING...
                                </div>
                            ) : (
                                <select
                                    value={destinationCampId}
                                    onChange={(e) => setDestinationCampId(Number(e.target.value))}
                                    className="rmm-input w-full py-1.5!"
                                    required
                                >
                                    <option value={0}>SELECT_DESTINATION...</option>
                                    {availableDestinations.map((c) => (
                                        <option key={c.id ?? 0} value={c.id ?? 0}>{c.code}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div>
                            <label className="rmm-label mb-1.5">MANIFEST_DETAILS</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="rmm-input w-full text-[10px]! resize-none"
                                rows={2}
                                placeholder="Mission justification..."
                            />
                        </div>

                        <div className="pt-2 border-t border-border-default/50">
                            <ResourceSelector resources={resources} onChange={setResources} />
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => { setDestinationCampId(0); setDescription(""); setResources([]); }}
                                disabled={createRequest.isPending}
                                className="rmm-btn border border-border-strong text-txt-secondary hover:text-txt-primary hover:bg-bg-secondary text-[10px] py-3! disabled:opacity-50"
                            >
                                CLR
                            </button>
                            <button
                                type="submit"
                                disabled={createRequest.isPending || destinationCampId === 0 || resources.length === 0}
                                className="rmm-btn rmm-btn-accent flex-1 justify-center text-[10px] py-3!"
                            >
                                {createRequest.isPending ? (
                                    <div className="h-3 w-3 border-2 border-white/30 border-t-white animate-spin" />
                                ) : "AUTHORIZE_SEND"}
                            </button>
                        </div>
                    </form>
                </aside>
            </div>
        </article>
    );
}
