import { BrainCircuit, Check, X } from "lucide-react";
import type { ReactNode } from "react";
import type { AdmissionRequest } from "../../../models/AdmissionRequest";

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

type AdmissionEvaluation = {
  apto?: boolean;
  riesgo?: string | null;
  razon?: string | null;
  asignacion_recomendada?: string | null;
  [key: string]: unknown;
};

type AdmissionRequestCardProps = {
  admission: AdmissionRequestExtended;
  evaluation?: AdmissionEvaluation;
  isUpdating: boolean;
  onAccept: (admission: AdmissionRequestExtended) => void;
  onReject: (admissionId?: number | null) => void;
};

const professionNameMap: Record<string, string> = {
  AGRI: "Agriculture",
  LOGIS: "Logistics",
  EXPLO: "Exploration",
  MEDI: "Medicine",
  SEGUR: "Security",
  TELE: "Communication",
  INGEN: "Engineering",
  COCIN: "Cooking",
  MANTE: "Maintenance",
  CUARENTENA: "Quarantine",

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

function formatAiDecision(apto?: boolean) {
  if (apto === true) return "Accept";
  if (apto === false) return "Reject";

  return "Not evaluated";
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
  variant = "default",
}: {
  label: string;
  value: ReactNode;
  accent?: boolean;
  variant?: "default" | "success" | "danger";
}) {
  const valueColor =
    variant === "success"
      ? "text-status-ok"
      : variant === "danger"
        ? "text-status-critical"
        : accent
          ? "text-accent"
          : "text-txt-primary";

  return (
    <div className="border border-border-default bg-bg-primary px-4 py-3">
      <p className="text-[12px] font-bold uppercase tracking-[0.13em] text-txt-disabled">
        {label}
      </p>

      <div
        className={`mt-2 text-[15px] font-bold leading-relaxed tracking-[0.03em] ${valueColor}`}
      >
        {value}
      </div>
    </div>
  );
}

export function AdmissionRequestCard({
  admission,
  evaluation,
  isUpdating,
  onAccept,
  onReject,
}: AdmissionRequestCardProps) {
  const aiDecision = formatAiDecision(evaluation?.apto);

  const decisionVariant =
    evaluation?.apto === true
      ? "success"
      : evaluation?.apto === false
        ? "danger"
        : "default";

  return (
    <article className="border border-border-default bg-bg-secondary p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-accent">
            Request #{admission.id}
          </p>

          <h3 className="mt-2 text-[20px] font-bold uppercase tracking-[0.08em] text-txt-primary">
            {formatPersonName(admission)}
          </h3>

          <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.14em] text-txt-secondary">
            {formatCampLabel(admission)}
          </p>
        </div>

        <div className="flex gap-3">
         <button
            type="button"
            onClick={() => onAccept(admission)}
            disabled={isUpdating}
            className="users-system-action-btn admission-toolbar-btn admission-toolbar-btn--accept"
          >
            <Check size={14} />
            Accept
          </button>
            <button
              type="button"
              onClick={() => onReject(admission.id)}
              disabled={isUpdating}
              className="users-system-action-btn admission-toolbar-btn admission-toolbar-btn--reject"
            >
              <X size={14} />
              Reject
            </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-4">
        <MiniBox
          label="DNI"
          value={admission.person?.dni ?? `Person #${admission.person_id}`}
        />

        <MiniBox
          label="AI Decision"
          value={aiDecision}
          variant={decisionVariant}
        />

        <MiniBox
          label="Risk"
          value={formatRisk(evaluation?.riesgo)}
          accent={Boolean(evaluation?.riesgo)}
        />

        <MiniBox
          label="Recommended"
          value={formatRecommendedAssignment(evaluation?.asignacion_recomendada)}
          accent
        />
      </div>

      <div className="mt-4 border border-border-default bg-bg-primary p-4">
        <div className="mb-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-accent">
          <BrainCircuit size={14} />
          AI Evaluation Reason
        </div>

        <p className="text-[13px] font-bold leading-relaxed tracking-[0.04em] text-txt-secondary">
          {evaluation?.razon ??
            admission.observations ??
            "No evaluation details available."}
        </p>
      </div>
    </article>
  );
}