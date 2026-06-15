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

type AiEvaluationResponse = Partial<{
  apto: boolean;
  riesgo: string;
  razon: string;
  asignacion_recomendada: string;
}>;

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

function safeParseAiResponse(response?: string | AiEvaluationResponse | null) {
  if (!response) return null;

  if (typeof response === "object") {
    return response;
  }

  try {
    const cleanResponse = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanResponse) as AiEvaluationResponse;
  } catch (error) {
    console.error("No se pudo parsear la respuesta de IA:", response, error);
    return null;
  }
}

function responseIsOk(response: any) {
  if (typeof response?.getEstado === "function") {
    return response.getEstado();
  }

  if (typeof response?.estado === "boolean") {
    return response.estado;
  }

  if (typeof response?.data?.estado === "boolean") {
    return response.data.estado;
  }

  return true;
}

function getItems<T>(response: any): T[] {
  const possiblePayloads = [
    response?.getResultado?.("items"),
    response?.getResultado?.("registros"),
    response?.getResultado?.("item"),
    response?.getResultado?.("registro"),
    response?.getResultadoObjeto?.(),

    response?.resultado,
    response?.data,
    response?.data?.resultado,

    response?.items,
    response?.registros,
    response?.data?.items,
    response?.data?.registros,
    response?.resultado?.items,
    response?.resultado?.registros,
    response?.data?.resultado?.items,
    response?.data?.resultado?.registros,
  ];

  for (const payload of possiblePayloads) {
    if (Array.isArray(payload)) {
      return payload as T[];
    }

    if (Array.isArray(payload?.items)) {
      return payload.items as T[];
    }

    if (Array.isArray(payload?.registros)) {
      return payload.registros as T[];
    }
  }

  return [];
}

function normalizeAiProfessionCode(value?: string | null) {
  if (!value) return "No especificada";

  const normalizedValue = value.trim().toUpperCase();

  const map: Record<string, string> = {
    "PROF-MED": "MEDI",
    "PROF-COOK": "COCIN",
    "PROF-COC": "COCIN",
    "PROF-AGR": "AGRI",
    "PROF-LOG": "LOGIS",
    "PROF-EXP": "EXPLO",
    "PROF-SEC": "SEGUR",
    "PROF-COM": "TELE",
    "PROF-ENG": "INGEN",
    "PROF-SCI": "CIEN",
    CUARENTENA: "CUARENTENA",
  };

  return map[normalizedValue] ?? normalizedValue;
}

function normalizeDecisionStatus(value?: string | null) {
  const normalizedValue = value?.trim().toUpperCase();

  if (normalizedValue === "A" || normalizedValue === "ACCEPT") return true;
  if (normalizedValue === "R" || normalizedValue === "REJECT") return false;

  return undefined;
}

function getLatestPromptForAdmission(prompts: AiPrompt[], admissionId: number) {
  return prompts
    .filter((item) => Number(item.admission_request_id) === admissionId)
    .sort((a: any, b: any) => {
      const dateA = new Date(a.created_at ?? 0).getTime();
      const dateB = new Date(b.created_at ?? 0).getTime();

      if (dateA !== dateB) return dateB - dateA;

      return Number(b.id ?? 0) - Number(a.id ?? 0);
    })[0];
}

function getLatestDecisionForAdmission(
  decisions: AiDecision[],
  admissionId: number,
) {
  return decisions
    .filter((item) => Number(item.admission_request_id) === admissionId)
    .sort((a: any, b: any) => {
      const dateA = new Date(a.created_at ?? 0).getTime();
      const dateB = new Date(b.created_at ?? 0).getTime();

      if (dateA !== dateB) return dateB - dateA;

      return Number(b.id ?? 0) - Number(a.id ?? 0);
    })[0];
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
        Number(admission.camp_id) === Number(authContext.campId) &&
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
        decisionResult.status === "fulfilled" &&
        responseIsOk(decisionResult.value)
          ? getItems<AiDecision>(decisionResult.value)
          : [];

      const prompts =
        promptResult.status === "fulfilled" && responseIsOk(promptResult.value)
          ? getItems<AiPrompt>(promptResult.value)
          : [];

      console.log("AI DEBUG - decisions:", decisions);
      console.log("AI DEBUG - prompts:", prompts);

      const nextEvaluations: Record<number, AiEvaluationView> = {};

      for (const admission of admissionItems) {
        if (!admission.id) continue;

        const admissionId = Number(admission.id);

        const prompt = getLatestPromptForAdmission(prompts, admissionId);
        const decision = getLatestDecisionForAdmission(decisions, admissionId);
        const parsedResponse = safeParseAiResponse(prompt?.response as any);

        console.log("AI DEBUG - admission:", admissionId, {
          prompt,
          decision,
          parsedResponse,
        });

        if (parsedResponse || decision || prompt) {
          const aiApto =
            parsedResponse?.apto ?? normalizeDecisionStatus(decision?.decision_status);

          nextEvaluations[admissionId] = {
            evaluation: {
              apto: aiApto ?? false,

              riesgo: parsedResponse?.riesgo ?? "No especificado",

              razon:
                parsedResponse?.razon ??
                decision?.explanation ??
                prompt?.response ??
                "Sin explicación registrada.",

              asignacion_recomendada: normalizeAiProfessionCode(
                parsedResponse?.asignacion_recomendada ?? "",
              ),
            },
            decision,
            prompt,
          };
        }
      }

      console.log("AI DEBUG - evaluationsByAdmissionId:", nextEvaluations);

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

      if (!responseIsOk(admissionResp)) {
        setError(
          admissionResp.getMensaje() || "Admissions could not be loaded.",
        );
        setAdmissions([]);
        return;
      }

      const admissionItems = getItems<AdmissionRequest>(admissionResp);
      setAdmissions(admissionItems);

      await loadAiEvaluations(admissionItems);
    } catch (err) {
      console.error(err);
      setError("Unexpected error loading admissions.");
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

      if (!responseIsOk(response)) {
       setError(
          response.getMensaje() || "The admission could not be updated.",
        );
        return false;
      }

      await loadAdmissions();
      return true;
    } catch (err) {
      console.error(err);
      setError("The admission could not be updated");
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