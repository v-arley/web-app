import { useState, useEffect } from "react";
import { X, Save, Key } from "lucide-react";

interface ModalPermsProps {
    isOpen: boolean;
    onClose: () => void;
    roleName: string | null;
}

const AVAILABLE_PERMS = [
    { id: "P-001", resource: "Users",       action: "CREATE"    },
    { id: "P-002", resource: "Users",       action: "READ"      },
    { id: "P-003", resource: "Settings",    action: "UPDATE"    },
    { id: "P-004", resource: "Inventory",   action: "DELETE"    },
    { id: "P-005", resource: "Inventory",   action: "READ"      },
    { id: "P-006", resource: "Inventory",   action: "UPDATE"    },
    { id: "P-007", resource: "Alerts",      action: "READ"      },
];

export function ModalPerms({ isOpen, onClose, roleName }: ModalPermsProps) {
    const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            // Mock pre-selected permissions can be set here if we had them
            setSelectedPerms(["P-002", "P-005"]);
        }
    }, [isOpen, roleName]);

    if (!isOpen) return null;

    const handleTogglePerm = (id: string) => {
        setSelectedPerms(prev => 
            prev.includes(id) 
                ? prev.filter(p => p !== id)
                : [...prev, id]
        );
    };

    const handleToggleAll = () => {
        if (selectedPerms.length === AVAILABLE_PERMS.length) {
            setSelectedPerms([]);
        } else {
            setSelectedPerms(AVAILABLE_PERMS.map(p => p.id));
        }
    };

    const handleSave = () => {
        // Here you would trigger an API call or state update
        console.log(`Saved perms for ${roleName}: `, selectedPerms);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none focus:outline-none">
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
                aria-hidden="true"
            />

            <div className="relative w-full max-w-2xl bg-bg-primary border border-border-default flex flex-col overflow-hidden transform transition-all">
                <div className="flex items-center justify-between px-6 py-4 bg-bg-secondary border-b border-border-default">
                    <div className="flex items-center gap-3">
                        <Key size={20} className="text-accent" />
                        <div>
                            <h3 className="text-[14px] font-bold text-txt-primary font-mono uppercase tracking-[0.1em]">
                                Manage Permissions
                            </h3>
                            {roleName && (
                                <p className="text-xs text-txt-secondary font-medium">Role: <span className="font-bold text-txt-primary">{roleName}</span></p>
                            )}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close permissions modal"
                        title="Close permissions modal"
                        className="p-1.5 text-txt-disabled hover:text-txt-primary hover:bg-bg-tertiary transition-colors"
                        >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[60vh] p-0">
                    <table className="w-full text-left">
                        <thead className="sticky top-0 bg-bg-primary z-10">
                            <tr className="bg-bg-secondary">
                                <th className="px-6 py-3 w-16 text-center">
                                    <input
                                        type="checkbox"
                                        aria-label="Select all permissions"
                                        title="Select all permissions"
                                        className="w-4 h-4 text-accent focus:ring-accent cursor-pointer"
                                        checked={selectedPerms.length === AVAILABLE_PERMS.length && selectedPerms.length > 0}
                                        onChange={handleToggleAll}
                                    />
                                </th>
                                <th className="px-6 py-3 text-[11px] font-bold text-txt-secondary uppercase tracking-widest">ID</th>
                                <th className="px-6 py-3 text-[11px] font-bold text-txt-secondary uppercase tracking-widest">Resource</th>
                                <th className="px-6 py-3 text-[11px] font-bold text-txt-secondary uppercase tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {AVAILABLE_PERMS.map(perm => (
                                <tr key={perm.id} className="hover:bg-bg-tertiary transition-colors border-b border-border-subtle">
                                    <td className="px-6 py-3 text-center">
                                       <input
                                            type="checkbox"
                                            aria-label={`Select permission ${perm.resource} ${perm.action}`}
                                            title={`Select permission ${perm.resource} ${perm.action}`}
                                            className="w-4 h-4 text-accent focus:ring-accent cursor-pointer"
                                            checked={selectedPerms.includes(perm.id)}
                                            onChange={() => handleTogglePerm(perm.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-3 font-mono text-xs text-txt-secondary font-bold">{perm.id}</td>
                                    <td className="px-6 py-3 text-sm font-bold text-txt-primary">{perm.resource}</td>
                                    <td className="px-6 py-3">
                                        <span className="font-mono font-bold text-[10px] bg-bg-tertiary border border-border-default px-2 py-1.5 text-txt-primary uppercase">
                                            {perm.action}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 bg-bg-secondary border-t border-border-default flex justify-between items-center">
                    <span className="text-xs uppercase tracking-widest font-mono font-bold text-txt-disabled">
                        {selectedPerms.length} Selected
                    </span>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2 font-bold text-txt-secondary bg-bg-tertiary border border-border-default hover:bg-bg-selected transition-colors uppercase text-[11px] tracking-wider font-mono"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-2 font-bold text-accent-fg bg-accent hover:bg-accent-hover transition-all uppercase text-[11px] tracking-wider font-mono"
                        >
                            <Save size={14} />
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
