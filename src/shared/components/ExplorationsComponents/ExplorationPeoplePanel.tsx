import { useEffect, useMemo, useState } from "react";
import { UserPlus, UsersRound, X } from "lucide-react";

import type { ExplorationRow } from "./explorationHelpers";
import type { Person } from "../../../models/Person";
import type { PersonExploration } from "../../../models/PersonExploration";
import { PersonService } from "../../../services/PersonService";
import { PersonExplorationService } from "../../../services/PersonExplorationService";

type Props = {
    selectedExploration: ExplorationRow | null;
    campId?: number;
    onChanged?: () => Promise<void> | void;
};

type AssignedPerson = {
    assignment: PersonExploration;
    person: Person | null;
};

const personService = new PersonService();
const personExplorationService = new PersonExplorationService();

const labelClass =
    "text-[10px] uppercase tracking-[0.25em] text-[#7b8794]";

function getPersonName(person?: Person | null) {
    if (!person) {
        return "Persona no encontrada";
    }

    return [person.name, person.last_name ?? person.surname]
        .filter(Boolean)
        .join(" ");
}

export default function ExplorationPeoplePanel({
    selectedExploration,
    campId,
    onChanged,
}: Props) {
    const isLockedExploration = selectedExploration?.state === "A" || selectedExploration?.state === "F";
    const [people, setPeople] = useState<Person[]>([]);
    const [assignments, setAssignments] = useState<PersonExploration[]>([]);
    const [selectedPersonId, setSelectedPersonId] = useState("");
    const [roleName, setRoleName] = useState("Explorador");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [personToRemove, setPersonToRemove] = useState<number | null>(null);

    async function loadData(explorationId: number) {
        setLoading(true);
        setMessage("");

        const [peopleResponse, assignmentsResponse] = await Promise.all([
            personService.findAll(),
            personExplorationService.findByExplorationId(explorationId),
        ]);

        if (peopleResponse.getEstado()) {
            const records = peopleResponse.getResultado<Person[]>("registros") ?? [];
            setPeople(records);
        }

        if (assignmentsResponse.getEstado()) {
            const records =
                assignmentsResponse.getResultado<PersonExploration[]>(
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

    const assignedPeople = useMemo<AssignedPerson[]>(() => {
        return assignments.map((assignment) => {
            const person =
                people.find((item) => item.id === assignment.person_id) ?? null;

            return {
                assignment,
                person,
            };
        });
    }, [assignments, people]);

    const availablePeople = useMemo(() => {
        const assignedIds = new Set(assignments.map((item) => item.person_id));

        return people.filter((person) => {
            const sameCamp = !campId || person.camp_id === campId;
            const active = !person.state || person.state === "A";
            const notAssigned = person.id ? !assignedIds.has(person.id) : false;

            return sameCamp && active && notAssigned;
        });
    }, [assignments, campId, people]);

    const handleAssignPerson = async () => {
        if (!selectedExploration?.id) {
            setMessage("Primero selecciona una exploración.");
            return;
        }

        const personId = Number(selectedPersonId);

        if (!personId) {
            setMessage("Selecciona una persona para asignar.");
            return;
        }

        setSaving(true);
        setMessage("");

        const response = await personExplorationService.save({
            exploration_id: selectedExploration.id,
            person_id: personId,
            role_name: roleName.trim() || "Explorador",
            assigned_at: new Date(),
        });

        if (!response.getEstado()) {
            setSaving(false);
            setMessage(response.getMensaje());
            return;
        }

        setSelectedPersonId("");
        setRoleName("Explorador");
        setMessage("Persona asignada correctamente.");
        if (selectedExploration?.id) {
            await loadData(selectedExploration.id);
        }
        await onChanged?.();
        setSaving(false);
    };

    const handleRemovePerson = async (personId?: number) => {
        if (!selectedExploration?.id || !personId) {
            return;
        }

        setSaving(true);
        setMessage("");

        const response = await personExplorationService.remove(
            selectedExploration.id,
            personId,
        );

        if (!response.getEstado()) {
            setSaving(false);
            setMessage(response.getMensaje());
            return;
        }

        setPersonToRemove(null);
        setMessage("Persona removida correctamente.");

        if (selectedExploration?.id) {
            await loadData(selectedExploration.id);
        }
        await onChanged?.();
        setSaving(false);
    };

    if (!selectedExploration) {
        return (
            <div className="rounded-xl bg-[#cecece] p-5 text-sm text-[#64748b]">
                Selecciona una exploración para ver personas asignadas.
            </div>
        );
    }

    return (
        <div className="rounded-xl bg-[#cecece] p-5 shadow-[0_0_18px_rgba(0,0,0,0.35),inset_0_0_14px_rgba(115,115,115,0.33)]">
            <div className="mb-4 flex flex-col gap-3 border-b border-[#9ca3af] pb-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                    <UsersRound className="h-8 w-8 rounded-md bg-[#A6A6A6] p-1 text-[#343434]" />
                    <div>
                        <p className={labelClass}>Personas asignadas</p>
                        <h3 className="text-lg font-bold text-[#222]">
                            {selectedExploration.code}
                        </h3>
                    </div>
                </div>

                <p className="text-[11px] uppercase tracking-[0.25em] text-[#64748b]">
                    Total: {assignedPeople.length.toString().padStart(2, "0")}
                </p>
            </div>

            {message && (
                <div className="mb-4 rounded-lg border border-[#FF6600]/30 bg-[#FF6600]/10 px-4 py-3 text-sm text-[#9a3412]">
                    {message}
                </div>
            )}

            {isLockedExploration && (
                <div className="mb-4 rounded-lg border border-[#64748b]/40 bg-[#64748b]/10 px-4 py-3 text-sm text-[#334155]">
                    Esta exploración ya está activa o finalizada. Las personas asignadas solo pueden consultarse.
                </div>
            )}

            {!isLockedExploration && (
                <div className="grid gap-3 lg:grid-cols-[1fr_180px_auto]">
                    <select
                        value={selectedPersonId}
                        onChange={(event) => setSelectedPersonId(event.target.value)}
                        className="w-full rounded-lg border border-black bg-black px-4 py-3 text-sm text-white outline-none transition-colors hover:border-[#FF6600] focus:border-[#FF6600]"
                    >
                        <option value="">Seleccionar persona</option>
                        {availablePeople.map((person) => (
                            <option key={person.id} value={person.id}>
                                {getPersonName(person)} - {person.dni}
                            </option>
                        ))}
                    </select>

                    <input
                        value={roleName}
                        onChange={(event) => setRoleName(event.target.value)}
                        className="w-full rounded-lg border border-black bg-black px-4 py-3 text-sm text-white outline-none transition-colors hover:border-[#FF6600] focus:border-[#FF6600]"
                        placeholder="Rol"
                    />

                    <button
                        type="button"
                        disabled={saving || !selectedExploration}
                        onClick={handleAssignPerson}
                        className="flex items-center justify-center gap-2 rounded-lg border border-[#FF6600] bg-[#FF6600] px-4 py-3 text-sm uppercase tracking-[0.18em] text-black transition-colors hover:bg-transparent hover:text-[#FF6600] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <UserPlus size={16} />
                        Asignar
                    </button>
                </div>
            )}

            <div className="mt-5 max-h-[260px] overflow-y-auto pr-2">
                {loading ? (
                    <div className="py-8 text-center text-sm uppercase tracking-[0.25em] text-[#64748b]">
                        Cargando personas...
                    </div>
                ) : assignedPeople.length === 0 ? (
                    <div className="py-8 text-center text-sm uppercase tracking-[0.25em] text-[#f05a28]">
                        No hay personas asignadas
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {assignedPeople.map(({ assignment, person }) => (
                            <div
                                key={`${assignment.exploration_id}-${assignment.person_id}`}
                                className="flex flex-col gap-3 rounded-xl border border-[#c7c7c7] bg-[#f7f7f7] p-4 text-[#222] sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div>
                                    <p className="text-sm font-bold">
                                        {getPersonName(person)}
                                    </p>
                                    <p className="mt-1 text-xs text-[#707070]">
                                        DNI: {person?.dni ?? "N/D"} | Rol:{" "}
                                        {assignment.role_name ?? "Explorador"}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    disabled={saving || isLockedExploration}
                                    onClick={() => {
                                        if (isLockedExploration) return;
                                        setPersonToRemove(assignment.person_id);
                                    }}
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

            {personToRemove && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4">
                    <div className="w-full max-w-md rounded-xl border border-red-500/40 bg-[#232323] p-6 text-white shadow-[0_0_30px_rgba(0,0,0,0.65)]">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-red-300">
                            Confirmar acción
                        </p>

                        <h3 className="mt-2 text-xl font-bold">
                            Quitar persona
                        </h3>

                        <p className="mt-4 text-sm leading-relaxed text-[#cfcfcf]">
                            ¿Deseas quitar esta persona de la exploración seleccionada?
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={saving}
                                onClick={() => setPersonToRemove(null)}
                                className="border border-[#555] px-4 py-3 text-sm uppercase tracking-[0.2em] text-[#ccc] transition-colors hover:border-white hover:text-white disabled:opacity-60"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                disabled={saving}
                                onClick={() => handleRemovePerson(personToRemove)}
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