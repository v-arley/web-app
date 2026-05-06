import { useState } from "react";
import { Check, X, Clock, Package, MapPin, Search, Inbox, ArrowUpRight } from "lucide-react";

type RequestStatus = 'pending' | 'approved' | 'rejected';

interface ResourceRequest {
    id: string;
    targetCamp: string;
    resourceType: string;
    amount: number;
    status: RequestStatus;
    date: string;
    requester: string;
}

const INITIAL_REQUESTS: ResourceRequest[] = [
    {
        id: "REQ-001",
        targetCamp: "Camp Alpha - Forward Base",
        resourceType: "Water Rations (L)",
        amount: 500,
        status: "pending",
        date: new Date().toISOString().split('T')[0],
        requester: "Cmdr. Shepard"
    },
    {
        id: "REQ-002",
        targetCamp: "Camp Delta - Medical Center",
        resourceType: "Medical Supplies (Kits)",
        amount: 50,
        status: "approved",
        date: "2026-04-11",
        requester: "Dr. Chakwas"
    },
    {
        id: "REQ-003",
        targetCamp: "Camp Beta - Logistics Server",
        resourceType: "Energy Cells (kWh)",
        amount: 1200,
        status: "rejected",
        date: "2026-04-10",
        requester: "Eng. Adams"
    },
    {
        id: "REQ-004",
        targetCamp: "Camp Gamma - Research Outpost",
        resourceType: "Construction Material (Tons)",
        amount: 15,
        status: "pending",
        date: "2026-04-12",
        requester: "Current User"
    }
];

const CAMP_OPTIONS = [
    "Camp Alpha - Forward Base",
    "Camp Beta - Logistics Server",
    "Camp Gamma - Research Outpost",
    "Camp Delta - Medical Center"
];

const RESOURCE_OPTIONS = [
    "Water Rations (L)",
    "Energy Cells (kWh)",
    "Medical Supplies (Kits)",
    "Food Rations (kg)",
    "Construction Material (Tons)"
];

export function RequestsView() {
    const [requests, setRequests] = useState<ResourceRequest[]>(INITIAL_REQUESTS);
    const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
    const [searchQuery, setSearchQuery] = useState('');

    // Form State
    const [targetCamp, setTargetCamp] = useState("");
    const [resourceType, setResourceType] = useState("");
    const [amount, setAmount] = useState<number | "">("");

    const handleNewRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetCamp || !resourceType || !amount) return;

        const newRequest: ResourceRequest = {
            id: `REQ-00${requests.length + 1}`,
            targetCamp,
            resourceType,
            amount: Number(amount),
            status: "pending",
            date: new Date().toISOString().split('T')[0],
            requester: "Current User"
        };

        setRequests([newRequest, ...requests]);

        // Reset form
        setTargetCamp("");
        setResourceType("");
        setAmount("");

        // Switch to 'sent' tab to see the new request
        setActiveTab('sent');
    };

    const handleUpdateStatus = (id: string, newStatus: RequestStatus) => {
        setRequests(requests.map(req =>
            req.id === id ? { ...req, status: newStatus } : req
        ));
    };

    // Filter requests
    const filteredRequests = requests.filter(req => {
        const isSent = req.requester === "Current User";
        const matchesTab = activeTab === 'sent' ? isSent : !isSent;
        const matchesSearch =
            req.resourceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.targetCamp.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.requester.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesTab && matchesSearch;
    });

    return (
        <div className="w-full h-full flex flex-col overflow-hidden bg-bg-app">

            {/* Top Bar Navigation */}
            <div className="w-full bg-bg-secondary border-b border-border-default px-8 py-3 flex items-center justify-between">
                <div className="text-[12px] font-mono tracking-[0.2em] text-txt-secondary uppercase font-bold">
                    Requests
                </div>
            </div>

            <div className="w-full h-full flex overflow-hidden ">
                {/* Main List Section (Left) */}
                <div className="flex-1 flex flex-col bg-[#FBFBFB] overflow-y-auto h-full">

                    {/* Top Bar Navigation */}
                    <div className="w-full px-8 py-5 flex justify-between gap-5 z-10 sticky top-0">
                        
                        {/* Tabs */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setActiveTab('received')}
                                className={`flex items-center gap-2 px-5 py-2 text-[11px] font-bold uppercase font-mono tracking-widest transition-all ${activeTab === 'received'
                                    ? 'bg-bg-selected text-txt-primary border border-border-accent'
                                    : 'bg-bg-tertiary text-txt-secondary hover:bg-bg-selected border border-border-default hover:text-txt-primary'
                                    }`}
                            >
                                <Inbox size={16} />
                                Received
                                <span className={`ml-1 px-1.5 py-0.5 rounded text-[9px] leading-none ${activeTab === 'received' ? 'bg-accent text-accent-fg' : 'bg-bg-tertiary text-txt-secondary'}`}>
                                    {requests.filter(r => r.requester !== "Current User").length}
                                </span>
                            </button>
                            <button
                                onClick={() => setActiveTab('sent')}
                                className={`flex items-center gap-2 px-5 py-2 text-[11px] font-bold uppercase font-mono tracking-widest transition-all ${activeTab === 'sent'
                                    ? 'bg-bg-selected text-txt-primary border border-border-accent'
                                    : 'bg-bg-tertiary text-txt-secondary hover:bg-bg-selected border border-border-default hover:text-txt-primary'
                                    }`}
                            >
                                <ArrowUpRight size={16} />
                                Sent
                                <span className={`ml-1 px-1.5 py-0.5 rounded text-[9px] leading-none ${activeTab === 'sent' ? 'bg-accent text-accent-fg' : 'bg-bg-tertiary text-txt-secondary'}`}>
                                    {requests.filter(r => r.requester === "Current User").length}
                                </span>
                            </button>
                        </div>

                        {/* Search Bar */}
                            <div className="relative w-80">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-txt-disabled" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search requests..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-bg-tertiary text-sm text-txt-primary font-mono border border-border-default focus:outline-none focus:border-border-accent transition-all font-medium placeholder:text-txt-disabled"
                                />
                            </div>
                    </div>

                    {/* Main Content Areas */}
                    <div className="px-1 py-5 w-full max-w-5xl mx-auto flex-1 h-full">
                        {filteredRequests.length === 0 ? (
                            <div className="w-full h-48 flex flex-col items-center justify-center text-txt-disabled gap-4 bg-bg-primary mt-4 border border-border-default">
                                <div className="w-16 h-16 bg-bg-tertiary flex items-center justify-center text-txt-disabled">
                                    <Search size={28} />
                                </div>
                                <span className="font-mono text-xs uppercase tracking-widest">No requests found</span>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1">
                                {filteredRequests.map((req) => (
                            <div key={req.id} className="w-full bg-bg-primary border border-border-default px-4 py-2 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer transition-all group hover:translate-x-2">
                                        {/* Left side: Information */}
                                        <div className="flex flex-col">
                                            {/* Route Header */}
                                            <div className="flex items-center gap-3 text-[10px] font-mono text-txt-disabled tracking-widest uppercase">
                                                <MapPin size={12} className="group-hover:text-accent transition-colors" />
                                                <span>{req.requester === "Current User" ? "CURRENT BASE" : "BASE-CENTRAL"}</span>
                                                <span className="text-accent font-bold text-xs">&gt;&gt;</span>
                                                <MapPin size={12} className="group-hover:text-accent transition-colors" />
                                                <span>{req.targetCamp.split(' - ')[0]}</span>
                                            </div>

                                            {/* Resource Info */}
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-bg-tertiary flex items-center justify-center text-accent flex-shrink-0 group-hover:bg-bg-selected transition-colors">
                                                    <Package size={24} />
                                                </div>
                                                <div className="flex flex-col items-start justify-center mt-1">
                                                    <h3 className="font-mono text-xl font-bold text-txt-primary uppercase tracking-wide leading-none">
                                                        {req.amount} UNITS {req.resourceType.split(' ')[0]}
                                                    </h3>
                                                    <p className="font-mono text-[10px] text-txt-disabled uppercase mt-2.5 tracking-[0.15em] leading-none">
                                                        ID: {req.id} • BY: {req.requester} • ON: {req.date}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right side: Actions & Status */}
                                        <div className="flex items-center gap-3">
                                            {req.status === 'pending' && activeTab === 'received' && (
                                                <>
                                                    <div className="px-4 py-1 bg-accent/10 flex items-center justify-center mr-2">
                                                        <span className="font-mono text-[11px] font-bold text-accent tracking-widest uppercase">
                                                            ACTION REQ
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleUpdateStatus(req.id, 'approved'); }}
                                                        className="w-8 h-8 bg-status-ok/5 flex items-center justify-center text-status-ok hover:bg-status-ok/20 transition-all shadow-sm transform hover:scale-105"
                                                        title="Approve Request"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleUpdateStatus(req.id, 'rejected'); }}
                                                        className="w-8 h-8 bg-red-500/5 flex items-center justify-center text-red-500 hover:bg-red-500/20 transition-all shadow-sm transform hover:scale-105"
                                                        title="Reject Request"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </>
                                            )}

                                            {req.status === 'pending' && activeTab === 'sent' && (
                                                <div className="px-4 py-1 bg-accent/10 flex items-center justify-center">
                                                    <Clock size={14} className="text-accent mr-2" />
                                                    <span className="font-mono text-[11px] font-bold text-accent tracking-widest uppercase">
                                                        PENDING
                                                    </span>
                                                </div>
                                            )}

                                            {req.status === 'approved' && (
                                                <div className="px-4 py-1 flex items-center gap-2 bg-status-ok/5">
                                                    <Check size={14} className="text-status-ok" />
                                                    <span className="font-mono text-[11px] font-bold text-status-ok uppercase tracking-widest">
                                                        APPROVED
                                                    </span>
                                                </div>
                                            )}

                                            {req.status === 'rejected' && (
                                                <div className="px-4 py-1 flex items-center gap-2 bg-red-500/5">
                                                    <X size={14} className="text-red-500/70" />
                                                    <span className="font-mono text-[11px] font-bold text-red-500/70 uppercase tracking-widest">
                                                        REJECTED
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Section (Right) */}
                <div className="w-[420px] h-full flex flex-col z-20 flex-shrink-0 relativw bg-bg-primary border-l border-border-default">
                    <div className="flex items-center justify-end px-4 py-2 z-10 sticky top-0">
                        <h3 className="text-[14px] font-bold text-txt-primary font-mono uppercase tracking-[0.1em] flex items-center ">
                            New Request
                        </h3>
                    </div>

                    <div className="px-4 flex-1 overflow-y-auto">
                        <form onSubmit={handleNewRequest} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-txt-secondary uppercase tracking-[0.15em] flex items-center gap-2">
                                    <MapPin size={13} className="text-accent" />
                                    Target Camp
                                </label>
                                <div className="relative">
                                    <select
                                        value={targetCamp}
                                        onChange={(e) => setTargetCamp(e.target.value)}
                                        className="w-full pl-4 pr-10 py-3.5 bg-bg-tertiary border border-border-default focus:border-border-accent outline-none transition-all text-sm font-semibold text-txt-primary font-mono cursor-pointer appearance-none"
                                        required
                                    >
                                        <option value="" disabled>Select destination...</option>
                                        {CAMP_OPTIONS.map((camp) => (
                                            <option key={camp} value={camp}>{camp}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none p-1 bg-bg-selected">
                                        <svg className="w-3 h-3 text-txt-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2.5">
                                <label className="text-[10px] font-bold text-txt-secondary uppercase tracking-[0.15em] flex items-center gap-2">
                                    <Package size={13} className="text-accent" />
                                    Resource Type
                                </label>
                                <div className="relative">
                                    <select
                                        value={resourceType}
                                        onChange={(e) => setResourceType(e.target.value)}
                                        className="w-full pl-4 pr-10 py-3.5 bg-bg-tertiary border border-border-default focus:border-border-accent outline-none transition-all text-sm font-semibold text-txt-primary font-mono cursor-pointer appearance-none"
                                        required
                                    >
                                        <option value="" disabled>Select required payload...</option>
                                        {RESOURCE_OPTIONS.map((res) => (
                                            <option key={res} value={res}>{res}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none p-1 bg-bg-selected">
                                        <svg className="w-3 h-3 text-txt-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2.5">
                                <label className="text-[10px] font-bold text-txt-secondary uppercase tracking-[0.15em] flex items-center gap-2">
                                    <span className="font-mono text-accent">#</span>
                                    Quantity Amount
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                                    placeholder="Enter unit amount..."
                                    className="w-full px-4 py-3.5 bg-bg-tertiary border border-border-default focus:border-border-accent outline-none transition-all text-sm font-semibold text-txt-primary font-mono placeholder:text-txt-disabled"
                                    required
                                />
                            </div>

                            <div className="pt-2 flex flex-col gap-2"> 
                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-3 px-6 py-2 font-bold text-accent-fg bg-bg-tertiary border border-border-default hover:bg-accent hover:text-accent-fg transition-all uppercase text-[11px] tracking-widest font-mono group"
                                >
                                    
                                    Clear Form
                                </button>         
                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-3 px-4 py-2 font-bold text-accent-fg bg-accent hover:bg-accent-hover transition-all uppercase text-[11px] tracking-widest font-mono group"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
