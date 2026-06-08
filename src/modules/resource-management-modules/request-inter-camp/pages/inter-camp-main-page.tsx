import { useEffect, useState } from "react";
import { Inbox, Package, Send, Truck, RotateCcw, Users } from "lucide-react";
import { IncomingRequestsPage } from "./IncomingRequestsPage";
import { OutgoingRequestsPage } from "./OutgoingRequestsPage";
import { ShipmentsPage } from "./ShipmentsPage";
import { PeopleRequestsPage } from "./PeopleRequestsPage";
import { useQuery } from "@tanstack/react-query";
import { useCampRequestMutation } from "../hooks/useCampRequestMutation";
import { ResourceSelector } from "../components/ResourceSelector";
import { PersonSelector } from "../components/PersonSelector";
import { requestResourceService } from "../services/RequestResourceService";
import { requestPersonService } from "../services/RequestPersonService";
import { CampService } from "../../../../services/CampService";
import { Camp } from "../../../../models/Camp";
import { useToast } from "../../../../shared/hooks/useToast";
import { useNavigation } from "../../../../shared/app/NavigationContext";
import CollapsibleSidePanel, { CollapsiblePanelHeader, getInitialSidePanelOpenState } from "../../shared/components/CollapsibleSidePanel";

const campService = new CampService();

type InterCampTab = "incoming" | "outgoing" | "shipments";
type RequestMode = "resources" | "people";

export function InterCampMainPage() {
    const [activeTab, setActiveTab] = useState<InterCampTab>("outgoing");
    const [requestMode, setRequestMode] = useState<RequestMode>("resources");
    const [isFormOpen, setIsFormOpen] = useState(getInitialSidePanelOpenState);
    const { authContext, activeCamp, activeCampStatus } = useNavigation();
    const originCampId = authContext.campId ?? 0;
    const { toast } = useToast();

    const [destinationCampId, setDestinationCampId] = useState<number>(0);
    const [description, setDescription] = useState<string>("");
    const [resources, setResources] = useState<Array<{ resource_id: number; amount: number }>>([]);
    const [people, setPeople] = useState<Array<{ person_id: number }>>([]);

    const { createRequest, deleteRequest } = useCampRequestMutation();

    const { data: camps = [], isLoading: isLoadingCamps } = useQuery({
        queryKey: ["camps-list-for-requests"],
        queryFn: async () => {
            const res = await campService.findAllForRequests();
            return res.getResultado<Camp[]>("registros") ?? [];
        },
    });

    const originCampName =
        activeCamp?.code?.trim() ||
        activeCamp?.description?.trim() ||
        camps.find((c) => c.id === originCampId)?.code ||
        (activeCampStatus === "loading" ? "Resolving..." : "No camp assigned");
    const destinationCampName = camps.find((c) => c.id === destinationCampId)?.code ?? "";
    const availableDestinations = camps.filter((c) => c.id !== originCampId);

    useEffect(() => {
        if (requestMode === "people" && activeTab === "shipments") {
            setActiveTab("outgoing");
        }
    }, [activeTab, requestMode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!originCampId) {
            toast({ tone: "error", title: "Missing origin camp", message: "No camp is assigned to the current user." });
            return;
        }

        if (destinationCampId === 0) {
            toast({ tone: "warning", title: "Missing destination", message: "Please select a destination camp." });
            return;
        }
        if (originCampId === destinationCampId) {
            toast({ tone: "error", title: "Invalid selection", message: "Origin and destination camps must be different." });
            return;
        }
        if (requestMode === "resources" && resources.length === 0) {
            toast({ tone: "warning", title: "No resources", message: "Please add at least one resource." });
            return;
        }
        if (requestMode === "people" && people.length === 0) {
            toast({ tone: "warning", title: "No people", message: "Please add at least one person." });
            return;
        }

        try {
            const request = await createRequest.mutateAsync({
                origin_camp_id: originCampId,
                destination_camp_id: destinationCampId,
                request_type: requestMode === "resources" ? "R" : "P",
                status: "P",
                origin_approval_status: "P",
                destination_approval_status: "P",
                description: description.trim() || null,
            });

            if (request.id) {
                try {
                    if (requestMode === "resources") {
                        await requestResourceService.createRequestResources(
                            request.id,
                            resources.map((r) => ({ resource_id: r.resource_id, amount: r.amount }))
                        );
                    } else {
                        await requestPersonService.createRequestPersons(
                            request.id,
                            people.map((person) => ({ person_id: person.person_id }))
                        );
                    }
                } catch (error) {
                    await deleteRequest.mutateAsync(request.id);
                    throw error;
                }
                toast({
                    tone: "success",
                    title: "Request submitted",
                    message: `${requestMode === "resources" ? "Provision" : "People transfer"} to ${destinationCampName} is pending manual approvals.`,
                });
                setDestinationCampId(0);
                setDescription("");
                setResources([]);
                setPeople([]);
            }
        } catch (error) {
            toast({
                tone: "error",
                title: "Error creating request",
                message: error instanceof Error ? error.message : "Failed to create the request.",
            });
        }
    };

    const allTabs: Array<{ key: InterCampTab; label: string; icon: React.ReactNode; description: string }> = [
        { key: "outgoing",  label: "My Requests",     icon: <Send size={16} />,  description: "Provisions I submitted"  },
        { key: "incoming",  label: "Received From",   icon: <Inbox size={16} />, description: "Requests sent to me" },
        { key: "shipments", label: "Shipments",       icon: <Truck size={16} />, description: "Shipments in transit"    },
    ];
    const tabs = allTabs.filter((tab) => requestMode === "resources" || tab.key !== "shipments");

    return (
        <article className="rmm-scope flex h-full min-h-0 flex-col bg-black/50 backdrop-blur-lg overflow-hidden relative border border-border-default">
            <div className="rmm-bracket rmm-bracket-tl"></div>
            <div className="rmm-bracket rmm-bracket-tr"></div>
            <div className="rmm-bracket rmm-bracket-bl"></div>
            <div className="rmm-bracket rmm-bracket-br"></div>

            {/* Topbar */}
            <header className="rmm-module-header flex items-stretch bg-black/50 backdrop-blur-lg shrink-0 z-10">
                <div className="rmm-module-brand flex items-center gap-3 shrink-0">
                    {/* <div className="rmm-module-accent w-0.75 self-stretch bg-accent"></div> */}
                    <div className="rmm-module-copy py-2 px-3">
                        <div className="rmm-module-title text-xl font-abril font-bold uppercase tracking-widest text-txt-primary leading-none">
                            Inter-Camp
                        </div>
                        <p className="rmm-module-subtitle font-mono text-[9px] text-txt-muted uppercase tracking-[0.18em] mt-0.5">
                            Logistics Transfer
                        </p>
                    </div>
                </div>

                <nav className="rmm-module-tabs flex items-stretch flex-1 justify-end">
                    <div className="flex items-center gap-1 border-l border-border-subtle px-2">
                        <button
                            type="button"
                            onClick={() => setRequestMode("resources")}
                            className={`grid h-8 w-8 place-items-center border transition-colors ${
                                requestMode === "resources"
                                    ? "border-accent/50 bg-accent/10 text-accent"
                                    : "border-border-default bg-bg-secondary/40 text-txt-muted hover:text-txt-primary"
                            }`}
                            aria-label="Show resource requests"
                            title="Resource requests"
                        >
                            <Package size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setRequestMode("people")}
                            className={`grid h-8 w-8 place-items-center border transition-colors ${
                                requestMode === "people"
                                    ? "border-accent/50 bg-accent/10 text-accent"
                                    : "border-border-default bg-bg-secondary/40 text-txt-muted hover:text-txt-primary"
                            }`}
                            aria-label="Show people requests"
                            title="People requests"
                        >
                            <Users size={14} />
                        </button>
                    </div>
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`rmm-module-tab relative flex items-center gap-2.5 px-5 border-r border-border-subtle transition-all group ${
                                activeTab === tab.key
                                    ? "rmm-module-tab--active bg-bg-app/60 text-accent"
                                    : "text-txt-muted hover:bg-bg-secondary/40 hover:text-txt-primary"
                            }`}
                        >
                            {activeTab === tab.key && (
                                <div className="rmm-module-tab-indicator absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                            )}
                            {/* <span className={`rmm-module-tab-index font-mono text-[9px] opacity-40 ${activeTab === tab.key ? "text-accent opacity-60" : ""}`}>
                                {String(i + 1).padStart(2, "0")}
                            </span> */}
                            <span className={`rmm-module-tab-icon ${activeTab === tab.key ? "text-accent" : "text-txt-disabled group-hover:text-txt-secondary"}`}>
                                {tab.icon}
                            </span>
                            <div className="rmm-module-tab-copy text-left">
                                <div className="rmm-module-tab-label font-mono text-[10px] font-bold uppercase tracking-widest">{tab.label}</div>
                                {/* <div className="rmm-module-tab-description font-mono text-[8px] text-txt-disabled uppercase tracking-wide">{tab.description}</div> */}
                            </div>
                        </button>
                    ))}
                </nav>
            </header>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">

                {/* Main Content */}
                <main className="flex-1 overflow-hidden flex flex-col">
                    <section className="flex-1 flex flex-col overflow-hidden">
                        {requestMode === "resources" && activeTab === "outgoing"  && <OutgoingRequestsPage />}
                        {requestMode === "resources" && activeTab === "incoming"  && <IncomingRequestsPage />}
                        {requestMode === "resources" && activeTab === "shipments" && <ShipmentsPage />}
                        {requestMode === "people" && activeTab === "outgoing" && <PeopleRequestsPage direction="outgoing" />}
                        {requestMode === "people" && activeTab === "incoming" && <PeopleRequestsPage direction="incoming" />}
                    </section>
                </main>

                <CollapsibleSidePanel
                    isOpen={isFormOpen}
                    label={requestMode === "resources" ? "Provision request form" : "People request form"}
                    collapsedLabel="FORM"
                    widthClassName="lg:w-96"
                    onOpen={() => setIsFormOpen(true)}
                    onClose={() => setIsFormOpen(false)}
                >
                    <CollapsiblePanelHeader
                        title={requestMode === "resources" ? "Request Provision" : "Request People"}
                        subtitle={<>Sending from: <span className="text-accent">{originCampName}</span></>}
                        onClose={() => setIsFormOpen(false)}
                    />

                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3">
                        {/* Info banner */}
                        {/* <div className="p-3 bg-status-info/10 border border-status-info/30">
                            <p className="font-mono text-[9px] text-txt-secondary leading-relaxed">
                                Submitting this form <span className="text-status-info font-bold">automatically authorizes</span> the provision on your behalf. The destination camp must then approve to complete the shipment.
                            </p>
                        </div> */}

                        <div>
                            <label className="rmm-label mb-1.5">{requestMode === "resources" ? "DESTINATION CAMP" : "PROVIDER CAMP"}</label>
                            {isLoadingCamps ? (
                                <div className="rmm-input w-full flex items-center gap-2 opacity-50">
                                    <div className="h-3 w-3 border-2 border-accent/30 border-t-accent animate-spin" />
                                    SCANNING...
                                </div>
                            ) : (
                                <select
                                    value={destinationCampId}
                                    onChange={(e) => setDestinationCampId(Number(e.target.value))}
                                    className="rmm-input w-full"
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
                            <label className="rmm-label mb-1.5">DESCRIPTION (optional)</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="rmm-input w-full text-[10px] resize-none"
                                rows={3}
                                placeholder="Mission justification..."
                            />
                        </div>

                        <div className="pt-2 border-t border-border-default/50">
                            {requestMode === "resources" ? (
                                <ResourceSelector resources={resources} onChange={setResources} />
                            ) : (
                                <PersonSelector campId={destinationCampId} persons={people} onChange={setPeople} />
                            )}
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => { setDestinationCampId(0); setDescription(""); setResources([]); setPeople([]); }}
                                disabled={createRequest.isPending}
                                className="rmm-btn border border-border-default bg-bg-tertiary text-txt-secondary hover:text-txt-primary hover:bg-bg-secondary text-[10px] px-3 transition-all disabled:opacity-50"
                            >
                                <RotateCcw size={12} />
                                CLEAR
                            </button>
                            <button
                                type="submit"
                                disabled={createRequest.isPending || !originCampId || destinationCampId === 0 || (requestMode === "resources" ? resources.length === 0 : people.length === 0)}
                                className="rmm-btn rmm-btn-accent flex-1 justify-center text-[10px] py-2.5 transition-all shadow-sm"
                            >
                                {createRequest.isPending ? (
                                    <div className="h-3 w-3 border-2 border-white/30 border-t-white animate-spin" />
                                ) : "SUBMIT REQUEST"}
                            </button>
                        </div>
                    </form>
                </CollapsibleSidePanel>
            </div>
        </article>
    );
}
