import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X,
} from "lucide-react";

import type { AdmissionRequest } from "../../../models/AdmissionRequest";
import type { Profession } from "../../../models/Profession";
import type { Role } from "../../../models/Role";
import { ProfessionService } from "../../../services/ProfessionService";
import { RoleService } from "../../../services/RoleService";
import { AdmissionApprovalSidebar } from "./AdmissionApprovalSidebar";
import { AdmissionApprovalStepContent } from "./AdmissionApprovalStepContent";

type AiEvaluationView = {
  evaluation: {
    apto: boolean;
    riesgo: string;
    razon: string;
    asignacion_recomendada: string;
  };
};

type ApprovalPayload = {
  role_id: number;
  profession_id: number;
  username: string;
  password: string;
};

type ServiceResponse = {
  getEstado: () => boolean;
  getMensaje: () => string;
  getResultado: (key: string) => unknown;
};

type Props = {
  admission: AdmissionRequest;
  personLabel?: string;
  aiEvaluation?: AiEvaluationView;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (payload: ApprovalPayload) => Promise<boolean>;
};

const roleService = new RoleService();
const professionService = new ProfessionService();

function getListFromResponse<T>(response: ServiceResponse): T[] {
  const registros = response.getResultado("registros");
  const items = response.getResultado("items");

  if (Array.isArray(registros)) return registros as T[];
  if (Array.isArray(items)) return items as T[];

  return [];
}

function normalize(value?: string | null) {
  return (
    value
      ?.trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") ?? ""
  );
}

function getProfessionEnglishName(value?: string | null) {
  const normalizedValue = value?.trim().toUpperCase() ?? "";

  const map: Record<string, string> = {
    AGRI: "Farmer",
    MEDI: "Doctor",
    INGEN: "Engineer",
    EXPLO: "Explorer",
    LOGIS: "Logistics",
    SEGUR: "Security Agent",
    TELE: "Communications Technician",
    COCIN: "Cook",
    MANTE: "Maintenance Technician",
    CUARENTENA: "Quarantine",

    "PROF-AGR": "Farmer",
    "PROF-MED": "Doctor",
    "PROF-ENG": "Engineer",
    "PROF-EXP": "Explorer",
    "PROF-LOG": "Logistics",
    "PROF-SEC": "Security Agent",
    "PROF-COM": "Communications Technician",
    "PROF-COC": "Cook",
    "PROF-COOK": "Cook",
  };

  return map[normalizedValue] ?? value ?? "";
}

function getProfessionCode(value?: string | null) {
  const normalizedValue = value?.trim().toUpperCase() ?? "";

  const map: Record<string, string> = {
    AGRI: "AGRI",
    MEDI: "MEDI",
    INGEN: "INGEN",
    EXPLO: "EXPLO",
    LOGIS: "LOGIS",
    SEGUR: "SEGUR",
    TELE: "TELE",
    COCIN: "COCIN",
    MANTE: "MANTE",
    CUARENTENA: "CUARENTENA",

    "PROF-AGR": "AGRI",
    "PROF-MED": "MEDI",
    "PROF-ENG": "INGEN",
    "PROF-EXP": "EXPLO",
    "PROF-LOG": "LOGIS",
    "PROF-SEC": "SEGUR",
    "PROF-COM": "TELE",
    "PROF-COC": "COCIN",
    "PROF-COOK": "COCIN",
  };

  return map[normalizedValue] ?? normalizedValue;
}

function getRoleText(role: Role) {
  const rawRole = role as Role & {
    code?: string;
    name?: string;
    description?: string;
  };

  return normalize(
    `${rawRole.code ?? ""} ${rawRole.name ?? ""} ${
      rawRole.description ?? ""
    }`,
  );
}

function isOperationalCampRole(role: Role) {
  const text = getRoleText(role);

  const isAdminRole =
    text.includes("admin") ||
    text.includes("administrator") ||
    text.includes("administrador") ||
    text.includes("system") ||
    text.includes("sistema") ||
    text.includes("global");

  if (isAdminRole) return false;

  return (
    text.includes("worker") ||
    text.includes("trabajador") ||
    text.includes("resource") ||
    text.includes("recurso") ||
    text.includes("manager") ||
    text.includes("gestor") ||
    text.includes("gestion") ||
    text.includes("expedition") ||
    text.includes("exploration") ||
    text.includes("exploracion") ||
    text.includes("viajes") ||
    text.includes("communication") ||
    text.includes("comunicacion") ||
    text.includes("leader") ||
    text.includes("encargado")
  );
}

function getRoleLabel(role: Role) {
  const rawRole = role as Role & {
    code?: string;
    name?: string;
    description?: string;
  };

  const code = rawRole.code ?? `ROLE-${role.id}`;
  const name = rawRole.name ?? rawRole.description ?? "";

  return name ? `${code} · ${name}` : code;
}

function getProfessionLabel(profession: Profession) {
  const rawProfession = profession as Profession & {
    code?: string;
    name?: string;
    description?: string;
  };

  const code = rawProfession.code ?? `PROF-${profession.id}`;
  const englishName = getProfessionEnglishName(code);

  return englishName ? `${code} · ${englishName}` : code;
}

function getProfessionSearchText(profession: Profession) {
  const rawProfession = profession as Profession & {
    code?: string;
    name?: string;
    description?: string;
  };

  return normalize(
    `${rawProfession.code ?? ""} ${rawProfession.name ?? ""} ${
      rawProfession.description ?? ""
    }`,
  );
}

function findRecommendedProfessionId(
  professions: Profession[],
  recommendedProfession: string,
) {
  const recommendedCode = getProfessionCode(recommendedProfession);

  if (!recommendedCode) return "";

  const codeMatch = professions.find((profession) => {
    const rawProfession = profession as Profession & {
      code?: string;
    };

    return getProfessionCode(rawProfession.code) === recommendedCode;
  });

  if (codeMatch?.id) return String(codeMatch.id);

  const recommendedText = normalize(recommendedProfession);

  const partialMatch = professions.find((profession) => {
    const professionText = getProfessionSearchText(profession);

    return (
      professionText.includes(recommendedText) ||
      recommendedText.includes(professionText)
    );
  });

  return partialMatch?.id ? String(partialMatch.id) : "";
}



export function AdmissionApprovalModal({
  admission,
  personLabel,
  aiEvaluation,
  isSubmitting = false,
  onClose,
  onConfirm,
}: Props) {
  const roleSelectRef = useRef<HTMLSelectElement | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null);

  const [step, setStep] = useState<1 | 2>(1);
  const [roles, setRoles] = useState<Role[]>([]);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [roleId, setRoleId] = useState("");
  const [professionId, setProfessionId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  const [localError, setLocalError] = useState("");

const recommendedProfessionCode =
  aiEvaluation?.evaluation.asignacion_recomendada ?? "";

const recommendedProfession = recommendedProfessionCode
  ? `${getProfessionCode(recommendedProfessionCode)} · ${getProfessionEnglishName(
      recommendedProfessionCode,
    )}`
  : "";

  useEffect(() => {
    let mounted = true;

    const loadCatalogs = async () => {
      try {
        setLoadingCatalogs(true);
        setLocalError("");

        const [rolesResponse, professionsResponse] = await Promise.all([
          roleService.findAll(),
          professionService.findAll(),
        ]);

        if (!mounted) return;

        if (!rolesResponse.getEstado()) {
          setLocalError(
            rolesResponse.getMensaje() || "Roles could not be loaded.",
          );
          return;
        }

        if (!professionsResponse.getEstado()) {
          setLocalError(
            professionsResponse.getMensaje() ||
              "Professions could not be loaded.",
          );
          return;
        }

        const loadedRoles = getListFromResponse<Role>(rolesResponse).filter(
          isOperationalCampRole,
        );

        const loadedProfessions =
          getListFromResponse<Profession>(professionsResponse);

        setRoles(loadedRoles);
        setProfessions(loadedProfessions);

        if (loadedRoles.length > 0) {
          setRoleId(String(loadedRoles[0].id));
        }

        const suggestedProfessionId = findRecommendedProfessionId(
          loadedProfessions,
          recommendedProfession,
        );

        if (suggestedProfessionId) {
          setProfessionId(suggestedProfessionId);
        } else if (loadedProfessions.length > 0) {
          setProfessionId(String(loadedProfessions[0].id));
        }
      } catch (error) {
        console.error(error);

        if (mounted) {
          setLocalError("An unexpected error occurred while loading catalogs.");
        }
      } finally {
        if (mounted) {
          setLoadingCatalogs(false);
        }
      }
    };

    void loadCatalogs();

    return () => {
      mounted = false;
    };
  }, [recommendedProfession]);

  useEffect(() => {
    if (step === 1 && !loadingCatalogs) {
      window.setTimeout(() => roleSelectRef.current?.focus(), 0);
    }

    if (step === 2) {
      window.setTimeout(() => usernameRef.current?.focus(), 0);
    }
  }, [step, loadingCatalogs]);

  const handleNext = () => {
    setLocalError("");

    if (!roleId || !professionId) {
      setLocalError("Select a role and a profession before continuing.");
      return;
    }

    setStep(2);
  };

  const handleConfirm = async () => {
    setLocalError("");

    if (!roleId || !professionId) {
      setStep(1);
      setLocalError("Select a role and a profession before confirming.");
      return;
    }

    if (!username.trim()) {
      setLocalError("Username is required.");
      return;
    }

    if (password.length < 8) {
      setLocalError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    const ok = await onConfirm({
      role_id: Number(roleId),
      profession_id: Number(professionId),
      username: username.trim(),
      password,
    });

    if (ok) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-3 font-mono backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-5xl overflow-hidden border border-border-default bg-bg-primary shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <AdmissionApprovalSidebar
          step={step}
          admissionId={admission.id}
          personLabel={personLabel}
        />

        <section className="flex min-w-0 flex-1 flex-col bg-bg-primary">
          <div className="flex shrink-0 items-center justify-between border-b border-border-default bg-bg-secondary px-6 py-4 md:px-8">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.22em] text-txt-disabled">
                {step === 1 ? "STEP 01" : "STEP 02"}
              </p>

              <h3 className="mt-1 text-[27px] font-bold uppercase tracking-[0.08em] text-txt-primary">
                {step === 1 ? "Role and Profession" : "Access Credentials"}
              </h3>

              <p className="mt-1 text-[12px] font-bold tracking-[0.05em] text-txt-secondary">
                <span className="text-status-critical">*</span> Required fields
              </p>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 md:px-8">
            {localError ? (
              <div className="mb-4 border border-status-critical bg-status-critical/10 px-4 py-3 text-[14px] font-bold tracking-[0.05em] text-status-critical">
                {localError}
              </div>
            ) : null}

            <AdmissionApprovalStepContent
              step={step}
              admission={admission}
              personLabel={personLabel}
              recommendedProfession={recommendedProfession}
              roles={roles}
              professions={professions}
              roleId={roleId}
              professionId={professionId}
              username={username}
              password={password}
              confirmPassword={confirmPassword}
              loadingCatalogs={loadingCatalogs}
              isSubmitting={isSubmitting}
              roleSelectRef={roleSelectRef}
              usernameRef={usernameRef}
              getRoleLabel={getRoleLabel}
              getProfessionLabel={getProfessionLabel}
              onRoleChange={setRoleId}
              onProfessionChange={setProfessionId}
              onUsernameChange={setUsername}
              onPasswordChange={setPassword}
              onConfirmPasswordChange={setConfirmPassword}
            />
          </div>

         <div className="flex shrink-0 flex-col gap-3 border-t border-border-default bg-bg-secondary px-6 py-4 sm:flex-row sm:items-center sm:justify-end md:px-8">
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
              {step === 2 ? (
             <button
                type="button"
                onClick={() => setStep(1)}
                className="users-system-action-btn"
              >
                <ChevronLeft size={14} />
                Back
              </button>
              ) : null}

              <button
                type="button"
                onClick={onClose}
                className="users-system-action-btn"
              >
                Cancel
              </button>

              {step === 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={loadingCatalogs || isSubmitting || roles.length === 0}
                  className="users-system-action-btn users-system-action-btn--primary"
                >
                  Next
                  <ChevronRight size={15} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void handleConfirm()}
                  disabled={isSubmitting}
                  className="users-system-action-btn users-system-action-btn--primary"
                >
                  {isSubmitting ? (
                    "Processing..."
                  ) : (
                    <>
                      <ShieldCheck size={15} />
                      Confirm Admission
                      <CheckCircle size={15} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}