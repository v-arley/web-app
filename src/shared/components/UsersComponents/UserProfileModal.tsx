import { useEffect, useMemo, useRef, useState } from "react";
import {IdCard, Pencil, Power, PowerOff, Save, X, KeyRound,} from "lucide-react";

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
  onOpenCredentials?: () => void;
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
  onOpenCredentials,
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
          <header className="flex shrink-0 items-center justify-between border-b border-border-default bg-bg-primary px-7 py-5">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-txt-disabled">
                Staff Profile
              </p>

              <h2 className="mt-2 text-[30px] font-bold uppercase tracking-[0.16em] text-txt-primary">
                Person Information
              </h2>
            </div>

            <div className="flex items-center gap-5">
              {!isEditingProfile ? (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.16em] text-txt-primary transition-colors hover:text-accent"
                >
                  <Pencil size={15} />
                  Edit Profile
                </button>
              ) : null}
                <button
                  type="button"
                  onClick={onOpenCredentials}
                  aria-label="Update credentials"
                  title="Update credentials"
                  className="flex h-11 items-center justify-center gap-2 border border-accent bg-bg-secondary px-5 text-[13px] font-bold uppercase tracking-[0.13em] text-accent transition-colors hover:bg-accent hover:text-accent-fg"
                >
                  <KeyRound size={15} />
                  Update Credentials
                </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close user profile"
                title="Close user profile"
                className="text-txt-primary transition-colors hover:text-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-7 py-6">
            <UserProfileDetailsPanel
              id={id}
              name={name}
              lastName={lastName}
              role={role}
              active={active}
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
              canEditProfile={canEditProfile}
              isEditingProfile={isEditingProfile}
              formatProfessionName={formatProfessionName}
              onDescriptionChange={setEditedDescription}
              onConditionsChange={setEditedConditions}
              onProfessionChange={setSelectedProfession}
              onTemporaryChange={setIsTemporary}
              onTemporaryUntilChange={setTemporaryUntil}
            />
          </div>

          <footer className="flex shrink-0 items-center justify-between border-t border-border-default bg-bg-primary px-7 py-5">
            <button
              type="button"
              onClick={handleOpenIdCard}
              disabled={!canOpenIdCard}
              className="flex h-12 items-center justify-center gap-2 text-[13px] font-bold uppercase tracking-[0.16em] text-txt-primary transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              <IdCard size={15} />
              View ID Card
            </button>

            {isEditingProfile ? (
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSavingChanges}
                  className="h-12 border border-border-default bg-bg-tertiary px-8 text-[13px] font-bold uppercase tracking-[0.18em] text-txt-primary transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => void handleSaveChanges()}
                  disabled={!canSaveChanges}
                  className="flex h-12 items-center justify-center gap-2 border border-accent bg-accent px-8 text-[13px] font-bold uppercase tracking-[0.18em] text-accent-fg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Save size={15} />
                  {isSavingChanges ? "Saving..." : "Save Changes"}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleToggleClick}
                className={[
                  "flex h-12 items-center justify-center gap-2 px-8 text-[13px] font-bold uppercase tracking-[0.18em] transition-colors",
                  isToggleAnimating
                    ? transitionButtonBackground
                    : defaultButtonBackground,
                  isTextWhite ? "text-white" : defaultButtonText,
                ].join(" ")}
              >
                {active ? <PowerOff size={15} /> : <Power size={15} />}
                {active ? "Deactivate Profile" : "Activate Profile"}
              </button>
            )}
          </footer>
        </section>
      </div>
    </div>
  );
}