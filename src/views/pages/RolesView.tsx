import { useState } from "react";
import { Plus, Shield, Trash2, Edit2, Key, List } from "lucide-react";
import { ModalPerms } from "./ModalPerms";

interface Role {
    id: string;
    name: string;
    description: string;
    usersCount: number;
}

const INITIAL_ROLES: Role[] = [
    { id: "R-001", name: "Administrator", description: "Full system access and configurations", usersCount: 2 },
    { id: "R-002", name: "Commander", description: "Oversight of camp operations and personnel", usersCount: 5 },
    { id: "R-003", name: "Logistics Officer", description: "Manages warehouse and resource routing", usersCount: 12 },
    { id: "R-004", name: "Field Operative", description: "Executes tasks and explorations", usersCount: 48 },
];

export function RolesView() {
    const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
    const [newRoleName, setNewRoleName] = useState("");
    const [newRoleDesc, setNewRoleDesc] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoleForPerms, setSelectedRoleForPerms] = useState<string | null>(null);

    const handleCreateRole = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRoleName || !newRoleDesc) return;

        const newRole: Role = {
            id: `R-00${roles.length + 1}`,
            name: newRoleName,
            description: newRoleDesc,
            usersCount: 0
        };

        setRoles([...roles, newRole]);
        setNewRoleName("");
        setNewRoleDesc("");
    };

    return (
        <div className="flex flex-col w-full relative">
            {/* Section 1: Create Role Form */}
            <div className="overflow-hidden bg-[#F1F1F1]">

                <div className="px-4 py-2 flex items-center gap-2">
                    <Shield size={18} className="text-[#f05a28]" />
                    <h3 className="font-bold font-ibmplex uppercase tracking-wider text-sm">
                        Create New Role
                    </h3>
                </div>

                <div className="px-4 py-2">
                    <form onSubmit={handleCreateRole} className="flex flex-col md:flex-row gap-4 items-end">
                        {/* Implementar una label para mostrar el id, casos: si se created uno nuevo se muestra un valor vacio, si se edita uno existente se muestra el id */}
                        <div className="flex-1 flex flex-col gap-2 w-full">
                            <label className="text-xs font-bold font-mono text-gray-500 uppercase tracking-widest">
                                Role Name
                            </label>
                            <input
                                type="text"
                                value={newRoleName}
                                onChange={(e) => setNewRoleName(e.target.value)}
                                placeholder="e.g. Medical Staff"
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
                                value={newRoleDesc}
                                onChange={(e) => setNewRoleDesc(e.target.value)}
                                placeholder="Brief description of responsibilities..."
                                className="w-full px-4 py-2.5 bg-gray-50 focus:ring-2 focus:ring-[#f05a28] focus:bg-white outline-none transition-all text-sm font-medium"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 font-bold text-white bg-black hover:bg-[#f05a28] shadow-md hover:shadow-lg transition-all uppercase text-xs tracking-wider h-[42px]"
                        >
                            <Plus size={16} />
                            Create
                        </button>
                    </form>
                </div>
            </div>

            {/* Section 2: Roles List */}
            <div className="overflow-hidden flex flex-col">

                {/* Header */}
                <div className="px-4 py-2 flex items-center gap-2">
                    <List size={18} className="text-[#f05a28]" />
                    <h3 className="font-bold text-gray-900 font-ibmplex uppercase tracking-wider text-sm">
                        System Roles
                    </h3>
                    {/* <span className="bg-gray-300 text-gray-700 px-3 py-1 text-xs font-bold font-mono shadow-inner">
                        {roles.length} TOTAL
                    </span>
                    <input
                        type="text"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        placeholder="Search role..."
                        className="w-100 px-4 py-2.5 bg-gray-50 focus:ring-2 focus:ring-[#f05a28] focus:bg-white outline-none transition-all text-sm font-medium"
                    /> */}
                </div>

                <div className="px-4 py-2 flex items-center justify-center w-full">
                    <input
                        type="text"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        placeholder="Enter role name or ID to search..."
                        className="w-full px-4 py-2.5 bg-gray-50 font-mono focus:ring-2 focus:ring-[#f05a28] focus:bg-white outline-none transition-all text-sm font-medium"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="">
                                <th className="px-6 py-2 text-xs font-mono font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">ID</th>
                                <th className="px-6 py-2 text-xs font-mono font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Role Name</th>
                                <th className="px-6 py-2 text-xs font-mono font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap hidden sm:table-cell">Description</th>
                                <th className="px-6 py-2 text-xs font-mono font-bold text-gray-500 uppercase tracking-widest text-center whitespace-nowrap">Active Users</th>
                                <th className="px-6 py-2 text-xs font-mono font-bold text-gray-500 uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {roles.map((role) => (
                                <tr key={role.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="px-6 py-2">
                                        <span className="font-mono text-xs font-bold text-[#f05a28] bg-[#f05a28]/10 px-2 py-1.5">
                                            {role.id}
                                        </span>
                                    </td>
                                    <td className="px-6 py-2">
                                        <span className="text-xs text-[#f05a28] font-ibmplex uppercase">{role.name}</span>
                                    </td>
                                    <td className="px-6 py-2 hidden sm:table-cell">
                                        <span className="font-mono text-xs text-gray-600 max-w-xs md:max-w-md truncate block">
                                            {role.description}
                                        </span>
                                    </td>
                                    <td className="px-6 py-2 text-center">
                                        <span className="font-ibmplex inline-flex items-center justify-center text-gray-700 font-bold text-xs">
                                            {role.usersCount}
                                        </span>
                                    </td>
                                    <td className="px-6 py-2 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => { setSelectedRoleForPerms(role.name); setIsModalOpen(true); }}
                                                className="p-2 text-gray-400 hover:text-[#f05a28] hover:bg-orange-50 transition-colors shadow-none hover:shadow-sm"
                                                title="Manage Permissions"
                                            >
                                                <Key size={16} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors shadow-none hover:shadow-sm">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors shadow-none hover:shadow-sm">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {roles.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-mono text-sm">
                                        No roles found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ModalPerms
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                roleName={selectedRoleForPerms}
            />
        </div>
    );
}