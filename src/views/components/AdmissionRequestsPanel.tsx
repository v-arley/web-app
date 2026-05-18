import { BrainCircuit, Check, ClipboardList, X } from "lucide-react";
import { useAdmissionRequestsView } from "../../hooks/useAdmissionRequestsView";

type AdmissionRequestsPanelProps = {
  onAdmissionResolved?: () => void | Promise<void>;
};

export function AdmissionRequestsPanel({
  onAdmissionResolved,
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
      <div className="mt-6 flex min-h-0 flex-1 items-center justify-center rounded-xl border border-dashed border-[#B8B8B8] bg-[#F2F2F2] p-[25px]">
        <span className="font-mono text-sm uppercase tracking-widest text-gray-500">
          Loading admissions...
        </span>
      </div>
    );
  }

  return (
    <div className="mt-6 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto rounded-xl bg-transparent p-[25px]">
      {error && (
        <div className="rounded-md border border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {pendingAdmissions.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-[#B8B8B8] bg-[#F2F2F2] p-[25px]">
          <div className="max-w-xl text-center">
            <ClipboardList className="mx-auto mb-3 h-10 w-10 text-[#808080]" />
            <p className="font-mono text-sm font-bold uppercase tracking-widest text-[#343434]">
              No pending admissions
            </p>
            <p className="mt-3 text-sm text-gray-500">
              Cuando se registre una persona desde Register staff, su solicitud
              pendiente aparecerá aquí.
            </p>
          </div>
        </div>
      ) : (
        pendingAdmissions.map((admission) => {
          const evaluationResult = admission.id
            ? evaluationsByAdmissionId[admission.id]
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
                        {evaluationResult.evaluation.riesgo}
                      </p>
                    </div>

                    <div className="rounded-md border border-[#CCCCCC] bg-[#F7F7F7] p-3 md:col-span-2">
                      <p className="font-mono text-xs font-bold uppercase text-gray-500">
                        Recommended assignment
                      </p>
                      <p className="mt-1 font-mono text-sm text-[#343434]">
                        {evaluationResult.evaluation.asignacion_recomendada}
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
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-lg border border-yellow-500 bg-yellow-50 p-4">
                  <div className="flex items-center gap-2">
                    <BrainCircuit size={16} className="text-yellow-700" />
                    <p className="font-mono text-xs font-bold uppercase tracking-widest text-yellow-800">
                      AI evaluation pending
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-yellow-800">
                    Esta solicitud aún no tiene evaluación visible. Si fue
                    creada antes del cambio automático, registrá una nueva
                    solicitud o revisá si la evaluación ya existe en backend.
                  </p>
                </div>
              )}

              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
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