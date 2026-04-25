import { Response as Respuesta, type BackendResponse } from "../utils/Response";
import { AxiosBaseService } from "./AxiosBaseService";
import { AiDecision } from "../models/AiDecision";
import { AiPrompt } from "../models/AiPrompt";

export type AiAdmissionEvaluation = {
    apto: boolean;
    riesgo: "bajo" | "medio" | "alto";
    razon: string;
    asignacion_recomendada: string;
};

export type AdmissionEvaluationResult = {
    evaluation: AiAdmissionEvaluation;
    prompt: AiPrompt;
    decision: AiDecision;
};

export class AdmissionEvaluationService extends AxiosBaseService {
    async evaluate(admissionRequestId: number): Promise<Respuesta> {
        try {
            const { data } = await this.client.post<BackendResponse<{ item: AdmissionEvaluationResult }>>(
                `/admission-requests/${admissionRequestId}/evaluate`,
                {},
            );
            const item = this.extractItem<AdmissionEvaluationResult>(data);

            return new Respuesta(true, "Evaluacion IA completada.", "", "registro", item);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo ejecutar la evaluacion IA"), "", "registro", null);
        }
    }
}
