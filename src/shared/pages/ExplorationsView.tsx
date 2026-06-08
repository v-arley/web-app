import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";

import ExplorationStats from "../components/ExplorationsComponents/ExplorationStats";
import ExplorationFilters from "../components/ExplorationsComponents/ExplorationFilters";
import ExplorationsTable from "../components/ExplorationsComponents/ExplorationsTable";
import ExplorationDetailPanel from "../components/ExplorationsComponents/ExplorationDetailPanel";
import ExplorationForm from "../components/ExplorationsComponents/ExplorationForm";
import ExplorationPeoplePanel from "../components/ExplorationsComponents/ExplorationPeoplePanel";
import ExplorationResourcesPanel from "../components/ExplorationsComponents/ExplorationResourcesPanel";
import { PersonExplorationService } from "../../services/PersonExplorationService";
import type { PersonExploration } from "../../models/PersonExploration";
import { ResourceExplorationService } from "../../services/ResourceExplorationService";
import type { ExplorationResource } from "../../models/ExplorationResource";

import { ExplorationService } from "../../services/ExplorationService";
import type { CreateExploration, Exploration } from "../../models/Exploration";
import { getAuthContextFromToken } from "../utils/authAccess";

import type {
    ExplorationRow,
    RiskFilter,
    StateFilter,
} from "../components/ExplorationsComponents/explorationHelpers";

const explorationService = new ExplorationService();
const personExplorationService = new PersonExplorationService();
const resourceExplorationService = new ResourceExplorationService();

function formatDateForRow(value?: Date | string | null) {
    if (!value) {
        return "";
    }

    if (typeof value === "string") {
        return value.split("T")[0];
    }

    return value.toISOString().split("T")[0];
}

function mapExplorationToRow( 
    exploration: Exploration, 
    peopleCountByExploration: Map<number, number>,
    resourceCountByExploration: Map<number, number>,
): ExplorationRow  {
    return {
        id: exploration.id ?? 0,
        camp_id: exploration.camp_id,
        code: exploration.code,
        name: exploration.name,
        objective: exploration.objective,
        notes: exploration.notes,
        departure_date: formatDateForRow(exploration.departure_date),
        estimated_return_date: formatDateForRow(
            exploration.estimated_return_date,
        ),
        duration_days: exploration.duration_days,
        risk_level: exploration.risk_level as ExplorationRow["risk_level"],
        state: exploration.state as ExplorationRow["state"],
        people_count: peopleCountByExploration.get(exploration.id ?? 0) ?? 0,
        resource_count: resourceCountByExploration.get(exploration.id ?? 0) ?? 0,
    };
}

export function ExplorationsView() {
    const [authContext] = useState(getAuthContextFromToken);

    const [explorations, setExplorations] = useState<ExplorationRow[]>([]);
    const [selectedExploration, setSelectedExploration] =
        useState<ExplorationRow | null>(null);

    const [search, setSearch] = useState("");
    const [riskFilter, setRiskFilter] = useState<RiskFilter>("todas");
    const [stateFilter, setStateFilter] = useState<StateFilter>("todas");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingExploration, setEditingExploration] = useState<ExplorationRow | null>(null);
    const [showPeoplePanel, setShowPeoplePanel] = useState(false);
    const [showResourcesPanel, setShowResourcesPanel] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [startValidationMessage, setStartValidationMessage] = useState("");
    const [formValidationMessage, setFormValidationMessage] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const [stateAction, setStateAction] = useState<{
        exploration: ExplorationRow;
        newState: "A" | "F" | "C";
    } | null>(null);

    const currentCampId =
        authContext.campId ??
        selectedExploration?.camp_id ??
        explorations[0]?.camp_id;

    const loadExplorations = useCallback(async () => {
        setLoading(true);
        setErrorMessage("");

        const [ response, peopleAssignmentsResponse, resourceAssignmentsResponse, ] = await Promise.all([
            explorationService.findAll(),
            personExplorationService.findAll(),
            resourceExplorationService.findAll(),
        ]);

        if (!response.getEstado()) {
            setExplorations([]);
            setSelectedExploration(null);
            setErrorMessage(response.getMensaje());
            setLoading(false);
            return;
        }

        const peopleAssignments =
            peopleAssignmentsResponse.getResultado<PersonExploration[]>("registros") ??
            [];

        const resourceAssignments =
            resourceAssignmentsResponse.getResultado<ExplorationResource[]>(
                "registros",
            ) ?? [];
    

        const peopleCountByExploration = new Map<number, number>();
        const resourceCountByExploration = new Map<number, number>();

        peopleAssignments.forEach((assignment) => {
            const current = peopleCountByExploration.get(assignment.exploration_id) ?? 0;
            peopleCountByExploration.set(assignment.exploration_id, current + 1);
        });

        resourceAssignments.forEach((assignment) => {
            const current =
                resourceCountByExploration.get(assignment.exploration_id) ?? 0;

            resourceCountByExploration.set(
                assignment.exploration_id,
                current + 1,
            );
        });

        const data = response.getResultado<Exploration[]>("registros") ?? [];
        const rows = data
            .map((exploration) =>
                mapExplorationToRow(exploration, peopleCountByExploration, resourceCountByExploration,),
            )
            .filter((exploration) => exploration.id > 0);

        setExplorations(rows);
        setSelectedExploration((current) => {
            if (!current) {
                return rows[0] ?? null;
            }

            return rows.find((row) => row.id === current.id) ?? rows[0] ?? null;
        });
        setLoading(false);
    }, []);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            void loadExplorations();
        }, 0);

        return () => {
            window.clearTimeout(timer);
        };
    }, [loadExplorations]);

    const handleCreateExploration = async (payload: CreateExploration) => {
        setSaving(true);
        setErrorMessage("");
        setSuccessMessage("");
        setFormValidationMessage("");

        const response = await explorationService.save(payload);

        if (!response.getEstado()) {
            setSaving(false);
            setFormValidationMessage(response.getMensaje());
            return false;
        }

        setSuccessMessage("Exploration created successfully.");
        setShowCreateForm(false);
        await loadExplorations();
        setSaving(false);

        return true;
    };

    const handleUpdateExploration = async (payload: CreateExploration) => {
        if (!editingExploration?.id) {
            setErrorMessage("The selected exploration was not found.");
            return false;
        }

        setSaving(true);
        setErrorMessage("");
        setSuccessMessage("");
        setFormValidationMessage("");

        const response = await explorationService.update(
            editingExploration.id,
            payload,
        );

       if (!response.getEstado()) {
            setSaving(false);
            setFormValidationMessage(response.getMensaje());
            return false;
        }

        setSuccessMessage("Exploration updated successfully.");
        setEditingExploration(null);
        await loadExplorations();
        setSaving(false);

        return true;
    };

    const handleChangeExplorationState = async () => {
        if (!stateAction) {
            return;
        }

        const { exploration, newState } = stateAction;

        setSaving(true);
        setErrorMessage("");
        setSuccessMessage("");

        const response = await explorationService.update(exploration.id, {
            state: newState,
        });

        if (!response.getEstado()) {
            setSaving(false);
            setErrorMessage(response.getMensaje());
            return;
        }

        const messageByState = {
            A: "Exploration started successfully.",
            F: "Exploration finished successfully.",
            C: "Exploration cancelled successfully.",
        };

        setSuccessMessage(messageByState[newState]);
        setStateAction(null);
        await loadExplorations();
        setSaving(false);
    };
    

    const filteredExplorations = useMemo(() => {
        const q = search.trim().toLowerCase();

        return explorations.filter((exploration) => {
            const matchesSearch =
                !q ||
                exploration.code.toLowerCase().includes(q) ||
                exploration.name.toLowerCase().includes(q) ||
                (exploration.objective ?? "").toLowerCase().includes(q);

            const matchesRisk =
                riskFilter === "todas" || exploration.risk_level === riskFilter;

            const matchesState =
                stateFilter === "todas" || exploration.state === stateFilter;

            return matchesSearch && matchesRisk && matchesState;
        });
    }, [explorations, search, riskFilter, stateFilter]);


    const totalPages = Math.max(
        1,
        Math.ceil(filteredExplorations.length / pageSize),
    );

    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedExplorations = useMemo(() => {
        const startIndex = (safeCurrentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        return filteredExplorations.slice(startIndex, endIndex);
    }, [filteredExplorations, safeCurrentPage]);

    const activeCount = explorations.filter(
        (exploration) => exploration.state === "A",
    ).length;

    const highRiskCount = explorations.filter(
        (exploration) => exploration.risk_level === "H",
    ).length;

    return (
        <div className="w-full h-full flex flex-col bg-[#111111] overflow-hidden font-mono">
            <div className="w-full bg-[#242424] border-b border-[#3a3a3a] px-6 py-3 flex items-center justify-between shrink-0">
                <div className="flex flex-col">
                    <span className="text-[12px] font-mono font-bold text-[#C0C0C0] uppercase tracking-label">
                        Exploration control
                    </span>
                    <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-label">
                        Expeditions / target resources / supply return
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => void loadExplorations()}
                    className="flex items-center gap-2 text-[11px] font-mono text-[#6B7280] hover:text-[#E85D04] uppercase tracking-label transition-colors"
                >
                    <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                    {loading ? "Loading..." : "Refresh"}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
                <div className="p-4 flex flex-col gap-4">
                    <ExplorationStats
                        totalExplorations={explorations.length}
                        activeCount={activeCount}
                        highRiskCount={highRiskCount}
                    />

                    <div className="flex flex-col gap-4 xl:flex-row">
                        <section className="min-w-0 flex-1">
                            <div className="flex flex-col gap-4">
                                <ExplorationFilters
                                    search={search}
                                    riskFilter={riskFilter}
                                    stateFilter={stateFilter}
                                    onSearchChange={(value) => {
                                        setSearch(value);
                                        setCurrentPage(1);
                                    }}
                                    onRiskFilterChange={(value) => {
                                        setRiskFilter(value);
                                        setCurrentPage(1);
                                    }}
                                    onStateFilterChange={(value) => {
                                        setStateFilter(value);
                                        setCurrentPage(1);
                                    }}
                                    onCreateClick={() => {
                                        setSuccessMessage("");
                                        setErrorMessage("");
                                        setFormValidationMessage("");
                                        setShowCreateForm(true);
                                    }}
                                />

                                {showCreateForm && (
                                    <ExplorationForm
                                        mode="create"
                                        campId={currentCampId}
                                        saving={saving}
                                        onCancel={() => setShowCreateForm(false)}
                                        onSubmit={handleCreateExploration}
                                    />
                                )}

                                {editingExploration && (
                                    <ExplorationForm
                                        mode="edit"
                                        campId={editingExploration.camp_id ?? currentCampId}
                                        saving={saving}
                                        initialData={editingExploration}
                                        onCancel={() => setEditingExploration(null)}
                                        onSubmit={handleUpdateExploration}
                                    />
                                )}

                                {showPeoplePanel && (
                                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6">
                                        <div className="max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-[#FF6600]/40 bg-[#232323] p-5 shadow-[0_0_30px_rgba(0,0,0,0.65)]">
                                            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4 text-white">
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#9CA3AF]">
                                                        People management
                                                    </p>
                                                    <h3 className="mt-1 text-2xl">
                                                        {selectedExploration?.name ?? "Exploration"}
                                                    </h3>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => setShowPeoplePanel(false)}
                                                    className="rounded-lg border border-white/10 px-4 py-2 text-sm uppercase tracking-[0.2em] text-[#9CA3AF] transition-colors hover:border-[#FF6600] hover:text-[#FF6600]"
                                                >
                                                    Close
                                                </button>
                                            </div>

                                            <ExplorationPeoplePanel
                                                selectedExploration={selectedExploration}
                                                campId={currentCampId}
                                                onChanged={loadExplorations}
                                            />
                                        </div>
                                    </div>
                                )}

                                {showResourcesPanel && (
                                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6">
                                        <div className="max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-[#FF6600]/40 bg-[#232323] p-5 shadow-[0_0_30px_rgba(0,0,0,0.65)]">
                                            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4 text-white">
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#9CA3AF]">
                                                        Resource management
                                                    </p>
                                                    <h3 className="mt-1 text-2xl">
                                                        {selectedExploration?.name ?? "Exploration"}
                                                    </h3>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => setShowResourcesPanel(false)}
                                                    className="rounded-lg border border-white/10 px-4 py-2 text-sm uppercase tracking-[0.2em] text-[#9CA3AF] transition-colors hover:border-[#FF6600] hover:text-[#FF6600]"
                                                >
                                                    Close
                                                </button>
                                            </div>

                                            <ExplorationResourcesPanel
                                                selectedExploration={selectedExploration}
                                                onChanged={loadExplorations}
                                            />
                                        </div>
                                    </div>
                                )}

                                {stateAction && (
                                    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4">
                                        <div className="w-full max-w-md rounded-xl border border-[#FF6600]/40 bg-[#232323] p-6 text-white shadow-[0_0_30px_rgba(0,0,0,0.65)]">
                                            <p className="text-[10px] uppercase tracking-[0.25em] text-[#FF6600]">
                                                Confirm action
                                            </p>

                                            <h3 className="mt-2 text-xl font-bold">
                                                {stateAction.newState === "A" && "Start exploration"}
                                                {stateAction.newState === "F" && "Finish exploration"}
                                                {stateAction.newState === "C" && "Cancel exploration"}
                                            </h3>

                                            <p className="mt-4 text-sm leading-relaxed text-[#cfcfcf]">
                                                Do you want to change the status of exploration{" "}
                                                <span className="font-bold text-white">
                                                    {stateAction.exploration.name}
                                                </span>
                                                ?
                                            </p>

                                            <div className="mt-6 flex justify-end gap-3">
                                                <button
                                                    type="button"
                                                    disabled={saving}
                                                    onClick={() => setStateAction(null)}
                                                    className="border border-[#555] px-4 py-3 text-sm uppercase tracking-[0.2em] text-[#ccc] transition-colors hover:border-white hover:text-white disabled:opacity-60"
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    type="button"
                                                    disabled={saving}
                                                    onClick={handleChangeExplorationState}
                                                    className="border border-[#FF6600] bg-[#FF6600] px-4 py-3 text-sm uppercase tracking-[0.2em] text-black transition-colors hover:bg-transparent hover:text-[#FF6600] disabled:opacity-60"
                                                >
                                                    {saving ? "Processing..." : "Confirm"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {successMessage && (
                                    <div className="border border-[#22C55E]/50 bg-[#22C55E]/10 px-4 py-3 font-mono text-xs uppercase tracking-label text-[#22C55E]">
                                        {successMessage}
                                    </div>
                                )}

                                {loading && (
                                    <div className="border border-[#3a3a3a] bg-[#1a1a1a] p-6 font-mono text-xs uppercase tracking-label text-[#6B7280]">
                                        Loading explorations...
                                    </div>
                                )}

                                {!loading && errorMessage && (
                                    <div className="border border-[#E85D04] bg-[#E85D04]/10 px-4 py-3 font-mono text-xs uppercase tracking-label text-[#E85D04]">
                                        {errorMessage}
                                    </div>
                                )}

                                {!loading && !errorMessage && (
                                    <ExplorationsTable
                                        explorations={paginatedExplorations}
                                        selectedExploration={selectedExploration}
                                        onSelectExploration={setSelectedExploration}
                                        currentPage={safeCurrentPage}
                                        totalPages={totalPages}
                                        totalItems={filteredExplorations.length}
                                        onPageChange={setCurrentPage}
                                    />
                                )}

                                {startValidationMessage && (
                                    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/70 px-4">
                                        <div className="w-full max-w-md rounded-xl border border-[#FF6600]/50 bg-[#232323] p-6 text-white shadow-[0_0_30px_rgba(0,0,0,0.65)]">
                                            <p className="text-[10px] uppercase tracking-[0.25em] text-[#FF6600]">
                                                Exploration validation
                                            </p>

                                            <h3 className="mt-2 text-xl font-bold">
                                                Cannot start exploration
                                            </h3>

                                            <p className="mt-4 text-sm leading-relaxed text-[#cfcfcf]">
                                                {startValidationMessage}
                                            </p>

                                            <div className="mt-6 flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => setStartValidationMessage("")}
                                                    className="border border-[#FF6600] bg-[#FF6600] px-5 py-3 text-sm uppercase tracking-[0.2em] text-black transition-colors hover:bg-transparent hover:text-[#FF6600]"
                                                >
                                                    Understood
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {formValidationMessage && (
                                    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/70 px-4">
                                        <div className="w-full max-w-md rounded-xl border border-red-500/50 bg-[#232323] p-6 text-white shadow-[0_0_30px_rgba(0,0,0,0.65)]">
                                            <p className="text-[10px] uppercase tracking-[0.25em] text-red-400">
                                                Exploration validation
                                            </p>

                                            <h3 className="mt-2 text-xl font-bold">
                                                Could not save
                                            </h3>

                                            <p className="mt-4 text-sm leading-relaxed text-[#cfcfcf]">
                                                {formValidationMessage}
                                            </p>

                                            <div className="mt-6 flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormValidationMessage("")}
                                                    className="border border-red-500 bg-red-500 px-5 py-3 text-sm uppercase tracking-[0.2em] text-black transition-colors hover:bg-transparent hover:text-red-400"
                                                >
                                                    Understood
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        <ExplorationDetailPanel
                            selectedExploration={selectedExploration}
                            onEditExploration={(exploration) => {
                                setSuccessMessage("");
                                setErrorMessage("");
                                setFormValidationMessage("");
                                setShowCreateForm(false);
                                setShowPeoplePanel(false);
                                setShowResourcesPanel(false);
                                setEditingExploration(exploration);
                            }}
                            onManagePeople={() => {
                                setSuccessMessage("");
                                setErrorMessage("");
                                setShowCreateForm(false);
                                setEditingExploration(null);
                                setShowResourcesPanel(false);
                                setShowPeoplePanel(true);
                            }}
                            onManageResources={() => {
                                setSuccessMessage("");
                                setErrorMessage("");
                                setShowCreateForm(false);
                                setEditingExploration(null);
                                setShowPeoplePanel(false);
                                setShowResourcesPanel(true);
                            }}
                            onChangeExplorationState={(exploration, newState) => {
                                setSuccessMessage("");
                                setErrorMessage("");
                                setShowCreateForm(false);
                                setEditingExploration(null);
                                setShowPeoplePanel(false);
                                setShowResourcesPanel(false);

                                if (newState === "A") {
                                    const peopleCount = exploration.people_count ?? 0;
                                    const resourceCount = exploration.resource_count ?? 0;

                                    if (peopleCount === 0 && resourceCount === 0) {
                                        setStartValidationMessage(
                                            "This exploration cannot be started because it has no assigned people or target resources.",
                                        );
                                        return;
                                    }

                                    if (peopleCount === 0) {
                                        setStartValidationMessage(
                                            "This exploration cannot be started because it has no assigned people.",
                                        );
                                        return;
                                    }

                                    if (resourceCount === 0) {
                                        setStartValidationMessage(
                                            "This exploration cannot be started because it has no assigned target resources.",
                                        );
                                        return;
                                    }
                                }

                                setStateAction({
                                    exploration,
                                    newState,
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}