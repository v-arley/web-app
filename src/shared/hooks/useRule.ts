import { useEffect, useState, useCallback } from "react";
import { RuleService } from "../../services/RuleService";
import type { Rule, CreateRule, UpdateRule } from "../../models/Rule";

const service = new RuleService();

export function useRules() {
    const [data, setData] = useState<Rule[]>([]);
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

            const items = res.getResultado<Rule[]>("registros") ?? [];
            setData(items);
        } catch {
            setError("No fue posible cargar las reglas.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const create = useCallback(async (payload: CreateRule): Promise<boolean> => {
        try {
            const res = await service.save(payload);
            if (!res.getEstado()) {
                setError(res.getMensaje());
                return false;
            }
            await load();
            return true;
        } catch {
            setError("No fue posible crear la regla.");
            return false;
        }
    }, [load]);

    const update = useCallback(async (id: number, payload: UpdateRule): Promise<boolean> => {
        try {
            const res = await service.update(id, payload);
            if (!res.getEstado()) {
                setError(res.getMensaje());
                return false;
            }
            await load();
            return true;
        } catch {
            setError("No fue posible actualizar la regla.");
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
            setError("No fue posible eliminar la regla.");
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
