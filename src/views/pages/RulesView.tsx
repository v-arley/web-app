import { useState } from "react";
import { Plus, GitMerge, Trash2, List } from "lucide-react";
import { useRules } from "../../hooks/useRule";
import type { CreateRule } from "../../models/Rule";

export function RulesView() {
    const { data: rules, isLoading, error, create, remove } = useRules();

    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const filteredRules = rules.filter((r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(r.id).includes(searchTerm)
    );

    const handleCreateRule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || !newDesc) return;
        const payload: CreateRule = { name: newName, description: newDesc };
        setIsSaving(true);
        const ok = await create(payload);
        if (ok) {
            setNewName("");
            setNewDesc("");
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: number) => {
        await remove(id);
    };

    return (
        <div className="flex flex-col w-full relative">
            {/* Form */}
            <div className="overflow-hidden bg-[#F1F1F1]">
                <div className="px-4 py-2 flex items-center gap-2">
                    <GitMerge size={18} className="text-[#f05a28]" />
                    <h3 className="font-bold font-ibmplex uppercase tracking-wider text-sm">
                        Create New Rule
                    </h3>
                </div>
                <div className="px-4 py-2">
                    <form onSubmit={handleCreateRule} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 flex flex-col gap-2 w-full">
                            <label className="text-xs font-bold font-mono text-gray-500 uppercase tracking-widest">
                                Rule Name
                            </label>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="e.g. Prevent Login"
                                className="w-full px-4 py-2.5 bg-gray-50 focus:ring-2 focus:ring-[#f05a28] focus:bg-white outline-none transition-all text-sm font-medium"
                                required
                            />
                        </div>
                        <div className="flex-[2] flex flex-col gap-2 w-full">
                            <label className="text-xs font-bold font-mono text-gray-500 uppercase tracking-widest">
                                Description
                            </label>
                            <input
                                type="text"
                                value={newDesc}
                                onChange={(e) => setNewDesc(e.target.value)}
                                placeholder="e.g. Description of what this rule does"
                                className="w-full px-4 py-2.5 bg-gray-50 focus:ring-2 focus:ring-[#f05a28] focus:bg-white outline-none transition-all text-sm font-medium"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 font-bold text-white bg-black hover:bg-[#f05a28] shadow-md hover:shadow-lg transition-all uppercase text-xs tracking-wider h-[42px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus size={16} />
                            {isSaving ? "Saving..." : "Create"}
                        </button>
                    </form>
                </div>
            </div>

            {/* List */}
            <div className="overflow-hidden flex flex-col">
                <div className="px-4 py-2 flex items-center gap-2">
                    <List size={18} className="text-[#f05a28]" />
                    <h3 className="font-bold text-gray-900 font-ibmplex uppercase tracking-wider text-sm">
                        System Rules
                    </h3>
                </div>

                <div className="px-4 py-2 flex items-center justify-center w-full">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Enter rule name or ID to search..."
                        className="w-full px-4 py-2.5 bg-gray-50 font-mono focus:ring-2 focus:ring-[#f05a28] focus:bg-white outline-none transition-all text-sm font-medium"
                    />
                </div>
                
                <div className="overflow-x-auto">
                    {isLoading && (
                        <div className="px-6 py-8 text-center">
                            <span className="text-xs font-mono text-gray-400 tracking-widest uppercase animate-pulse">Loading...</span>
                        </div>
                    )}
                    {!isLoading && error && (
                        <div className="px-6 py-8 text-center">
                            <span className="text-xs font-mono text-red-500 tracking-widest uppercase">{error}</span>
                        </div>
                    )}
                    {!isLoading && !error && (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="">
                                <th className="px-6 py-2 text-xs font-mono font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">ID</th>
                                <th className="px-6 py-2 text-xs font-mono font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Rule Name</th>
                                <th className="px-6 py-2 text-xs font-mono font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap hidden sm:table-cell">Description</th>
                                <th className="px-6 py-2 text-xs font-mono font-bold text-gray-500 uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {filteredRules.map((rule) => (
                                <tr key={rule.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="px-6 py-2">
                                        <span className="font-mono text-xs font-bold text-[#f05a28] bg-[#f05a28]/10 px-2 py-1.5">
                                            {String(rule.id).padStart(3, "0")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-2">
                                        <span className="text-xs text-[#f05a28] font-ibmplex uppercase">{rule.name}</span>
                                    </td>
                                    <td className="px-6 py-2 hidden sm:table-cell">
                                        <span className="font-mono text-xs text-gray-600 max-w-xs md:max-w-md truncate block">
                                            {rule.description}
                                        </span>
                                    </td>
                                    <td className="px-6 py-2 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => { void handleDelete(rule.id); }}
                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors shadow-none hover:shadow-sm"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )}
                </div>
            </div>
        </div>
    );
}
