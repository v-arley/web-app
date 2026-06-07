import { useState } from "react";
import {
  ArrowLeft,
  BrainCircuit,
  Check,
  ClipboardList,
  UserRound,
  X,
} from "lucide-react";

import type { AdmissionRequest } from "../../models/AdmissionRequest";
import { useAdmissionRequestsView } from "../hooks/useAdmissionRequestsView";
import { AdmissionApprovalModal } from "./AdmissionApprovalModal";

type AdmissionRequestsPanelProps = {
  onAdmissionResolved?: (message?: string) => void | Promise<void>;
  onBackToStaff?: () => void;
};

type ApprovalPayload = {
  role_id: number;
  profession_id: number;
  username: string;
  password: string;
};

type AdmissionPersonLike = {
  id?: number;
  dni?: string;
  name?: string;
  surname?: string;
  last_name?: string;
  first_name?: string;
};

type AdmissionCampLike = {
  id?: number;
  code?: string;
  name?: string;
};

type AdmissionRequestExtended = AdmissionRequest & {
  person?: AdmissionPersonLike;
  camp?: AdmissionCampLike;
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

function formatPersonName(admission: AdmissionRequestExtended) {
  const person = admission.person;

  if (!person) {
    return `Person #${admission.person_id}`;
  }

  const fullName = [
    person.first_name ?? person.name,
    person.surname ?? person.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (fullName) return fullName;
  if (person.dni) return `DNI ${person.dni}`;

  return `Person #${admission.person_id}`;
}

function formatCampLabel(admission: AdmissionRequestExtended) {
  const camp = admission.camp;

  if (camp?.code) return camp.code;
  if (camp?.name) return camp.name;
  if (camp?.id) return `Camp #${camp.id}`;

  return `Camp #${admission.camp_id}`;
}

function MiniBox({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="border border-border-default bg-bg-primary px-4 py-3">
      <p className="text-[12px] font-bold uppercase tracking-[0.13em] text-txt-disabled">
        {label}
      </p>

      <div
        className={`mt-2 text-[15px] font-bold leading-relaxed tracking-[0.03em] ${
          accent ? "text-accent" : "text-txt-primary"
        }`}
      >
        {value}
      </div>
    </div>
  );
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
    useState<AdmissionRequestExtended | null>(null);

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

      await onAdmissionResolved?.(
        "Admission request accepted successfully. Credentials assigned successfully.",
      );
    }

    return ok;
  };

  const admissionsToRender: AdmissionRequestExtended[] = Array.isArray(
    pendingAdmissions,
  )
    ? (pendingAdmissions as AdmissionRequestExtended[])
    : [];

  if (loading) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center border border-border-default bg-bg-secondary p-8">
        <span className="animate-pulse text-[14px] font-bold uppercase tracking-[0.16em] text-txt-disabled">
          Loading admissions...
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-bg-app">
        <div className="flex shrink-0 items-center justify-between border-b border-border-default bg-bg-secondary px-5 py-3">
          <div className="flex items-center gap-3">
            <ClipboardList size={18} className="text-accent" />

            <div>
              <p className="text-[15px] font-bold uppercase tracking-[0.16em] text-txt-primary">
                Pending Admission Requests
              </p>

              <p className="mt-0.5 text-[12px] uppercase tracking-[0.13em] text-txt-disabled">
                Review / approve / reject
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="border border-accent/40 bg-accent/10 px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.12em] text-accent">
              {admissionsToRender.length} pending
            </span>

            {onBackToStaff ? (
              <button
                type="button"
                onClick={onBackToStaff}
                className="flex h-9 items-center justify-center gap-2 border border-border-default bg-bg-primary px-3 text-[12px] font-bold uppercase tracking-[0.12em] text-txt-primary transition-colors hover:border-accent hover:text-accent"
              >
                <ArrowLeft size={14} />
                Back
              </button>
            ) : null}
          </div>
        </div>

        {error ? (
          <div className="mx-4 mt-4 border border-status-critical bg-status-critical/10 px-4 py-3 text-[14px] font-bold tracking-[0.04em] text-status-critical">
            {error}
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {admissionsToRender.length === 0 ? (
            <div className="flex min-h-[320px] items-center justify-center border border-border-default bg-bg-secondary p-8">
              <div className="max-w-xl text-center">
                <ClipboardList className="mx-auto mb-4 h-10 w-10 text-txt-disabled" />

                <p className="text-[15px] font-bold uppercase tracking-[0.17em] text-txt-primary">
                  No Pending Admissions
                </p>

                <p className="mt-3 text-[14px] leading-relaxed tracking-[0.04em] text-txt-secondary">
                  New requests will appear here after a staff member is
                  registered.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {admissionsToRender.map((admission) => {
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
                    className="border border-border-default bg-bg-secondary"
                  >
                    <div className="flex flex-col gap-3 border-b border-border-default px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="border border-border-strong bg-bg-primary px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.12em] text-txt-primary">
                          Request #{admission.id ?? "--"}
                        </span>

                        <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-txt-disabled">
                          Admission review
                        </span>
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => setSelectedAdmission(admission)}
                          disabled={isUpdating}
                          className="flex h-9 items-center justify-center gap-2 border border-status-ok bg-status-ok px-4 text-[12px] font-bold uppercase tracking-[0.12em] text-accent-fg transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Check size={15} />
                          Accept
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleReject(admission.id)}
                          disabled={isUpdating}
                          className="flex h-9 items-center justify-center gap-2 border border-status-critical bg-status-critical px-4 text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <X size={15} />
                          Reject
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 p-4">
                      <div className="grid gap-3 md:grid-cols-2">
                        <MiniBox
                          label="Person"
                          value={
                            <span className="flex items-center gap-2">
                              <UserRound size={15} className="text-accent" />
                              {formatPersonName(admission)}
                            </span>
                          }
                        />

                        <MiniBox
                          label="Camp"
                          value={formatCampLabel(admission)}
                        />
                      </div>

                      <div className="border border-border-default bg-bg-primary px-4 py-3">
                        <p className="text-[12px] font-bold uppercase tracking-[0.13em] text-txt-disabled">
                          Observations
                        </p>

                        <div className="mt-2 max-h-[96px] overflow-y-auto whitespace-pre-wrap pr-2 text-[15px] leading-relaxed tracking-[0.03em] text-txt-primary">
                          {admission.observations || "No observations."}
                        </div>
                      </div>

                      <div className="border border-border-default bg-bg-primary px-4 py-3">
                        <div className="mb-3 flex items-center gap-2 border-b border-border-default pb-2">
                          <BrainCircuit size={16} className="text-accent" />

                          <p className="text-[14px] font-bold uppercase tracking-[0.14em] text-txt-primary">
                            AI Evaluation
                          </p>
                        </div>

                        {evaluationResult ? (
                          <div className="space-y-3">
                            <div className="grid gap-3 md:grid-cols-4">
                              <MiniBox
                                label="Suitable"
                                value={
                                  evaluationResult.evaluation.apto
                                    ? "YES"
                                    : "NO"
                                }
                              />

                              <MiniBox
                                label="Risk"
                                value={formatRisk(
                                  evaluationResult.evaluation.riesgo,
                                )}
                                accent
                              />

                              <MiniBox
                                label="Recommended"
                                value={formatRecommendedAssignment(
                                  evaluationResult.evaluation
                                    .asignacion_recomendada,
                                )}
                              />

                              <MiniBox
                                label="AI Decision"
                                value={
                                  aiDecisionStatus === "A"
                                    ? "ACCEPTED"
                                    : aiDecisionStatus === "R"
                                      ? "REJECTED"
                                      : "NO DECISION"
                                }
                              />
                            </div>

                            <div className="border border-border-default bg-bg-secondary px-4 py-3">
                              <p className="text-[12px] font-bold uppercase tracking-[0.13em] text-txt-disabled">
                                Reason
                              </p>

                              <p className="mt-2 max-h-[90px] overflow-y-auto pr-2 text-[15px] leading-relaxed tracking-[0.03em] text-txt-primary">
                                {evaluationResult.evaluation.razon}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="border border-status-warning/40 bg-status-warning/10 px-3 py-3">
                            <p className="text-[13px] font-bold uppercase tracking-[0.13em] text-status-warning">
                              AI evaluation not available
                            </p>

                            <p className="mt-2 text-[14px] leading-relaxed tracking-[0.03em] text-txt-secondary">
                              This request does not have a visible evaluation
                              yet.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedAdmission ? (
        <AdmissionApprovalModal
          admission={selectedAdmission}
          personLabel={formatPersonName(selectedAdmission)}
          aiEvaluation={
            selectedAdmission.id != null
              ? evaluationsByAdmissionId[selectedAdmission.id]
              : undefined
          }
          isSubmitting={updatingId === selectedAdmission.id}
          onClose={() => setSelectedAdmission(null)}
          onConfirm={handleConfirmApproval}
        />
      ) : null}
    </>
  );
}