import { useMemo, useState } from "react";
import type { AchievementFormValues } from "../schemas/achievement.schema";
import { useAchievementMutations } from "./useAchievementMutations";
import { useAchievementQuery } from "./useAchievementQuery";
import { useDebounce } from "../../../../hooks/useDebounce";

type CatalogCallbacks = {
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
};

export function useAchievementCatalogTab(enabled = true, callbacks: CatalogCallbacks = {}) {
    const { query } = useAchievementQuery(enabled);
    const mutations = useAchievementMutations();
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<AchievementFormValues | undefined>();

    const allRecords = useMemo(() => query.data ?? [], [query.data]);
    const debouncedSearch = useDebounce(search, 500);
    const normalizedSearch = debouncedSearch.trim().toLowerCase();

    const filteredRecords = useMemo(() => {
        if (!normalizedSearch) {
            return allRecords;
        }

        return allRecords.filter((record) => {
            const fields = [record.code, record.name, record.category ?? "", record.condition_logic];
            return fields.some((field) => field.toLowerCase().includes(normalizedSearch));
        });
    }, [allRecords, normalizedSearch]);

    const selectById = (record: AchievementFormValues | undefined) => {
        setSelected(record);
    };

    const handleSave = async (payload: AchievementFormValues): Promise<boolean> => {
        try {
            if (selected?.id) {
                await mutations.update.mutateAsync({ id: selected.id, data: payload });
                callbacks.onSuccess?.("Logro actualizado correctamente.");
            } else {
                await mutations.create.mutateAsync(payload);
                callbacks.onSuccess?.("Logro creado correctamente.");
            }

            setSelected(undefined);
            return true;
        } catch (error) {
            callbacks.onError?.(error instanceof Error ? error.message : "No se pudo guardar el logro.");
            return false;
        }
    };

    const handleDelete = async (record: AchievementFormValues): Promise<void> => {
        if (!record.id) {
            callbacks.onError?.("No se puede eliminar un logro sin identificador.");
            return;
        }

        try {
            await mutations.remove.mutateAsync(record.id);
            callbacks.onSuccess?.("Logro eliminado correctamente.");
            setSelected(undefined);
        } catch (error) {
            callbacks.onError?.(error instanceof Error ? error.message : "No se pudo eliminar el logro.");
        }
    };

    const handleClear = () => {
        setSelected(undefined);
    };

    return {
        allRecords,
        filteredRecords,
        selected,
        search,
        setSearch,
        selectById,
        handleSave,
        handleDelete,
        handleClear,
        isLoading: query.isLoading,
        isBusy: mutations.create.isPending || mutations.update.isPending || mutations.remove.isPending,
        error: query.error,
    };
}