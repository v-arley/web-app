import { useCallback, useEffect, useState } from "react";
import { ResourceProductionService } from "../../services/ResourceProductionService";
import { CampProductionRule } from "../../models/CampProductionRule";
import type {
  WorkerProductionHistoryPage,
  WorkerProductionResult,
} from "../../models/ResourceProduction";

const productionService = new ResourceProductionService();

export function useResourceProduction() {
  const [rules, setRules] = useState<CampProductionRule[]>([]);
  const [history, setHistory] = useState<WorkerProductionHistoryPage>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    items: [],
  });

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<WorkerProductionResult | null>(
    null,
  );

  const fetchData = useCallback(async () => {
    const [rulesResponse, historyResponse] = await Promise.all([
      productionService.findWorkerProductionRule(),
      productionService.findWorkerProductionHistory(page, limit),
    ]);

    if (!rulesResponse.getEstado()) {
      setRules([]);
      setError(
        rulesResponse.getMensaje() ||
          "No se pudieron cargar las reglas de producción.",
      );
    } else {
      setRules(
        rulesResponse.getResultado<CampProductionRule[]>("registros") ?? [],
      );
    }

    if (!historyResponse.getEstado()) {
      setHistory({
        page,
        limit,
        total: 0,
        totalPages: 1,
        items: [],
      });
      setError(
        historyResponse.getMensaje() ||
          "No se pudo cargar el historial de producción.",
      );
    } else {
      setHistory(
        historyResponse.getResultado<WorkerProductionHistoryPage>(
          "registro",
        ) ?? {
          page,
          limit,
          total: 0,
          totalPages: 1,
          items: [],
        },
      );
    }
  }, [page, limit]);

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      try {
        const [rulesResponse, historyResponse] = await Promise.all([
          productionService.findWorkerProductionRule(),
          productionService.findWorkerProductionHistory(page, limit),
        ]);

        if (!active) return;

        if (!rulesResponse.getEstado()) {
          setRules([]);
          setError(
            rulesResponse.getMensaje() ||
              "No se pudieron cargar las reglas de producción.",
          );
        } else {
          setRules(
            rulesResponse.getResultado<CampProductionRule[]>("registros") ?? [],
          );
        }

        if (!historyResponse.getEstado()) {
          setHistory({
            page,
            limit,
            total: 0,
            totalPages: 1,
            items: [],
          });
          setError(
            historyResponse.getMensaje() ||
              "No se pudo cargar el historial de producción.",
          );
        } else {
          setHistory(
            historyResponse.getResultado<WorkerProductionHistoryPage>(
              "registro",
            ) ?? {
              page,
              limit,
              total: 0,
              totalPages: 1,
              items: [],
            },
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadInitialData();

    return () => {
      active = false;
    };
  }, [page, limit]);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    await fetchData();
    setLoading(false);
  }, [fetchData]);

  const saveProduction = useCallback(
    async (resourceId: number, amount: number, productionDate: string) => {
      setSaving(true);
      setError(null);
      setLastResult(null);

      try {
        const response = await productionService.saveWorkerProduction({
          resourceId,
          amount,
          productionDate,
        });

        if (!response.getEstado()) {
          setError(
            response.getMensaje() || "No se pudo registrar la producción.",
          );
          return null;
        }

        const result =
          response.getResultado<WorkerProductionResult>("registro") ?? null;

        setLastResult(result);
        await fetchData();

        return result;
      } finally {
        setSaving(false);
      }
    },
    [fetchData],
  );

  return {
    rules,
    history,
    page,
    setPage,
    loading,
    saving,
    error,
    lastResult,
    reload,
    saveProduction,
    clearLastResult: () => setLastResult(null),
  };
}
