import axiosClient from "../../../../api/axiosClient";

export interface DashboardMetrics {
    population: {
        current: number;
        total: number;
        percentage: number;
    };
    critical_alerts: number;
    rations_today: {
        delivered: number;
        total: number;
        percentage: number;
    };
    shipments_in_transit: number;
}

export interface StockSummaryItem {
    resource_id: number;
    resource_code: string;
    resource_name: string;
    warehouse_id: number;
    warehouse_name: string;
    amount: number;
    min_quantity: number;
    stock_status: "OK" | "LOW" | "CRITICAL";
    date_last_movement: string;
}

export interface ActivityLog {
    id: number;
    table_name: string;
    action: string;
    record_id: number | null;
    performed_by: number | null;
    username: string;
    old_values: any;
    new_values: any;
    created_at: string;
}

export class DashboardService {
    private baseUrl = "/api/camps";

    /**
     * Obtiene las métricas del dashboard para un campamento
     * NOTA: Endpoint pendiente de implementación en backend
     */
    async getDashboardMetrics(campId: number): Promise<DashboardMetrics> {
        try {
            const response = await axiosClient.get(`${this.baseUrl}/${campId}/dashboard-metrics`);
            if (response.data.estado) {
                return response.data.data;
            }
            throw new Error(response.data.mensaje || "Error al obtener métricas");
        } catch (error: any) {
            // Retornar datos mock mientras se implementa el endpoint
            console.warn("⚠️ Endpoint /dashboard-metrics no implementado, usando datos mock");
            return {
                population: { current: 0, total: 0, percentage: 0 },
                critical_alerts: 0,
                rations_today: { delivered: 0, total: 0, percentage: 0 },
                shipments_in_transit: 0,
            };
        }
    }

    /**
     * Obtiene el resumen de stock del almacén principal
     */
    async getStockSummary(campId: number): Promise<StockSummaryItem[]> {
        try {
            const response = await axiosClient.get(`${this.baseUrl}/${campId}/stock-summary`);
            if (response.data.estado) {
                return response.data.data || [];
            }
            throw new Error(response.data.mensaje || "Error al obtener stock");
        } catch (error: any) {
            console.error("Error fetching stock summary:", error);
            return [];
        }
    }

    /**
     * Obtiene la actividad reciente del campamento
     * NOTA: Endpoint pendiente - usar /api/audit-logs filtrado por campamento
     */
    async getRecentActivity(campId: number, limit: number = 10): Promise<ActivityLog[]> {
        try {
            const response = await axiosClient.get(`/api/audit-logs`, {
                params: { camp_id: campId, limit },
            });
            if (response.data.estado) {
                return response.data.data || [];
            }
            throw new Error(response.data.mensaje || "Error al obtener actividad");
        } catch (error: any) {
            console.warn("⚠️ Error al obtener logs de actividad:", error.message);
            return [];
        }
    }
}
