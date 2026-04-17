import { useState } from "react";
import { Trash2, Search } from "lucide-react";
import { TextFieldFloat } from "../components/TextFielFloat";
import { ComboboxFloat } from "../../components/ui/combobox";
import { useResources } from "../../hooks/useResource";
import type { Resource } from "../../models/Resource";

import "../components/TextFielFloat.css";

const PAGE_SIZE = 5;

const RESOURCE_CATEGORIES = [
    "ALIMENTACIÓN",
    "BEBIDAS",
    "MEDICAMENTOS",
    "HERRAMIENTAS",
    "EQUIPAMIENTO",
    "VESTUARIO",
    "COMUNICACIONES",
    "TRANSPORTE",
    "SEGURIDAD",
    "OTROS",
] as const;

const UNITS_OF_MEASURE = [
    "UND",
    "KG",
    "G",
    "L",
    "ML",
    "M",
    "M2",
    "PAR",
    "CAJA",
    "PKG",
] as const;

type FormState = {
    code: string;
    name: string;
    category: string;
    unitOfMeasure: string;
    description: string;
    consumable: boolean;
};

const emptyForm: FormState = {
    code: "",
    name: "",
    category: "",
    unitOfMeasure: "",
    description: "",
    consumable: false,
};

export function InventoryView() {
    const { data: resources, isLoading, error, create, update, remove } = useResources();

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [page, setPage] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const selectedItem: Resource | null = resources.find((r) => r.id === selectedId) ?? null;

    const filteredResources = resources.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(r.id).includes(searchTerm)
    );

    const totalPages = Math.max(1, Math.ceil(filteredResources.length / PAGE_SIZE));
    const pageItems = filteredResources.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    const handleRowClick = (item: Resource) => {
        if (selectedId === item.id) {
            setSelectedId(null);
            setEditMode(false);
            setForm(emptyForm);
        } else {
            setSelectedId(item.id);
            setEditMode(false);
            setForm({
                code: item.code,
                name: item.name,
                category: item.category,
                unitOfMeasure: item.unitOfMeasure,
                description: item.description,
                consumable: item.consumable,
            });
        }
    };

    const handleEditToggle = () => {
        if (editMode) {
            // Cancelar: restaurar el formulario al estado actual de la selección
            if (selectedItem) {
                setForm({
                    code: selectedItem.code,
                    name: selectedItem.name,
                    category: selectedItem.category,
                    unitOfMeasure: selectedItem.unitOfMeasure,
                    description: selectedItem.description,
                    consumable: selectedItem.consumable,
                });
            } else {
                setForm(emptyForm);
            }
        }
        setEditMode((prev) => !prev);
    };

    const handleDelete = async () => {
        if (selectedId === null) return;
        setIsSaving(true);
        const ok = await remove(selectedId);
        if (ok) {
            setSelectedId(null);
            setEditMode(false);
            setForm(emptyForm);
        }
        setIsSaving(false);
    };

    const handleSave = async () => {
        if (!editMode) return;
        setIsSaving(true);
        if (selectedId !== null) {
            const ok = await update(selectedId, form);
            if (ok) setEditMode(false);
        } else {
            const ok = await create(form);
            if (ok) {
                setEditMode(false);
                setForm(emptyForm);
            }
        }
        setIsSaving(false);
    };

    const handleFieldChange = (field: keyof FormState, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="flex flex-row flex-1 min-h-0 w-full h-full overflow-hidden p-0 border border-gray-300">

            {/* ── LEFT PANEL ─────────────────────────────────────────── */}
            <div className="flex flex-col bg-white shrink-0 p-8 gap-2" style={{ width: "52%" }}>

                {/* Search bar */}
                <div className="relative w-full shrink-0">
                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                        type="text"
                        placeholder="SEARCH BY ID, CODE OR NAME..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                        className="w-full bg-[#2b2b2b] pl-16 pr-8 py-2 text-[12px] font-mono font-bold tracking-[0.2em] uppercase text-white outline-none transition-colors shadow-sm focus:bg-[#333]"
                    />
                </div>

                {/* LIST / Page indicator */}
                <div className="flex items-stretch h-8 gap-2">
                    <div className="flex-1 bg-[#2b2b2b] flex items-center px-4">
                        <span className="text-white font-bold font-ibmplex text-[16px] tracking-[0.2em] uppercase">
                            LIST
                        </span>
                    </div>
                    <div className="bg-[#c85a27] px-4 flex items-center justify-center">
                        <span className="text-black font-mono text-[16px] font-bold tracking-[0.2em]">
                            PG&#8209;{String(page + 1).padStart(2, "0")}
                        </span>
                    </div>
                </div>

                {/* Table header */}
                <div className="grid grid-cols-[0.6fr_1.2fr_2fr_1.4fr] px-1 py-1 border-b-2 border-black">
                    {["ID", "CODE", "NAME", "CATEGORY"].map((h) => (
                        <div key={h} className="text-[12px] font-mono font-bold tracking-[0.1em] text-black uppercase text-center">
                            {h.split('').join(' ')}
                        </div>
                    ))}
                </div>

                {/* Loading / error / empty states */}
                {isLoading && (
                    <div className="flex-1 flex items-center justify-center">
                        <span className="text-[11px] font-mono text-[#aaa] tracking-[0.3em] uppercase animate-pulse">Loading...</span>
                    </div>
                )}
                {!isLoading && error && (
                    <div className="flex-1 flex items-center justify-center">
                        <span className="text-[11px] font-mono text-[#ff4444] tracking-[0.2em] uppercase">{error}</span>
                    </div>
                )}

                {/* Table rows */}
                {!isLoading && !error && (
                    <div className="flex-1 overflow-y-auto">
                        {pageItems.map((item) => {
                            const isSelected = selectedId === item.id;
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => handleRowClick(item)}
                                    className={`grid grid-cols-[0.6fr_1.2fr_2fr_1.4fr] px-1 py-1 cursor-pointer select-none text-center
                                        ${isSelected
                                            ? "bg-[#d4d4d4] border-l-[3px] border-[#c85a27]"
                                            : "hover:bg-gray-100 border-l-[3px] border-transparent"}`}
                                >
                                    <div className="text-[11px] font-mono text-black flex items-center justify-center">{item.id}</div>
                                    <div className="text-[11px] font-mono text-black flex items-center justify-center">{item.code}</div>
                                    <div className="text-[11px] font-mono text-black uppercase flex items-center justify-center">{item.name}</div>
                                    <div className="text-[11px] font-mono text-black flex items-center justify-center">{item.category}</div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Footer stats */}
                <div className="bg-[#2b2b2b] px-4">
                    <span className="text-[10px] font-mono text-gray-400 tracking-[0.2em] uppercase">
                        FOUND: {String(filteredResources.length).padStart(4, "0")}
                    </span>
                </div>

                {/* Pagination buttons */}
                <div className="flex gap-2 h-10">
                    <button
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="flex-1 bg-[#c85a27] text-black text-[15px] font-mono font-bold tracking-[0.35em] uppercase
                            hover:bg-[#b04a1d] transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-default"
                    >
                        PREVIUS
                    </button>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                        className="flex-1 bg-[#0f0f0f] text-white text-[15px] font-mono font-bold tracking-[0.35em] uppercase
                            hover:bg-[#2a2a2e] transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-default"
                    >
                        NEXT
                    </button>
                </div>
            </div>

            {/* ── RIGHT PANEL ────────────────────────────────────────── */}
            <div className="flex flex-col flex-1 bg-[#2b2b2b] relative min-h-0 border-l border-gray-800">

                {/* Top action bar */}
                <div
                    className={`absolute top-0 left-0 w-28 h-28 z-10 transition-opacity
                        ${selectedId !== null && !isSaving ? "cursor-pointer hover:brightness-110" : "cursor-default opacity-30"}`}
                    onClick={selectedId !== null && !isSaving ? () => { void handleDelete(); } : undefined}
                    title={selectedId !== null ? "Eliminar registro seleccionado" : "Sin selección"}
                >
                    <Trash2 size={24} color="#c85a27" strokeWidth={2} className="absolute top-4 left-4" />
                </div>
                <div className="flex justify-end p-8 z-10 shrink-0">
                    <button
                        onClick={handleEditToggle}
                        disabled={isSaving}
                        className={`px-10 text-[14px] font-mono font-bold tracking-[0.2em] uppercase transition-colors cursor-pointer
                            disabled:opacity-40 disabled:cursor-default
                            ${editMode
                                ? "bg-white text-[#c85a27] hover:bg-gray-200"
                                : "bg-[#c85a27] text-black hover:bg-[#b04a1d]"}`}
                    >
                        {editMode ? "CANCEL" : "EDITAR"}
                    </button>
                </div>

                {/* Form fields */}
                <div className="flex-1 px-20 pt-10 pb-4 flex flex-col gap-2 overflow-y-auto">

                    <TextFieldFloat
                        label="ID"
                        value={selectedItem ? String(selectedItem.id) : ""}
                        readOnly
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <TextFieldFloat
                            label="CODE"
                            value={form.code}
                            readOnly={!editMode}
                            onChange={(e) => handleFieldChange("code", e.target.value)}
                        />
                        <TextFieldFloat
                            label="NAME"
                            value={form.name}
                            readOnly={!editMode}
                            onChange={(e) => handleFieldChange("name", e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <ComboboxFloat
                            label="CATEGORY"
                            value={form.category}
                            options={RESOURCE_CATEGORIES}
                            readOnly={!editMode}
                            onChange={(val) => handleFieldChange("category", val)}
                        />
                        <ComboboxFloat
                            label="UNIT"
                            value={form.unitOfMeasure}
                            options={UNITS_OF_MEASURE}
                            readOnly={!editMode}
                            onChange={(val) => handleFieldChange("unitOfMeasure", val)}
                        />
                    </div>

                    <TextFieldFloat
                        label="DESCRIPTION"
                        value={form.description}
                        readOnly={!editMode}
                        onChange={(e) => handleFieldChange("description", e.target.value)}
                    />

                    {/* Consumable toggle */}
                    <div className="flex items-center gap-4 mt-2">
                        <label className="text-[10px] text-[#a0a0a0] font-mono uppercase tracking-[0.2em]">CONSUMABLE</label>
                        <button
                            disabled={!editMode}
                            onClick={() => setForm(prev => ({ ...prev, consumable: !prev.consumable }))}
                            className={`px-4 py-1 text-[11px] font-mono font-bold tracking-widest uppercase transition-colors
                                ${form.consumable ? "bg-[#c85a27] text-black" : "bg-[#1e1e1e] text-gray-400 border border-gray-600"}
                                ${!editMode ? "opacity-40 cursor-default" : "cursor-pointer"}`}
                        >
                            {form.consumable ? "YES" : "NO"}
                        </button>
                    </div>
                </div>

                {/* Save/Clear buttons */}
                <div className="px-16 py-8 shrink-0 flex flex-col items-center gap-3">
                    <button
                        onClick={() => { void handleSave(); }}
                        disabled={!editMode || isSaving}
                        className="w-full max-w-[400px] bg-[#c85a27] text-black font-ibmplex text-[16px] font-bold tracking-[0.2em] uppercase py-2
                            hover:bg-[#b04a1d] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default"
                    >
                        {isSaving ? "SAVING..." : "SAVE AND SUBMIT"}
                    </button>
                    <button
                        onClick={() => { setForm(emptyForm); setSelectedId(null); setEditMode(false); }}
                        disabled={isSaving}
                        className="w-full max-w-[400px] bg-transparent text-[#c85a27] border-2 border-[#c85a27] font-ibmplex text-[14px] font-bold tracking-[0.2em] uppercase py-1.5
                            hover:bg-[#c85a27] hover:text-black transition-colors cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#c85a27] disabled:cursor-default"
                    >
                        CLEAR FORM
                    </button>
                </div>
            </div>
        </div>
    );
}

