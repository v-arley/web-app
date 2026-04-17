import { useState } from "react";
import { Plus, Key, Trash2, List } from "lucide-react";
import { usePermissions } from "../../hooks/usePermission";
import type { CreatePermission } from "../../models/Permision";

export function PermsView() {
    const { data: perms, isLoading, error, create, remove } = usePermissions();

    const [newCode, setNewCode] = useState("");
    const [newNameField, setNewNameField] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const filteredPerms = perms.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(p.id).includes(searchTerm)
    );

    const handleCreatePerm = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCode || !newNameField || !newDesc) return;
        const payload: CreatePermission = {
            code: newCode.toUpperCase(),
            name: newNameField.toUpperCase(),
            description: newDesc,
        };
        setIsSaving(true);
        const ok = await create(payload);
        if (ok) {
            setNewCode("");
            setNewNameField("");
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
                    <Key size={18} className="text-[#f05a28]" />
                    <h3 className="font-bold font-ibmplex uppercase tracking-wider text-sm">
                        Create New Permission
                    </h3>
                </div>
                <div className="px-4 py-2">
                    <form onSubmit={handleCreatePerm} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 flex flex-col gap-2 w-full">
                            <label className="text-xs font-bold font-mono text-gray-500 uppercase tracking-widest">
                                Code
                            </label>
                            <input
                                type="text"
                                value={newCode}
                                onChange={(e) => setNewCode(e.target.value)}
                                placeholder="e.g. USR-01"
                                className="w-full px-4 py-2.5 bg-gray-50 focus:ring-2 focus:ring-[#f05a28] focus:bg-white outline-none transition-all text-sm font-medium uppercase"
                                required
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-2 w-full">
                            <label className="text-xs font-bold font-mono text-gray-500 uppercase tracking-widest">
                                Perm Name
                            </label>
                            <input
                                type="text"
                                value={newNameField}
                                onChange={(e) => setNewNameField(e.target.value)}
                                placeholder="e.g. CREATE_USER"
                                className="w-full px-4 py-2.5 bg-gray-50 focus:ring-2 focus:ring-[#f05a28] focus:bg-white outline-none transition-all text-sm font-medium uppercase"
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
                                placeholder="Brief description..."
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
                        System Permissions
                    </h3>
                </div>

                <div className="px-4 py-2 flex items-center justify-center w-full">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Enter permission name or code to search..."
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
                                <th className="px-6 py-2 text-xs font-mono font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Code</th>
                                <th className="px-6 py-2 text-xs font-mono font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Name</th>
                                <th className="px-6 py-2 text-xs font-mono font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap hidden sm:table-cell">Description</th>
                                <th className="px-6 py-2 text-xs font-mono font-bold text-gray-500 uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {filteredPerms.map((perm) => (
                                <tr key={perm.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="px-6 py-2">
                                        <span className="font-mono text-xs font-bold text-[#f05a28] bg-[#f05a28]/10 px-2 py-1.5">
                                            {String(perm.id).padStart(3, "0")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-2">
                                        <span className="text-xs text-[#f05a28] font-ibmplex uppercase">{perm.code}</span>
                                    </td>
                                    <td className="px-6 py-2">
                                        <span className="font-mono font-bold text-[11px] bg-gray-100 px-2.5 py-1 text-gray-700">
                                            {perm.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-2 hidden sm:table-cell">
                                        <span className="font-mono text-xs text-gray-600 max-w-xs md:max-w-md truncate block">
                                            {perm.description}
                                        </span>
                                    </td>
                                    <td className="px-6 py-2 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => { void handleDelete(perm.id); }}
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
