import type { ProfessionFormValues } from "../schemas/profession.schema";

type UseProfessionTableParams = {
    professions: ProfessionFormValues[];
    selectedId?: number | null;
    onSelect?: (profession: ProfessionFormValues | undefined) => void;
};

export function useProfessionTable({
    professions,
    selectedId = null,
    onSelect,
}: UseProfessionTableParams) {
    const handleSelect = (profession: ProfessionFormValues) => {
        if (profession.id === selectedId) {
            onSelect?.(undefined);
            return;
        }

        onSelect?.(profession);
    };

    return {
        professions,
        selectedId,
        handleSelect,
    };
}
