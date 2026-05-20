import { useEffect, useState } from "react";
import { IdCard, Power, PowerOff } from "lucide-react";
import { useUserProfileModal } from "../../hooks/useUserProfileModal";
import "./UserProfileModal.css";

type ChangeProfessionOptions = {
  isTemporary: boolean;
  temporaryUntil?: string;
};

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
  personId?: number;
  idCardUrl?: string;
  onToggleActive: () => void;
  onChangeProfession: (
    profession: string,
    options?: ChangeProfessionOptions,
  ) => void | Promise<void>;
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
  personId,
  idCardUrl,
  onToggleActive,
  onChangeProfession,
  onClose,
}: UserDetailModalProps) {
  const [selectedProfession, setSelectedProfession] = useState(profession);
  const [isTemporary, setIsTemporary] = useState(false);
  const [temporaryUntil, setTemporaryUntil] = useState("");

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
    profession: selectedProfession,
    professions,
    onToggleActive,
  });

  useEffect(() => {
    setSelectedProfession(profession);
  }, [profession]);

  const handleApplyProfession = async () => {
    if (isTemporary && !temporaryUntil) return;

    await onChangeProfession(selectedProfession, {
      isTemporary,
      temporaryUntil: isTemporary ? temporaryUntil : undefined,
    });
  };

  const handleOpenIdCard = () => {
    const url =
      idCardUrl ||
      (personId ? `http://localhost:3000/api/people/${personId}/id-card` : "");

    if (!url) return;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const isApplyDisabled = isTemporary && !temporaryUntil;
  const canOpenIdCard = Boolean(idCardUrl || personId);

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
              value={selectedProfession}
              onChange={(e) => setSelectedProfession(e.target.value)}
              className="user-profile-select"
            >
              {professionOptions.map((item) => (
                <option key={item} value={item}>
                  {formatProfession(item)}
                </option>
              ))}
            </select>

            <label className="mt-4 flex items-center gap-3 font-mono text-sm text-[#343434]">
              <input
                type="checkbox"
                checked={isTemporary}
                onChange={(e) => {
                  setIsTemporary(e.target.checked);

                  if (!e.target.checked) {
                    setTemporaryUntil("");
                  }
                }}
              />
              Temporary assignment
            </label>

            {isTemporary && (
              <div className="mt-3">
                <p className="user-profile-label">TEMPORARY UNTIL</p>
                <input
                  type="date"
                  value={temporaryUntil}
                  onChange={(e) => setTemporaryUntil(e.target.value)}
                  className="user-profile-select"
                />
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                disabled={isApplyDisabled}
                onClick={handleApplyProfession}
                className={`border px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] transition ${
                  isApplyDisabled
                    ? "cursor-not-allowed border-[#cfcfcf] bg-[#e6e6e6] text-[#9a9a9a]"
                    : "border-[#ff6600] bg-transparent text-[#ff6600] hover:bg-[#ff6600] hover:text-black"
                }`}
              >
                Apply assignment
              </button>
            </div>
          </div>

          <div>
            <p className="user-profile-label">REGISTRATION DATE</p>
            <p className="user-profile-value user-profile-value-gray">
              {registrationDate.toLocaleDateString()}
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              disabled={!canOpenIdCard}
              onClick={handleOpenIdCard}
              className={`flex items-center gap-2 border px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] transition ${
                canOpenIdCard
                  ? "border-[#ff6600] bg-transparent text-[#ff6600] hover:bg-[#ff6600] hover:text-black"
                  : "cursor-not-allowed border-[#cfcfcf] bg-[#e6e6e6] text-[#9a9a9a]"
              }`}
            >
              <IdCard size={16} />
              View ID Card
            </button>
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