import { useEffect, useMemo, useState } from "react";
import { AdmissionRequestService } from "../../services/AdmissionRequestService";
import type { AdmissionRequest } from "../../models/AdmissionRequest";
import { AiDecisionService } from "../../services/AiDecisionService";
import { AiPromptService } from "../../services/AiPromptService";
import type { AiDecision } from "../../models/AiDecision";
import type { AiPrompt } from "../../models/AiPrompt";
import { getAuthContextFromToken } from "../utils/authAccess";

const admissionRequestService = new AdmissionRequestService();
const aiDecisionService = new AiDecisionService();
const aiPromptService = new AiPromptService();

type AiEvaluationView = {
  evaluation: {
    apto: boolean;
    riesgo: string;
    razon: string;
    asignacion_recomendada: string;
  };
  decision?: AiDecision;
  prompt?: AiPrompt;
};

function safeParseAiResponse(response?: string) {
  if (!response) return null;

  try {
    return JSON.parse(response) as Partial<{
      apto: boolean;
      riesgo: string;
      razon: string;
      asignacion_recomendada: string;
    }>;
  } catch {
    return null;
  }
}

export function useAdmissionRequestsView() {
  const authContext = getAuthContextFromToken();

  const [admissions, setAdmissions] = useState<AdmissionRequest[]>([]);
  const [evaluationsByAdmissionId, setEvaluationsByAdmissionId] = useState<
    Record<number, AiEvaluationView>
  >({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const pendingAdmissions = useMemo(() => {
    return admissions.filter(
      (admission) =>
        admission.camp_id === authContext.campId &&
        admission.request_status === "P",
    );
  }, [admissions, authContext.campId]);

  const loadAdmissions = async () => {
    try {
      setLoading(true);
      setError("");

      const [admissionResp, decisionResp, promptResp] = await Promise.all([
        admissionRequestService.findAll(),
        aiDecisionService.findAll(),
        aiPromptService.findAll(),
      ]);

      if (!admissionResp.getEstado()) {
        setError(
          admissionResp.getMensaje() || "No se pudieron cargar las admisiones.",
        );
        return;
      }

      const admissionData =
        admissionResp.getResultado<AdmissionRequest[]>("registros") ?? [];

      setAdmissions(admissionData);

      const decisions =
        decisionResp.getEstado()
          ? decisionResp.getResultado<AiDecision[]>("registros") ?? []
          : [];

      const prompts =
        promptResp.getEstado()
          ? promptResp.getResultado<AiPrompt[]>("registros") ?? []
          : [];

      const nextEvaluations: Record<number, AiEvaluationView> = {};

      for (const admission of admissionData) {
        if (!admission.id) continue;

        const decision = decisions.find(
          (item) => item.admission_request_id === admission.id,
        );

        const prompt = prompts
          .filter((item) => item.admission_request_id === admission.id)
          .sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
          })[0];

        const parsedResponse = safeParseAiResponse(prompt?.response);

        if (decision || parsedResponse) {
          nextEvaluations[admission.id] = {
            evaluation: {
              apto:
                parsedResponse?.apto ??
                decision?.decision_status === "A",
              riesgo: parsedResponse?.riesgo ?? "No especificado",
              razon:
                parsedResponse?.razon ??
                decision?.explanation ??
                "Sin explicación registrada.",
              asignacion_recomendada:
                parsedResponse?.asignacion_recomendada ??
                "No especificada",
            },
            decision,
            prompt,
          };
        }
      }

      setEvaluationsByAdmissionId(nextEvaluations);
    } catch (err) {
      console.error(err);
      setError("Error inesperado al cargar admisiones.");
    } finally {
      setLoading(false);
    }
  };

  const updateAdmissionStatus = async (
    id: number,
    request_status: "A" | "R",
  ) => {
    try {
      setUpdatingId(id);
      setError("");

      const response = await admissionRequestService.update(id, {
        request_status,
      });

      if (!response.getEstado()) {
        setError(response.getMensaje() || "No se pudo actualizar la admisión.");
        return false;
      }

      await loadAdmissions();
      return true;
    } catch (err) {
      console.error(err);
      setError("Error inesperado al actualizar admisión.");
      return false;
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    void loadAdmissions();
  }, []);

  return {
    admissions,
    pendingAdmissions,
    evaluationsByAdmissionId,
    loading,
    error,
    updatingId,
    loadAdmissions,
    updateAdmissionStatus,
  };
}