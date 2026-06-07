import { useEffect, useMemo, useRef, useState } from "react";
import {
  IdCard,
  Power,
  PowerOff,
  Pencil,
  Save,
  X,
  Camera,
  UserRound,
} from "lucide-react";
import { useUserProfileModal } from "../hooks/useUserProfileModal";
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

const professionNameMap: Record<string, string> = {
  "PROF-MED": "Medicine",
  "PROF-LOG": "Logistics",
  "PROF-AGR": "Agriculture",
  "PROF-EXP": "Exploration",
  "PROF-COC": "Cooking",
  "PROF-COOK": "Cooking",
  "PROF-SEC": "Security",
  "PROF-COM": "Communication",
  "PROF-ENG": "Engineering",
  "PROF-SCI": "Science",

  MEDICINA: "Medicine",
  LOGISTICA: "Logistics",
  LOGÍSTICA: "Logistics",
  AGRICULTURA: "Agriculture",
  EXPLORACION: "Exploration",
  EXPLORACIÓN: "Exploration",
  COCINA: "Cooking",
  COOKING: "Cooking",
};

function formatProfessionName(value?: string | null) {
  if (!value) return "Not assigned";

  const normalized = value.trim().toUpperCase();

  if (professionNameMap[normalized]) {
    return professionNameMap[normalized];
  }

  return value
    .replace(/^PROF[-_]/i, "")
    .replace(/[-_]/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatSex(value: string) {
  const normalized = value.trim().toUpperCase();

  if (normalized === "M") return "Male";
  if (normalized === "F") return "Female";
  if (normalized === "O") return "Other";

  return value || "Not specified";
}

function formatDate(value: Date) {
  if (!value) return "Not specified";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not specified";
  }

  return date.toLocaleDateString("en-GB");
}

const labelClass =
  "text-[12px] font-bold uppercase tracking-[0.16em] text-txt-secondary";

const valueClass =
  "mt-2 text-[16px] font-bold leading-relaxed tracking-[0.04em] text-txt-primary";

const inputClass =
  "h-12 w-full border border-border-default bg-bg-tertiary px-4 text-[15px] font-bold tracking-[0.05em] text-txt-primary outline-none transition-all placeholder:text-txt-disabled focus:border-accent focus:shadow-[0_0_0_2px_rgba(232,93,4,0.22)] disabled:cursor-not-allowed disabled:opacity-70";

const textareaClass =
  "min-h-[100px] w-full resize-none border border-border-default bg-bg-tertiary px-4 py-3 text-[15px] font-bold leading-relaxed tracking-[0.04em] text-txt-primary outline-none transition-all placeholder:text-txt-disabled focus:border-accent focus:shadow-[0_0_0_2px_rgba(232,93,4,0.22)] disabled:cursor-not-allowed disabled:opacity-70";

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
  const today = new Date().toISOString().split("T")[0];
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedPhoto, setEditedPhoto] = useState(imageUrl ?? "");
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedConditions, setEditedConditions] = useState(conditions);
  const [isSavingChanges, setIsSavingChanges] = useState(false);

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
  } = useUserProfileModal({
    active,
    profession: selectedProfession,
    professions,
    onToggleActive,
  });

  const displayedProfessionOptions = useMemo(() => {
    const merged = [
      profession,
      selectedProfession,
      ...professions,
      ...professionOptions,
      "PROF-COC",
    ].filter(Boolean);

    return Array.from(new Set(merged));
  }, [profession, selectedProfession, professions, professionOptions]);

  useEffect(() => {
    setSelectedProfession(profession);
  }, [profession]);

  useEffect(() => {
    setEditedPhoto(imageUrl ?? "");
    setEditedDescription(description ?? "");
    setEditedConditions(conditions ?? "");
  }, [imageUrl, description, conditions]);

  const displayedPhoto = isEditingProfile ? editedPhoto : imageUrl;
  const canOpenIdCard = Boolean(idCardUrl || personId);
  const canEditProfile = Boolean(personId && onUpdatePersonProfile);

  const profileChanged =
    editedDescription !== (description ?? "") ||
    editedConditions !== (conditions ?? "") ||
    editedPhoto !== (imageUrl ?? "");

  const professionChanged =
    selectedProfession !== profession ||
    isTemporary ||
    temporaryUntil.trim() !== "";

  const hasChanges = profileChanged || professionChanged;

  const canSaveChanges =
    isEditingProfile &&
    hasChanges &&
    !isSavingChanges &&
    selectedProfession.trim() !== "" &&
    (!isTemporary || temporaryUntil.trim() !== "");

  const handleSelectPhoto = (file?: File) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setEditedPhoto(String(reader.result ?? ""));
      setIsEditingProfile(true);
    };

    reader.readAsDataURL(file);
  };

  const handleSaveChanges = async () => {
    if (!canSaveChanges) return;

    setIsSavingChanges(true);

    try {
      if (profileChanged && personId && onUpdatePersonProfile) {
        const payload: UpdatePersonProfilePayload = {
          description: editedDescription,
          conditions: editedConditions,
        };

        if (editedPhoto !== (imageUrl ?? "")) {
          payload.photo = editedPhoto;
        }

        await onUpdatePersonProfile(personId, payload);
      }

      if (professionChanged) {
        await onChangeProfession(selectedProfession, {
          isTemporary,
          temporaryUntil: isTemporary ? temporaryUntil : undefined,
        });
      }

      setIsEditingProfile(false);
    } finally {
      setIsSavingChanges(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedPhoto(imageUrl ?? "");
    setEditedDescription(description ?? "");
    setEditedConditions(conditions ?? "");
    setSelectedProfession(profession);
    setIsTemporary(false);
    setTemporaryUntil("");
    setIsEditingProfile(false);
  };

  const handleOpenIdCard = () => {
    const url =
      idCardUrl ||
      (personId ? `http://localhost:3000/api/people/${personId}/id-card` : "");

    if (!url) return;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 font-mono backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-6xl overflow-hidden border border-border-default bg-bg-secondary shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <aside className="relative hidden w-[320px] shrink-0 border-r border-border-default bg-bg-primary md:block">
          <div
            className={`absolute left-1/2 top-0 h-[86px] w-[88px] -translate-x-1/2 ${
              active ? "bg-accent" : "bg-bg-tertiary"
            }`}
          />

          <div className="flex h-full items-center justify-center px-7 py-9">
            <div className="flex w-full max-w-[260px] flex-col items-center border border-border-strong bg-bg-secondary px-6 py-7 shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
              <div className="mb-8 h-2 w-full bg-bg-tertiary" />

              <div className="relative h-[230px] w-full overflow-hidden bg-black">
                {displayedPhoto ? (
                  <img
                    src={displayedPhoto}
                    alt="Profile"
                    className={`h-full w-full object-cover object-center ${
                      active ? "opacity-100" : "grayscale opacity-60"
                    }`}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-bg-primary">
                    <UserRound className="h-20 w-20 text-txt-disabled" />
                  </div>
                )}

                {canEditProfile && isEditingProfile ? (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      aria-label="Profile photo file"
                      title="Profile photo file"
                      className="hidden"
                      onChange={(event) =>
                        handleSelectPhoto(event.target.files?.[0])
                      }
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="Change profile photo"
                      title="Change profile photo"
                      className="absolute bottom-3 right-3 flex items-center gap-2 bg-black/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.13em] text-accent transition-colors hover:bg-accent hover:text-accent-fg"
                    >
                      <Camera size={14} />
                      Photo
                    </button>
                  </>
                ) : null}
              </div>

              <p
                className={`mt-5 text-[13px] font-bold uppercase tracking-[0.18em] ${
                  active ? "text-accent" : "text-txt-disabled"
                }`}
              >
                {role || "Worker"}
              </p>

              <p className="mt-3 text-center text-[21px] font-bold uppercase tracking-[0.08em] text-txt-primary">
                {name} {lastName}
              </p>

              <p className="mt-2 text-center text-[13px] font-bold uppercase tracking-[0.16em] text-txt-secondary">
                {formatProfessionName(selectedProfession)}
              </p>

              <div className="mt-6 flex h-12 w-12 items-center justify-center border border-accent text-accent">
                <ProfessionIcon
                  className={`h-6 w-6 ${iconColorClass || "text-accent"}`}
                />
              </div>

              <span
                className={`mt-6 px-5 py-1.5 text-[12px] font-bold uppercase tracking-[0.16em] ${
                  active
                    ? "bg-status-ok/15 text-status-ok"
                    : "bg-status-critical/15 text-status-critical"
                }`}
              >
                {active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </aside>

        <section className="flex max-h-[92vh] min-w-0 flex-1 flex-col bg-bg-secondary">
          <header className="flex shrink-0 items-center justify-between border-b border-border-default bg-bg-primary px-7 py-5">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.22em] text-txt-disabled">
                Staff Profile
              </p>

              <h2 className="mt-1 text-[28px] font-bold uppercase tracking-[0.08em] text-txt-primary">
                {isEditingProfile ? "Edit Person Profile" : "Person Information"}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {!isEditingProfile ? (
                <button
                  type="button"
                  disabled={!canEditProfile}
                  onClick={() => setIsEditingProfile(true)}
                  aria-label="Edit profile"
                  title="Edit profile"
                  className="flex h-11 items-center justify-center gap-2 border border-accent bg-accent px-5 text-[13px] font-bold uppercase tracking-[0.13em] text-accent-fg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:border-border-default disabled:bg-bg-tertiary disabled:text-txt-disabled disabled:opacity-50"
                >
                  <Pencil size={15} />
                  Edit Profile
                </button>
              ) : null}

              <button
                type="button"
                onClick={onClose}
                aria-label="Close profile modal"
                title="Close profile modal"
                className="flex h-11 w-11 items-center justify-center border border-border-strong text-txt-primary transition-colors hover:border-accent hover:bg-accent hover:text-accent-fg"
              >
                <X size={20} />
              </button>
            </div>
          </header>

          <div className="overflow-y-auto px-7 py-6">
            <div className="border border-border-default bg-bg-primary px-5 py-5">
              <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
                <div className="border-r border-border-default pr-5">
                  <p className={labelClass}>ID</p>

                  <p className="mt-2 break-all text-[25px] font-bold uppercase tracking-[0.08em] text-txt-primary">
                    {id}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span
                      className={`border px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.14em] ${
                        active
                          ? "border-status-ok/40 bg-status-ok/10 text-status-ok"
                          : "border-status-critical/40 bg-status-critical/10 text-status-critical"
                      }`}
                    >
                      {active ? "Active" : "Inactive"}
                    </span>

                    <span className="border border-accent/40 bg-accent/10 px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-accent">
                      {role || "Worker"}
                    </span>
                  </div>
                </div>

                <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
                  <div>
                    <p className={labelClass}>First Name</p>
                    <p className={valueClass}>{name}</p>
                  </div>

                  <div>
                    <p className={labelClass}>Last Name</p>
                    <p className={valueClass}>{lastName}</p>
                  </div>

                  <div>
                    <p className={labelClass}>Sex</p>
                    <p className={valueClass}>{formatSex(sex)}</p>
                  </div>

                  <div>
                    <p className={labelClass}>Birth Date</p>
                    <p className={valueClass}>{formatDate(birthdate)}</p>
                  </div>

                  <div>
                    <p className={labelClass}>Registration Date</p>
                    <p className={valueClass}>{formatDate(registrationDate)}</p>
                  </div>

                  <div>
                    <p className={labelClass}>Current Profession</p>
                    <p className={valueClass}>
                      {formatProfessionName(selectedProfession)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 border border-border-default bg-bg-primary px-5 py-5">
              <div className="mb-4 flex items-center justify-between gap-4 border-b border-border-default pb-4">
                <div>
                  <p className="text-[16px] font-bold uppercase tracking-[0.16em] text-txt-primary">
                    Profile Details
                  </p>

                  <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.14em] text-txt-disabled">
                    Description / conditions / profession assignment
                  </p>
                </div>

                {isEditingProfile ? (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    aria-label="Cancel profile editing"
                    title="Cancel profile editing"
                    className="flex h-10 w-10 items-center justify-center border border-border-strong text-txt-primary transition-colors hover:border-accent hover:text-accent"
                  >
                    <X size={18} />
                  </button>
                ) : null}
              </div>

              <div className="grid gap-5">
                <div className="grid gap-5 xl:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="profile-description" className={labelClass}>
                      Description
                    </label>

                    <textarea
                      id="profile-description"
                      aria-label="Profile description"
                      title="Profile description"
                      value={editedDescription}
                      disabled={!isEditingProfile}
                      onChange={(event) =>
                        setEditedDescription(event.target.value)
                      }
                      placeholder="No description registered."
                      className={textareaClass}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="profile-conditions" className={labelClass}>
                      Conditions
                    </label>

                    <textarea
                      id="profile-conditions"
                      aria-label="Profile conditions"
                      title="Profile conditions"
                      value={editedConditions}
                      disabled={!isEditingProfile}
                      onChange={(event) =>
                        setEditedConditions(event.target.value)
                      }
                      placeholder="No conditions registered."
                      className={textareaClass}
                    />
                  </div>
                </div>

                <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_220px]">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="profile-profession" className={labelClass}>
                      Profession Assignment
                    </label>

                    <select
                      id="profile-profession"
                      aria-label="Profession assignment"
                      title="Profession assignment"
                      value={selectedProfession}
                      disabled={!isEditingProfile}
                      onChange={(event) =>
                        setSelectedProfession(event.target.value)
                      }
                      className={inputClass}
                    >
                      {displayedProfessionOptions.map((item) => (
                        <option key={item} value={item}>
                          {formatProfessionName(item)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <label className="flex h-12 w-full items-center justify-center gap-3 border border-border-default bg-bg-tertiary px-4 text-[14px] font-bold tracking-[0.04em] text-txt-primary">
                      <input
                        type="checkbox"
                        checked={isTemporary}
                        disabled={!isEditingProfile}
                        aria-label="Temporary assignment"
                        title="Temporary assignment"
                        onChange={(event) => {
                          setIsTemporary(event.target.checked);

                          if (!event.target.checked) {
                            setTemporaryUntil("");
                          }
                        }}
                        className="h-4 w-4 accent-[#FF6600]"
                      />
                      Temporary
                    </label>
                  </div>
                </div>

                {isTemporary ? (
                  <div className="flex flex-col gap-2">
                    <label htmlFor="temporary-until" className={labelClass}>
                      Temporary Until
                    </label>
                    <input
                      id="temporary-until"
                      type="date"
                      aria-label="Temporary assignment end date"
                      title="Temporary assignment end date"
                      value={temporaryUntil}
                      min={today}
                      disabled={!isEditingProfile}
                      onChange={(event) => {
                        const selectedDate = event.target.value;

                        if (selectedDate && selectedDate < today) {
                          setTemporaryUntil(today);
                          return;
                        }

                        setTemporaryUntil(selectedDate);
                      }}
                      className={inputClass}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <footer className="flex shrink-0 flex-col gap-3 border-t border-border-default bg-bg-primary px-7 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={!canOpenIdCard}
                onClick={handleOpenIdCard}
                aria-label="View ID card"
                title="View ID card"
                className="flex h-11 items-center justify-center gap-2 border border-accent bg-bg-secondary px-5 text-[13px] font-bold uppercase tracking-[0.13em] text-accent transition-colors hover:bg-accent hover:text-accent-fg disabled:cursor-not-allowed disabled:border-border-default disabled:text-txt-disabled disabled:opacity-50"
              >
                <IdCard size={16} />
                View ID Card
              </button>

              <button
                type="button"
                onClick={handleToggleClick}
                aria-label={active ? "Deactivate profile" : "Activate profile"}
                title={active ? "Deactivate profile" : "Activate profile"}
                className={`flex h-11 items-center justify-center gap-2 border px-5 text-[13px] font-bold uppercase tracking-[0.13em] transition-transform ${
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
                  <PowerOff className="h-5 w-5" />
                ) : (
                  <Power className="h-5 w-5" />
                )}
                {active ? "Deactivate Profile" : "Activate Profile"}
              </button>
            </div>

            {isEditingProfile ? (
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  aria-label="Cancel changes"
                  title="Cancel changes"
                  className="flex h-11 items-center justify-center border border-border-strong bg-bg-secondary px-6 text-[13px] font-bold uppercase tracking-[0.13em] text-txt-primary transition-colors hover:border-accent hover:text-accent"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!canSaveChanges}
                  onClick={handleSaveChanges}
                  aria-label="Save profile changes"
                  title="Save profile changes"
                  className="flex h-11 items-center justify-center gap-2 border border-accent bg-accent px-6 text-[13px] font-bold uppercase tracking-[0.13em] text-accent-fg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:border-border-default disabled:bg-bg-tertiary disabled:text-txt-disabled disabled:opacity-50"
                >
                  <Save size={15} />
                  {isSavingChanges ? "Saving..." : "Save Changes"}
                </button>
              </div>
            ) : null}
          </footer>
        </section>
      </div>
    </div>
  );
}