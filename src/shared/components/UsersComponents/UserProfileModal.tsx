import { useEffect, useMemo, useRef, useState } from "react";
import {
  Pencil,
  Power,
  PowerOff,
  Save,
  X,
} from "lucide-react";
import { useUserProfileModal } from "../../hooks/useUserProfileModal";
import { UserProfileSidebar } from "./UserProfileSidebar";
import { UserProfileDetailsPanel } from "./UserProfileDetailsPanel";
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
  const [isSavingChanges, setIsSavingChanges] = useState(false);

  const today = new Date().toISOString().split("T")[0];

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

  const handleOpenIdCard = () => {
    if (idCardUrl) {
      window.open(idCardUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (personId) {
      window.open(`/persons/${personId}/id-card`, "_blank", "noopener,noreferrer");
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditedPhoto(imageUrl ?? "");
    setEditedDescription(description ?? "");
    setEditedConditions(conditions ?? "");
    setSelectedProfession(profession);
    setIsTemporary(false);
    setTemporaryUntil("");
  };

  const handleSaveChanges = async () => {
    if (!canSaveChanges) return;

    setIsSavingChanges(true);

    try {
      if (profileChanged && personId && onUpdatePersonProfile) {
        await onUpdatePersonProfile(personId, {
          photo: editedPhoto,
          description: editedDescription,
          conditions: editedConditions,
        });
      }

      if (professionChanged) {
        await onChangeProfession(selectedProfession, {
          isTemporary,
          temporaryUntil: isTemporary ? temporaryUntil : undefined,
        });
      }

      setIsEditingProfile(false);
      setIsTemporary(false);
      setTemporaryUntil("");
    } finally {
      setIsSavingChanges(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 font-mono backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex h-[92vh] w-full max-w-7xl overflow-hidden border border-border-default bg-bg-secondary shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <UserProfileSidebar
          active={active}
          role={role}
          name={name}
          lastName={lastName}
          displayedPhoto={displayedPhoto}
          selectedProfession={selectedProfession}
          canEditProfile={canEditProfile}
          isEditingProfile={isEditingProfile}
          fileInputRef={fileInputRef}
          ProfessionIcon={ProfessionIcon}
          iconColorClass={iconColorClass}
          formatProfessionName={formatProfessionName}
          onSelectPhoto={handleSelectPhoto}
        />

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex shrink-0 items-center justify-between border-b border-border-default bg-bg-primary px-6 py-5 md:px-8">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-txt-disabled">
                User Profile
              </p>

              <h2 className="mt-1 text-[28px] font-bold uppercase tracking-[0.08em] text-txt-primary">
                {name} {lastName}
              </h2>

              <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.16em] text-txt-secondary">
                {formatProfessionName(selectedProfession)} / {active ? "Active" : "Inactive"}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close user profile"
              title="Close user profile"
              className="flex h-12 w-12 items-center justify-center border border-border-strong text-txt-primary transition-colors hover:border-accent hover:bg-accent hover:text-accent-fg"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 md:px-8">
            <UserProfileDetailsPanel
              id={id}
              sex={formatSex(sex)}
              registrationDate={formatDate(registrationDate)}
              birthdate={formatDate(birthdate)}
              description={description}
              conditions={conditions}
              editedDescription={editedDescription}
              editedConditions={editedConditions}
              selectedProfession={selectedProfession}
              displayedProfessionOptions={displayedProfessionOptions}
              isTemporary={isTemporary}
              temporaryUntil={temporaryUntil}
              today={today}
              canOpenIdCard={canOpenIdCard}
              canEditProfile={canEditProfile}
              isEditingProfile={isEditingProfile}
              formatProfessionName={formatProfessionName}
              onOpenIdCard={handleOpenIdCard}
              onDescriptionChange={setEditedDescription}
              onConditionsChange={setEditedConditions}
              onProfessionChange={setSelectedProfession}
              onTemporaryChange={setIsTemporary}
              onTemporaryUntilChange={setTemporaryUntil}
            />
          </div>

          <footer className="grid shrink-0 grid-cols-[1fr_180px] gap-4 border-t border-border-default bg-bg-primary px-6 py-5 md:px-8">
            {isEditingProfile ? (
              <>
                <button
                  type="button"
                  onClick={() => void handleSaveChanges()}
                  disabled={!canSaveChanges}
                  className="flex h-12 items-center justify-center gap-2 border border-accent bg-accent text-[13px] font-bold uppercase tracking-[0.18em] text-accent-fg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Save size={15} />
                  {isSavingChanges ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSavingChanges}
                  className="h-12 border border-border-default bg-bg-tertiary text-[13px] font-bold uppercase tracking-[0.18em] text-txt-primary transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="flex h-12 items-center justify-center gap-2 border border-accent bg-accent text-[13px] font-bold uppercase tracking-[0.18em] text-accent-fg transition-colors hover:bg-accent-hover"
                >
                  <Pencil size={15} />
                  Edit Profile
                </button>

                <button
                  type="button"
                  onClick={handleToggleClick}
                  className={[
                    "flex h-12 items-center justify-center gap-2 border text-[13px] font-bold uppercase tracking-[0.18em] transition-colors",
                    isToggleAnimating ? transitionButtonBackground : defaultButtonBackground,
                    isTextWhite ? "text-white" : defaultButtonText,
                  ].join(" ")}
                >
                  {active ? <PowerOff size={15} /> : <Power size={15} />}
                  {active ? "Deactivate" : "Activate"}
                </button>
              </>
            )}
          </footer>
        </section>
      </div>
    </div>
  );
}