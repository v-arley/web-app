import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Lock,
  ShieldCheck,
  UserCheck,
  X,
} from "lucide-react";

import type { AdmissionRequest } from "../../models/AdmissionRequest";
import type { Profession } from "../../models/Profession";
import type { Role } from "../../models/Role";
import { ProfessionService } from "../../services/ProfessionService";
import { RoleService } from "../../services/RoleService";

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

const inputClass =
  "h-12 w-full border border-border-default bg-bg-tertiary px-4 text-[15px] font-bold tracking-[0.04em] text-txt-primary outline-none transition-all placeholder:text-txt-disabled focus:border-accent focus:shadow-[0_0_0_2px_rgba(232,93,4,0.22)]";

const selectClass =
  "h-12 w-full border border-border-default bg-bg-tertiary px-4 text-[15px] font-bold tracking-[0.04em] text-txt-primary outline-none transition-all focus:border-accent focus:shadow-[0_0_0_2px_rgba(232,93,4,0.22)]";

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
  const name = rawProfession.name ?? rawProfession.description ?? "";

  return name ? `${code} · ${name}` : code;
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
  const recommendedText = normalize(recommendedProfession);

  if (!recommendedText) return "";

  const exactMatch = professions.find((profession) => {
    const professionText = getProfessionSearchText(profession);
    return professionText === recommendedText;
  });

  if (exactMatch?.id) return String(exactMatch.id);

  const partialMatch = professions.find((profession) => {
    const professionText = getProfessionSearchText(profession);
    return (
      professionText.includes(recommendedText) ||
      recommendedText.includes(professionText)
    );
  });

  return partialMatch?.id ? String(partialMatch.id) : "";
}

function FieldLabel({
  children,
  htmlFor,
  required = false,
}: {
  children: React.ReactNode;
  htmlFor: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[13px] font-bold uppercase tracking-[0.13em] text-txt-primary"
    >
      {children}
      {required ? <span className="ml-1 text-status-critical">*</span> : null}
    </label>
  );
}

function SummaryLine({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <p className="text-[14px] font-bold tracking-[0.04em] text-txt-secondary">
      {label}: <span className="text-txt-primary">{value}</span>
    </p>
  );
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

  const recommendedProfession =
    aiEvaluation?.evaluation.asignacion_recomendada ?? "";

  const selectedRole = useMemo(() => {
    return roles.find((role) => role.id === Number(roleId));
  }, [roles, roleId]);

  const selectedProfession = useMemo(() => {
    return professions.find(
      (profession) => profession.id === Number(professionId),
    );
  }, [professions, professionId]);

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
        <aside className="hidden w-72 shrink-0 flex-col border-r border-border-default bg-bg-secondary px-7 py-7 md:flex">
          <div className="mb-7 flex h-14 w-14 items-center justify-center bg-accent text-accent-fg">
            <UserCheck className="h-7 w-7" strokeWidth={2.3} />
          </div>

          <h2 className="text-[25px] font-bold uppercase leading-tight tracking-[0.12em] text-txt-primary">
            Confirm
            <br />
            Admission
          </h2>

          <p className="mt-4 text-[13px] font-bold leading-relaxed tracking-[0.04em] text-txt-secondary">
            Request #{admission.id ?? "--"} · {personLabel ?? "Selected person"}
          </p>

          <div className="mt-8 flex flex-col gap-6">
            <div
              className={`flex items-center gap-4 border-b pb-4 transition-all ${
                step === 1
                  ? "border-accent text-accent shadow-[0_8px_12px_-10px_rgba(232,93,4,0.95)]"
                  : "border-border-default text-txt-disabled"
              }`}
            >
              <UserCheck
                className={`h-11 w-11 border bg-transparent p-2 ${
                  step === 1
                    ? "border-accent text-accent shadow-[0_0_12px_rgba(232,93,4,0.7)]"
                    : "border-border-strong text-txt-disabled"
                }`}
                strokeWidth={2.5}
              />

              <p className="text-[15px] font-bold leading-relaxed tracking-[0.07em]">
                Role and Profession
              </p>
            </div>

            <div
              className={`flex items-center gap-4 border-b pb-4 transition-all ${
                step === 2
                  ? "border-accent text-accent shadow-[0_8px_12px_-10px_rgba(232,93,4,0.95)]"
                  : "border-border-default text-txt-disabled"
              }`}
            >
              <Lock
                className={`h-11 w-11 border bg-transparent p-2 ${
                  step === 2
                    ? "border-accent text-accent shadow-[0_0_12px_rgba(232,93,4,0.7)]"
                    : "border-border-strong text-txt-disabled"
                }`}
                strokeWidth={2.5}
              />

              <p className="text-[15px] font-bold leading-relaxed tracking-[0.07em]">
                Access Credentials
              </p>
            </div>
          </div>
        </aside>

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

            <button
              type="button"
              onClick={onClose}
              aria-label="Close admission approval modal"
              title="Close admission approval modal"
              className="flex h-11 w-11 items-center justify-center border border-border-strong text-txt-primary transition-colors hover:border-accent hover:bg-accent hover:text-accent-fg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 md:px-8">
            {localError ? (
              <div className="mb-4 border border-status-critical bg-status-critical/10 px-4 py-3 text-[14px] font-bold tracking-[0.05em] text-status-critical">
                {localError}
              </div>
            ) : null}

            {step === 1 ? (
              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border border-border-default bg-bg-secondary px-4 py-4">
                    <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-txt-disabled">
                      Person
                    </p>

                    <p className="mt-2 text-[17px] font-bold tracking-[0.04em] text-txt-primary">
                      {personLabel ?? `Person #${admission.person_id}`}
                    </p>
                  </div>

                  <div className="border border-accent/50 bg-accent/10 px-4 py-4">
                    <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-accent">
                      Suggested Profession
                    </p>

                    <p className="mt-2 text-[17px] font-bold uppercase tracking-[0.04em] text-txt-primary">
                      {recommendedProfession || "Not suggested"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="approvalRole" required>
                      System Role
                    </FieldLabel>

                    <select
                      id="approvalRole"
                      ref={roleSelectRef}
                      aria-label="System role"
                      title="System role"
                      value={roleId}
                      onChange={(event) => setRoleId(event.target.value)}
                      disabled={loadingCatalogs || isSubmitting}
                      className={selectClass}
                    >
                      {roles.length === 0 ? (
                        <option value="">No operational roles available</option>
                      ) : (
                        roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {getRoleLabel(role)}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="approvalProfession" required>
                      Camp Profession
                    </FieldLabel>

                    <select
                      id="approvalProfession"
                      aria-label="Camp profession"
                      title="Camp profession"
                      value={professionId}
                      onChange={(event) => setProfessionId(event.target.value)}
                      disabled={loadingCatalogs || isSubmitting}
                      className={selectClass}
                    >
                      {professions.length === 0 ? (
                        <option value="">No professions available</option>
                      ) : (
                        professions.map((profession) => (
                          <option key={profession.id} value={profession.id}>
                            {getProfessionLabel(profession)}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid gap-5">
                  <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="approvalUsername" required>
                      Username
                    </FieldLabel>

                    <input
                      id="approvalUsername"
                      ref={usernameRef}
                      aria-label="Username"
                      title="Username"
                      type="text"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      disabled={isSubmitting}
                      className={inputClass}
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <FieldLabel htmlFor="approvalPassword" required>
                        Password
                      </FieldLabel>

                      <input
                        id="approvalPassword"
                        aria-label="Password"
                        title="Password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Minimum 8 characters"
                        disabled={isSubmitting}
                        className={inputClass}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <FieldLabel htmlFor="approvalConfirmPassword" required>
                        Confirm Password
                      </FieldLabel>

                      <input
                        id="approvalConfirmPassword"
                        aria-label="Confirm password"
                        title="Confirm password"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        placeholder="Repeat password"
                        disabled={isSubmitting}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex shrink-0 flex-col gap-3 border-t border-border-default bg-bg-secondary px-6 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="border border-border-strong bg-bg-primary px-7 py-3 text-[14px] font-bold uppercase tracking-[0.12em] text-txt-primary transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <div className="flex flex-col gap-3 sm:flex-row">
              {step === 2 ? (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 border border-border-strong bg-bg-primary px-7 py-3 text-[14px] font-bold uppercase tracking-[0.12em] text-txt-primary transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ChevronLeft size={15} />
                  Back
                </button>
              ) : null}

              {step === 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={loadingCatalogs || isSubmitting || roles.length === 0}
                  className="flex items-center justify-center gap-2 border border-accent bg-accent px-7 py-3 text-[14px] font-bold uppercase tracking-[0.12em] text-accent-fg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:border-border-default disabled:bg-bg-tertiary disabled:text-txt-disabled disabled:opacity-60"
                >
                  Next
                  <ChevronRight size={15} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void handleConfirm()}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 border border-accent bg-accent px-7 py-3 text-[14px] font-bold uppercase tracking-[0.12em] text-accent-fg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:border-border-default disabled:bg-bg-tertiary disabled:text-txt-disabled disabled:opacity-60"
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