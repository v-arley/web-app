import { useState } from "react";
import { Plus, Key, Trash2, Search } from "lucide-react";
import { usePermissions } from "../hooks/usePermission";
import type { CreatePermission } from "../../models/Permision";
import { TextFieldFloat } from "../components/TextFielFloat";

const PAGE_SIZE = 7;
type FormState = { code: string; name: string; description: string };
const emptyForm: FormState = { code: "", name: "", description: "" };

export function PermsView() {
    const { data: perms, isLoading, error, create, remove } = usePermissions();

    const [selectedId, setSelectedId]   = useState<number | null>(null);
    const [editMode, setEditMode]       = useState(false);
    const [form, setForm]               = useState<FormState>(emptyForm);
    const [searchTerm, setSearchTerm]   = useState("");
    const [page, setPage]               = useState(0);
    const [isSaving, setIsSaving]       = useState(false);

    const selectedPerm = perms.find(p => p.id === selectedId) ?? null;

    const filtered = perms.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(p.id).includes(searchTerm)
    );
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageItems  = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    const handleRowClick = (perm: typeof perms[0]) => {
        if (selectedId === perm.id) {
            setSelectedId(null); setEditMode(false); setForm(emptyForm);
        } else {
            setSelectedId(perm.id);
            setEditMode(false);
            setForm({ code: perm.code, name: perm.name, description: perm.description });
        }
    };

    const handleEditToggle = () => {
        if (editMode && selectedPerm)
            setForm({ code: selectedPerm.code, name: selectedPerm.name, description: selectedPerm.description });
        setEditMode(e => !e);
    };

    const handleSave = async () => {
        if (!form.code || !form.name || !form.description) return;
        setIsSaving(true);
        if (!selectedId) {
            const payload: CreatePermission = {
                code: form.code.toUpperCase(),
                name: form.name.toUpperCase(),
                description: form.description,
            };
            const ok = await create(payload);
            if (ok) setForm(emptyForm);
        }
        setIsSaving(false);
    };

    const handleDelete = async () => {
        if (!selectedId) return;
        setIsSaving(true);
        const ok = await remove(selectedId);
        if (ok) { setSelectedId(null); setEditMode(false); setForm(emptyForm); }
        setIsSaving(false);
    };

    return (
        <div className="flex flex-row flex-1 min-h-0 w-full h-full overflow-hidden border border-border-default">

            {/* ── LEFT PANEL ─────────────────────────────────────── */}
            <div className="flex flex-col bg-[#FBFBFB] shrink-0 p-6 gap-2" style={{ width: "54%" }}>

                {/* Search */}
                <div className="relative w-full shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-secondary" size={16} />
                    <input
                        type="text"
                        placeholder="SEARCH BY ID, CODE OR NAME..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                        className="w-full bg-bg-tertiary pl-9 pr-4 py-2 font-mono text-sm font-bold tracking-wide uppercase text-txt-primary border border-border-default rounded-none outline-none focus:border-border-accent transition-colors placeholder:text-txt-disabled"
                    />
                </div>

                {/* LIST / PG header */}
                <div className="flex items-stretch h-8 gap-2 shrink-0">
                    <div className="flex-1 bg-bg-secondary border border-border-default flex items-center px-4">
                        <span className="text-txt-primary font-bold font-mono text-sm tracking-wide uppercase">LIST</span>
                    </div>
                    <div className="bg-[#E85D04] px-4 flex items-center justify-center">
                        <span className="text-accent-fg font-mono text-sm font-bold tracking-wide">
                            PG&#8209;{String(page + 1).padStart(2, "0")}
                        </span>
                    </div>
                </div>

                {/* Table header */}
                <div className="grid grid-cols-[0.5fr_1fr_1.5fr_2.5fr] px-1 py-1 border-b border-border-default shrink-0">
                    {["ID", "CODE", "NAME", "DESCRIPTION"].map(h => (
                        <div key={h} className="text-xs font-mono font-bold tracking-label text-txt-secondary uppercase text-center">
                            {h}
                        </div>
                    ))}
                </div>

                {/* Loading / error */}
                {isLoading && (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-border-default border-t-accent rounded-full animate-spin" />
                    </div>
                )}
                {!isLoading && error && (
                    <div className="flex-1 flex items-center justify-center">
                        <span className="font-mono text-xs text-status-critical tracking-label uppercase">{error}</span>
                    </div>
                )}

                {/* Rows */}
                {!isLoading && !error && (
                    <div className="flex-1 overflow-y-auto">
                        {pageItems.map(perm => {
                            const isSelected = selectedId === perm.id;
                            return (
                                <div
                                    key={perm.id}
                                    onClick={() => handleRowClick(perm)}
                                    className={`grid grid-cols-[0.5fr_1fr_1.5fr_2.5fr] px-1 py-1.5 cursor-pointer select-none text-center border-b border-border-subtle transition-colors
                                        ${isSelected
                                            ? "bg-bg-selected border-l-2 border-l-accent"
                                            : "hover:bg-bg-tertiary border-l-2 border-l-transparent"}`}
                                >
                                    <div className="font-mono text-xs font-bold text-txt-secondary flex items-center justify-center">
                                        {String(perm.id).padStart(3, "0")}
                                    </div>
                                    <div className="font-mono text-xs text-txt-secondary uppercase flex items-center justify-center">{perm.code}</div>
                                    <div className="font-mono text-xs text-txt-secondary uppercase flex items-center justify-center truncate px-1">{perm.name}</div>
                                    <div className="font-mono text-xs text-txt-secondary flex items-center justify-center truncate px-1">{perm.description}</div>
                                </div>
                            );
                        })}
                        {pageItems.length === 0 && (
                            <div className="py-10 text-center font-mono text-xs text-txt-disabled uppercase tracking-label">
                                No permissions found.
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="bg-bg-secondary border-t border-border-default px-4 py-1.5 shrink-0">
                    <span className="font-mono text-xs text-txt-secondary tracking-wide uppercase">
                        FOUND: {String(filtered.length).padStart(4, "0")}
                    </span>
                </div>

                {/* Pagination */}
                <div className="flex gap-2 h-10 shrink-0">
                    <button
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="flex-1 bg-bg-tertiary border border-border-default text-txt-primary font-mono font-bold text-sm tracking-wide uppercase hover:bg-bg-selected hover:border-accent transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-default rounded-none"
                    >PREV</button>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                        className="flex-1 bg-accent text-accent-fg font-mono font-bold text-sm tracking-wide uppercase hover:bg-accent-hover transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-default rounded-none"
                    >NEXT</button>
                </div>
            </div>

            {/* ── RIGHT PANEL ────────────────────────────────────── */}
            <div className="flex flex-col flex-1 bg-bg-secondary border-l border-border-default relative min-h-0">

                {/* Top actions */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-border-default shrink-0">
                    <div className="flex items-center gap-2">
                        <Key size={14} className="text-accent" />
                        <span className="font-mono text-xs font-bold text-txt-secondary uppercase tracking-label">
                            {selectedId ? "Permission Details" : "New Permission"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedId && (
                            <button
                                onClick={() => { void handleDelete(); }}
                                disabled={isSaving}
                                className="p-1.5 text-txt-secondary hover:text-status-critical border border-border-subtle hover:border-status-critical rounded-none transition-colors cursor-pointer disabled:opacity-30"
                                title="Delete Permission"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                        {selectedId && (
                            <button
                                onClick={handleEditToggle}
                                className={`px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-label rounded-none transition-colors cursor-pointer
                                    ${editMode ? "bg-bg-tertiary text-txt-primary border border-border-default" : "bg-accent text-accent-fg hover:bg-accent-hover"}`}
                            >
                                {editMode ? "Cancel" : "Edit"}
                            </button>
                        )}
                    </div>
                </div>

                {/* Form fields */}
                <div className="flex-1 px-8 pt-8 pb-4 flex flex-col gap-3 overflow-y-auto">
                    {selectedId && (
                        <TextFieldFloat
                            label="ID"
                            value={String(selectedId).padStart(3, "0")}
                            readOnly
                        />
                    )}
                    <TextFieldFloat
                        label="CODE"
                        value={form.code}
                        readOnly={!!selectedId && !editMode}
                        onChange={(e) => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                    />
                    <TextFieldFloat
                        label="PERMISSION NAME"
                        value={form.name}
                        readOnly={!!selectedId && !editMode}
                        onChange={(e) => setForm(p => ({ ...p, name: e.target.value.toUpperCase() }))}
                    />
                    <TextFieldFloat
                        label="DESCRIPTION"
                        value={form.description}
                        readOnly={!!selectedId && !editMode}
                        onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                    />
                </div>

                {/* Save / Clear */}
                <div className="px-8 py-6 shrink-0 flex flex-col gap-2">
                    {!selectedId && (
                        <button
                            onClick={() => { void handleSave(); }}
                            disabled={isSaving || !form.code || !form.name || !form.description}
                            className="w-full bg-accent text-accent-fg font-mono font-bold text-sm uppercase tracking-label py-2.5 hover:bg-accent-hover transition-colors rounded-none disabled:opacity-30 disabled:cursor-default cursor-pointer"
                        >
                            <Plus size={14} className="inline mr-2" />
                            {isSaving ? "Saving..." : "Create Permission"}
                        </button>
                    )}
                    <button
                        onClick={() => { setSelectedId(null); setEditMode(false); setForm(emptyForm); }}
                        className="w-full bg-transparent text-txt-secondary font-mono text-xs uppercase tracking-label py-2 border border-border-default hover:border-border-strong hover:text-txt-primary transition-colors rounded-none cursor-pointer"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
}


