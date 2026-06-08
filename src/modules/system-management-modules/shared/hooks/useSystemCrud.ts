import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type CrudService<TRecord, TCreate, TUpdate> = {
    findAll: () => Promise<TRecord[]>;
    create: (payload: TCreate) => Promise<TRecord>;
    update: (id: number, payload: TUpdate) => Promise<TRecord>;
    remove: (id: number) => Promise<void>;
};

export function useSystemCrud<TRecord extends { id?: number | null }, TCreate, TUpdate>(
    queryKey: readonly unknown[],
    service: CrudService<TRecord, TCreate, TUpdate>,
) {
    const queryClient = useQueryClient();
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const query = useQuery<TRecord[], Error>({
        queryKey,
        queryFn: () => service.findAll(),
    });

    const records = query.data ?? [];
    const selectedRecord = useMemo(
        () => records.find((record) => record.id != null && record.id === selectedId) ?? null,
        [records, selectedId],
    );

    const invalidate = () => queryClient.invalidateQueries({ queryKey });

    const create = useMutation({
        mutationFn: (payload: TCreate) => service.create(payload),
        onSuccess: (record) => {
            void invalidate();
            setSelectedId(record.id ?? null);
        },
    });

    const update = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: TUpdate }) => service.update(id, payload),
        onSuccess: (record) => {
            void invalidate();
            setSelectedId(record.id ?? null);
        },
    });

    const remove = useMutation({
        mutationFn: (id: number) => service.remove(id),
        onSuccess: () => {
            void invalidate();
            setSelectedId(null);
        },
    });

    return {
        query,
        records,
        selectedId,
        selectedRecord,
        selectRecord: setSelectedId,
        clearSelection: () => setSelectedId(null),
        mutations: { create, update, remove },
    };
}

export default useSystemCrud;
