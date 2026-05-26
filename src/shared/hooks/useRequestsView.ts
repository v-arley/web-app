import { useMemo, useState, type FormEvent } from "react";

export type RequestStatus = "pending" | "approved" | "rejected";
export type RequestTab = "received" | "sent";

export interface ResourceRequest {
  id: string;
  targetCamp: string;
  resourceType: string;
  amount: number;
  status: RequestStatus;
  date: string;
  requester: string;
}

export const CAMP_OPTIONS = [
  "Camp Alpha - Forward Base",
  "Camp Beta - Logistics Server",
  "Camp Gamma - Research Outpost",
  "Camp Delta - Medical Center",
];

export const RESOURCE_OPTIONS = [
  "Water Rations (L)",
  "Energy Cells (kWh)",
  "Medical Supplies (Kits)",
  "Food Rations (kg)",
  "Construction Material (Tons)",
];

const INITIAL_REQUESTS: ResourceRequest[] = [
  {
    id: "REQ-001",
    targetCamp: "Camp Alpha - Forward Base",
    resourceType: "Water Rations (L)",
    amount: 500,
    status: "pending",
    date: new Date().toISOString().split("T")[0],
    requester: "Cmdr. Shepard",
  },
  {
    id: "REQ-002",
    targetCamp: "Camp Delta - Medical Center",
    resourceType: "Medical Supplies (Kits)",
    amount: 50,
    status: "approved",
    date: "2026-04-11",
    requester: "Dr. Chakwas",
  },
  {
    id: "REQ-003",
    targetCamp: "Camp Beta - Logistics Server",
    resourceType: "Energy Cells (kWh)",
    amount: 1200,
    status: "rejected",
    date: "2026-04-10",
    requester: "Eng. Adams",
  },
  {
    id: "REQ-004",
    targetCamp: "Camp Gamma - Research Outpost",
    resourceType: "Construction Material (Tons)",
    amount: 15,
    status: "pending",
    date: "2026-04-12",
    requester: "Current User",
  },
];

export function useRequestsView() {
  const [requests, setRequests] = useState<ResourceRequest[]>(INITIAL_REQUESTS);
  const [activeTab, setActiveTab] = useState<RequestTab>("received");
  const [searchQuery, setSearchQuery] = useState("");

  const [targetCamp, setTargetCamp] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [amount, setAmount] = useState<number | "">("");

  const receivedCount = useMemo(() => {
    return requests.filter((request) => request.requester !== "Current User")
      .length;
  }, [requests]);

  const sentCount = useMemo(() => {
    return requests.filter((request) => request.requester === "Current User")
      .length;
  }, [requests]);

  const filteredRequests = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return requests.filter((request) => {
      const isSent = request.requester === "Current User";
      const matchesTab = activeTab === "sent" ? isSent : !isSent;

      const matchesSearch =
        query === "" ||
        request.resourceType.toLowerCase().includes(query) ||
        request.targetCamp.toLowerCase().includes(query) ||
        request.id.toLowerCase().includes(query) ||
        request.requester.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [requests, activeTab, searchQuery]);

  const clearForm = () => {
    setTargetCamp("");
    setResourceType("");
    setAmount("");
  };

  const handleNewRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!targetCamp || !resourceType || !amount) return;

    const newRequest: ResourceRequest = {
      id: `REQ-00${requests.length + 1}`,
      targetCamp,
      resourceType,
      amount: Number(amount),
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      requester: "Current User",
    };

    setRequests((prev) => [newRequest, ...prev]);
    clearForm();
    setActiveTab("sent");
  };

  const handleUpdateStatus = (id: string, newStatus: RequestStatus) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status: newStatus } : request,
      ),
    );
  };

  return {
    requests,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,

    targetCamp,
    setTargetCamp,
    resourceType,
    setResourceType,
    amount,
    setAmount,

    receivedCount,
    sentCount,
    filteredRequests,

    clearForm,
    handleNewRequest,
    handleUpdateStatus,
  };
}