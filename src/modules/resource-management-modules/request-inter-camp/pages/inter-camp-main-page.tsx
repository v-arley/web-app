import { useState } from "react";
import { Inbox, RotateCcw, Send, Truck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getAuthContextFromToken } from "../../../../shared/utils/authAccess";
import { IncomingRequestsPage } from "./IncomingRequestsPage";
import { OutgoingRequestsPage } from "./OutgoingRequestsPage";
import { ShipmentsPage } from "./ShipmentsPage";
import { useCampRequestMutation } from "../hooks/useCampRequestMutation";
import { ResourceSelector } from "../components/ResourceSelector";
import { requestResourceService } from "../services/RequestResourceService";
import { CampService } from "../../../../services/CampService";
import { Camp } from "../../../../models/Camp";
import { useToast } from "../../../../shared/hooks/useToast";
import CollapsibleSidePanel, { CollapsiblePanelHeader, getInitialSidePanelOpenState } from "../../shared/components/CollapsibleSidePanel";

const campService = new CampService();

type InterCampTab = "incoming" | "outgoing" | "shipments";

<<<<<<< HEAD
type ResourceItem = {
  resource_id: number;
  amount: number;
  name?: string;
};
=======
export function InterCampMainPage() {
    const [activeTab, setActiveTab] = useState<InterCampTab>("outgoing");
    const [isFormOpen, setIsFormOpen] = useState(getInitialSidePanelOpenState);
    const authContext = getAuthContextFromToken();
    const originCampId = authContext.campId ?? 0;
    const { toast } = useToast();
>>>>>>> develop

const inputClass =
  "h-12 w-full border border-border-default bg-bg-tertiary px-4 text-[15px] font-bold tracking-[0.04em] text-txt-primary outline-none transition-all placeholder:text-txt-disabled focus:border-accent focus:shadow-[0_0_0_2px_rgba(232,93,4,0.22)]";

const textAreaClass =
  "h-[105px] w-full resize-none border border-border-default bg-bg-tertiary px-4 py-3 text-[15px] font-bold leading-relaxed tracking-[0.04em] text-txt-primary outline-none transition-all placeholder:text-txt-disabled focus:border-accent focus:shadow-[0_0_0_2px_rgba(232,93,4,0.22)]";

<<<<<<< HEAD
function FieldLabel({
  children,
  htmlFor,
  required = false,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
}) {
  const className =
    "text-[13px] font-bold uppercase tracking-[0.14em] text-txt-primary";
=======
    const { data: camps = [], isLoading: isLoadingCamps } = useQuery({
        queryKey: ["camps-list-for-requests"],
        queryFn: async () => {
            const res = await campService.findAllForRequests();
            return res.getResultado<Camp[]>("registros") ?? [];
        },
    });

    const originCampName = camps.find((c) => c.id === originCampId)?.code ?? "Loading...";
    const destinationCampName = camps.find((c) => c.id === destinationCampId)?.code ?? "";
    const availableDestinations = camps.filter((c) => c.id !== originCampId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (destinationCampId === 0) {
            toast({ tone: "warning", title: "Missing destination", message: "Please select a destination camp." });
            return;
        }
        if (originCampId === destinationCampId) {
            toast({ tone: "error", title: "Invalid selection", message: "Origin and destination camps must be different." });
            return;
        }
        if (resources.length === 0) {
            toast({ tone: "warning", title: "No resources", message: "Please add at least one resource." });
            return;
        }

        try {
            const request = await createRequest.mutateAsync({
                origin_camp_id: originCampId,
                destination_camp_id: destinationCampId,
                request_type: "R",
                status: "P",
                origin_approval_status: "A",       // Auto-approved — I'm the sender
                destination_approval_status: "P",
                description: description.trim() || null,
            });

            if (request.id) {
                await requestResourceService.createRequestResources(
                    request.id,
                    resources.map((r) => ({ resource_id: r.resource_id, amount: r.amount }))
                );
                toast({ tone: "success", title: "Shipment authorized", message: `Provision to ${destinationCampName} submitted and approved by your camp.` });
                setDestinationCampId(0);
                setDescription("");
                setResources([]);
            }
        } catch (error) {
            toast({
                tone: "error",
                title: "Error creating request",
                message: error instanceof Error ? error.message : "Failed to create the provision request.",
            });
        }
    };

    const tabs: Array<{ key: InterCampTab; label: string; icon: React.ReactNode; description: string }> = [
        { key: "outgoing",  label: "My Requests",     icon: <Send size={16} />,  description: "Provisions I submitted"  },
        { key: "incoming",  label: "Received From",   icon: <Inbox size={16} />, description: "Requests sent to me" },
        { key: "shipments", label: "Shipments",       icon: <Truck size={16} />, description: "Shipments in transit"    },
    ];
>>>>>>> develop

  if (!htmlFor) {
    return (
<<<<<<< HEAD
      <p className={className}>
        {children}
        {required ? <span className="ml-1 text-status-critical">*</span> : null}
      </p>
=======
        <article className="rmm-scope flex h-full min-h-0 flex-col bg-black/50 backdrop-blur-lg overflow-hidden relative border border-border-default">
            <div className="rmm-bracket rmm-bracket-tl"></div>
            <div className="rmm-bracket rmm-bracket-tr"></div>
            <div className="rmm-bracket rmm-bracket-bl"></div>
            <div className="rmm-bracket rmm-bracket-br"></div>

            {/* Topbar */}
            <header className="rmm-module-header flex items-stretch bg-black/50 backdrop-blur-lg shrink-0 z-10">
                <div className="rmm-module-brand flex items-center gap-3 shrink-0">
                    <div className="rmm-module-accent w-0.75 self-stretch bg-accent"></div>
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
                        {activeTab === "outgoing"  && <OutgoingRequestsPage />}
                        {activeTab === "incoming"  && <IncomingRequestsPage />}
                        {activeTab === "shipments" && <ShipmentsPage />}
                    </section>
                </main>

                <CollapsibleSidePanel
                    isOpen={isFormOpen}
                    label="Authorize provision form"
                    collapsedLabel="FORM"
                    widthClassName="lg:w-96"
                    onOpen={() => setIsFormOpen(true)}
                    onClose={() => setIsFormOpen(false)}
                >
                    <CollapsiblePanelHeader
                        title="Authorize Provision"
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
                            <label className="rmm-label mb-1.5">DESTINATION CAMP</label>
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
                            <ResourceSelector resources={resources} onChange={setResources} />
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => { setDestinationCampId(0); setDescription(""); setResources([]); }}
                                disabled={createRequest.isPending}
                                className="rmm-btn border border-border-default bg-bg-tertiary text-txt-secondary hover:text-txt-primary hover:bg-bg-secondary text-[10px] px-3 transition-all disabled:opacity-50"
                            >
                                <RotateCcw size={12} />
                                CLEAR
                            </button>
                            <button
                                type="submit"
                                disabled={createRequest.isPending || destinationCampId === 0 || resources.length === 0}
                                className="rmm-btn rmm-btn-accent flex-1 justify-center text-[10px] py-2.5 transition-all shadow-sm"
                            >
                                {createRequest.isPending ? (
                                    <div className="h-3 w-3 border-2 border-white/30 border-t-white animate-spin" />
                                ) : "AUTHORIZE & SEND"}
                            </button>
                        </div>
                    </form>
                </CollapsibleSidePanel>
            </div>
        </article>
>>>>>>> develop
    );
  }

  return (
    <label htmlFor={htmlFor} className={className}>
      {children}
      {required ? <span className="ml-1 text-status-critical">*</span> : null}
    </label>
  );
}

function TabButton({
  index,
  active,
  icon,
  label,
  description,
  onClick,
}: {
  index: number;
  active: boolean;
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex min-h-[72px] flex-1 items-center gap-3 border-l border-border-default px-5 text-left transition-all",
        active
          ? "border-b-2 border-b-accent bg-bg-secondary text-txt-primary"
          : "bg-bg-primary text-txt-disabled hover:bg-bg-secondary hover:text-txt-primary",
      ].join(" ")}
    >
      <span
        className={[
          "text-[12px] font-bold tracking-[0.12em]",
          active ? "text-accent" : "text-txt-disabled",
        ].join(" ")}
      >
        {String(index).padStart(2, "0")}
      </span>

      <span className={active ? "text-accent" : "text-txt-disabled"}>
        {icon}
      </span>

      <span>
        <span className="block text-[14px] font-bold uppercase tracking-[0.14em]">
          {label}
        </span>

        <span className="mt-1 block text-[11px] uppercase tracking-[0.15em] text-txt-disabled">
          {description}
        </span>
      </span>
    </button>
  );
}

export function InterCampMainPage() {
  const [activeTab, setActiveTab] = useState<InterCampTab>("outgoing");
  const authContext = getAuthContextFromToken();
  const originCampId = authContext.campId ?? 0;

  const [destinationCampId, setDestinationCampId] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [resources, setResources] = useState<ResourceItem[]>([]);

  const { createRequest } = useCampRequestMutation();

  const { data: camps = [], isLoading: isLoadingCamps } = useQuery({
    queryKey: ["camps-list-for-requests"],
    queryFn: async () => {
      const res = await campService.findAllForRequests();
      return res.getResultado<Camp[]>("registros") ?? [];
    },
  });

  const originCampName =
    camps.find((camp) => camp.id === originCampId)?.code ?? "Loading...";

  const availableDestinations = camps.filter(
    (camp) => camp.id !== originCampId,
  );

  const clearForm = () => {
    setDestinationCampId(0);
    setDescription("");
    setResources([]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (destinationCampId === 0) {
      alert("Please select a destination camp.");
      return;
    }

    if (originCampId === destinationCampId) {
      alert("Origin and destination camps must be different.");
      return;
    }

    if (resources.length === 0) {
      alert("Please add at least one resource.");
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
          resources.map((resource) => ({
            resource_id: resource.resource_id,
            amount: resource.amount,
          })),
        );

        alert("Request created successfully.");
        clearForm();
      }
    } catch (error) {
      alert(`Error creating request: ${error}`);
    }
  };

  const tabs: Array<{
    key: InterCampTab;
    label: string;
    icon: React.ReactNode;
    description: string;
  }> = [
    {
      key: "outgoing",
      label: "Sent",
      icon: <Send size={17} />,
      description: "Applications submitted",
    },
    {
      key: "incoming",
      label: "Received",
      icon: <Inbox size={17} />,
      description: "Applications received",
    },
    {
      key: "shipments",
      label: "Shipments",
      icon: <Truck size={17} />,
      description: "Shipments in transit",
    },
  ];

  const isSubmitDisabled =
    createRequest.isPending ||
    destinationCampId === 0 ||
    resources.length === 0 ||
    originCampId === destinationCampId;

  return (
    <article className="flex h-full min-h-0 flex-col overflow-hidden bg-bg-app font-mono text-txt-primary">
      <header className="shrink-0 border-b border-border-default bg-bg-secondary">
        <div className="flex items-end justify-between gap-5 px-5 py-4">
          <div>
            <h2 className="text-[27px] font-bold uppercase tracking-[0.18em] text-txt-primary">
              INTER-CAMP
            </h2>

            <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.16em] text-txt-secondary">
              Logistics transfer / request control
            </p>
          </div>

          <div className="hidden border border-border-default bg-bg-primary px-4 py-2 text-right lg:block">
            <p className="text-[11px] uppercase tracking-[0.16em] text-txt-disabled">
              Source camp
            </p>

            <p className="mt-1 text-[14px] font-bold uppercase tracking-[0.1em] text-accent">
              {originCampName}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 border-t border-border-default lg:grid-cols-3">
          {tabs.map((tab, index) => (
            <TabButton
              key={tab.key}
              index={index + 1}
              active={activeTab === tab.key}
              icon={tab.icon}
              label={tab.label}
              description={tab.description}
              onClick={() => setActiveTab(tab.key)}
            />
          ))}
        </div>
      </header>

      <section className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden xl:grid-cols-[minmax(0,1fr)_430px]">
        <div className="min-h-0 overflow-hidden border-r border-border-default bg-bg-app">
          <div className="h-full min-h-0 overflow-auto p-4">
            {activeTab === "outgoing" ? <OutgoingRequestsPage /> : null}
            {activeTab === "incoming" ? <IncomingRequestsPage /> : null}
            {activeTab === "shipments" ? <ShipmentsPage /> : null}
          </div>
        </div>

        <aside className="min-h-0 overflow-y-auto border-l border-border-default bg-bg-secondary">
          <form onSubmit={handleSubmit} className="flex min-h-full flex-col">
            <div className="border-b border-border-default px-5 py-4">
              <div className="flex items-center gap-3">
                <Send size={18} className="text-accent" />

                <div>
                  <p className="text-[15px] font-bold uppercase tracking-[0.16em] text-accent">
                    Generate Provision
                  </p>

                  <p className="mt-1 text-[12px] uppercase tracking-[0.12em] text-txt-secondary">
                    Source: {originCampName}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-5 px-5 py-5">
              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="destination-camp" required>
                  Target camp
                </FieldLabel>

                {isLoadingCamps ? (
                  <div className={`${inputClass} flex items-center text-txt-disabled`}>
                    Loading camps...
                  </div>
                ) : (
                  <select
                    id="destination-camp"
                    aria-label="Target camp"
                    title="Target camp"
                    value={destinationCampId}
                    onChange={(event) =>
                      setDestinationCampId(Number(event.target.value))
                    }
                    className={inputClass}
                    required
                  >
                    <option value={0}>Select destination...</option>
                    {availableDestinations.map((camp) => (
                      <option key={camp.id ?? 0} value={camp.id ?? 0}>
                        {camp.code}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {originCampId === destinationCampId && destinationCampId !== 0 ? (
                <div className="border border-status-critical bg-status-critical/10 px-4 py-3 text-[13px] font-bold tracking-[0.05em] text-status-critical">
                  Origin and destination camps must be different.
                </div>
              ) : null}

              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="description">
                  Manifest details
                </FieldLabel>

                <textarea
                  id="description"
                  aria-label="Manifest details"
                  title="Manifest details"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className={textAreaClass}
                  placeholder="Mission justification..."
                />
              </div>

              <div className="space-y-3">
                <FieldLabel required>Resources</FieldLabel>

                <ResourceSelector resources={resources} onChange={setResources} />
              </div>
            </div>

            <div className="flex shrink-0 gap-3 border-t border-border-default bg-bg-primary px-5 py-4">
              <button
                type="button"
                onClick={clearForm}
                className="flex h-11 items-center justify-center gap-2 border border-border-default bg-bg-secondary px-5 text-[13px] font-bold uppercase tracking-[0.13em] text-txt-primary transition-colors hover:border-accent hover:text-accent"
              >
                <RotateCcw size={15} />
                Clear
              </button>

              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="flex h-11 flex-1 items-center justify-center gap-2 border border-accent bg-accent px-5 text-[13px] font-bold uppercase tracking-[0.13em] text-accent-fg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:border-border-default disabled:bg-bg-tertiary disabled:text-txt-disabled disabled:opacity-60"
              >
                {createRequest.isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin border-2 border-accent-fg/30 border-t-accent-fg" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Authorize Send
                  </>
                )}
              </button>
            </div>
          </form>
        </aside>
      </section>
    </article>
  );
}