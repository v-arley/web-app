import { useCallback, useEffect, useState } from "react";
import { RationService } from "../../services/RationService";
import { Ration, type WorkerRationHistoryPage } from "../../models/Ration";

const rationService = new RationService();

export function useWorkerRations() {
  const [currentRation, setCurrentRation] = useState<Ration | null>(null);
  const [history, setHistory] = useState<WorkerRationHistoryPage>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    items: [],
  });

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const [currentResponse, historyResponse] = await Promise.all([
      rationService.findWorkerRation(),
      rationService.findWorkerRationHistory(page, limit),
    ]);

    if (!currentResponse.getEstado()) {
      setCurrentRation(null);
      setError(
        currentResponse.getMensaje() || "The current ration could not be loaded.",
      );
    } else {
      setCurrentRation(currentResponse.getResultado<Ration>("registro"));
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
          "The ration history could not be loaded.",
      );
    } else {
      setHistory(
        historyResponse.getResultado<WorkerRationHistoryPage>("registro") ?? {
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
        const [currentResponse, historyResponse] = await Promise.all([
          rationService.findWorkerRation(),
          rationService.findWorkerRationHistory(page, limit),
        ]);

        if (!active) return;

        if (!currentResponse.getEstado()) {
          setCurrentRation(null);
          setError(
            currentResponse.getMensaje() ||
              "The current ration could not be loaded.",
          );
        } else {
          setCurrentRation(currentResponse.getResultado<Ration>("registro"));
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
              "The ration history could not be loaded.",
          );
        } else {
          setHistory(
            historyResponse.getResultado<WorkerRationHistoryPage>(
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

  return {
    currentRation,
    history,
    page,
    setPage,
    loading,
    error,
    reload,
  };
}
