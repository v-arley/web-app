import { useCallback, useEffect, useState } from "react";
import { ExplorationService } from "../../services/ExplorationService";
import type { WorkerExplorationPage } from "../../models/Exploration";

const explorationService = new ExplorationService();

export function useWorkerExplorations() {
    const [data, setData] = useState<WorkerExplorationPage>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
        items: [],
    });

    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const [name, setName] = useState("");
    const [state, setState] = useState("");
    const [riskLevel, setRiskLevel] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        const response = await explorationService.findWorkerExplorations({
            page,
            limit,
            name: name.trim() || undefined,
            state: state || undefined,
            riskLevel: riskLevel || undefined,
        });

        if (!response.getEstado()) {
            setData({
                page,
                limit,
                total: 0,
                totalPages: 1,
                items: [],
            });
            setError(
                response.getMensaje() ||
                "The scans could not be loaded.",
            );
            return;
        }

        setData(
            response.getResultado<WorkerExplorationPage>("registro") ?? {
                page,
                limit,
                total: 0,
                totalPages: 1,
                items: [],
            },
        );
    }, [page, limit, name, state, riskLevel]);

    useEffect(() => {
        let active = true;

        async function loadInitialData() {
            try {
                const response =
                    await explorationService.findWorkerExplorations({
                        page,
                        limit,
                        name: name.trim() || undefined,
                        state: state || undefined,
                        riskLevel: riskLevel || undefined,
                    });

                if (!active) return;

                if (!response.getEstado()) {
                    setData({
                        page,
                        limit,
                        total: 0,
                        totalPages: 1,
                        items: [],
                    });
                    setError(
                        response.getMensaje() ||
                        "The scans could not be loaded.",
                    );
                } else {
                    setData(
                        response.getResultado<WorkerExplorationPage>(
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
    }, [page, limit, name, state, riskLevel]);

    const reload = useCallback(async () => {
        setLoading(true);
        setError(null);
        await fetchData();
        setLoading(false);
    }, [fetchData]);

    const updateName = useCallback((value: string) => {
        setName(value);
        setPage(1);
    }, []);

    const updateState = useCallback((value: string) => {
        setState(value);
        setPage(1);
    }, []);

    const updateRiskLevel = useCallback((value: string) => {
        setRiskLevel(value);
        setPage(1);
    }, []);

    const clearFilters = useCallback(() => {
        setName("");
        setState("");
        setRiskLevel("");
        setPage(1);
    }, []);

    return {
        data,
        page,
        setPage,
        name,
        setName: updateName,
        state,
        setState: updateState,
        riskLevel,
        setRiskLevel: updateRiskLevel,
        loading,
        error,
        reload,
        clearFilters,
    };
}