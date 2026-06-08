import { useMutation, useQueryClient } from "@tanstack/react-query";
import { campRequestService } from "../services/CampRequestService";
import { CAMP_REQUESTS_QUERY_KEY } from "./useCampRequestsQuery";
import type { CampRequestFormValues } from "../schemas/camp-request.schema";
import { SHIPMENTS_QUERY_KEY } from "./useShipmentsQuery";
import { REQUEST_PERSONS_QUERY_KEY } from "./useRequestPersonsQuery";

export function useCampRequestMutation() {
    const queryClient = useQueryClient();
    // const { toast } = useToast();

    const createRequest = useMutation({
        mutationFn: (payload: Partial<CampRequestFormValues>) =>
            campRequestService.createCampRequest(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CAMP_REQUESTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: SHIPMENTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: REQUEST_PERSONS_QUERY_KEY });
            // toast({
            //     title: "Solicitud enviada",
            //     message: "La solicitud ha sido enviada al campamento origen para su aprobación.",
            //     tone: "success",
            // });
        },
        onError: () => {
            // toast({
            //     title: "Error",
            //     message: "No se pudo crear la solicitud. Intente nuevamente.",
            //     tone: "error",
            // });
        },
    });

    const deleteRequest = useMutation({
        mutationFn: (id: number) => campRequestService.deleteCampRequest(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CAMP_REQUESTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: SHIPMENTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: REQUEST_PERSONS_QUERY_KEY });
        },
    });

    const approveAsDestination = useMutation({
        mutationFn: (id: number) =>
            campRequestService.approveAsDestination(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CAMP_REQUESTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: SHIPMENTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: REQUEST_PERSONS_QUERY_KEY });
            // toast({
            //     title: "Solicitud Aprobada",
            //     message: "Has aprobado la entrada de recursos a tu campamento.",
            //     tone: "success",
            // });
        },
    });

    const rejectAsDestination = useMutation({
        mutationFn: (id: number) =>
            campRequestService.rejectAsDestination(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CAMP_REQUESTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: SHIPMENTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: REQUEST_PERSONS_QUERY_KEY });
            // toast({
            //     title: "Solicitud Rechazada",
            //     message: "Has rechazado la solicitud de entrada.",
            //     tone: "info",
            // });
        },
    });

    const approveAsOrigin = useMutation({
        mutationFn: (id: number) =>
            campRequestService.approveAsOrigin(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CAMP_REQUESTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: SHIPMENTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: REQUEST_PERSONS_QUERY_KEY });
            // toast({
            //     title: "Salida Autorizada",
            //     message: "Has autorizado el despacho de recursos de tu campamento.",
            //     tone: "success",
            // });
        },
    });

    const rejectAsOrigin = useMutation({
        mutationFn: (id: number) =>
            campRequestService.rejectAsOrigin(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CAMP_REQUESTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: REQUEST_PERSONS_QUERY_KEY });
            // toast({
            //     title: "Salida Rechazada",
            //     message: "Has denegado la salida de recursos.",
            //     tone: "info",
            // });
        },
    });

    return {
        createRequest,
        deleteRequest,
        approveAsDestination,
        rejectAsDestination,
        approveAsOrigin,
        rejectAsOrigin,
    };
}
