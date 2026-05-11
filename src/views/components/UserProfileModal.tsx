import { Power, PowerOff } from "lucide-react";
import { useUserProfileModal } from "../../hooks/useUserProfileModal";
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
  const {
    isToggleAnimating,
    professionOptions,
    handleToggleClick,
    defaultButtonBackground,
    defaultButtonText,
    transitionButtonBackground,
    isTextWhite,
    iconColorClass,
    ProfessionIcon,
    formatProfession,
  } = useUserProfileModal({
    active,
    profession,
    professions,
    onToggleActive,
  });

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
              <ProfessionIcon
                className={`user-profile-profession-icon ${iconColorClass}`}
              />
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