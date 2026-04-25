import { useEffect, useState, useCallback } from "react";
import { CampService } from "../services/CampService";
import type { Camp, CreateCamp, UpdateCamp } from "../models/Camp";

const service = new CampService();

export function useCamps() {
  const [data, setData] = useState<Camp[]>([]);
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

      const items = res.getResultado<Camp[]>("registros") ?? [];
      setData(items);
    } catch {
      setError("No fue posible cargar los campamentos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const create = useCallback(async (payload: CreateCamp): Promise<boolean> => {
    try {
      setError(null);

      const res = await service.save(payload);

      if (!res.getEstado()) {
        setError(res.getMensaje());
        return false;
      }

      await load();
      return true;
    } catch {
      setError("No fue posible crear el campamento.");
      return false;
    }
  }, [load]);

  const update = useCallback(async (id: number, payload: UpdateCamp): Promise<boolean> => {
    try {
      setError(null);

      const res = await service.update(id, payload);

      if (!res.getEstado()) {
        setError(res.getMensaje());
        return false;
      }

      await load();
      return true;
    } catch {
      setError("No fue posible actualizar el campamento.");
      return false;
    }
  }, [load]);

  const remove = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);

      const res = await service.remove(id);

      if (!res.getEstado()) {
        setError(res.getMensaje());
        return false;
      }

      await load();
      return true;
    } catch {
      setError("No fue posible eliminar el campamento.");
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