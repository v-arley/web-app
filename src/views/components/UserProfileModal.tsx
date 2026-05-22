import { useEffect, useRef, useState } from "react";
import { IdCard, Power, PowerOff, Pencil, Save, X, Camera } from "lucide-react";
import { useUserProfileModal } from "../../hooks/useUserProfileModal";
import "./UserProfileModal.css";

type ChangeProfessionOptions = {
  isTemporary: boolean;
  temporaryUntil?: string;
};

type UpdatePersonProfilePayload = {
  photo?: string;
  description?: string;
  conditions?: string;
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
  description?: string;
  conditions?: string;
  onToggleActive: () => void;
  onUpdatePersonProfile?: (
    personId: number,
    payload: UpdatePersonProfilePayload,
  ) => void | Promise<void>;
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
  description = "",
  conditions = "",
  onToggleActive,
  onUpdatePersonProfile,
  onChangeProfession,
  onClose,
}: UserDetailModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedProfession, setSelectedProfession] = useState(profession);
  const [isTemporary, setIsTemporary] = useState(false);
  const [temporaryUntil, setTemporaryUntil] = useState("");

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedPhoto, setEditedPhoto] = useState(imageUrl ?? "");
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedConditions, setEditedConditions] = useState(conditions);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

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

  useEffect(() => {
    setEditedPhoto(imageUrl ?? "");
    setEditedDescription(description ?? "");
    setEditedConditions(conditions ?? "");
  }, [imageUrl, description, conditions]);

  const handleSelectPhoto = (file?: File) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setEditedPhoto(String(reader.result ?? ""));
      setIsEditingProfile(true);
    };

    reader.readAsDataURL(file);
  };

  const handleApplyProfession = async () => {
    if (isTemporary && !temporaryUntil) return;

    await onChangeProfession(selectedProfession, {
      isTemporary,
      temporaryUntil: isTemporary ? temporaryUntil : undefined,
    });
  };

  const handleSaveProfile = async () => {
    if (!personId || !onUpdatePersonProfile) return;

    setIsSavingProfile(true);

    try {
      await onUpdatePersonProfile(personId, {
        photo: editedPhoto,
        description: editedDescription,
        conditions: editedConditions,
      });

      setIsEditingProfile(false);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedPhoto(imageUrl ?? "");
    setEditedDescription(description ?? "");
    setEditedConditions(conditions ?? "");
    setIsEditingProfile(false);
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
  const canEditProfile = Boolean(personId && onUpdatePersonProfile);
  const displayedPhoto = isEditingProfile ? editedPhoto : imageUrl;

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

            <div className="relative">
              {displayedPhoto && (
                <img
                  src={displayedPhoto}
                  alt="Profile"
                  className={`user-profile-image ${
                    active
                      ? "user-profile-image-active"
                      : "user-profile-image-inactive"
                  }`}
                />
              )}

              {canEditProfile && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) =>
                      handleSelectPhoto(event.target.files?.[0])
                    }
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/75 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#ff6600] transition hover:bg-[#ff6600] hover:text-black"
                  >
                    <Camera size={13} />
                    Photo
                  </button>
                </>
              )}
            </div>

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
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="user-profile-label">ID</p>
              <p className="user-profile-value user-profile-value-black">{id}</p>
            </div>

            <button
              type="button"
              disabled={!canEditProfile}
              onClick={() => setIsEditingProfile(true)}
              className={`flex items-center gap-2 border px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.18em] transition ${
                canEditProfile
                  ? "border-[#ff6600] bg-transparent text-[#ff6600] hover:bg-[#ff6600] hover:text-black"
                  : "cursor-not-allowed border-[#cfcfcf] bg-[#e6e6e6] text-[#9a9a9a]"
              }`}
            >
              <Pencil size={14} />
              Edit profile
            </button>
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

          {isEditingProfile && (
            <div className="border-y border-[#cfcfcf] py-5">
              <div className="flex items-center justify-between">
                <p className="user-profile-label">EDIT PERSON PROFILE</p>

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-[#343434] hover:text-[#ff6600]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-4">
                <div>
                  <p className="user-profile-label">DESCRIPTION</p>
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="user-profile-select min-h-[80px] resize-none"
                    placeholder="Description"
                  />
                </div>

                <div>
                  <p className="user-profile-label">CONDITIONS</p>
                  <textarea
                    value={editedConditions}
                    onChange={(e) => setEditedConditions(e.target.value)}
                    className="user-profile-select min-h-[80px] resize-none"
                    placeholder="Health conditions"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="border border-[#343434] px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#343434] transition hover:bg-[#343434] hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={isSavingProfile}
                    onClick={handleSaveProfile}
                    className={`flex items-center gap-2 border px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] transition ${
                      isSavingProfile
                        ? "cursor-not-allowed border-[#cfcfcf] bg-[#e6e6e6] text-[#9a9a9a]"
                        : "border-[#ff6600] bg-[#ff6600] text-black hover:bg-black hover:text-[#ff6600]"
                    }`}
                  >
                    <Save size={14} />
                    {isSavingProfile ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </div>
            </div>
          )}

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