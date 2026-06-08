import { useEffect, useState, useCallback } from "react";
import { PermissionService } from "../../services/PermissionService";
import type { Permission, CreatePermission, UpdatePermission } from "../../models/Permision";

const service = new PermissionService();

export function usePermissions() {
    const [data, setData] = useState<Permission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const res = await service.findAll();
            if (!res.getEstado()) {
                setError(res.getMensaje());
                return;
            }

            const items = res.getResultado<Permission[]>("registros") ?? [];
            setData(items);
        } catch {
            setError("No fue posible cargar los permisos.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const create = useCallback(async (payload: CreatePermission): Promise<boolean> => {
        try {
            const res = await service.save(payload);
            if (!res.getEstado()) {
                setError(res.getMensaje());
                return false;
            }
            await load();
            return true;
        } catch {
            setError("No fue posible crear el permiso.");
            return false;
        }
    }, [load]);

    const update = useCallback(async (id: number, payload: UpdatePermission): Promise<boolean> => {
        try {
            const res = await service.update(id, payload);
            if (!res.getEstado()) {
                setError(res.getMensaje());
                return false;
            }
            await load();
            return true;
        } catch {
            setError("No fue posible actualizar el permiso.");
            return false;
        }
    }, [load]);

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
            setError("No fue posible eliminar el permiso.");
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
