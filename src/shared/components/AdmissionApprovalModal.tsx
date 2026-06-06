import { useEffect, useMemo, useState } from "react";
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

function buildDefaultUsername(
  personLabel?: string,
  admission?: AdmissionRequest,
) {
  const cleanName = normalize(personLabel)
    .replace(/[^a-z0-9\s.]/g, "")
    .replace(/\s+/g, ".")
    .replace(/\.+/g, ".")
    .replace(/^\./, "")
    .replace(/\.$/, "");

  if (cleanName) return cleanName;

  return `user.${admission?.person_id ?? "new"}`;
}

export function AdmissionApprovalModal({
  admission,
  personLabel,
  aiEvaluation,
  isSubmitting = false,
  onClose,
  onConfirm,
}: Props) {
  const [step, setStep] = useState<1 | 2>(1);

  const [roles, setRoles] = useState<Role[]>([]);
  const [professions, setProfessions] = useState<Profession[]>([]);

  const [roleId, setRoleId] = useState("");
  const [professionId, setProfessionId] = useState("");

  const [username, setUsername] = useState(() =>
    buildDefaultUsername(personLabel, admission),
  );
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
            rolesResponse.getMensaje() || "No se pudieron cargar los roles.",
          );
          return;
        }

        if (!professionsResponse.getEstado()) {
          setLocalError(
            professionsResponse.getMensaje() ||
              "No se pudieron cargar las profesiones.",
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

        const workerRole = loadedRoles.find((role) => {
          const roleText = getRoleText(role);

          return roleText.includes("worker") || roleText.includes("trabajador");
        });

        setRoleId(String(workerRole?.id ?? loadedRoles[0]?.id ?? ""));

        const recommended = normalize(recommendedProfession);

        const matchedProfession = loadedProfessions.find((profession) => {
          const code = normalize(profession.code);
          const name = normalize(profession.name);

          return (
            recommended !== "" &&
            (recommended === code ||
              recommended === name ||
              recommended.includes(name) ||
              name.includes(recommended) ||
              recommended.includes(code) ||
              code.includes(recommended))
          );
        });

        setProfessionId(
          String(matchedProfession?.id ?? loadedProfessions[0]?.id ?? ""),
        );

        if (loadedRoles.length === 0) {
          setLocalError(
            "No hay roles operativos disponibles para asignar dentro del campamento.",
          );
        }
      } catch (error) {
        console.error(error);

        if (mounted) {
          setLocalError("Error inesperado al cargar roles y profesiones.");
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

  const validateStepOne = () => {
    if (!roleId) {
      setLocalError("Seleccione el rol que tendrá la persona en el sistema.");
      return false;
    }

    if (!professionId) {
      setLocalError(
        "Seleccione la profesión que tendrá la persona en el campamento.",
      );
      return false;
    }

    setLocalError("");
    return true;
  };

  const validateStepTwo = () => {
    if (!username.trim()) {
      setLocalError("Ingrese un nombre de usuario.");
      return false;
    }

    if (password.trim().length < 8) {
      setLocalError("La contraseña debe tener al menos 8 caracteres.");
      return false;
    }

    if (password !== confirmPassword) {
      setLocalError("La confirmación de contraseña no coincide.");
      return false;
    }

    setLocalError("");
    return true;
  };

  const handleNext = () => {
    if (!validateStepOne()) return;
    setStep(2);
  };

  const handleConfirm = async () => {
    if (!validateStepOne()) {
      setStep(1);
      return;
    }

    if (!validateStepTwo()) return;

    const ok = await onConfirm({
      role_id: Number(roleId),
      profession_id: Number(professionId),
      username: username.trim(),
      password: password.trim(),
    });

    if (ok) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-2xl overflow-hidden border border-border-default bg-bg-primary shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-default bg-bg-secondary px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center border border-accent/40 bg-accent/10 text-accent">
              <UserCheck size={18} />
            </div>

            <div>
              <h2 className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-txt-primary">
                Confirmar ingreso
              </h2>
              <p className="font-mono text-[11px] text-txt-disabled">
                Solicitud #{admission.id ?? "--"} · Persona #
                {admission.person_id}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-txt-disabled transition hover:text-txt-primary disabled:opacity-50"
            aria-label="Cerrar modal"
            title="Cerrar modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="border-b border-border-default bg-bg-primary px-5 py-3">
          <div className="grid grid-cols-2 gap-3 font-mono text-[11px] uppercase tracking-[0.16em]">
            <div
              className={`border px-3 py-2 ${
                step === 1
                  ? "border-accent text-accent"
                  : "border-border-default text-txt-disabled"
              }`}
            >
              1. Rol y profesión
            </div>

            <div
              className={`border px-3 py-2 ${
                step === 2
                  ? "border-accent text-accent"
                  : "border-border-default text-txt-disabled"
              }`}
            >
              2. Credenciales
            </div>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
          {localError ? (
            <div className="mb-4 border border-status-critical/40 bg-status-critical/10 px-4 py-3 font-mono text-xs text-status-critical">
              {localError}
            </div>
          ) : null}

          <div className="mb-5 grid gap-3 border border-border-default bg-bg-secondary/40 p-4 font-mono text-xs">
            <div>
              <span className="text-txt-disabled">Persona: </span>
              <span className="font-bold text-txt-primary">
                {personLabel || `Persona #${admission.person_id}`}
              </span>
            </div>

            {aiEvaluation ? (
              <>
                <div>
                  <span className="text-txt-disabled">Resultado IA: </span>
                  <span
                    className={
                      aiEvaluation.evaluation.apto
                        ? "text-status-ok"
                        : "text-status-critical"
                    }
                  >
                    {aiEvaluation.evaluation.apto ? "Apto" : "No apto"}
                  </span>
                </div>

                <div>
                  <span className="text-txt-disabled">Riesgo: </span>
                  <span className="text-txt-primary">
                    {aiEvaluation.evaluation.riesgo}
                  </span>
                </div>

                <div>
                  <span className="text-txt-disabled">
                    Profesión recomendada:{" "}
                  </span>
                  <span className="text-accent">
                    {recommendedProfession || "No especificada"}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-txt-disabled">
                No se encontró evaluación de IA asociada.
              </div>
            )}
          </div>

          {loadingCatalogs ? (
            <div className="border border-border-default bg-bg-secondary/40 p-6 text-center font-mono text-xs uppercase tracking-[0.18em] text-txt-disabled">
              Cargando roles y profesiones...
            </div>
          ) : step === 1 ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                  Rol del sistema
                </label>

                <select
                  value={roleId}
                  onChange={(event) => setRoleId(event.target.value)}
                  className="w-full border border-border-default bg-bg-tertiary px-3 py-3 font-mono text-xs text-txt-primary outline-none transition focus:border-accent"
                  title="Rol del sistema"
                >
                  <option value="">Seleccione un rol</option>
                  {roles.map((role) => (
                    <option key={role.id} value={String(role.id)}>
                      {role.name}
                    </option>
                  ))}
                </select>

                <p className="font-mono text-[11px] text-txt-disabled">
                  Solo se pueden asignar roles operativos del campamento. Los
                  roles administrativos los gestiona el administrador del
                  sistema.
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                  Profesión del campamento
                </label>

                <select
                  value={professionId}
                  onChange={(event) => setProfessionId(event.target.value)}
                  className="w-full border border-border-default bg-bg-tertiary px-3 py-3 font-mono text-xs text-txt-primary outline-none transition focus:border-accent"
                  title="Profesión del campamento"
                >
                  <option value="">Seleccione una profesión</option>
                  {professions.map((profession) => (
                    <option key={profession.id} value={String(profession.id)}>
                      {profession.code} · {profession.name}
                    </option>
                  ))}
                </select>

                <p className="font-mono text-[11px] text-txt-disabled">
                  La IA solo recomienda profesión. El administrador puede
                  confirmar esa recomendación o cambiarla.
                </p>
              </div>

              <div className="border border-border-default bg-bg-secondary/30 p-4 font-mono text-[11px] text-txt-secondary">
                <p>
                  <span className="text-txt-disabled">
                    Rol seleccionado:{" "}
                  </span>
                  <span className="text-txt-primary">
                    {selectedRole?.name ?? "Sin seleccionar"}
                  </span>
                </p>

                <p className="mt-2">
                  <span className="text-txt-disabled">
                    Profesión seleccionada:{" "}
                  </span>
                  <span className="text-txt-primary">
                    {selectedProfession
                      ? `${selectedProfession.code} · ${selectedProfession.name}`
                      : "Sin seleccionar"}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-accent">
                <Lock size={15} />
                Credenciales de acceso
              </div>

              <div className="space-y-2">
                <label className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                  Nombre de usuario
                </label>

                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="usuario.campamento"
                  className="w-full border border-border-default bg-bg-tertiary px-3 py-3 font-mono text-xs text-txt-primary outline-none transition placeholder:text-txt-disabled/40 focus:border-accent"
                  title="Nombre de usuario"
                />
              </div>

              <div className="space-y-2">
                <label className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                  Contraseña
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full border border-border-default bg-bg-tertiary px-3 py-3 font-mono text-xs text-txt-primary outline-none transition placeholder:text-txt-disabled/40 focus:border-accent"
                  title="Contraseña"
                />
              </div>

              <div className="space-y-2">
                <label className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                  Confirmar contraseña
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Repita la contraseña"
                  className="w-full border border-border-default bg-bg-tertiary px-3 py-3 font-mono text-xs text-txt-primary outline-none transition placeholder:text-txt-disabled/40 focus:border-accent"
                  title="Confirmar contraseña"
                />
              </div>

              <div className="border border-border-default bg-bg-secondary/30 p-4 font-mono text-[11px] text-txt-secondary">
                Al confirmar, se aceptará la solicitud, se asignará la profesión
                seleccionada, se creará el usuario y se le asignará el rol
                operativo definido.
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-border-default bg-bg-secondary px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="border border-border-default px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-txt-secondary transition hover:border-txt-disabled hover:text-txt-primary disabled:opacity-50"
          >
            Cancelar
          </button>

          <div className="flex flex-col gap-3 sm:flex-row">
            {step === 2 ? (
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 border border-border-default px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-txt-secondary transition hover:border-txt-disabled hover:text-txt-primary disabled:opacity-50"
              >
                <ChevronLeft size={14} />
                Atrás
              </button>
            ) : null}

            {step === 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={loadingCatalogs || isSubmitting || roles.length === 0}
                className="flex items-center justify-center gap-2 bg-accent px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-accent-fg transition hover:bg-accent-hover disabled:opacity-50"
              >
                Siguiente
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void handleConfirm()}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 bg-accent px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-accent-fg transition hover:bg-accent-hover disabled:opacity-50"
              >
                {isSubmitting ? (
                  "Procesando..."
                ) : (
                  <>
                    <ShieldCheck size={14} />
                    Confirmar ingreso
                    <CheckCircle size={14} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}