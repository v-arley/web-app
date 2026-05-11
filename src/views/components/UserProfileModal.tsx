import {
  BriefcaseBusiness,
  HeartPulse,
  Map,
  Package,
  Power,
  PowerOff,
  Shield,
  Wrench,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "./UserProfileModal.css";

type UserDetailModalProps = {
  name: string;
  lastName: string;
  role: string;
  sex: string;
  id: string;
  active: boolean;
  profession: string;
  professions: string[];
  registrationDate: Date;
  birthdate: Date;
  imageUrl?: string;
  onToggleActive: () => void;
  onChangeProfession: (profession: string) => void;
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
  professions,
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

  const formatProfession = (value?: string | null) => {
    if (!value) return "SIN PROFESIÓN";

    return value
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const professionOptions = professions.includes(profession)
    ? professions
    : [profession, ...professions].filter(Boolean);

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
      case "MEDICINA":
        return (
          <HeartPulse
            className={`user-profile-profession-icon ${iconColorClass}`}
          />
        );

      case "EXPLORACION":
        return (
          <Map className={`user-profile-profession-icon ${iconColorClass}`} />
        );

      case "LOGISTICA":
        return (
          <Package
            className={`user-profile-profession-icon ${iconColorClass}`}
          />
        );

      case "MANTENIMIENTO":
        return (
          <Wrench
            className={`user-profile-profession-icon ${iconColorClass}`}
          />
        );

      case "SEGURIDAD":
        return (
          <Shield
            className={`user-profile-profession-icon ${iconColorClass}`}
          />
        );

      case "OPERACIONES":
        return (
          <BriefcaseBusiness
            className={`user-profile-profession-icon ${iconColorClass}`}
          />
        );

      default:
        return (
          <BriefcaseBusiness
            className={`user-profile-profession-icon ${iconColorClass}`}
          />
        );
    }
  })();

  return (
    <div className="user-profile-overlay" onClick={onClose}>
      <div className="user-profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="user-profile-left-panel">
          <div
            className={`user-profile-accent-bar ${
              active
                ? "user-profile-accent-bar-active"
                : "user-profile-accent-bar-inactive"
            }`}
          ></div>

          <div className="user-profile-card">
            <div className="user-profile-card-top-line"></div>

            {imageUrl && (
              <img
                src={imageUrl}
                alt="Profile"
                className={`user-profile-image ${
                  active
                    ? "user-profile-image-active"
                    : "user-profile-image-inactive"
                }`}
              />
            )}

            <p
              className={`user-profile-role ${
                active
                  ? "user-profile-role-active"
                  : "user-profile-role-inactive"
              }`}
            >
              {role}
            </p>

            <p
              className={`user-profile-name ${
                active
                  ? "user-profile-name-active"
                  : "user-profile-name-inactive"
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
            <p className="user-profile-label">ID</p>
            <p className="user-profile-value user-profile-value-black">{id}</p>
          </div>

          <div className="user-profile-grid">
            <div>
              <p className="user-profile-label">FIRST NAME</p>
              <p className="user-profile-value user-profile-value-black">
                {name}
              </p>
            </div>

            <div>
              <p className="user-profile-label">LAST NAME</p>
              <p className="user-profile-value user-profile-value-black">
                {lastName}
              </p>
            </div>

            <div>
              <p className="user-profile-label">SEX</p>
              <p className="user-profile-value user-profile-value-black">
                {sex}
              </p>
            </div>

            <div>
              <p className="user-profile-label">BIRTH DATE</p>
              <p className="user-profile-value user-profile-value-black">
                {birthdate.toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="user-profile-profession-section">
            <p className="user-profile-label">PROFESSION</p>
            <select
              value={profession}
              onChange={(e) => onChangeProfession(e.target.value)}
              className="user-profile-select"
            >
              {professionOptions.map((item) => (
                <option key={item} value={item}>
                  {formatProfession(item)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="user-profile-label">REGISTRATION DATE</p>
            <p className="user-profile-value user-profile-value-gray">
              {registrationDate.toLocaleDateString()}
            </p>
          </div>

          <div className="user-profile-button-row">
            <button
              onClick={handleToggleClick}
              className={`user-profile-toggle-button ${
                isTextWhite
                  ? "user-profile-toggle-text-white"
                  : defaultButtonText
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
              {active ? "DEACTIVATE PROFILE" : "ACTIVATE PROFILE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
