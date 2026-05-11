import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import { PersonService } from "../../services/PersonService";
import { ResourceService } from "../../services/ResourceService";
import { ExplorationService } from "../../services/ExplorationService";
import { TaskService } from "../../services/TaskService";
import { CampService } from "../../services/CampService";

import type { Person } from "../../models/Person";
import type { Resource } from "../../models/Resource";
import type { Exploration } from "../../models/Exploration";
import type { Task } from "../../models/Task";
import type { Camp } from "../../models/Camp";

import DashboardKpiSection from "../components/DashboardComponents/DashboardKpiSection.tsx";
import DashboardLeftPanel from "../components/DashboardComponents/DashboardLeftPanel";
import DashboardMapSection from "../components/DashboardComponents/DashboardMapSection";
import DashboardRightPanel from "../components/DashboardComponents/DashboardRightPanel";

const personSvc = new PersonService();
const resourceSvc = new ResourceService();
const explorationSvc = new ExplorationService();
const taskSvc = new TaskService();
const campSvc = new CampService();

export function DashboardView() {
    const [persons, setPersons] = useState<Person[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [explorations, setExplorations] = useState<Exploration[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [camps, setCamps] = useState<Camp[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    const loadAll = async () => {
        const [pRes, rRes, eRes, tRes, cRes] = await Promise.allSettled([
            personSvc.findAll(),
            resourceSvc.findAll(),
            explorationSvc.findAll(),
            taskSvc.findAll(),
            campSvc.findAll(),
        ]);

        if (pRes.status === "fulfilled" && pRes.value.getEstado()) {
            setPersons(pRes.value.getResultado<Person[]>("registros") ?? []);
        }

        if (rRes.status === "fulfilled" && rRes.value.getEstado()) {
            setResources(rRes.value.getResultado<Resource[]>("registros") ?? []);
        }

        if (eRes.status === "fulfilled" && eRes.value.getEstado()) {
            setExplorations(
                eRes.value.getResultado<Exploration[]>("registros") ?? [],
            );
        }

        if (tRes.status === "fulfilled" && tRes.value.getEstado()) {
            setTasks(tRes.value.getResultado<Task[]>("registros") ?? []);
        }

        if (cRes.status === "fulfilled" && cRes.value.getEstado()) {
            setCamps(cRes.value.getResultado<Camp[]>("registros") ?? []);
        }

        setLoading(false);
        setLastRefresh(new Date());
    };

    const handleRefresh = () => {
        setLoading(true);
        void loadAll();
    };

    useEffect(() => {
        void loadAll();
    }, []);

    const activePersons = persons.filter((person) => person.state === "A").length;
    const inactivePersons = persons.filter((person) => person.state === "I").length;

    const resourcesByStatus = {
        C: resources.filter((resource) => resource.status === "C"),
        M: resources.filter((resource) => resource.status === "M"),
        O: resources.filter((resource) => resource.status === "O"),
        none: resources.filter((resource) => !resource.status),
    };

    const totalResources = resources.length;

    const explorationsByState = {
        P: explorations.filter((exploration) => exploration.state === "P"),
        A: explorations.filter((exploration) => exploration.state === "A"),
        F: explorations.filter((exploration) => exploration.state === "F"),
        C: explorations.filter((exploration) => exploration.state === "C"),
    };

    const tasksByPriority = {
        H: tasks.filter((task) => task.priority === "H"),
        M: tasks.filter((task) => task.priority === "M"),
        L: tasks.filter((task) => task.priority === "L"),
    };

    const consumableResources = resources.filter(
        (resource) => resource.consumable,
    ).length;

    const inactiveResources = resources.filter(
        (resource) => resource.state === "I",
    ).length;

    const formatRefresh = (date: Date) =>
        date.toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });

    return (
        <div className="w-full h-full flex flex-col bg-[#FBFBFB] overflow-hidden">
            <div className="w-full bg-bg-secondary border-b border-border-default px-6 py-3 flex items-center justify-between shrink-0">
                <span className="text-[12px] font-mono font-bold text-txt-secondary uppercase tracking-label">
                    System Overview
                </span>

                <button
                    type="button"
                    onClick={handleRefresh}
                    className="flex items-center gap-2 text-[11px] font-mono text-txt-disabled hover:text-accent uppercase tracking-label transition-colors"
                >
                    <RefreshCw
                        size={11}
                        className={loading ? "animate-spin" : ""}
                    />

                    {loading
                        ? "Loading..."
                        : `Updated ${formatRefresh(lastRefresh)}`}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
                <div className="flex flex-col gap-4 p-4 w-full">
                    <DashboardKpiSection
                        loading={loading}
                        activePersons={activePersons}
                        inactivePersons={inactivePersons}
                        totalResources={totalResources}
                        criticalResources={resourcesByStatus.C.length}
                        activeExplorations={explorationsByState.A.length}
                        pendingExplorations={explorationsByState.P.length}
                        highPriorityTasks={tasksByPriority.H.length}
                        totalTasks={tasks.length}
                    />

                    <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr_280px] gap-4">
                        <DashboardLeftPanel
                            loading={loading}
                            persons={persons}
                            resourcesByStatus={resourcesByStatus}
                            totalResources={totalResources}
                            tasks={tasks}
                            tasksByPriority={tasksByPriority}
                            activePersons={activePersons}
                            inactivePersons={inactivePersons}
                        />

                        <DashboardMapSection
                            loading={loading}
                            camps={camps}
                            explorations={explorations}
                            explorationsByState={explorationsByState}
                        />

                        <DashboardRightPanel
                            loading={loading}
                            cancelledExplorations={explorationsByState.C.length}
                            finishedExplorations={explorationsByState.F.length}
                            consumableResources={consumableResources}
                            inactiveResources={inactiveResources}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}