import { useEffect, useMemo, useState } from "react";
import { PackagePlus, Boxes, X } from "lucide-react";

import type { ExplorationRow } from "./explorationHelpers";
import type { Resource } from "../../../models/Resource";
import type { ExplorationResource } from "../../../models/ExplorationResource";
import { ResourceService } from "../../../services/ResourceService";
import { ResourceExplorationService } from "../../../services/ResourceExplorationService";

type Props = {
    selectedExploration: ExplorationRow | null;
};

type AssignedResource = {
    assignment: ExplorationResource;
    resource: Resource | null;
};

const resourceService = new ResourceService();
const resourceExplorationService = new ResourceExplorationService();

const labelClass =
    "text-[10px] uppercase tracking-[0.25em] text-[#7b8794]";

function getResourceName(resource?: Resource | null) {
    if (!resource) {
        return "Recurso no encontrado";
    }

    return `${resource.name} (${resource.code})`;
}

function getUnit(resource?: Resource | null) {
    return resource?.unitOfMeasure || "unidad";
}

export default function ExplorationResourcesPanel({
    selectedExploration,
}: Props) {
    const [resources, setResources] = useState<Resource[]>([]);
    const [assignments, setAssignments] = useState<ExplorationResource[]>([]);

    const [selectedResourceId, setSelectedResourceId] = useState("");
    const [amountCollected, setAmountCollected] = useState("");
    const [amountConsumed, setAmountConsumed] = useState("");
    const [observations, setObservations] = useState("");

    const [resourceToRemove, setResourceToRemove] = useState<number | null>(null);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    async function loadData(explorationId: number) {
        setLoading(true);
        setMessage("");

        const [resourcesResponse, assignmentsResponse] = await Promise.all([
            resourceService.findAll(),
            resourceExplorationService.findByExplorationId(explorationId),
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

        setLoading(false);
    }

    useEffect(() => {
        const timer = window.setTimeout(() => {
            if (!selectedExploration?.id) {
                setAssignments([]);
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
            setMessage("Primero selecciona una exploración.");
            return;
        }

        const resourceId = Number(selectedResourceId);

        if (!resourceId) {
            setMessage("Selecciona un recurso para asignar.");
            return;
        }

        const collected = Number(amountCollected || 0);
        const consumed = Number(amountConsumed || 0);

        if (Number.isNaN(collected) || collected < 0) {
            setMessage("La cantidad recolectada debe ser un número válido.");
            return;
        }

        if (Number.isNaN(consumed) || consumed < 0) {
            setMessage("La cantidad consumida debe ser un número válido.");
            return;
        }

        setSaving(true);
        setMessage("");

        const response = await resourceExplorationService.save({
            exploration_id: selectedExploration.id,
            resource_id: resourceId,
            amount_collected: collected,
            amount_consumed: consumed,
            observations: observations.trim(),
        });

        if (!response.getEstado()) {
            setSaving(false);
            setMessage(response.getMensaje());
            return;
        }

        setSelectedResourceId("");
        setAmountCollected("");
        setAmountConsumed("");
        setObservations("");
        setMessage("Recurso asignado correctamente.");

        await loadData(selectedExploration.id);
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
        setMessage("Recurso removido correctamente.");

        await loadData(selectedExploration.id);
        setSaving(false);
    };

    if (!selectedExploration) {
        return (
            <div className="rounded-xl bg-[#cecece] p-5 text-sm text-[#64748b]">
                Selecciona una exploración para ver recursos asignados.
            </div>
        );
    }

    return (
        <div className="rounded-xl bg-[#cecece] p-5 shadow-[0_0_18px_rgba(0,0,0,0.35),inset_0_0_14px_rgba(115,115,115,0.33)]">
            <div className="mb-4 flex flex-col gap-3 border-b border-[#9ca3af] pb-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                    <Boxes className="h-8 w-8 rounded-md bg-[#A6A6A6] p-1 text-[#343434]" />
                    <div>
                        <p className={labelClass}>Recursos asignados</p>
                        <h3 className="text-lg font-bold text-[#222]">
                            {selectedExploration.code}
                        </h3>
                    </div>
                </div>

                <p className="text-[11px] uppercase tracking-[0.25em] text-[#64748b]">
                    Total: {assignedResources.length.toString().padStart(2, "0")}
                </p>
            </div>

            {message && (
                <div className="mb-4 rounded-lg border border-[#FF6600]/30 bg-[#FF6600]/10 px-4 py-3 text-sm text-[#9a3412]">
                    {message}
                </div>
            )}

            <div className="grid gap-3 lg:grid-cols-[1fr_150px_150px_auto]">
                <select
                    value={selectedResourceId}
                    onChange={(event) =>
                        setSelectedResourceId(event.target.value)
                    }
                    className="w-full rounded-lg border border-black bg-black px-4 py-3 text-sm text-white outline-none transition-colors hover:border-[#FF6600] focus:border-[#FF6600]"
                >
                    <option value="">Seleccionar recurso</option>
                    {availableResources.map((resource) => (
                        <option key={resource.id} value={resource.id}>
                            {resource.name} - {resource.code}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    min="0"
                    value={amountCollected}
                    onChange={(event) =>
                        setAmountCollected(event.target.value)
                    }
                    className="w-full rounded-lg border border-black bg-black px-4 py-3 text-sm text-white outline-none transition-colors hover:border-[#FF6600] focus:border-[#FF6600]"
                    placeholder="Recolectado"
                />

                <input
                    type="number"
                    min="0"
                    value={amountConsumed}
                    onChange={(event) =>
                        setAmountConsumed(event.target.value)
                    }
                    className="w-full rounded-lg border border-black bg-black px-4 py-3 text-sm text-white outline-none transition-colors hover:border-[#FF6600] focus:border-[#FF6600]"
                    placeholder="Consumido"
                />

                <button
                    type="button"
                    disabled={saving || !selectedExploration}
                    onClick={handleAssignResource}
                    className="flex items-center justify-center gap-2 rounded-lg border border-[#FF6600] bg-[#FF6600] px-4 py-3 text-sm uppercase tracking-[0.18em] text-black transition-colors hover:bg-transparent hover:text-[#FF6600] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <PackagePlus size={16} />
                    Asignar
                </button>
            </div>

            <textarea
                value={observations}
                onChange={(event) => setObservations(event.target.value)}
                className="mt-3 min-h-[80px] w-full resize-none rounded-lg border border-black bg-black px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-[#777] hover:border-[#FF6600] focus:border-[#FF6600]"
                placeholder="Observaciones del recurso..."
            />

            <div className="mt-5 max-h-[260px] overflow-y-auto pr-2">
                {loading ? (
                    <div className="py-8 text-center text-sm uppercase tracking-[0.25em] text-[#64748b]">
                        Cargando recursos...
                    </div>
                ) : assignedResources.length === 0 ? (
                    <div className="py-8 text-center text-sm uppercase tracking-[0.25em] text-[#f05a28]">
                        No hay recursos asignados
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {assignedResources.map(({ assignment, resource }) => (
                            <div
                                key={`${assignment.exploration_id}-${assignment.resource_id}`}
                                className="flex flex-col gap-3 rounded-xl border border-[#c7c7c7] bg-[#f7f7f7] p-4 text-[#222] sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div>
                                    <p className="text-sm font-bold">
                                        {getResourceName(resource)}
                                    </p>

                                    <p className="mt-1 text-xs text-[#707070]">
                                        Recolectado:{" "}
                                        {assignment.amount_collected ?? 0}{" "}
                                        {getUnit(resource)} | Consumido:{" "}
                                        {assignment.amount_consumed ?? 0}{" "}
                                        {getUnit(resource)}
                                    </p>

                                    {assignment.observations && (
                                        <p className="mt-2 text-xs text-[#707070]">
                                            {assignment.observations}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    disabled={saving}
                                    onClick={() =>
                                        setResourceToRemove(
                                            assignment.resource_id,
                                        )
                                    }
                                    className="flex items-center justify-center gap-2 border border-red-500 px-3 py-2 text-xs uppercase tracking-[0.18em] text-red-500 transition-colors hover:bg-red-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <X size={14} />
                                    Quitar
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {resourceToRemove && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4">
                    <div className="w-full max-w-md rounded-xl border border-red-500/40 bg-[#232323] p-6 text-white shadow-[0_0_30px_rgba(0,0,0,0.65)]">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-red-300">
                            Confirmar acción
                        </p>

                        <h3 className="mt-2 text-xl font-bold">
                            Quitar recurso
                        </h3>

                        <p className="mt-4 text-sm leading-relaxed text-[#cfcfcf]">
                            ¿Deseas quitar este recurso de la exploración
                            seleccionada?
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={saving}
                                onClick={() => setResourceToRemove(null)}
                                className="border border-[#555] px-4 py-3 text-sm uppercase tracking-[0.2em] text-[#ccc] transition-colors hover:border-white hover:text-white disabled:opacity-60"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                disabled={saving}
                                onClick={() =>
                                    handleRemoveResource(resourceToRemove)
                                }
                                className="border border-red-500 bg-red-500 px-4 py-3 text-sm uppercase tracking-[0.2em] text-black transition-colors hover:bg-transparent hover:text-red-400 disabled:opacity-60"
                            >
                                {saving ? "Quitando..." : "Quitar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}