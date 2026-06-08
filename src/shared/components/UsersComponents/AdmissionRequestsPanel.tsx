import { useState } from "react";
import {
  ArrowLeft,
  ClipboardList,
} from "lucide-react";

import type { AdmissionRequest } from "../../../models/AdmissionRequest";
import { useAdmissionRequestsView } from "../../hooks/useAdmissionRequestsView";
import { AdmissionApprovalModal } from "./AdmissionApprovalModal";
import { AdmissionEmptyState } from "./AdmissionEmptyState";
import { AdmissionRequestCard } from "./AdmissionRequestCard";

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

  const admissionsToRender: AdmissionRequestExtended[] = Array.isArray(
    pendingAdmissions,
  )
    ? (pendingAdmissions as AdmissionRequestExtended[])
    : [];

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
          <div className="mx-5 mt-4 border border-status-critical/40 bg-status-critical/10 px-4 py-3 text-[12px] font-bold uppercase tracking-[0.12em] text-status-critical">
            {error}
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {admissionsToRender.length === 0 ? (
            <AdmissionEmptyState />
          ) : (
            <div className="space-y-4">
              {admissionsToRender.map((admission) => (
                <AdmissionRequestCard
                  key={admission.id ?? admission.person_id}
                  admission={admission}
                  evaluation={
                    admission.id
                      ? evaluationsByAdmissionId[admission.id]
                      : undefined
                  }
                  isUpdating={updatingId === admission.id}
                  onAccept={setSelectedAdmission}
                  onReject={handleReject}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedAdmission ? (
        <AdmissionApprovalModal
          admission={selectedAdmission}
          onClose={() => setSelectedAdmission(null)}
          onConfirm={handleConfirmApproval}
        />
      ) : null}
    </>
  );
}