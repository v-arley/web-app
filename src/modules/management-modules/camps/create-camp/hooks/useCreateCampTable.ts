import { useState } from "react";

export function useCreateCampTable() {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const selectCamp = (id: number | null) => {
        setSelectedId((current) => (current === id ? null : id));
    };

    const clearSelection = () => {
        setSelectedId(null);
    };

    return {
        selectedId,
        selectCamp,
        clearSelection,
    };
}
