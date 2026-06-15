import { useEffect, useState } from "react";
import { Inbox, Send, Truck, RotateCcw } from "lucide-react";
import { IncomingRequestsPage } from "./IncomingRequestsPage";
import { OutgoingRequestsPage } from "./OutgoingRequestsPage";
import { ShipmentsPage } from "./ShipmentsPage";
import { PeopleRequestsPage } from "./PeopleRequestsPage";
import { useQuery } from "@tanstack/react-query";
import { useCampRequestMutation } from "../hooks/useCampRequestMutation";
import { ResourceSelector } from "../components/ResourceSelector";
import { requestResourceService } from "../services/RequestResourceService";
import { CampService } from "../../../../services/CampService";
import { Camp } from "../../../../models/Camp";
import { useToast } from "../../../../shared/hooks/useToast";
import { useNavigation } from "../../../../shared/app/NavigationContext";
import CollapsibleSidePanel, { CollapsiblePanelHeader, getInitialSidePanelOpenState } from "../../shared/components/CollapsibleSidePanel";
import { CampSearchPicker } from "../../shared/components/CampSearchPicker";

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
    const [peopleCount, setPeopleCount] = useState<number>(1);
    const [resources, setResources] = useState<Array<{ resource_id: number; amount: number }>>([]);

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
    const destinationOptions = availableDestinations.map((camp) => ({
        id: camp.id ?? 0,
        label: camp.code || camp.description || `Camp #${camp.id ?? 0}`,
        description: camp.description ?? "",
    }));

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
        if (requestMode === "people" && peopleCount <= 0) {
            toast({ tone: "warning", title: "Invalid people count", message: "Please enter how many people are needed." });
            return;
        }

        try {
            const normalizedDescription = description.trim();
            const requestDescription = requestMode === "people"
                ? `People needed: ${peopleCount}. ${normalizedDescription || "No additional details."}`
                : normalizedDescription || null;
            const request = await createRequest.mutateAsync({
                origin_camp_id: originCampId,
                destination_camp_id: destinationCampId,
                request_type: requestMode === "resources" ? "R" : "P",
                status: "P",
                origin_approval_status: requestMode === "people" ? "A" : "P",
                destination_approval_status: "P",
                description: requestDescription,
            });

            if (request.id) {
                try {
                    if (requestMode === "resources") {
                        await requestResourceService.createRequestResources(
                            request.id,
                            resources.map((r) => ({ resource_id: r.resource_id, amount: r.amount }))
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
                setPeopleCount(1);
                setResources([]);
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
        { key: "outgoing", label: "My Requests", icon: <Send size={16} />, description: "Provisions I submitted" },
        { key: "incoming", label: "Received From", icon: <Inbox size={16} />, description: "Requests sent to me" },
        { key: "shipments", label: "Shipments", icon: <Truck size={16} />, description: "Shipments in transit" },
    ];
    const tabs = allTabs.filter((tab) => requestMode === "resources" || tab.key !== "shipments");
    const operationDescription = requestMode === "resources" ? "Resources transfer" : "People transfer";
    const nextRequestMode: RequestMode = requestMode === "resources" ? "people" : "resources";
    const requestModeLabel = requestMode === "resources" ? "Resources" : "People";
    const requestModeAction = nextRequestMode === "resources" ? "Switch to resources" : "Switch to people";

    return (
        <article className="app-scope app-module">

            <header className="app-module-header">
                <div className="app-module-brand">
                    <div className="app-module-copy">
                        <div className="app-module-title">Inter-Camp</div>
                        <p className="app-module-subtitle">Logistics Transfer</p>
                    </div>
                </div>

                <nav className="app-module-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`app-module-tab ${activeTab === tab.key ? "app-module-tab--active" : ""}`}
                        >
                            {activeTab === tab.key && <div className="app-module-tab-indicator" />}
                            <span className="app-module-tab-icon">{tab.icon}</span>
                            <div className="app-module-tab-copy">
                                <div className="app-module-tab-label">{tab.label}</div>
                            </div>
                        </button>
                    ))}
                    <div style={{ display: "flex", alignItems: "center", borderLeft: "1px solid var(--color-border-subtle)", padding: "0 0.5rem" }}>
                        <button
                            type="button"
                            onClick={() => setRequestMode(nextRequestMode)}
                            className="app-btn app-btn--outline app-btn--sm"
                            aria-label={requestModeAction}
                            title={requestModeAction}
                            style={{
                                display: "inline-flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                justifyContent: "center",
                                gap: "0.125rem",
                                minWidth: "9.75rem",
                                maxWidth: "9.75rem",
                                minHeight: "2.5rem",
                                padding: "0.35rem 0.6rem",
                                whiteSpace: "nowrap",
                            }}
                        >
                            <span style={{ fontWeight: 700, lineHeight: 1 }}>{requestModeLabel}</span>
                        </button>
                    </div>
                </nav>
            </header>

            <main className="app-module-body app-content-pad">
                <div className="app-split">
                    <div
                        key={`${activeTab}-${requestMode}`}
                        className="app-animate-in"
                        style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, minHeight: 0, overflow: "hidden" }}
                    >
                        {requestMode === "resources" && activeTab === "outgoing" && <OutgoingRequestsPage />}
                        {requestMode === "resources" && activeTab === "incoming" && <IncomingRequestsPage />}
                        {activeTab === "shipments" && <ShipmentsPage />}
                        {requestMode === "people" && activeTab === "outgoing" && <PeopleRequestsPage direction="outgoing" />}
                        {requestMode === "people" && activeTab === "incoming" && <PeopleRequestsPage direction="incoming" />}
                    </div>

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
                            subtitle={<><span style={{ color: "var(--color-txt-secondary)" }}>{operationDescription}</span> | Sending from: <span style={{ color: "var(--color-accent)" }}>{originCampName}</span></>}
                            onClose={() => setIsFormOpen(false)}
                        />

                        <form onSubmit={handleSubmit} className="app-panel-body" style={{ gap: "0.75rem", display: "flex", flexDirection: "column" }}>
                            <div className="app-field">
                                <label className="app-label">{requestMode === "resources" ? "DESTINATION CAMP" : "PROVIDER CAMP"}</label>
                                {isLoadingCamps ? (
                                    <div className="app-input" style={{ display: "flex", alignItems: "center", gap: "0.5rem", opacity: 0.5 }}>
                                        <div className="app-spinner app-spinner--sm" />
                                        SCANNING...
                                    </div>
                                ) : (
                                    <CampSearchPicker
                                        selectedId={destinationCampId}
                                        onChange={setDestinationCampId}
                                        options={destinationOptions}
                                        placeholder="SELECT_DESTINATION..."
                                    />
                                )}
                            </div>

                            <div className="app-field">
                                <label className="app-label">DESCRIPTION (optional)</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="app-input"
                                    style={{ fontSize: "10px", resize: "none" }}
                                    rows={3}
                                    placeholder="Mission justification..."
                                />
                            </div>

                            <div style={{ paddingTop: "0.5rem", borderTop: "1px solid color-mix(in srgb, var(--color-border-default) 50%, transparent)" }}>
                                {requestMode === "resources" ? (
                                    <ResourceSelector resources={resources} onChange={setResources} />
                                ) : (
                                    <div className="app-field" style={{ gap: "0.75rem" }}>
                                        <label className="app-label">PEOPLE NEEDED</label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={peopleCount}
                                            onChange={(event) => setPeopleCount(Math.max(1, Number(event.target.value) || 1))}
                                            className="app-input"
                                        />
                                        <p className="app-muted" style={{ lineHeight: 1.6 }}>
                                            The provider camp selects the available people when approving this request.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: "flex", gap: "0.5rem", paddingTop: "0.25rem" }}>
                                <button
                                    type="button"
                                    onClick={() => { setDestinationCampId(0); setDescription(""); setPeopleCount(1); setResources([]); }}
                                    disabled={createRequest.isPending}
                                    className="app-btn app-btn--secondary app-btn--sm"
                                >
                                    <RotateCcw size={12} />
                                    CLEAR
                                </button>
                                <button
                                    type="submit"
                                    disabled={createRequest.isPending || !originCampId || destinationCampId === 0 || (requestMode === "resources" ? resources.length === 0 : peopleCount <= 0)}
                                    className="app-btn app-btn--primary app-btn--sm app-btn--full"
                                >
                                    {createRequest.isPending ? (
                                        <div className="app-spinner app-spinner--sm" style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} />
                                    ) : "SUBMIT REQUEST"}
                                </button>
                            </div>
                        </form>
                    </CollapsibleSidePanel>
                </div>
            </main>
        </article>
    );
}
