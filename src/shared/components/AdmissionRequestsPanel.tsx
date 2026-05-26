import { BrainCircuit, Check, ClipboardList, X, ArrowLeft } from "lucide-react";
import { useAdmissionRequestsView } from "../hooks/useAdmissionRequestsView";

type AdmissionRequestsPanelProps = {
  onAdmissionResolved?: () => void | Promise<void>;
  onBackToStaff?: () => void;
};

const professionNameMap: Record<string, string> = {
  "PROF-AGR": "Agriculture",
  "PROF-LOG": "Logistics",
  "PROF-EXP": "Exploration",
  "PROF-MED": "Medicine",
  "PROF-SEC": "Security",
  "PROF-COM": "Communication",
  "PROF-ENG": "Engineering",
  "PROF-SCI": "Science",
  "PROF-COC": "Cooking",
};

function formatRecommendedAssignment(value?: string | null) {
  if (!value) return "Not assigned";

  const normalizedValue = value.trim().toUpperCase();

  if (professionNameMap[normalizedValue]) {
    return professionNameMap[normalizedValue];
  }

  return value
    .replace(/^PROF[-_]/i, "")
    .replace(/[-_]/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatRisk(value?: string | null) {
  if (!value) return "Not specified";

  const normalizedValue = value.trim().toUpperCase();

  const riskMap: Record<string, string> = {
    BAJO: "Low",
    MEDIO: "Medium",
    ALTO: "High",
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
  };

  return riskMap[normalizedValue] ?? value;
}

export function AdmissionRequestsPanel({
  onAdmissionResolved,
  onBackToStaff,
}: AdmissionRequestsPanelProps) {
  const {
    pendingAdmissions,
    evaluationsByAdmissionId,
    loading,
    error,
    updatingId,
    updateAdmissionStatus,
  } = useAdmissionRequestsView();

  if (loading) {
    return (
      <div className="mt-3 flex min-h-0 flex-1 items-center justify-center rounded-xl border border-dashed border-[#B8B8B8] bg-[#F2F2F2] p-6">
        <span className="font-mono text-sm uppercase tracking-widest text-gray-500">
          Loading admissions...
        </span>
      </div>
    );
  }

  return (
    <div className="mt-2 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-xl bg-transparent px-3 py-2">
      <div className="flex items-center justify-between gap-3 px-1 py-1">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-[#FF6600]" />

          <p className="font-mono text-[20px] font-semibold uppercase tracking-[0.22em] text-[#FF6600]">
            Admission Management
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToStaff}
          disabled={!onBackToStaff}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#FF6600] bg-[#FF6600] px-4 font-mono text-xs font-semibold text-black transition-colors hover:bg-black hover:text-[#FF6600] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft size={14} />
          Back
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {pendingAdmissions.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-[#B8B8B8] bg-[#F2F2F2] p-6">
          <div className="max-w-xl text-center">
            <ClipboardList className="mx-auto mb-3 h-10 w-10 text-[#808080]" />

            <p className="font-mono text-sm font-bold uppercase tracking-widest text-[#343434]">
              No Pending Admissions
            </p>

            <p className="mt-3 text-sm text-gray-500">
              When a person is registered from Register staff, their pending
              request will appear here.
            </p>

            <button
              type="button"
              onClick={onBackToStaff}
              disabled={!onBackToStaff}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg border border-[#FF6600] bg-[#FF6600] px-4 py-2 font-mono text-sm font-medium text-black transition-colors hover:bg-black hover:text-[#FF6600] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft size={16} />
              Back to Staff Panel
            </button>
          </div>
        </div>
      ) : (
        pendingAdmissions.map((admission) => {
          const evaluationResult = admission.id
            ? evaluationsByAdmissionId[admission.id]
            : null;

          const aiDecisionStatus =
            evaluationResult?.decision?.decision_status === "A" ||
            evaluationResult?.decision?.decision_status === "R"
              ? evaluationResult.decision.decision_status
              : null;

          return (
            <div
              key={admission.id}
              className="rounded-xl border border-[#B8B8B8] bg-[#F2F2F2] p-5 shadow-[0_8px_18px_rgba(0,0,0,0.12)]"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
                    Admission #{admission.id}
                  </p>

                  <h3 className="mt-1 font-mono text-lg font-bold uppercase text-[#343434]">
                    Person ID: {admission.person_id}
                  </h3>

                  <p className="mt-1 font-mono text-xs uppercase text-gray-500">
                    Camp ID: {admission.camp_id} | Status:{" "}
                    {admission.request_status}
                  </p>

                  {admission.requested_at && (
                    <p className="mt-1 font-mono text-xs text-gray-500">
                      Requested at:{" "}
                      {new Date(admission.requested_at).toLocaleString()}
                    </p>
                  )}
                </div>

                <span className="rounded-md bg-[#FF6600] px-3 py-1 font-mono text-xs font-bold uppercase text-black">
                  Pending
                </span>
              </div>

              {admission.observations && (
                <div className="mt-4 rounded-lg border border-[#CCCCCC] bg-white/70 p-4">
                  <p className="mb-2 font-mono text-xs font-bold uppercase text-gray-500">
                    Observations
                  </p>

                  <pre className="whitespace-pre-wrap font-mono text-xs text-[#343434]">
                    {admission.observations}
                  </pre>
                </div>
              )}

              {evaluationResult ? (
                <div className="mt-4 rounded-lg border border-[#FF6600] bg-white p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <BrainCircuit size={16} className="text-[#FF6600]" />

                    <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#343434]">
                      AI Evaluation Result
                    </p>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-md border border-[#CCCCCC] bg-[#F7F7F7] p-3">
                      <p className="font-mono text-xs font-bold uppercase text-gray-500">
                        Apt
                      </p>

                      <p className="mt-1 font-mono text-sm font-bold text-[#343434]">
                        {evaluationResult.evaluation.apto ? "YES" : "NO"}
                      </p>
                    </div>

                    <div className="rounded-md border border-[#CCCCCC] bg-[#F7F7F7] p-3">
                      <p className="font-mono text-xs font-bold uppercase text-gray-500">
                        Risk
                      </p>

                      <p className="mt-1 font-mono text-sm font-bold uppercase text-[#343434]">
                        {formatRisk(evaluationResult.evaluation.riesgo)}
                      </p>
                    </div>

                    <div className="rounded-md border border-[#CCCCCC] bg-[#F7F7F7] p-3 md:col-span-2">
                      <p className="font-mono text-xs font-bold uppercase text-gray-500">
                        Recommended Assignment
                      </p>

                      <p className="mt-1 font-mono text-sm text-[#343434]">
                        {formatRecommendedAssignment(
                          evaluationResult.evaluation.asignacion_recomendada,
                        )}
                      </p>
                    </div>

                    <div className="rounded-md border border-[#CCCCCC] bg-[#F7F7F7] p-3 md:col-span-2">
                      <p className="font-mono text-xs font-bold uppercase text-gray-500">
                        Reason
                      </p>

                      <p className="mt-1 whitespace-pre-wrap font-mono text-sm text-[#343434]">
                        {evaluationResult.evaluation.razon}
                      </p>
                    </div>

                    <div className="rounded-md border border-[#CCCCCC] bg-[#F7F7F7] p-3 md:col-span-2">
                      <p className="font-mono text-xs font-bold uppercase text-gray-500">
                        AI Decision
                      </p>

                      <p className="mt-1 font-mono text-sm font-bold text-[#343434]">
                        {aiDecisionStatus === "A"
                          ? "ACCEPTED"
                          : aiDecisionStatus === "R"
                            ? "REJECTED"
                            : "NO DECISION"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-lg border border-yellow-500 bg-yellow-50 p-4">
                  <div className="flex items-center gap-2">
                    <BrainCircuit size={16} className="text-yellow-700" />

                    <p className="font-mono text-xs font-bold uppercase tracking-widest text-yellow-800">
                      AI Evaluation Pending
                    </p>
                  </div>

                  <p className="mt-2 text-sm text-yellow-800">
                    This request does not have a visible evaluation yet. If it
                    was created before automatic evaluation was enabled, create
                    a new request or verify whether the evaluation already
                    exists in the backend.
                  </p>
                </div>
              )}

              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={
                    !admission.id ||
                    !aiDecisionStatus ||
                    updatingId === admission.id
                  }
                  onClick={async () => {
                    if (!admission.id || !aiDecisionStatus) return;

                    const ok = await updateAdmissionStatus(
                      admission.id,
                      aiDecisionStatus,
                    );

                    if (ok) {
                      await onAdmissionResolved?.();
                    }
                  }}
                  className="flex items-center justify-center gap-2 rounded-lg border border-[#FF6600] bg-[#FF6600] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#e65c00] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <BrainCircuit size={16} />
                  Confirm AI
                </button>

                <button
                  type="button"
                  disabled={!admission.id || updatingId === admission.id}
                  onClick={async () => {
                    if (!admission.id) return;

                    const ok = await updateAdmissionStatus(admission.id, "A");

                    if (ok) {
                      await onAdmissionResolved?.();
                    }
                  }}
                  className="flex items-center justify-center gap-2 rounded-lg border border-green-700 bg-green-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Check size={16} />
                  Accept
                </button>

                <button
                  type="button"
                  disabled={!admission.id || updatingId === admission.id}
                  onClick={async () => {
                    if (!admission.id) return;

                    const ok = await updateAdmissionStatus(admission.id, "R");

                    if (ok) {
                      await onAdmissionResolved?.();
                    }
                  }}
                  className="flex items-center justify-center gap-2 rounded-lg border border-red-700 bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <X size={16} />
                  Reject
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}