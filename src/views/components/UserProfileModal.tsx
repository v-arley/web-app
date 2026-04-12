import {
  MonitorCog,
  Pickaxe,
  Power,
  PowerOff,
  ShelvingUnit,
  TentTree,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "./UserProfileModal.css";

type ProfessionKey =
  | "system_administrator"
  | "worker"
  | "resource_manager"
  | "expedition_leader";

type UserDetailModalProps = {
  name: string;
  lastName: string;
  role: string;
  sex: string;
  id: string;
  active: boolean;
  profession: ProfessionKey;
  registrationDate: Date;
  birthdate: Date;
  imageUrl?: string;
  onToggleActive: () => void;
  onChangeProfession: (profession: ProfessionKey) => void;
  onClose: () => void;
};

export function UserProfileModal({
  name,
  lastName,
  role,
  sex,
  id,
  active,
  profession,
  registrationDate,
  birthdate,
  imageUrl,
  onToggleActive,
  onChangeProfession,
  onClose,
}: UserDetailModalProps) {
  const [isToggleAnimating, setIsToggleAnimating] = useState(false);
  const toggleAnimationTimerRef = useRef<number | null>(null);

  const clearToggleTimer = () => {
    if (toggleAnimationTimerRef.current !== null) {
      window.clearTimeout(toggleAnimationTimerRef.current);
      toggleAnimationTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearToggleTimer();
    };
  }, []);

  const handleToggleClick = () => {
    onToggleActive();
    setIsToggleAnimating(true);
    clearToggleTimer();

    toggleAnimationTimerRef.current = window.setTimeout(() => {
      setIsToggleAnimating(false);
      toggleAnimationTimerRef.current = null;
    }, 1000);
  };

  const defaultButtonBackground = active
    ? "user-profile-toggle-bg-off"
    : "user-profile-toggle-bg-on";

  const defaultButtonText = active
    ? "user-profile-toggle-text-off"
    : "user-profile-toggle-text-on";

  const transitionButtonBackground = active
    ? "user-profile-toggle-bg-off-strong"
    : "user-profile-toggle-bg-on-strong";

  const isTextWhite = isToggleAnimating;

  const professionIcon = (() => {
    const iconColorClass = active
      ? "user-profile-icon-active"
      : "user-profile-icon-inactive";

    switch (profession) {
      case "worker":
        return <Pickaxe className={`user-profile-profession-icon ${iconColorClass}`} />;
      case "expedition_leader":
        return <TentTree className={`user-profile-profession-icon ${iconColorClass}`} />;
      case "system_administrator":
        return <MonitorCog className={`user-profile-profession-icon ${iconColorClass}`} />;
      case "resource_manager":
        return <ShelvingUnit className={`user-profile-profession-icon ${iconColorClass}`} />;
      default:
        return null;
    }
  })();

  return (
    <div className="user-profile-overlay" onClick={onClose}>
      <div
        className="user-profile-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="user-profile-left-panel">
          <div
            className={`user-profile-accent-bar ${
              active ? "user-profile-accent-bar-active" : "user-profile-accent-bar-inactive"
            }`}
          ></div>

          <div className="user-profile-card">
            <div className="user-profile-card-top-line"></div>

            {imageUrl && (
              <img
                src={imageUrl}
                alt="Profile"
                className={`user-profile-image ${
                  active ? "user-profile-image-active" : "user-profile-image-inactive"
                }`}
              />
            )}

            <p
              className={`user-profile-role ${
                active ? "user-profile-role-active" : "user-profile-role-inactive"
              }`}
            >
              {role}
            </p>

            <p
              className={`user-profile-name ${
                active ? "user-profile-name-active" : "user-profile-name-inactive"
              }`}
            >
              {name} {lastName}
            </p>

            <div className="user-profile-profession-icon-wrapper">
              {professionIcon}
            </div>
          </div>
        </div>

        <div className="user-profile-right-panel">
          <div>
            <p className="user-profile-label">CEDULA</p>
            <p className="user-profile-value user-profile-value-black">{id}</p>
          </div>

          <div className="user-profile-grid">
            <div>
              <p className="user-profile-label">NOMBRE</p>
              <p className="user-profile-value user-profile-value-black">{name}</p>
            </div>

            <div>
              <p className="user-profile-label">APELLIDO</p>
              <p className="user-profile-value user-profile-value-black">{lastName}</p>
            </div>

            <div>
              <p className="user-profile-label">SEXO</p>
              <p className="user-profile-value user-profile-value-black">{sex}</p>
            </div>

            <div>
              <p className="user-profile-label">FECHA NACIMIENTO</p>
              <p className="user-profile-value user-profile-value-black">
                {birthdate.toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="user-profile-profession-section">
            <p className="user-profile-label">PROFESIÓN</p>

            <select
              value={profession}
              onChange={(e) =>
                onChangeProfession(e.target.value as ProfessionKey)
              }
              className="user-profile-select"
            >
              <option value="system_administrator">
                Administrador de sistemas
              </option>
              <option value="worker">Trabajador</option>
              <option value="resource_manager">Gestor de recursos</option>
              <option value="expedition_leader">Líder de expedición</option>
            </select>
          </div>

          <div>
            <p className="user-profile-label">FECHA DE REGISTRO</p>
            <p className="user-profile-value user-profile-value-gray">
              {registrationDate.toLocaleDateString()}
            </p>
          </div>

          <div className="user-profile-button-row">
            <button
              onClick={handleToggleClick}
              className={`user-profile-toggle-button ${
                isTextWhite ? "user-profile-toggle-text-white" : defaultButtonText
              } ${
                isToggleAnimating
                  ? `${transitionButtonBackground} user-profile-toggle-scale-active`
                  : `${defaultButtonBackground} user-profile-toggle-scale-normal`
              }`}
            >
              {active ? (
                <PowerOff className="user-profile-button-icon" />
              ) : (
                <Power className="user-profile-button-icon" />
              )}
              {active ? "DESACTIVAR PERFIL" : "ACTIVAR PERFIL"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}