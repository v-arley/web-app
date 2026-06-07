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

function getDateValue(item: Record<string, unknown>) {
    return (
        item.created_at ??
        item.createdAt ??
        item.requested_at ??
        item.requestedAt ??
        item.resolved_at ??
        item.resolvedAt ??
        null
    );
}

function normalizeState(value?: string | boolean | null) {
    if (typeof value === "boolean") return value ? "A" : "I";

    const normalized = String(value ?? "").toUpperCase();

    if (normalized === "ACTIVE" || normalized === "ACTIVO") return "A";
    if (normalized === "INACTIVE" || normalized === "INACTIVO") return "I";

    return normalized;
}

function normalizeExplorationState(value?: string | null) {
    const normalized = String(value ?? "").toUpperCase();

    if (normalized === "PENDING" || normalized === "PENDIENTE") return "P";
    if (normalized === "ACTIVE" || normalized === "ACTIVA") return "A";
    if (normalized === "FINISHED" || normalized === "FINALIZADA") return "F";
    if (normalized === "CANCELLED" || normalized === "CANCELADA") return "C";

    return normalized;
}

function normalizePriority(value?: string | null) {
    const normalized = String(value ?? "").toUpperCase();

    if (normalized === "HIGH" || normalized === "ALTA") return "H";
    if (normalized === "MEDIUM" || normalized === "MEDIA") return "M";
    if (normalized === "LOW" || normalized === "BAJA") return "L";

    return normalized;
}

function normalizeResourceStatus(value?: string | null) {
    const normalized = String(value ?? "").toUpperCase();

    if (normalized === "CRITICAL" || normalized === "CRITICO") return "C";
    if (normalized === "MODERATE" || normalized === "MODERADO") return "M";
    if (normalized === "OK" || normalized === "NORMAL") return "O";

    return normalized;
}

function normalizeAdmissionStatus(value?: string | null) {
    const normalized = String(value ?? "").toUpperCase();

    if (normalized === "PENDING" || normalized === "PENDIENTE") return "P";
    if (normalized === "APPROVED" || normalized === "ACCEPTED") return "A";
    if (normalized === "REJECTED" || normalized === "DENIED") return "R";

    return normalized;
}

function normalizeHealthCondition(value?: string | null) {
    const normalized = String(value ?? "").trim();

    if (!normalized) return "No condition";

    return (
        normalized
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)[0] ?? "No condition"
    );
}

function getAge(value?: string | Date | null) {
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
        .map((person) =>
            getAge(person.date_birth ?? person.date_of_birth ?? null),
        )
        .filter((age): age is number => age != null);

    if (!ages.length) return 0;

    return Math.round(ages.reduce((sum, age) => sum + age, 0) / ages.length);
}

function countBy<T extends string>(items: T[]) {
    return items.reduce<Record<string, number>>((acc, item) => {
        acc[item] = (acc[item] ?? 0) + 1;
        return acc;
    }, {});
}

function toCountItems(record: Record<string, number>): CountItem[] {
    return Object.entries(record)
        .map(([label, value]) => ({
            label,
            value,
        }))
        .sort((a, b) => b.value - a.value);
}

function getProfessionLabel(profession?: Profession | null) {
    if (!profession) return "No profession";

    return profession.name || profession.code || `PROF-${profession.id ?? "N/A"}`;
}

function getPersonProfessionId(item: PersonProfession) {
    return Number(item.profession_id ?? item.profession?.id ?? 0);
}

function getPersonIdFromProfession(item: PersonProfession) {
    return Number(item.person_id ?? item.person?.id ?? 0);
}

function formatRefresh(value: Date) {
    return value.toLocaleTimeString("es-CR", {
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

        setLastRefresh(new Date());
    };

    useEffect(() => {
        void (async () => {
            setLoading(true);

            try {
                await loadAll();
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleRefresh = async () => {
        setLoading(true);

        try {
            await loadAll();
        } finally {
            setLoading(false);
        }
    };

    const activePersons = persons.filter(
        (person) => normalizeState(person.state) === "A",
    ).length;

    const inactivePersons = Math.max(persons.length - activePersons, 0);

    const totalCampCapacity = camps.reduce(
        (sum, camp) => sum + Number(camp.capacity ?? 0),
        0,
    );

    const capacityPercent =
        totalCampCapacity > 0
            ? Math.min(Math.round((activePersons / totalCampCapacity) * 100), 100)
            : 0;

    const populationCapacityText =
        totalCampCapacity > 0
            ? `${activePersons} / ${totalCampCapacity}`
            : `${activePersons} / N/A`;

    const totalResources = resources.length;

    const resourcesByStatus = {
        C: resources.filter(
            (resource) => normalizeResourceStatus(resource.status) === "C",
        ),
        M: resources.filter(
            (resource) => normalizeResourceStatus(resource.status) === "M",
        ),
        O: resources.filter(
            (resource) => normalizeResourceStatus(resource.status) === "O",
        ),
        none: resources.filter((resource) => {
            const status = normalizeResourceStatus(resource.status);
            return status !== "C" && status !== "M" && status !== "O";
        }),
    };

    const consumableResources = resources.filter(
        (resource) => resource.consumable,
    ).length;

    const inactiveResources = resources.filter(
        (resource) => normalizeState(resource.state) !== "A",
    ).length;

    const explorationsByState = {
        P: explorations.filter(
            (exploration) => normalizeExplorationState(exploration.state) === "P",
        ),
        A: explorations.filter(
            (exploration) => normalizeExplorationState(exploration.state) === "A",
        ),
        F: explorations.filter(
            (exploration) => normalizeExplorationState(exploration.state) === "F",
        ),
        C: explorations.filter(
            (exploration) => normalizeExplorationState(exploration.state) === "C",
        ),
    };

    const tasksByPriority = {
        H: tasks.filter((task) => normalizePriority(task.priority) === "H"),
        M: tasks.filter((task) => normalizePriority(task.priority) === "M"),
        L: tasks.filter((task) => normalizePriority(task.priority) === "L"),
    };

    const pendingAdmissions = admissionRequests.filter(
        (request) => normalizeAdmissionStatus(request.request_status) === "P",
    ).length;

    const acceptedAdmissionsThisWeek = admissionRequests.filter(
        (request) =>
            normalizeAdmissionStatus(request.request_status) === "A" &&
            isDateInCurrentWeek(
                getDateValue(request as unknown as Record<string, unknown>) as
                    | string
                    | Date
                    | null,
            ),
    ).length;

    const rejectedAdmissionsThisWeek = admissionRequests.filter(
        (request) =>
            normalizeAdmissionStatus(request.request_status) === "R" &&
            isDateInCurrentWeek(
                getDateValue(request as unknown as Record<string, unknown>) as
                    | string
                    | Date
                    | null,
            ),
    ).length;

    const activeTemporaryAssignments = personProfessions.filter((item) => {
        const temporary =
            item.is_temporary === "Y" ||
            String(item.is_temporary ?? "").toUpperCase() === "TRUE";

        if (!temporary) return false;

        if (!item.temporary_until) return true;

        const until = new Date(item.temporary_until);

        if (Number.isNaN(until.getTime())) return true;

        return until >= new Date();
    }).length;

    const activeUsers = users.filter(
        (user) =>
            user.active === true ||
            normalizeState(user.state ?? (user.active ? "A" : "I")) === "A",
    ).length;

    const inactiveUsers = Math.max(users.length - activeUsers, 0);

    const professionById = new Map(
        professions
            .filter((profession) => profession.id != null)
            .map((profession) => [Number(profession.id), profession]),
    );

    const activePersonIds = new Set(
        persons
            .filter((person) => normalizeState(person.state) === "A")
            .map((person) => Number(person.id ?? 0))
            .filter(Boolean),
    );

    const professionCounts = personProfessions.reduce<Record<string, number>>(
        (acc, item) => {
            const personId = getPersonIdFromProfession(item);

            if (!activePersonIds.has(personId)) return acc;

            const profession = professionById.get(getPersonProfessionId(item));
            const label = getProfessionLabel(profession);

            acc[label] = (acc[label] ?? 0) + 1;

            return acc;
        },
        {},
    );

    const professionDistribution = toCountItems(professionCounts);

    const coveredProfessionIds = new Set(
        personProfessions
            .filter((item) => activePersonIds.has(getPersonIdFromProfession(item)))
            .map((item) => getPersonProfessionId(item))
            .filter(Boolean),
    );

    const staffDeficits: StaffDeficitItem[] = professions
        .filter((profession) => normalizeState(profession.state) === "A")
        .filter((profession) => {
            const id = Number(profession.id ?? 0);
            return id > 0 && !coveredProfessionIds.has(id);
        })
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
        <div className="camp-admin-dashboard flex h-full min-h-0 w-full flex-col overflow-hidden bg-bg-app font-mono text-txt-primary">
            <div className="flex w-full shrink-0 items-center justify-between border-b border-border-default bg-bg-secondary px-5 py-3">
                <div className="flex min-w-0 items-center gap-3">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_10px_rgba(232,93,4,0.7)]" />

                    <div className="min-w-0">
                        <p className="text-[13px] font-bold uppercase tracking-[0.22em] text-txt-primary">
                            SYSTEM OVERVIEW
                        </p>

                        <p className="mt-0.5 hidden text-[11px] uppercase tracking-[0.18em] text-txt-disabled sm:block">
                            DASHBOARD AND CAMP INDICATORS
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleRefresh}
                    className="flex shrink-0 items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-txt-disabled transition-colors hover:text-accent"
                >
                    <RefreshCw
                        size={12}
                        className={loading ? "animate-spin" : ""}
                    />

                    {loading
                        ? "LOADING..."
                        : `UPDATED ${formatRefresh(lastRefresh)}`}
                </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto bg-bg-app">
                <div className="grid w-full grid-cols-12 gap-4 p-4">
                    <div className="col-span-12">
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
                    </div>

                    <div className="col-span-12 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
                        <div className="border border-border-default bg-bg-secondary px-5 py-4">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-txt-secondary">
                                POPULATION / CAPACITY
                            </p>

                            <p className="mt-3 text-3xl font-bold leading-none text-txt-primary">
                                {loading ? "..." : populationCapacityText}
                            </p>

                            <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-txt-disabled">
                                {totalCampCapacity > 0
                                    ? `${capacityPercent}% OCCUPIED`
                                    : "CAPACITY NOT SET"}
                            </p>
                        </div>

                        <div className="border border-border-default bg-bg-secondary px-5 py-4">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-txt-secondary">
                                PENDING ADMISSIONS
                            </p>

                            <p className="mt-3 text-3xl font-bold leading-none text-txt-primary">
                                {loading ? "..." : pendingAdmissions}
                            </p>

                            <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-txt-disabled">
                                WAITING REVIEW
                            </p>
                        </div>

                        <div className="border border-border-default bg-bg-secondary px-5 py-4">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-txt-secondary">
                                ACCEPTED THIS WEEK
                            </p>

                            <p className="mt-3 text-3xl font-bold leading-none text-txt-primary">
                                {loading ? "..." : acceptedAdmissionsThisWeek}
                            </p>

                            <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-txt-disabled">
                                APPROVED ADMISSIONS
                            </p>
                        </div>

                        <div className="border border-border-default bg-bg-secondary px-5 py-4">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-txt-secondary">
                                REJECTED THIS WEEK
                            </p>

                            <p className="mt-3 text-3xl font-bold leading-none text-txt-primary">
                                {loading ? "..." : rejectedAdmissionsThisWeek}
                            </p>

                            <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-txt-disabled">
                                DENIED ADMISSIONS
                            </p>
                        </div>

                        <div className="border border-border-default bg-bg-secondary px-5 py-4">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-txt-secondary">
                                TEMPORARY ASSIGNMENTS
                            </p>

                            <p className="mt-3 text-3xl font-bold leading-none text-txt-primary">
                                {loading ? "..." : activeTemporaryAssignments}
                            </p>

                            <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-txt-disabled">
                                ACTIVE REASSIGNMENTS
                            </p>
                        </div>

                        <div className="border border-border-default bg-bg-secondary px-5 py-4">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-txt-secondary">
                                ACTIVE USERS
                            </p>

                            <p className="mt-3 text-3xl font-bold leading-none text-txt-primary">
                                {loading ? "..." : activeUsers}
                            </p>

                            <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-txt-disabled">
                                {inactiveUsers} INACTIVE
                            </p>
                        </div>
                    </div>

                    <div className="col-span-12">
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
                    </div>

                    <div className="col-span-12 grid grid-cols-1 gap-4 2xl:grid-cols-[360px_minmax(0,1fr)_380px]">
                        <div className="min-h-0">
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
                        </div>

                        <div className="min-h-0">
                            <DashboardMapSection
                                loading={loading}
                                camps={camps}
                                explorations={explorations}
                                explorationsByState={explorationsByState}
                            />
                        </div>

                        <div className="min-h-0">
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
        </div>
    );
}