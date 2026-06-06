import { useState } from "react";
import {
  ArrowLeft,
  BrainCircuit,
  Check,
  ClipboardList,
  X,
} from "lucide-react";

import type { AdmissionRequest } from "../../models/AdmissionRequest";
import { useAdmissionRequestsView } from "../hooks/useAdmissionRequestsView";
import { AdmissionApprovalModal } from "./AdmissionApprovalModal";

type AdmissionRequestsPanelProps = {
  onAdmissionResolved?: () => void | Promise<void>;
  onBackToStaff?: () => void;
};

type ApprovalPayload = {
  role_id: number;
  profession_id: number;
  username: string;
  password: string;
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
  "PROF-COOK": "Cooking",
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

function getPersonLabel(admission: AdmissionRequest) {
  const rawAdmission = admission as AdmissionRequest & {
    person?: {
      name?: string;
      surname?: string;
      last_name?: string;
      dni?: string;
    };
  };

  const person = rawAdmission.person;

  if (person?.name || person?.surname || person?.last_name) {
    return [person.name, person.surname ?? person.last_name]
      .filter(Boolean)
      .join(" ");
  }

  if (person?.dni) {
    return `DNI ${person.dni}`;
  }

  return `Persona #${admission.person_id}`;
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

  const [selectedAdmission, setSelectedAdmission] =
    useState<AdmissionRequest | null>(null);

  const handleReject = async (admissionId?: number | null) => {
    if (!admissionId) return;

    const ok = await updateAdmissionStatus(admissionId, "R");

    if (ok) {
      await onAdmissionResolved?.();
    }
  };

  const handleConfirmApproval = async (payload: ApprovalPayload) => {
    if (!selectedAdmission?.id) return false;

    const ok = await updateAdmissionStatus(selectedAdmission.id, "A", payload);

    if (ok) {
      setSelectedAdmission(null);
      await onAdmissionResolved?.();
    }

    return ok;
  };

  const admissionsToRender: AdmissionRequest[] = Array.isArray(pendingAdmissions)
    ? pendingAdmissions
    : [];

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
    <>
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

        {admissionsToRender.length === 0 ? (
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
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {admissionsToRender.map((admission: AdmissionRequest) => {
              const evaluationResult =
                admission.id != null
                  ? evaluationsByAdmissionId[admission.id]
                  : undefined;

              const aiDecisionStatus =
                evaluationResult?.decision?.decision_status;

              const isUpdating = updatingId === admission.id;

              return (
                <article
                  key={
                    admission.id ??
                    `${admission.person_id}-${admission.camp_id}`
                  }
                  className="rounded-xl border border-[#B8B8B8] bg-[#F2F2F2] p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md border border-[#CCCCCC] bg-white px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-[#343434]">
                          Request #{admission.id ?? "--"}
                        </span>

                        <span className="rounded-md border border-[#FF6600] bg-[#FF6600]/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-[#FF6600]">
                          Pending
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <div className="rounded-md border border-[#CCCCCC] bg-[#F7F7F7] p-3">
                          <p className="font-mono text-xs font-bold uppercase text-gray-500">
                            Person
                          </p>

                          <p className="mt-1 font-mono text-sm font-bold text-[#343434]">
                            {getPersonLabel(admission)}
                          </p>
                        </div>

                        <div className="rounded-md border border-[#CCCCCC] bg-[#F7F7F7] p-3">
                          <p className="font-mono text-xs font-bold uppercase text-gray-500">
                            Camp
                          </p>

                          <p className="mt-1 font-mono text-sm font-bold text-[#343434]">
                            Camp #{admission.camp_id}
                          </p>
                        </div>

                        <div className="rounded-md border border-[#CCCCCC] bg-[#F7F7F7] p-3 md:col-span-2">
                          <p className="font-mono text-xs font-bold uppercase text-gray-500">
                            Observations
                          </p>

                          <p className="mt-1 whitespace-pre-wrap font-mono text-sm text-[#343434]">
                            {admission.observations || "No observations."}
                          </p>
                        </div>
                      </div>

                      {evaluationResult ? (
                        <div className="mt-4 rounded-lg border border-[#CCCCCC] bg-white p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <BrainCircuit
                              size={16}
                              className="text-[#FF6600]"
                            />

                            <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#343434]">
                              AI Evaluation
                            </p>
                          </div>

                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="rounded-md border border-[#CCCCCC] bg-[#F7F7F7] p-3">
                              <p className="font-mono text-xs font-bold uppercase text-gray-500">
                                Suitable
                              </p>

                              <p className="mt-1 font-mono text-sm font-bold text-[#343434]">
                                {evaluationResult.evaluation.apto
                                  ? "YES"
                                  : "NO"}
                              </p>
                            </div>

                            <div className="rounded-md border border-[#CCCCCC] bg-[#F7F7F7] p-3">
                              <p className="font-mono text-xs font-bold uppercase text-gray-500">
                                Risk
                              </p>

                              <p className="mt-1 font-mono text-sm font-bold uppercase text-[#343434]">
                                {formatRisk(
                                  evaluationResult.evaluation.riesgo,
                                )}
                              </p>
                            </div>

                            <div className="rounded-md border border-[#CCCCCC] bg-[#F7F7F7] p-3 md:col-span-2">
                              <p className="font-mono text-xs font-bold uppercase text-gray-500">
                                Recommended Assignment
                              </p>

                              <p className="mt-1 font-mono text-sm text-[#343434]">
                                {formatRecommendedAssignment(
                                  evaluationResult.evaluation
                                    .asignacion_recomendada,
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
                            <BrainCircuit
                              size={16}
                              className="text-yellow-700"
                            />

                            <p className="font-mono text-xs font-bold uppercase tracking-widest text-yellow-800">
                              AI Evaluation Pending
                            </p>
                          </div>

                          <p className="mt-2 text-sm text-yellow-800">
                            This request does not have a visible evaluation yet.
                            If it was created before automatic evaluation was
                            enabled, create a new request or verify whether the
                            evaluation already exists in the backend.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex shrink-0 flex-row gap-2 lg:flex-col">
                      <button
                        type="button"
                        onClick={() => setSelectedAdmission(admission)}
                        disabled={isUpdating}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-green-600 bg-green-600 px-4 font-mono text-xs font-bold uppercase tracking-widest text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Check size={16} />
                        Accept
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleReject(admission.id)}
                        disabled={isUpdating}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-600 bg-red-600 px-4 font-mono text-xs font-bold uppercase tracking-widest text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <X size={16} />
                        Reject
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {selectedAdmission && (
        <AdmissionApprovalModal
          admission={selectedAdmission}
          personLabel={getPersonLabel(selectedAdmission)}
          aiEvaluation={
            selectedAdmission.id != null
              ? evaluationsByAdmissionId[selectedAdmission.id]
              : undefined
          }
          isSubmitting={updatingId === selectedAdmission.id}
          onClose={() => setSelectedAdmission(null)}
          onConfirm={handleConfirmApproval}
        />
      )}
    </>
  );
}