import { useState, useEffect, useRef, useMemo } from "react";
import { X, Search, UserCheck } from "lucide-react";
import { PersonService } from "../../services/PersonService";
import type { Person } from "../../models/Person";

interface ModalSearchPersonProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (person: Person) => void;
}

const personService = new PersonService();

function PersonSearchContent({ onClose, onSelect }: Omit<ModalSearchPersonProps, "isOpen">) {
    const [query, setQuery] = useState("");
    const [people, setPeople] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        personService.findAll().then((res) => {
            if (res.getEstado()) {
                const list: Person[] = res.getResultado<Person[]>("registros") ?? [];
                setPeople(list);
            } else {
                setError("No se pudieron cargar las personas.");
            }
        }).finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return people;
        return people.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.last_name.toLowerCase().includes(q) ||
                p.dni.toLowerCase().includes(q)
        );
    }, [query, people]);

    const handleSelect = (person: Person) => {
        onSelect(person);
        onClose();
    };

    return (
        <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <UserCheck size={20} className="text-[#f05a28]" />
                    <h3 className="text-[13px] font-bold text-gray-900 font-mono uppercase tracking-[0.1em]">
                        Search Administrator
                    </h3>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Search input */}
            <div className="px-6 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2 bg-[#F4F4F5] px-3 py-2">
                    <Search size={15} className="text-gray-400 shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search by name or DNI..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-transparent text-[13px] font-mono text-gray-800 outline-none placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto max-h-[50vh]">
                {loading && (
                    <div className="flex items-center justify-center py-10">
                        <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest animate-pulse">
                            Loading...
                        </span>
                    </div>
                )}
                {error && !loading && (
                    <div className="flex items-center justify-center py-10">
                        <span className="text-[11px] font-mono text-red-400 uppercase tracking-widest">{error}</span>
                    </div>
                )}
                {!loading && !error && filtered.length === 0 && (
                    <div className="flex items-center justify-center py-10">
                        <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">
                            No results found
                        </span>
                    </div>
                )}
                {!loading && !error && filtered.map((person) => (
                    <button
                        key={person.id}
                        onClick={() => handleSelect(person)}
                        className="w-full flex items-center gap-4 px-6 py-3 hover:bg-orange-50 hover:border-l-2 hover:border-[#f05a28] transition-all text-left group"
                    >
                        <div className="w-9 h-9 bg-[#F4F4F5] flex items-center justify-center shrink-0 font-mono font-bold text-[12px] text-gray-500 group-hover:bg-[#f05a28] group-hover:text-white transition-colors">
                            {person.name.charAt(0)}{person.last_name.charAt(0)}
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-[13px] font-bold font-mono text-gray-800 uppercase truncate">
                                {person.name} {person.last_name}
                            </span>
                            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                                DNI: {person.dni}
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                    {filtered.length} {filtered.length === 1 ? "record" : "records"} found
                </span>
                <button
                    onClick={onClose}
                    className="px-4 py-1.5 font-bold text-gray-600 bg-white hover:bg-gray-100 transition-colors uppercase text-[11px] tracking-wider font-mono"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export function ModalSearchPerson({ isOpen, onClose, onSelect }: ModalSearchPersonProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />
            <PersonSearchContent onClose={onClose} onSelect={onSelect} />
        </div>
    );
}
