import { Search, UserMinus, UserPlus, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PersonService } from "../../../../services/PersonService";
import type { Person } from "../../../../models/Person";

const personService = new PersonService();

interface PersonSelectorProps {
  campId: number;
  persons: Array<{ person_id: number }>;
  onChange: (persons: Array<{ person_id: number }>) => void;
}

function getPersonLabel(person: Person) {
  return [person.name, person.surname ?? person.last_name].filter(Boolean).join(" ").trim() || `Person #${person.id}`;
}

export function PersonSelector({ campId, persons, onChange }: PersonSelectorProps) {
  const [search, setSearch] = useState("");
  const selectedIds = useMemo(() => new Set(persons.map((person) => person.person_id)), [persons]);

  const { data: availablePeople = [], isLoading } = useQuery({
    queryKey: ["people-for-request", campId],
    queryFn: async () => {
      const res = await personService.findAll();
      const people = res.getResultado<Person[]>("registros") ?? [];
      return people.filter((person) => person.camp_id === campId && person.state !== "I");
    },
    enabled: campId > 0,
  });

  const selectedPeople = useMemo(
    () => availablePeople.filter((person) => person.id && selectedIds.has(person.id)),
    [availablePeople, selectedIds],
  );

  const filteredPeople = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return availablePeople.filter((person) => {
      if (person.id && selectedIds.has(person.id)) return false;
      if (!normalizedSearch) return true;
      return (
        getPersonLabel(person).toLowerCase().includes(normalizedSearch) ||
        person.dni?.toLowerCase().includes(normalizedSearch) ||
        String(person.id).includes(normalizedSearch)
      );
    });
  }, [availablePeople, search, selectedIds]);

  const addPerson = (personId?: number) => {
    if (!personId || selectedIds.has(personId)) return;
    onChange([...persons, { person_id: personId }]);
  };

  const removePerson = (personId?: number) => {
    if (!personId) return;
    onChange(persons.filter((person) => person.person_id !== personId));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="app-label">PEOPLE TO REQUEST</label>
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">
          {selectedPeople.length} selected
        </span>
      </div>

      <div className="flex h-9 items-center gap-2 border border-border-default bg-bg-secondary/50 px-3">
        <Search size={13} className="shrink-0 text-txt-muted" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={campId > 0 ? "Search person" : "Select destination first"}
          disabled={campId <= 0}
          className="min-w-0 flex-1 bg-transparent font-mono text-[11px] text-txt-primary outline-none placeholder:text-txt-disabled disabled:cursor-not-allowed"
        />
      </div>

      <div className="max-h-56 overflow-y-auto border border-border-subtle bg-bg-tertiary/35">
        {campId <= 0 ? (
          <EmptySelectorState label="SELECT A PROVIDER CAMP" />
        ) : isLoading ? (
          <EmptySelectorState label="LOADING PEOPLE..." />
        ) : filteredPeople.length === 0 ? (
          <EmptySelectorState label="NO AVAILABLE PEOPLE" />
        ) : (
          filteredPeople.slice(0, 40).map((person) => (
            <button
              key={person.id}
              type="button"
              onClick={() => addPerson(person.id)}
              className="flex w-full items-center justify-between gap-3 border-b border-border-subtle px-3 py-2 text-left transition-colors hover:bg-accent/10"
            >
              <div className="min-w-0">
                <div className="truncate font-mono text-[11px] font-bold text-txt-primary">{getPersonLabel(person)}</div>
                <div className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-txt-muted">
                  DNI {person.dni || "-"} · Person #{person.id}
                </div>
              </div>
              <UserPlus size={14} className="shrink-0 text-accent" />
            </button>
          ))
        )}
      </div>

      {selectedPeople.length > 0 && (
        <div className="space-y-2">
          {selectedPeople.map((person) => (
            <div key={person.id} className="flex items-center justify-between gap-3 border border-border-subtle bg-bg-secondary/40 px-3 py-2">
              <div className="min-w-0">
                <div className="truncate font-mono text-[11px] font-bold text-txt-primary">{getPersonLabel(person)}</div>
                <div className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-txt-muted">DNI {person.dni || "-"}</div>
              </div>
              <button
                type="button"
                onClick={() => removePerson(person.id)}
                className="grid h-7 w-7 shrink-0 place-items-center border border-status-critical/40 bg-status-critical/10 text-status-critical transition-colors hover:bg-status-critical/20"
                aria-label="Remove selected person"
              >
                <UserMinus size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptySelectorState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-3 py-8 text-center">
      <Users size={18} className="text-txt-disabled" />
      <p className="font-mono text-[10px] uppercase tracking-widest text-txt-disabled">{label}</p>
    </div>
  );
}
