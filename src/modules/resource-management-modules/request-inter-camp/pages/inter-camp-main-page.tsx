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

const campService = new CampService();

type InterCampTab = "incoming" | "outgoing" | "shipments";

type ResourceItem = {
  resource_id: number;
  amount: number;
  name?: string;
};

const inputClass =
  "h-12 w-full border border-border-default bg-bg-tertiary px-4 text-[15px] font-bold tracking-[0.04em] text-txt-primary outline-none transition-all placeholder:text-txt-disabled focus:border-accent focus:shadow-[0_0_0_2px_rgba(232,93,4,0.22)]";

const textAreaClass =
  "h-[105px] w-full resize-none border border-border-default bg-bg-tertiary px-4 py-3 text-[15px] font-bold leading-relaxed tracking-[0.04em] text-txt-primary outline-none transition-all placeholder:text-txt-disabled focus:border-accent focus:shadow-[0_0_0_2px_rgba(232,93,4,0.22)]";

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

  if (!htmlFor) {
    return (
      <p className={className}>
        {children}
        {required ? <span className="ml-1 text-status-critical">*</span> : null}
      </p>
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