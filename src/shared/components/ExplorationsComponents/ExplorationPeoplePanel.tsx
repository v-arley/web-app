import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, UserPlus, UsersRound, X } from "lucide-react";

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
    "text-[10px] font-mono font-bold uppercase tracking-label text-[#6B7280]";

const inputClass =
    "w-full border border-[#3a3a3a] bg-[#111111] px-4 py-3 text-[12px] font-mono text-white outline-none transition-colors placeholder:text-[#6B7280] hover:border-[#E85D04]/60 focus:border-[#E85D04]";

function getPersonName(person?: Person | null) {
    if (!person) {
        return "Person not found";
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
    const isLockedExploration =
        selectedExploration?.state === "A" ||
        selectedExploration?.state === "F";

    const [people, setPeople] = useState<Person[]>([]);
    const [assignments, setAssignments] = useState<PersonExploration[]>([]);
    const [selectedPersonId, setSelectedPersonId] = useState("");
    const [roleName, setRoleName] = useState("Explorer");
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
            setMessage("Select an exploration first.");
            return;
        }

        const personId = Number(selectedPersonId);

        if (!personId) {
            setMessage("Select a person to assign.");
            return;
        }

        setSaving(true);
        setMessage("");

        const response = await personExplorationService.save({
            exploration_id: selectedExploration.id,
            person_id: personId,
            role_name: roleName.trim() || "Explorer",
            assigned_at: new Date(),
        });

        if (!response.getEstado()) {
            setSaving(false);
            setMessage(response.getMensaje());
            return;
        }

        setSelectedPersonId("");
        setRoleName("Explorer");
        setMessage("Person assigned successfully.");

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
        setMessage("Person removed successfully.");

        if (selectedExploration?.id) {
            await loadData(selectedExploration.id);
        }

        await onChanged?.();
        setSaving(false);
    };

    if (!selectedExploration) {
        return (
            <div className="border border-[#3a3a3a] bg-[#1a1a1a] p-5 font-mono text-xs uppercase tracking-label text-[#6B7280]">
                Select an exploration to view assigned people.
            </div>
        );
    }

    return (
        <div className="border border-[#3a3a3a] bg-[#1a1a1a] p-5 shadow-[0_0_18px_rgba(0,0,0,0.35)]">
            <div className="mb-4 flex flex-col gap-3 border-b border-[#3a3a3a] pb-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                    <div className="border border-[#E85D04]/60 bg-[#E85D04]/10 p-2 text-[#E85D04]">
                        <UsersRound size={20} />
                    </div>

                    <div>
                        <p className={labelClass}>Assigned people</p>
                        <h3 className="mt-1 font-mono text-lg font-black uppercase tracking-wide text-white">
                            {selectedExploration.code}
                        </h3>
                    </div>
                </div>

                <p className="border border-[#3a3a3a] bg-[#111111] px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-label text-[#C0C0C0]">
                    Total:{" "}
                    <span className="text-[#E85D04]">
                        {assignedPeople.length.toString().padStart(2, "0")}
                    </span>
                </p>
            </div>

            {message && (
                <div className="mb-4 flex items-center gap-2 border border-[#E85D04]/60 bg-[#E85D04]/10 px-4 py-3 font-mono text-xs uppercase tracking-label text-[#E85D04]">
                    <AlertTriangle size={15} />
                    {message}
                </div>
            )}

            {isLockedExploration && (
                <div className="mb-4 border border-[#38BDF8]/45 bg-[#38BDF8]/10 px-4 py-3 font-mono text-xs uppercase tracking-label text-[#38BDF8]">
                    This exploration is already active or finished. Assigned people can only be viewed.
                </div>
            )}

            {!isLockedExploration && (
                <div className="grid gap-3 lg:grid-cols-[1fr_180px_auto]">
                    <select
                        value={selectedPersonId}
                        onChange={(event) => setSelectedPersonId(event.target.value)}
                        className={inputClass}
                    >
                        <option value="">Select person</option>
                        {availablePeople.map((person) => (
                            <option key={person.id} value={person.id}>
                                {getPersonName(person)} - {person.dni}
                            </option>
                        ))}
                    </select>

                    <input
                        value={roleName}
                        onChange={(event) => setRoleName(event.target.value)}
                        className={inputClass}
                        placeholder="Role"
                    />

                    <button
                        type="button"
                        disabled={saving || !selectedExploration}
                        onClick={handleAssignPerson}
                        className="flex items-center justify-center gap-2 border border-[#E85D04] bg-[#E85D04] px-4 py-3 text-[11px] font-mono font-bold uppercase tracking-label text-[#111111] transition-colors hover:bg-[#FF6A10] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <UserPlus size={16} />
                        Assign
                    </button>
                </div>
            )}

            <div className="mt-5 max-h-[260px] overflow-y-auto pr-2">
                {loading ? (
                    <div className="border border-[#3a3a3a] bg-[#111111] p-6 text-center font-mono text-xs uppercase tracking-label text-[#6B7280]">
                        Loading people...
                    </div>
                ) : assignedPeople.length === 0 ? (
                    <div className="border border-[#3a3a3a] bg-[#111111] p-6 text-center font-mono text-xs uppercase tracking-label text-[#E85D04]">
                        No assigned people
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {assignedPeople.map(({ assignment, person }) => (
                            <div
                                key={`${assignment.exploration_id}-${assignment.person_id}`}
                                className="flex flex-col gap-3 border border-[#3a3a3a] bg-[#111111] p-4 text-[#C0C0C0] transition-colors hover:border-[#E85D04]/50 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div>
                                    <p className="font-mono text-sm font-bold uppercase tracking-wide text-white">
                                        {getPersonName(person)}
                                    </p>

                                    <p className="mt-1 font-mono text-[11px] text-[#6B7280]">
                                        DNI:{" "}
                                        <span className="text-[#38BDF8]">
                                            {person?.dni ?? "N/A"}
                                        </span>{" "}
                                        | Role:{" "}
                                        <span className="text-[#E85D04]">
                                            {assignment.role_name ?? "Explorer"}
                                        </span>
                                    </p>
                                </div>

                                {!isLockedExploration && (
                                    <button
                                        type="button"
                                        disabled={saving}
                                        onClick={() =>
                                            setPersonToRemove(assignment.person_id)
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

            {personToRemove && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4">
                    <div className="w-full max-w-md border border-red-500/40 bg-[#1a1a1a] p-6 text-white shadow-[0_0_30px_rgba(0,0,0,0.65)]">
                        <p className="text-[10px] font-mono font-bold uppercase tracking-label text-red-400">
                            Confirm action
                        </p>

                        <h3 className="mt-2 font-mono text-xl font-black uppercase tracking-wide">
                            Remove person
                        </h3>

                        <p className="mt-4 font-mono text-sm leading-relaxed text-[#C0C0C0]">
                            Do you want to remove this person from the selected exploration?
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={saving}
                                onClick={() => setPersonToRemove(null)}
                                className="border border-[#3a3a3a] px-4 py-3 text-[11px] font-mono font-bold uppercase tracking-label text-[#C0C0C0] transition-colors hover:border-white hover:text-white disabled:opacity-60"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={saving}
                                onClick={() => handleRemovePerson(personToRemove)}
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