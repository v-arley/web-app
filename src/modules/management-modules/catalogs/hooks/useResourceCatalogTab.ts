import { useMemo, useState } from "react";
import type { ResourceFormValues } from "../schemas/resource.schema";
import { useResourceMutations } from "./useResourceMutations";
import { useResourceQuery } from "./useResourceQuery";
import { useDebounce } from "../../../../hooks/useDebounce";

type CatalogCallbacks = {
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
};

export function useResourceCatalogTab(enabled = true, callbacks: CatalogCallbacks = {}) {
    const { query } = useResourceQuery(enabled);
    const mutations = useResourceMutations();
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<ResourceFormValues | undefined>();

    const allRecords = useMemo(() => query.data ?? [], [query.data]);
    const debouncedSearch = useDebounce(search, 500);
    const normalizedSearch = debouncedSearch.trim().toLowerCase();

    const filteredRecords = useMemo(() => {
        if (!normalizedSearch) {
            return allRecords;
        }

        return allRecords.filter((record) => {
            const fields = [record.code, record.name, record.category, record.unitOfMeasure];
            return fields.some((field) => field.toLowerCase().includes(normalizedSearch));
        });
    }, [allRecords, normalizedSearch]);

    const selectById = (record: ResourceFormValues | undefined) => {
        setSelected(record);
    };

    const handleSave = async (payload: ResourceFormValues): Promise<boolean> => {
        try {
            if (selected?.id) {
                await mutations.update.mutateAsync({ id: selected.id, data: payload });
                callbacks.onSuccess?.("Recurso actualizado correctamente.");
            } else {
                await mutations.create.mutateAsync(payload);
                callbacks.onSuccess?.("Recurso creado correctamente.");
            }

            setSelected(undefined);
            return true;
        } catch (error) {
            callbacks.onError?.(error instanceof Error ? error.message : "No se pudo guardar el recurso.");
            return false;
        }
    };

    const handleDelete = async (record: ResourceFormValues): Promise<void> => {
        if (!record.id) {
            callbacks.onError?.("No se puede eliminar un recurso sin identificador.");
            return;
        }

        try {
            await mutations.remove.mutateAsync(record.id);
            callbacks.onSuccess?.("Recurso eliminado correctamente.");
            setSelected(undefined);
        } catch (error) {
            callbacks.onError?.(error instanceof Error ? error.message : "No se pudo eliminar el recurso.");
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