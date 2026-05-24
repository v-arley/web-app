import { useQuery } from "@tanstack/react-query";
import { shipmentService } from "../services/ShipmentService";

export const SHIPMENTS_QUERY_KEY = ["shipments"];

interface ShipmentsFilters {
    requestId?: number;
    status?: 'P' | 'I' | 'D' | 'C';
}

export function useShipmentsQuery(filters?: ShipmentsFilters, enabled = true) {
    return useQuery({
        queryKey: [...SHIPMENTS_QUERY_KEY, filters],
        queryFn: () => shipmentService.getShipments(filters),
        enabled,
    });
}

export function useShipmentByIdQuery(id: number, enabled = true) {
    return useQuery({
        queryKey: [...SHIPMENTS_QUERY_KEY, id],
        queryFn: () => shipmentService.getShipmentById(id),
        enabled: enabled && id > 0,
    });
}
