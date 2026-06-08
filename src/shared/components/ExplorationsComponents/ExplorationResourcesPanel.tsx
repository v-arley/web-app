import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Boxes, PackagePlus, X } from "lucide-react";

import type { ExplorationRow } from "./explorationHelpers";
import type { Resource } from "../../../models/Resource";
import type { ExplorationResource } from "../../../models/ExplorationResource";
import { ResourceService } from "../../../services/ResourceService";
import { ResourceExplorationService } from "../../../services/ResourceExplorationService";
import type { ExplorationRation } from "../../../models/ExplorationRation";
import { ExplorationRationService } from "../../../services/ExplorationRationService";

type Props = {
    selectedExploration: ExplorationRow | null;
    onChanged?: () => Promise<void> | void;
};

type AssignedResource = {
    assignment: ExplorationResource;
    resource: Resource | null;
};

const resourceService = new ResourceService();
const resourceExplorationService = new ResourceExplorationService();
const explorationRationService = new ExplorationRationService();

const labelClass =
    "text-[10px] font-mono font-bold uppercase tracking-label text-[#6B7280]";

const inputClass =
    "w-full border border-[#3a3a3a] bg-[#111111] px-4 py-3 text-[12px] font-mono text-white outline-none transition-colors placeholder:text-[#6B7280] hover:border-[#E85D04]/60 focus:border-[#E85D04]";

function getResourceName(resource?: Resource | null) {
    if (!resource) {
        return "Resource not found";
    }

    return `${resource.name} (${resource.code})`;
}

function getUnit(resource?: Resource | null) {
    return resource?.unitOfMeasure || "unit";
}

export default function ExplorationResourcesPanel({
    selectedExploration,
    onChanged,
}: Props) {
    const isClosedExploration =
        selectedExploration?.state === "F" ||
        selectedExploration?.state === "C";

    const [resources, setResources] = useState<Resource[]>([]);
    const [assignments, setAssignments] = useState<ExplorationResource[]>([]);
    const [rations, setRations] = useState<ExplorationRation[]>([]);

    const [selectedResourceId, setSelectedResourceId] = useState("");
    const [observations, setObservations] = useState("");

    const [resourceToRemove, setResourceToRemove] = useState<number | null>(null);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    async function loadData(explorationId: number) {
        setLoading(true);
        setMessage("");

        const [resourcesResponse, assignmentsResponse, rationsResponse] =
            await Promise.all([
                resourceService.findAll(),
                resourceExplorationService.findByExplorationId(explorationId),
                explorationRationService.findByExplorationId(explorationId),
            ]);

        if (resourcesResponse.getEstado()) {
            const records =
                resourcesResponse.getResultado<Resource[]>("registros") ?? [];
            setResources(records);
        }

        if (assignmentsResponse.getEstado()) {
            const records =
                assignmentsResponse.getResultado<ExplorationResource[]>(
                    "registros",
                ) ?? [];
            setAssignments(records);
        } else {
            setAssignments([]);
            setMessage(assignmentsResponse.getMensaje());
        }

        if (rationsResponse.getEstado()) {
            const records =
                rationsResponse.getResultado<ExplorationRation[]>("registros") ?? [];
            setRations(records);
        } else {
            setRations([]);
        }

        setLoading(false);
    }

    useEffect(() => {
        const timer = window.setTimeout(() => {
            if (!selectedExploration?.id) {
                setAssignments([]);
                setRations([]);
                setMessage("");
                setLoading(false);
                return;
            }

            void loadData(selectedExploration.id);
        }, 0);

        return () => {
            window.clearTimeout(timer);
        };
    }, [selectedExploration?.id]);

    const assignedResources = useMemo<AssignedResource[]>(() => {
        return assignments.map((assignment) => {
            const resource =
                resources.find((item) => item.id === assignment.resource_id) ??
                null;

            return {
                assignment,
                resource,
            };
        });
    }, [assignments, resources]);

    const explorationRations = useMemo(() => {
        return rations.map((ration) => {
            const resource =
                resources.find((item) => item.id === ration.resource_id) ?? null;

            return {
                ration,
                resource,
            };
        });
    }, [rations, resources]);

    const availableResources = useMemo(() => {
        const assignedIds = new Set(
            assignments.map((item) => item.resource_id),
        );

        return resources.filter((resource) => {
            const active = !resource.state || resource.state === "A";
            const notAssigned = resource.id
                ? !assignedIds.has(resource.id)
                : false;

            return active && notAssigned;
        });
    }, [assignments, resources]);

    const handleAssignResource = async () => {
        if (!selectedExploration?.id) {
            setMessage("Select an exploration first.");
            return;
        }

        const resourceId = Number(selectedResourceId);

        if (!resourceId) {
            setMessage("Select a target resource.");
            return;
        }

        setSaving(true);
        setMessage("");

        const response = await resourceExplorationService.save({
            exploration_id: selectedExploration.id,
            resource_id: resourceId,
            amount_collected: 0,
            amount_consumed: 0,
            observations: observations.trim(),
        });

        if (!response.getEstado()) {
            setSaving(false);
            setMessage(response.getMensaje());
            return;
        }

        setSelectedResourceId("");
        setObservations("");
        setMessage(
            "Target resource assigned successfully. The collected amount will be calculated when the exploration is finished.",
        );

        await loadData(selectedExploration.id);
        await onChanged?.();
        setSaving(false);
    };

    const handleRemoveResource = async (resourceId?: number) => {
        if (!selectedExploration?.id || !resourceId) {
            return;
        }

        setSaving(true);
        setMessage("");

        const response = await resourceExplorationService.remove(
            selectedExploration.id,
            resourceId,
        );

        if (!response.getEstado()) {
            setSaving(false);
            setMessage(response.getMensaje());
            return;
        }

        setResourceToRemove(null);
        setMessage("Resource removed successfully.");

        await loadData(selectedExploration.id);
        await onChanged?.();
        setSaving(false);
    };

    if (!selectedExploration) {
        return (
            <div className="border border-[#3a3a3a] bg-[#1a1a1a] p-5 font-mono text-xs uppercase tracking-label text-[#6B7280]">
                Select an exploration to view assigned resources.
            </div>
        );
    }

    return (
        <div className="border border-[#3a3a3a] bg-[#1a1a1a] p-5 shadow-[0_0_18px_rgba(0,0,0,0.35)]">
            <div className="mb-4 flex flex-col gap-3 border-b border-[#3a3a3a] pb-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                    <div className="border border-[#E85D04]/60 bg-[#E85D04]/10 p-2 text-[#E85D04]">
                        <Boxes size={20} />
                    </div>

                    <div>
                        <p className={labelClass}>Target resources</p>
                        <h3 className="mt-1 font-mono text-lg font-black uppercase tracking-wide text-white">
                            {selectedExploration.code}
                        </h3>
                    </div>
                </div>

                <p className="border border-[#3a3a3a] bg-[#111111] px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-label text-[#C0C0C0]">
                    Total:{" "}
                    <span className="text-[#E85D04]">
                        {assignedResources.length.toString().padStart(2, "0")}
                    </span>
                </p>
            </div>

            {message && (
                <div className="mb-4 flex items-center gap-2 border border-[#E85D04]/60 bg-[#E85D04]/10 px-4 py-3 font-mono text-xs uppercase tracking-label text-[#E85D04]">
                    <AlertTriangle size={15} />
                    {message}
                </div>
            )}

            {isClosedExploration && (
                <div className="mb-4 border border-[#38BDF8]/45 bg-[#38BDF8]/10 px-4 py-3 font-mono text-xs uppercase tracking-label text-[#38BDF8]">
                    This exploration is already finished or cancelled. Target resources can only be viewed.
                </div>
            )}

            {!isClosedExploration && (
                <div className="border border-[#3a3a3a] bg-[#111111] p-4">
                    <p className="mb-3 font-mono text-xs leading-relaxed text-[#9CA3AF]">
                        Assign the resources that the team will search for during
                        the exploration. The collected amount will remain at 0
                        until the exploration is finished.
                    </p>

                    <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
                        <select
                            value={selectedResourceId}
                            onChange={(event) =>
                                setSelectedResourceId(event.target.value)
                            }
                            className={inputClass}
                        >
                            <option value="">Select target resource</option>
                            {availableResources.map((resource) => (
                                <option key={resource.id} value={resource.id}>
                                    {resource.name} - {resource.code}
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            disabled={saving || !selectedExploration || isClosedExploration}
                            onClick={handleAssignResource}
                            className="flex items-center justify-center gap-2 border border-[#E85D04] bg-[#E85D04] px-4 py-3 text-[11px] font-mono font-bold uppercase tracking-label text-[#111111] transition-colors hover:bg-[#FF6A10] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <PackagePlus size={16} />
                            Assign target
                        </button>
                    </div>

                    <textarea
                        value={observations}
                        onChange={(event) => setObservations(event.target.value)}
                        className={`${inputClass} mt-3 min-h-[80px] resize-none`}
                        placeholder="Observations about this target resource..."
                    />
                </div>
            )}

            <div className="mt-5 max-h-[260px] overflow-y-auto pr-2">
                {loading ? (
                    <div className="border border-[#3a3a3a] bg-[#111111] p-6 text-center font-mono text-xs uppercase tracking-label text-[#6B7280]">
                        Loading resources...
                    </div>
                ) : assignedResources.length === 0 ? (
                    <div className="border border-[#3a3a3a] bg-[#111111] p-6 text-center font-mono text-xs uppercase tracking-label text-[#E85D04]">
                        No target resources assigned
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {assignedResources.map(({ assignment, resource }) => (
                            <div
                                key={`${assignment.exploration_id}-${assignment.resource_id}`}
                                className="flex flex-col gap-3 border border-[#3a3a3a] bg-[#111111] p-4 text-[#C0C0C0] transition-colors hover:border-[#E85D04]/50 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div>
                                    <p className="font-mono text-sm font-bold uppercase tracking-wide text-white">
                                        {getResourceName(resource)}
                                    </p>

                                    <p className="mt-1 font-mono text-[11px] text-[#6B7280]">
                                        Target search | Collected:{" "}
                                        <span className="text-[#E85D04]">
                                            {assignment.amount_collected ?? 0}
                                        </span>{" "}
                                        {getUnit(resource)}
                                    </p>

                                    {assignment.observations && (
                                        <p className="mt-2 font-mono text-[11px] leading-relaxed text-[#9CA3AF]">
                                            {assignment.observations}
                                        </p>
                                    )}
                                </div>

                                {!isClosedExploration && (
                                    <button
                                        type="button"
                                        disabled={saving}
                                        onClick={() =>
                                            setResourceToRemove(assignment.resource_id)
                                        }
                                        className="flex items-center justify-center gap-2 border border-red-500 px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-label text-red-400 transition-colors hover:bg-red-500 hover:text-[#111111] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <X size={14} />
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-6 border border-[#FACC15]/45 bg-[#FACC15]/10 p-4">
                <div className="mb-3 flex items-center justify-between border-b border-[#FACC15]/30 pb-3">
                    <div>
                        <p className="text-[10px] font-mono font-bold uppercase tracking-label text-[#FACC15]">
                            Consumed rations
                        </p>
                        <h4 className="font-mono text-sm font-bold uppercase tracking-wide text-white">
                            Resources used at departure
                        </h4>
                    </div>

                    <p className="border border-[#FACC15]/40 bg-[#111111] px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-label text-[#FACC15]">
                        Total: {explorationRations.length.toString().padStart(2, "0")}
                    </p>
                </div>

                {explorationRations.length === 0 ? (
                    <p className="border border-[#3a3a3a] bg-[#111111] p-4 text-center font-mono text-xs uppercase tracking-label text-[#6B7280]">
                        No rations registered
                    </p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {explorationRations.map(({ ration, resource }) => (
                            <div
                                key={`${ration.exploration_id}-${ration.resource_id}`}
                                className="border border-[#3a3a3a] bg-[#111111] p-4 text-[#C0C0C0]"
                            >
                                <p className="font-mono text-sm font-bold uppercase tracking-wide text-white">
                                    {getResourceName(resource)}
                                </p>

                                <p className="mt-1 font-mono text-[11px] text-[#6B7280]">
                                    Planned:{" "}
                                    <span className="text-[#FACC15]">
                                        {ration.planned_amount}
                                    </span>{" "}
                                    {getUnit(resource)} | Consumed:{" "}
                                    <span className="text-[#FACC15]">
                                        {ration.consumed_amount}
                                    </span>{" "}
                                    {getUnit(resource)}
                                </p>

                                {ration.notes && (
                                    <p className="mt-2 font-mono text-[11px] leading-relaxed text-[#9CA3AF]">
                                        {ration.notes}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {resourceToRemove && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4">
                    <div className="w-full max-w-md border border-red-500/40 bg-[#1a1a1a] p-6 text-white shadow-[0_0_30px_rgba(0,0,0,0.65)]">
                        <p className="text-[10px] font-mono font-bold uppercase tracking-label text-red-400">
                            Confirm action
                        </p>

                        <h3 className="mt-2 font-mono text-xl font-black uppercase tracking-wide">
                            Remove resource
                        </h3>

                        <p className="mt-4 font-mono text-sm leading-relaxed text-[#C0C0C0]">
                            Do you want to remove this resource from the selected exploration?
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={saving}
                                onClick={() => setResourceToRemove(null)}
                                className="border border-[#3a3a3a] px-4 py-3 text-[11px] font-mono font-bold uppercase tracking-label text-[#C0C0C0] transition-colors hover:border-white hover:text-white disabled:opacity-60"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={saving}
                                onClick={() =>
                                    handleRemoveResource(resourceToRemove)
                                }
                                className="border border-red-500 bg-red-500 px-4 py-3 text-[11px] font-mono font-bold uppercase tracking-label text-[#111111] transition-colors hover:bg-transparent hover:text-red-400 disabled:opacity-60"
                            >
                                {saving ? "Removing..." : "Remove"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}