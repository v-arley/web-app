import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shipmentService } from "../services/ShipmentService";
import { SHIPMENTS_QUERY_KEY } from "./useShipmentsQuery";
import { CAMP_REQUESTS_QUERY_KEY } from "./useCampRequestsQuery";
import type { ShipmentFormValues } from "../schemas/shipment.schema";
import { useToast } from "../../../../shared/hooks/useToast";

export function useShipmentMutation() {
    const queryClient = useQueryClient();
    //const { toast } = useToast();

    const createShipment = useMutation({
        mutationFn: (payload: Partial<ShipmentFormValues>) =>
            shipmentService.createShipment(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SHIPMENTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: CAMP_REQUESTS_QUERY_KEY });
            // toast({
            //     title: "Envío Creado",
            //     message: "Se ha generado la guía de envío exitosamente.",
            //     tone: "success",
            // });
        },
    });

    const startTransit = useMutation({
        mutationFn: (id: number) => shipmentService.startTransit(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SHIPMENTS_QUERY_KEY });
            // toast({
            //     title: "Tránsito Iniciado",
            //     message: "El envío ahora figura en estado 'En Tránsito'.",
            //     tone: "info",
            // });
        },
    });

    const confirmDelivery = useMutation({
        mutationFn: ({ id, observations }: { id: number; observations?: string }) =>
            shipmentService.confirmDelivery(id, observations),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SHIPMENTS_QUERY_KEY });
            // toast({
            //     title: "Entrega Confirmada",
            //     message: "El envío ha sido marcado como entregado.",
            //     tone: "success",
            // });
        },
    });

    const cancelShipment = useMutation({
        mutationFn: ({ id, observations }: { id: number; observations?: string }) =>
            shipmentService.cancelShipment(id, observations),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SHIPMENTS_QUERY_KEY });
            // toast({
            //     title: "Envío Cancelado",
            //     message: "El envío ha sido cancelado correctamente.",
            //     tone: "warning",
            // });
        },
    });

    return {
        createShipment,
        startTransit,
        confirmDelivery,
        cancelShipment,
    };
}
