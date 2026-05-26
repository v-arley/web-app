import { useMemo, useState } from "react";
import type { ProfessionFormValues } from "../schemas/profession.schema";
import { useProfessionMutations } from "./useProfessionMutations";
import { useProfessionQuery } from "./useProfessionQuery";
import { useDebounce } from "../../../../shared/hooks/useDebounce";

type CatalogCallbacks = {
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
};

export function useProfessionCatalogTab(enabled = true, callbacks: CatalogCallbacks = {}) {
    const { query } = useProfessionQuery(enabled);
    const mutations = useProfessionMutations();
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<ProfessionFormValues | undefined>();

    const allRecords = useMemo(() => query.data ?? [], [query.data]);
    const debouncedSearch = useDebounce(search, 500);
    const normalizedSearch = debouncedSearch.trim().toLowerCase();

    const filteredRecords = useMemo(() => {
        if (!normalizedSearch) {
            return allRecords;
        }

        return allRecords.filter((record) => {
            const fields = [
                record.code,
                record.name,
                record.description ?? "",
                String(record.default_resource_id ?? ""),
            ];
            return fields.some((field) => field.toLowerCase().includes(normalizedSearch));
        });
    }, [allRecords, normalizedSearch]);

    const selectById = (record: ProfessionFormValues | undefined) => {
        setSelected(record);
    };

    const handleSave = async (payload: ProfessionFormValues): Promise<boolean> => {
        try {
            if (selected?.id) {
                await mutations.update.mutateAsync({ id: selected.id, data: payload });
                callbacks.onSuccess?.("Profesion actualizada correctamente.");
            } else {
                await mutations.create.mutateAsync(payload);
                callbacks.onSuccess?.("Profesion creada correctamente.");
            }

            setSelected(undefined);
            return true;
        } catch (error) {
            callbacks.onError?.(error instanceof Error ? error.message : "No se pudo guardar la profesion.");
            return false;
        }
    };

    const handleDelete = async (record: ProfessionFormValues): Promise<void> => {
        if (!record.id) {
            callbacks.onError?.("No se puede eliminar una profesion sin identificador.");
            return;
        }

        try {
            await mutations.remove.mutateAsync(record.id);
            callbacks.onSuccess?.("Profesion eliminada correctamente.");
            setSelected(undefined);
        } catch (error) {
            callbacks.onError?.(error instanceof Error ? error.message : "No se pudo eliminar la profesion.");
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