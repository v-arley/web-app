import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import { PersonService } from "../../services/PersonService";
import { ResourceService } from "../../services/ResourceService";
import { ExplorationService } from "../../services/ExplorationService";
import { TaskService } from "../../services/TaskService";
import { CampService } from "../../services/CampService";
import { AdmissionRequestService } from "../../services/AdmissionRequestService";
import { PersonProfessionService } from "../../services/PersonProfessionService";
import { UserService } from "../../services/UserService";
import { ProfessionService } from "../../services/ProfessionService";
import { AuditLogService } from "../../services/AuditLogService";

import type { Person } from "../../models/Person";
import type { Resource } from "../../models/Resource";
import type { Exploration } from "../../models/Exploration";
import type { Task } from "../../models/Task";
import type { Camp } from "../../models/Camp";
import type { AdmissionRequest } from "../../models/AdmissionRequest";
import type { PersonProfession } from "../../models/PersonProfession";
import type { User } from "../../models/User";
import type { Profession } from "../../models/Profession";
import type { AuditLog } from "../../models/AuditLog";

import DashboardKpiSection from "../components/DashboardComponents/DashboardKpiSection";
import DashboardLeftPanel from "../components/DashboardComponents/DashboardLeftPanel";
import DashboardMapSection from "../components/DashboardComponents/DashboardMapSection";
import DashboardRightPanel from "../components/DashboardComponents/DashboardRightPanel";
import DashboardAnalyticsSection, {
    type AnalyticsTab,
    type CountItem,
    type StaffDeficitItem,
} from "../components/DashboardComponents/DashboardAnalyticsSection";

const personSvc = new PersonService();
const resourceSvc = new ResourceService();
const explorationSvc = new ExplorationService();
const taskSvc = new TaskService();
const campSvc = new CampService();
const admissionRequestSvc = new AdmissionRequestService();
const personProfessionSvc = new PersonProfessionService();
const userSvc = new UserService();
const professionSvc = new ProfessionService();
const auditLogSvc = new AuditLogService();

function isDateInCurrentWeek(value?: string | Date | null) {
    if (!value) return false;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return false;

    const today = new Date();
    const firstDay = new Date(today);
    const day = today.getDay();

    const diffToMonday = day === 0 ? -6 : 1 - day;
    firstDay.setDate(today.getDate() + diffToMonday);
    firstDay.setHours(0, 0, 0, 0);

    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 7);

    return date >= firstDay && date < lastDay;
}

function isTemporaryActive(item: PersonProfession) {
    if (item.is_temporary !== "Y") return false;

    if (!item.temporary_until) return true;

    const limitDate = new Date(item.temporary_until);
    if (Number.isNaN(limitDate.getTime())) return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return limitDate >= today;
}

function calculateAge(value?: string | Date | null) {
    if (!value) return null;

    const birthDate = new Date(value);
    if (Number.isNaN(birthDate.getTime())) return null;

    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age -= 1;
    }

    return age >= 0 ? age : null;
}

function getAverageAge(persons: Person[]) {
    const ages = persons
        .map((person) => calculateAge(person.date_of_birth ?? person.date_birth))
        .filter((age): age is number => typeof age === "number");

    if (!ages.length) return 0;

    return Math.round(ages.reduce((sum, age) => sum + age, 0) / ages.length);
}

function normalizeHealthCondition(value?: string | null) {
    const condition = value?.trim().toUpperCase();

    if (!condition) return "HEALTHY";

    if (
        condition.includes("SANO") ||
        condition.includes("SANA") ||
        condition.includes("APTO") ||
        condition.includes("APTA") ||
        condition.includes("SALUDABLE") ||
        condition.includes("BIEN") ||
        condition.includes("NONE") ||
        condition.includes("NO CONDITION") ||
        condition.includes("SIN CONDICION") ||
        condition.includes("SIN CONDICIÓN")
    ) {
        return "HEALTHY";
    }

    return "HAS CONDITION";
}

function getProfessionLabel(profession?: string | null) {
    const value = profession?.trim();

    if (!value) return "No profession";

    const normalized = value.toUpperCase();

    const labels: Record<string, string> = {
        "PROF-MED": "Medicina",
        "PROF-LOG": "Logística",
        "PROF-AGR": "Agricultura",
        "PROF-EXP": "Exploración",
        MEDICINA: "Medicina",
        LOGISTICA: "Logística",
        LOGÍSTICA: "Logística",
        AGRICULTURA: "Agricultura",
        EXPLORACION: "Exploración",
        EXPLORACIÓN: "Exploración",
    };

    return labels[normalized] ?? value;
}

function normalizeProfessionKey(profession?: string | null) {
    return profession?.trim().toUpperCase() ?? "";
}

function countBy(values: string[]) {
    return values.reduce<Record<string, number>>((acc, value) => {
        const key = value.trim() || "No data";
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
    }, {});
}

function toCountItems(record: Record<string, number>): CountItem[] {
    return Object.entries(record)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value);
}

function formatRefresh(date: Date) {
    return date.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

function sortRecentActivity(items: AuditLog[]) {
    return [...items].sort((a, b) => {
        const dateA = new Date(a.created_at ?? 0).getTime();
        const dateB = new Date(b.created_at ?? 0).getTime();

        return dateB - dateA;
    });
}

export function DashboardView() {
    const [persons, setPersons] = useState<Person[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [explorations, setExplorations] = useState<Exploration[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [camps, setCamps] = useState<Camp[]>([]);
    const [admissionRequests, setAdmissionRequests] = useState<AdmissionRequest[]>([]);
    const [personProfessions, setPersonProfessions] = useState<PersonProfession[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [professions, setProfessions] = useState<Profession[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const [activeTab, setActiveTab] = useState<AnalyticsTab>("professions");

    const loadAll = async () => {
        const [
            pRes,
            rRes,
            eRes,
            tRes,
            cRes,
            aRes,
            ppRes,
            uRes,
            profRes,
            auditRes,
        ] = await Promise.allSettled([
            personSvc.findAll(),
            resourceSvc.findAll(),
            explorationSvc.findAll(),
            taskSvc.findAll(),
            campSvc.findAll(),
            admissionRequestSvc.findAll(),
            personProfessionSvc.findAll(),
            userSvc.findAll(),
            professionSvc.findAll(),
            auditLogSvc.findAll(),
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

        if (aRes.status === "fulfilled" && aRes.value.getEstado()) {
            setAdmissionRequests(
                aRes.value.getResultado<AdmissionRequest[]>("registros") ?? [],
            );
        }

        if (ppRes.status === "fulfilled" && ppRes.value.getEstado()) {
            setPersonProfessions(
                ppRes.value.getResultado<PersonProfession[]>("registros") ?? [],
            );
        }

        if (uRes.status === "fulfilled" && uRes.value.getEstado()) {
            setUsers(uRes.value.getResultado<User[]>("registros") ?? []);
        }

        if (profRes.status === "fulfilled" && profRes.value.getEstado()) {
            setProfessions(
                profRes.value.getResultado<Profession[]>("registros") ?? [],
            );
        }

        if (auditRes.status === "fulfilled" && auditRes.value.getEstado()) {
            setAuditLogs(
                auditRes.value.getResultado<AuditLog[]>("registros") ?? [],
            );
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

    const activeUsers = users.filter((user) => user.state === "A").length;
    const inactiveUsers = users.filter((user) => user.state === "I").length;

    const activePersons =
        persons.length > 0
            ? persons.filter((person) => person.state === "A").length
            : activeUsers;

    const inactivePersons =
        persons.length > 0
            ? persons.filter((person) => person.state === "I").length
            : inactiveUsers;

    const totalPopulation =
        persons.length > 0 ? persons.length : activeUsers + inactiveUsers;

    const totalCampCapacity = camps.reduce(
        (total, camp) => total + (Number(camp.capacity) || 0),
        0,
    );

    const populationCapacityText =
        totalCampCapacity > 0
            ? `${totalPopulation} / ${totalCampCapacity}`
            : `${totalPopulation}`;

    const capacityPercent =
        totalCampCapacity > 0
            ? Math.round((totalPopulation / totalCampCapacity) * 100)
            : 0;

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

    const pendingAdmissions = admissionRequests.filter(
        (admission) => admission.request_status === "P",
    ).length;

    const acceptedAdmissionsThisWeek = admissionRequests.filter(
        (admission) =>
            admission.request_status === "A" &&
            isDateInCurrentWeek(admission.requested_at),
    ).length;

    const rejectedAdmissionsThisWeek = admissionRequests.filter(
        (admission) =>
            admission.request_status === "R" &&
            isDateInCurrentWeek(admission.requested_at),
    ).length;

    const activeTemporaryAssignments = personProfessions.filter(
        isTemporaryActive,
    ).length;

    const consumableResources = resources.filter(
        (resource) => resource.consumable,
    ).length;

    const inactiveResources = resources.filter(
        (resource) => resource.state === "I",
    ).length;

    const professionDistribution = toCountItems(
        countBy(
            users
                .filter((user) => user.state === "A")
                .map((user) => getProfessionLabel(user.profession)),
        ),
    );

    const activeProfessionCodes = new Set(
        users
            .filter((user) => user.state === "A")
            .map((user) => normalizeProfessionKey(user.profession))
            .filter(Boolean),
    );

    const staffDeficits: StaffDeficitItem[] = professions
        .filter((profession) => profession.state === "A")
        .filter(
            (profession) =>
                !activeProfessionCodes.has(profession.code.toUpperCase()),
        )
        .map((profession) => ({
            code: profession.code,
            name: profession.name,
        }));

    const healthDistribution = toCountItems(
        countBy(
            persons.map((person) =>
                normalizeHealthCondition(person.conditions),
            ),
        ),
    );

    const averageAge = getAverageAge(persons);
    const totalPersons = persons.length;

    const maleCount = persons.filter(
        (person) => person.sex?.toUpperCase() === "M",
    ).length;

    const femaleCount = persons.filter(
        (person) => person.sex?.toUpperCase() === "F",
    ).length;

    const otherSexCount = Math.max(totalPersons - maleCount - femaleCount, 0);

    const recentActivity = sortRecentActivity(auditLogs).slice(0, 5);

    return (
        <div className="w-full h-full flex flex-col bg-[#FBFBFB] overflow-hidden">
            <div className="w-full bg-bg-secondary border-b border-border-default px-6 py-3 flex items-center justify-between shrink-0">
                <div>
                    <span className="text-[12px] font-mono font-bold text-txt-secondary uppercase tracking-label">
                        System Overview
                    </span>

                    <p className="mt-1 text-[10px] font-mono uppercase tracking-label text-txt-disabled">
                        Administrative dashboard and camp indicators
                    </p>
                </div>

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

                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                        <div className="rounded-xl border border-border-default bg-bg-secondary p-4">
                            <p className="text-[10px] font-mono uppercase tracking-label text-txt-disabled">
                                Population / capacity
                            </p>
                            <p className="mt-2 text-2xl font-bold text-txt-primary">
                                {loading ? "..." : populationCapacityText}
                            </p>
                            <p className="mt-2 text-[10px] font-mono uppercase tracking-label text-txt-disabled">
                                {totalCampCapacity > 0
                                    ? `${capacityPercent}% occupied`
                                    : "capacity not set"}
                            </p>
                        </div>

                        <div className="rounded-xl border border-border-default bg-bg-secondary p-4">
                            <p className="text-[10px] font-mono uppercase tracking-label text-txt-disabled">
                                Pending admissions
                            </p>
                            <p className="mt-2 text-2xl font-bold text-txt-primary">
                                {loading ? "..." : pendingAdmissions}
                            </p>
                            <p className="mt-2 text-[10px] font-mono uppercase tracking-label text-txt-disabled">
                                waiting review
                            </p>
                        </div>

                        <div className="rounded-xl border border-border-default bg-bg-secondary p-4">
                            <p className="text-[10px] font-mono uppercase tracking-label text-txt-disabled">
                                Accepted this week
                            </p>
                            <p className="mt-2 text-2xl font-bold text-txt-primary">
                                {loading ? "..." : acceptedAdmissionsThisWeek}
                            </p>
                            <p className="mt-2 text-[10px] font-mono uppercase tracking-label text-txt-disabled">
                                approved admissions
                            </p>
                        </div>

                        <div className="rounded-xl border border-border-default bg-bg-secondary p-4">
                            <p className="text-[10px] font-mono uppercase tracking-label text-txt-disabled">
                                Rejected this week
                            </p>
                            <p className="mt-2 text-2xl font-bold text-txt-primary">
                                {loading ? "..." : rejectedAdmissionsThisWeek}
                            </p>
                            <p className="mt-2 text-[10px] font-mono uppercase tracking-label text-txt-disabled">
                                denied admissions
                            </p>
                        </div>

                        <div className="rounded-xl border border-border-default bg-bg-secondary p-4">
                            <p className="text-[10px] font-mono uppercase tracking-label text-txt-disabled">
                                Temporary assignments
                            </p>
                            <p className="mt-2 text-2xl font-bold text-txt-primary">
                                {loading ? "..." : activeTemporaryAssignments}
                            </p>
                            <p className="mt-2 text-[10px] font-mono uppercase tracking-label text-txt-disabled">
                                active reassignments
                            </p>
                        </div>

                        <div className="rounded-xl border border-border-default bg-bg-secondary p-4">
                            <p className="text-[10px] font-mono uppercase tracking-label text-txt-disabled">
                                Active users
                            </p>
                            <p className="mt-2 text-2xl font-bold text-txt-primary">
                                {loading ? "..." : activeUsers}
                            </p>
                            <p className="mt-2 text-[10px] font-mono uppercase tracking-label text-txt-disabled">
                                {inactiveUsers} inactive
                            </p>
                        </div>
                    </div>

                    <DashboardAnalyticsSection
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        professionDistribution={professionDistribution}
                        healthDistribution={healthDistribution}
                        staffDeficits={staffDeficits}
                        averageAge={averageAge}
                        maleCount={maleCount}
                        femaleCount={femaleCount}
                        otherSexCount={otherSexCount}
                        totalPersons={totalPersons}
                        activeTemporaryAssignments={activeTemporaryAssignments}
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
                            recentActivity={recentActivity}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}