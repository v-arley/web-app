// hooks/useResources.ts
import { useEffect, useState, useCallback } from "react";
import { ResourceService } from "../services/ResourceService";
import type { Resource, CreateResource, UpdateResource } from "../models/Resource";

const service = new ResourceService();

export function useResources() {
    const [data, setData] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ── Cargar lista ─────────────────────────────────────────
    const load = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const res = await service.findAll();
            if (!res.getEstado()) {
                setError(res.getMensaje());
                return;
            }

            const items = res.getResultado<Resource[]>("registros") ?? [];
            setData(items);
        } catch {
            setError("No fue posible cargar los recursos.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ── Crear ────────────────────────────────────────────────
    const create = useCallback(async (payload: CreateResource): Promise<boolean> => {
        try {
            const res = await service.save(payload);
            if (!res.getEstado()) {
                setError(res.getMensaje());
                return false;
            }
            await load();
            return true;
        } catch {
            setError("No fue posible crear el recurso.");
            return false;
        }
    }, [load]);

    // ── Actualizar ───────────────────────────────────────────
    const update = useCallback(async (id: number, payload: UpdateResource): Promise<boolean> => {
        try {
            const res = await service.update(id, payload);
            if (!res.getEstado()) {
                setError(res.getMensaje());
                return false;
            }
            await load();
            return true;
        } catch {
            setError("No fue posible actualizar el recurso.");
            return false;
        }
    }, [load]);

    // ── Eliminar ─────────────────────────────────────────────
    const remove = useCallback(async (id: number): Promise<boolean> => {
        try {
            const res = await service.remove(id);
            if (!res.getEstado()) {
                setError(res.getMensaje());
                return false;
            }
            await load();
            return true;
        } catch {
            setError("No fue posible eliminar el recurso.");
            return false;
        }
    }, [load]);

    useEffect(() => {
        void load();
    }, [load]);

    return {
        data,
        isLoading,
        error,
        reload: load,
        create,
        update,
        remove,
    };
}

