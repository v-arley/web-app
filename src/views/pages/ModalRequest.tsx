import React, { useState } from "react";
import { X, Save } from "lucide-react";

export interface RequestFormData {
    targetCamp: string;
    resourceType: string;
    amount: number;
}

interface ModalRequestProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: RequestFormData) => void;
}

// Mock categories
const CAMP_OPTIONS = [
    "Camp Alpha - Forward Base",
    "Camp Beta - Logistics Server",
    "Camp Gamma - Research Outpost",
    "Camp Delta - Medical Center"
];

const RESOURCE_OPTIONS = [
    "Water Rations (L)",
    "Energy Cells (kWh)",
    "Medical Supplies (Kits)",
    "Food Rations (kg)",
    "Construction Material (Tons)"
];

export function ModalRequest({ isOpen, onClose, onSubmit }: ModalRequestProps) {
    const [targetCamp, setTargetCamp] = useState("");
    const [resourceType, setResourceType] = useState("");
    const [amount, setAmount] = useState<number | "">("");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetCamp || !resourceType || !amount) return;

        onSubmit({
            targetCamp,
            resourceType,
            amount: Number(amount),
        });

        // Reset
        setTargetCamp("");
        setResourceType("");
        setAmount("");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none focus:outline-none">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col overflow-hidden transform transition-all">
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-900 font-mono uppercase tracking-wider">
                        New Resource Request
                    </h3>
                    <button 
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                Target Camp
                            </label>
                            <select
                                value={targetCamp}
                                onChange={(e) => setTargetCamp(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 focus:ring-2 focus:ring-[#f05a28] focus:bg-white outline-none transition-all text-sm font-medium"
                                required
                            >
                                <option value="" disabled>Select target camp...</option>
                                {CAMP_OPTIONS.map((camp) => (
                                    <option key={camp} value={camp}>{camp}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                Resource Type
                            </label>
                            <select
                                value={resourceType}
                                onChange={(e) => setResourceType(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 focus:ring-2 focus:ring-[#f05a28] focus:bg-white outline-none transition-all text-sm font-medium"
                                required
                            >
                                <option value="" disabled>Select resource type...</option>
                                {RESOURCE_OPTIONS.map((res) => (
                                    <option key={res} value={res}>{res}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                Amount
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                                placeholder="Enter amount..."
                                className="w-full px-4 py-2.5 bg-gray-50 focus:ring-2 focus:ring-[#f05a28] focus:bg-white outline-none transition-all text-sm font-medium"
                                required
                            />
                        </div>

                        <div className="mt-4 flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors uppercase text-xs tracking-wider"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-6 py-2 font-bold text-white bg-black hover:bg-[#f05a28] shadow-md hover:shadow-lg transition-all uppercase text-xs tracking-wider"
                            >
                                <Save size={16} />
                                Submit Request
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
