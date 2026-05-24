import { useState } from "react";
import { Inbox, Send, Truck, Plus } from "lucide-react";
//import { getAuthContextFromToken } from "../../../../utils/authAccess";
import { CreateRequestPage } from "./CreateRequestPage";
import { IncomingRequestsPage } from "./IncomingRequestsPage";
import { OutgoingRequestsPage } from "./OutgoingRequestsPage";
import { ShipmentsPage } from "./ShipmentsPage";

type InterCampTab = "create" | "incoming" | "outgoing" | "shipments";

export function InterCampMainPage() {
    const [activeTab, setActiveTab] = useState<InterCampTab>("outgoing");
    //const authContext = getAuthContextFromToken();

    const tabs: Array<{
        key: InterCampTab;
        label: string;
        icon: React.ReactNode;
        description: string;
    }> = [
        {
            key: "create",
            label: "Nueva Solicitud",
            icon: <Plus size={20} />,
            description: "Crear solicitud de recursos a otro campamento",
        },
        {
            key: "outgoing",
            label: "Solicitudes Enviadas (Origen)",
            icon: <Send size={20} />,
            description: "Solicitudes que envió este campamento",
        },
        {
            key: "incoming",
            label: "Solicitudes Recibidas (Destino)",
            icon: <Inbox size={20} />,
            description: "Solicitudes recibidas de otros campamentos",
        },
        {
            key: "shipments",
            label: "Envíos",
            icon: <Truck size={20} />,
            description: "Gestión de envíos en tránsito y completados",
        },
    ];

    return (
        <div className="flex h-full flex-col bg-bg-app overflow-hidden">
            {/* Header with tabs */}
            <div className="shrink-0 border-b border-border-default bg-bg-secondary">
                <div className="px-5 py-3">
                    <div className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-[0.2em] mb-3">
                        Administración de Recursos / Inter-Campamentos
                    </div>

                    {/* Tab Navigation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-start gap-3 p-4 border-2 transition-all text-left ${
                                    activeTab === tab.key
                                        ? "border-accent bg-accent/10"
                                        : "border-border-default bg-bg-primary/20 hover:border-accent/50"
                                }`}
                            >
                                <div
                                    className={`shrink-0 ${
                                        activeTab === tab.key ? "text-accent" : "text-txt-disabled"
                                    }`}
                                >
                                    {tab.icon}
                                </div>
                                <div className="flex-1">
                                    <div
                                        className={`text-[11px] font-mono font-bold uppercase tracking-[0.15em] mb-1 ${
                                            activeTab === tab.key ? "text-accent" : "text-txt-primary"
                                        }`}
                                    >
                                        {tab.label}
                                    </div>
                                    {/* <div className="text-[10px] font-mono text-txt-secondary">
                                        {tab.description}
                                    </div> */}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Flow Info Banner */}
                {/* <div className="px-5 py-3 bg-status-info/5 border-t border-status-info/30">
                    <div className="text-[10px] font-mono font-bold text-status-info uppercase tracking-[0.15em] mb-2">
                        Flujo de Solicitudes
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-mono text-txt-secondary">
                        <span className="px-2 py-1 bg-bg-tertiary border border-border-default">Solicitud</span>
                        <span>→</span>
                        <span className="px-2 py-1 bg-bg-tertiary border border-border-default">Aprobación Origen</span>
                        <span>→</span>
                        <span className="px-2 py-1 bg-bg-tertiary border border-border-default">Aprobación Destino</span>
                        <span>→</span>
                        <span className="px-2 py-1 bg-bg-tertiary border border-border-default">Envío</span>
                        <span>→</span>
                        <span className="px-2 py-1 bg-status-ok/20 border border-status-ok/30 text-status-ok">Recepción</span>
                    </div>
                </div> */}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
                {activeTab === "create" && <CreateRequestPage />}
                {activeTab === "incoming" && <IncomingRequestsPage />}
                {activeTab === "outgoing" && <OutgoingRequestsPage />}
                {activeTab === "shipments" && <ShipmentsPage />}
            </div>
        </div>
    );
}
