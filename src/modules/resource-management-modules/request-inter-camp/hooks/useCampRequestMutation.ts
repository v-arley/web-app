import { useMutation, useQueryClient } from "@tanstack/react-query";
import { campRequestService } from "../services/CampRequestService";
import { CAMP_REQUESTS_QUERY_KEY } from "./useCampRequestsQuery";
import type { CampRequestFormValues } from "../schemas/camp-request.schema";
// import { useToast } from "../../../../hooks/useToast";

export function useCampRequestMutation() {
    const queryClient = useQueryClient();
    // const { toast } = useToast();

    const createRequest = useMutation({
        mutationFn: (payload: Partial<CampRequestFormValues>) =>
            campRequestService.createCampRequest(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CAMP_REQUESTS_QUERY_KEY });
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

    const approveAsDestination = useMutation({
        mutationFn: ({ id, userId }: { id: number; userId: number }) =>
            campRequestService.approveAsDestination(id, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CAMP_REQUESTS_QUERY_KEY });
            // toast({
            //     title: "Solicitud Aprobada",
            //     message: "Has aprobado la entrada de recursos a tu campamento.",
            //     tone: "success",
            // });
        },
    });

    const rejectAsDestination = useMutation({
        mutationFn: ({ id, userId }: { id: number; userId: number }) =>
            campRequestService.rejectAsDestination(id, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CAMP_REQUESTS_QUERY_KEY });
            // toast({
            //     title: "Solicitud Rechazada",
            //     message: "Has rechazado la solicitud de entrada.",
            //     tone: "info",
            // });
        },
    });

    const approveAsOrigin = useMutation({
        mutationFn: ({ id, userId }: { id: number; userId: number }) =>
            campRequestService.approveAsOrigin(id, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CAMP_REQUESTS_QUERY_KEY });
            // toast({
            //     title: "Salida Autorizada",
            //     message: "Has autorizado el despacho de recursos de tu campamento.",
            //     tone: "success",
            // });
        },
    });

    const rejectAsOrigin = useMutation({
        mutationFn: ({ id, userId }: { id: number; userId: number }) =>
            campRequestService.rejectAsOrigin(id, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CAMP_REQUESTS_QUERY_KEY });
            // toast({
            //     title: "Salida Rechazada",
            //     message: "Has denegado la salida de recursos.",
            //     tone: "info",
            // });
        },
    });

    return {
        createRequest,
        approveAsDestination,
        rejectAsDestination,
        approveAsOrigin,
        rejectAsOrigin,
    };
}
