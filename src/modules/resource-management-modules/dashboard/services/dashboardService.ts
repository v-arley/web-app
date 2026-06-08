import { AxiosBaseService } from "../../../../shared/utils/AxiosBaseService";
import type { BackendResponse, BackendListPayload } from "../../../../shared/utils/Response";

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
    username: string | null;
    old_values: any;
    new_values: any;
    created_at: string;
}

type MetricsPayload = { data: DashboardMetrics };

export class DashboardService extends AxiosBaseService {
    private readonly campBase = "/camps";

    async getDashboardMetrics(campId: number): Promise<DashboardMetrics> {
        try {
            const { data } = await this.client.get<BackendResponse<MetricsPayload>>(
                `${this.campBase}/${campId}/dashboard-metrics`
            );
            if (data && typeof data === "object" && "resultado" in data) {
                const metrics = (data as BackendResponse<MetricsPayload>).resultado?.data;
                if (metrics) return metrics;
            }
            throw new Error("Respuesta inesperada del servidor");
        } catch (error) {
            throw new Error(this.extractErrorMessage(error, "Error al obtener métricas del dashboard"));
        }
    }

    async getStockSummary(campId: number): Promise<StockSummaryItem[]> {
        try {
            const { data } = await this.client.get<BackendResponse<BackendListPayload<unknown>>>(
                `${this.campBase}/${campId}/stock-summary`
            );
            const rawItems = this.extractItems<Record<string, unknown>>(data);
            return rawItems.map((item) => ({
                resource_id: Number(item.resource_id ?? 0),
                resource_code: String(item.resource_code ?? ""),
                resource_name: String(item.resource_name ?? ""),
                warehouse_id: Number(item.warehouse_id ?? 0),
                warehouse_name: String(item.warehouse_name ?? ""),
                amount: Number(item.current_amount ?? 0),
                min_quantity: Number(item.min_quantity ?? 0),
                stock_status: (item.stock_status === "CRITICAL" || item.stock_status === "LOW"
                    ? item.stock_status
                    : "OK") as "OK" | "LOW" | "CRITICAL",
                date_last_movement: String(item.date_last_movement ?? ""),
            }));
        } catch (error) {
            throw new Error(this.extractErrorMessage(error, "Error al obtener resumen de stock"));
        }
    }

    async getRecentActivity(campId: number, limit: number = 20): Promise<ActivityLog[]> {
        try {
            const { data } = await this.client.get<BackendResponse<BackendListPayload<unknown>>>(
                `${this.campBase}/${campId}/activity-log`,
                { params: { limit } }
            );
            const rawItems = this.extractItems<Record<string, unknown>>(data);
            return rawItems.map((item) => ({
                id: Number(item.id ?? 0),
                table_name: String(item.table_name ?? ""),
                action: String(item.action ?? ""),
                record_id: item.record_id != null ? Number(item.record_id) : null,
                performed_by: item.performed_by != null ? Number(item.performed_by) : null,
                username: item.username != null ? String(item.username) : null,
                old_values: item.old_values ?? null,
                new_values: item.new_values ?? null,
                created_at: String(item.created_at ?? ""),
            }));
        } catch (error) {
            console.warn("Error al obtener actividad reciente:", this.extractErrorMessage(error, ""));
            return [];
        }
    }
}
