import { useEffect, useState } from "react";
import { DashboardService } from "../services";
import type { DashboardMetrics, StockSummaryItem, ActivityLog } from "../services";

const dashboardService = new DashboardService();

interface UseDashboardReturn {
    metrics: DashboardMetrics | null;
    stockSummary: StockSummaryItem[];
    recentActivity: ActivityLog[];
    isLoadingMetrics: boolean;
    isLoadingStock: boolean;
    isLoadingActivity: boolean;
    error: string | null;
    refresh: () => void;
}

export function useDashboard(campId: number, autoFetch: boolean = true): UseDashboardReturn {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [stockSummary, setStockSummary] = useState<StockSummaryItem[]>([]);
    const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
    const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
    const [isLoadingStock, setIsLoadingStock] = useState(false);
    const [isLoadingActivity, setIsLoadingActivity] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMetrics = async () => {
        setIsLoadingMetrics(true);
        setError(null);
        try {
            const data = await dashboardService.getDashboardMetrics(campId);
            setMetrics(data);
        } catch (err: any) {
            setError(err.message || "Error al cargar métricas");
        } finally {
            setIsLoadingMetrics(false);
        }
    };

    const fetchStockSummary = async () => {
        setIsLoadingStock(true);
        try {
            const data = await dashboardService.getStockSummary(campId);
            // Mostrar solo los primeros 10 recursos del almacén principal
            setStockSummary(data.slice(0, 10));
        } catch (err: any) {
            console.error("Error loading stock:", err);
        } finally {
            setIsLoadingStock(false);
        }
    };

    const fetchRecentActivity = async () => {
        setIsLoadingActivity(true);
        try {
            const data = await dashboardService.getRecentActivity(campId, 10);
            setRecentActivity(data);
        } catch (err: any) {
            console.error("Error loading activity:", err);
        } finally {
            setIsLoadingActivity(false);
        }
    };

    const refresh = () => {
        fetchMetrics();
        fetchStockSummary();
        fetchRecentActivity();
    };

    useEffect(() => {
        if (autoFetch && campId > 0) {
            refresh();
        }
    }, [campId, autoFetch]);

    return {
        metrics,
        stockSummary,
        recentActivity,
        isLoadingMetrics,
        isLoadingStock,
        isLoadingActivity,
        error,
        refresh,
    };
}
