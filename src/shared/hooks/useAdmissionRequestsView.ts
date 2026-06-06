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

type ApprovalData = {
  role_id: number;
  profession_id: number;
  username: string;
  password: string;
};

function safeParseAiResponse(response?: string) {
  if (!response) return null;

  try {
    const cleanResponse = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanResponse) as Partial<{
      apto: boolean;
      riesgo: string;
      razon: string;
      asignacion_recomendada: string;
    }>;
  } catch {
    return null;
  }
}

function getItems<T>(response: any): T[] {
  const registros = response?.getResultado?.("registros");
  const items = response?.getResultado?.("items");

  if (Array.isArray(registros)) return registros as T[];
  if (Array.isArray(items)) return items as T[];

  return [];
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

  const loadAiEvaluations = async (admissionItems: AdmissionRequest[]) => {
    try {
      const [decisionResult, promptResult] = await Promise.allSettled([
        aiDecisionService.findAll(),
        aiPromptService.findAll(),
      ]);

      const decisions =
        decisionResult.status === "fulfilled" && decisionResult.value.getEstado()
          ? getItems<AiDecision>(decisionResult.value)
          : [];

      const prompts =
        promptResult.status === "fulfilled" && promptResult.value.getEstado()
          ? getItems<AiPrompt>(promptResult.value)
          : [];

      const nextEvaluations: Record<number, AiEvaluationView> = {};

      for (const admission of admissionItems) {
        if (!admission.id) continue;

        const prompt = prompts.find(
          (item) => item.admission_request_id === admission.id,
        );

        const decision = decisions.find(
          (item) => item.admission_request_id === admission.id,
        );

        const parsedResponse = safeParseAiResponse(prompt?.response);

        if (parsedResponse || decision || prompt) {
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
      console.error("Error loading AI evaluations:", err);
    }
  };

  const loadAdmissions = async () => {
    try {
      setLoading(true);
      setError("");

      const admissionResp = await admissionRequestService.findAll();

      if (!admissionResp.getEstado()) {
        setError(
          admissionResp.getMensaje() || "No se pudieron cargar las admisiones.",
        );
        setAdmissions([]);
        return;
      }

      const admissionItems = getItems<AdmissionRequest>(admissionResp);
      setAdmissions(admissionItems);

      void loadAiEvaluations(admissionItems);
    } catch (err) {
      console.error(err);
      setError("Error inesperado al cargar admisiones.");
      setAdmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const updateAdmissionStatus = async (
    id: number,
    request_status: "A" | "R",
    approvalData?: ApprovalData,
  ) => {
    try {
      setUpdatingId(id);
      setError("");

      const response = await admissionRequestService.update(id, {
        request_status,
        ...(request_status === "A" && approvalData ? approvalData : {}),
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