import { useEffect, useMemo, useRef, useState } from "react";
import {
  IdCard,
  Power,
  PowerOff,
  Pencil,
  Save,
  X,
  Camera,
  BriefcaseBusiness,
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
  const [isSavingProfession, setIsSavingProfession] = useState(false);

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

    setIsSavingProfession(true);

    try {
      await onChangeProfession(selectedProfession, {
        isTemporary,
        temporaryUntil: isTemporary ? temporaryUntil : undefined,
      });

      setIsEditingProfile(false);
    } finally {
      setIsSavingProfession(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!personId || !onUpdatePersonProfile) return;

    setIsSavingProfile(true);

    try {
      const payload: UpdatePersonProfilePayload = {
        description: editedDescription,
        conditions: editedConditions,
      };

      if (editedPhoto !== (imageUrl ?? "")) {
        payload.photo = editedPhoto;
      }

      await onUpdatePersonProfile(personId, payload);

      setIsEditingProfile(false);
    } finally {
      setIsSavingProfile(false);
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

  const isApplyDisabled =
    !isEditingProfile ||
    isSavingProfession ||
    (isTemporary && !temporaryUntil);

  const canOpenIdCard = Boolean(idCardUrl || personId);
  const canEditProfile = Boolean(personId && onUpdatePersonProfile);
  const displayedPhoto = isEditingProfile ? editedPhoto : imageUrl;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 font-mono backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex h-[92vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-[#3A3A3A] bg-[#F3F3F3] shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative hidden w-[360px] shrink-0 bg-[#2E2F2F] md:block">
          <div
            className={`absolute left-1/2 top-0 h-[88px] w-20 -translate-x-1/2 ${
              active ? "bg-[#FF6600]" : "bg-[#777777]"
            }`}
          />

          <div className="flex h-full items-center justify-center px-10 py-10">
            <div className="flex w-full max-w-[290px] flex-col items-center rounded-xl border border-[#686868] bg-[#1D1F1F] px-8 py-7 shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
              <div className="mb-10 h-2 w-full rounded-full bg-[#3D3D3D]" />

              <div className="relative h-[240px] w-full overflow-hidden rounded-xl bg-black">
                {displayedPhoto ? (
                  <img
                    src={displayedPhoto}
                    alt="Profile"
                    className={`h-full w-full object-cover object-center ${
                      active ? "opacity-100" : "grayscale opacity-60"
                    }`}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#111111]">
                    <UserRound className="h-20 w-20 text-[#666666]" />
                  </div>
                )}

                {canEditProfile && isEditingProfile && (
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
                      className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-black/80 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#FF6600] transition hover:bg-[#FF6600] hover:text-black"
                    >
                      <Camera size={13} />
                      Photo
                    </button>
                  </>
                )}
              </div>

              <p
                className={`mt-5 text-sm font-bold uppercase tracking-[0.18em] ${
                  active ? "text-[#FF6600]" : "text-[#9A9A9A]"
                }`}
              >
                {role || "Worker"}
              </p>

              <p className="mt-3 text-center text-lg font-bold text-white">
                {name} {lastName}
              </p>

              <p className="mt-2 text-center text-xs uppercase tracking-[0.18em] text-[#A0A0A0]">
                {formatProfessionName(profession)}
              </p>

              <div className="mt-6 flex h-11 w-11 items-center justify-center rounded-xl border border-[#FF6600] text-[#FF6600]">
                <ProfessionIcon
                  className={`h-6 w-6 ${iconColorClass || "text-[#FF6600]"}`}
                />
              </div>

              <span
                className={`mt-6 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-[0.16em] ${
                  active
                    ? "bg-green-500/15 text-green-400"
                    : "bg-red-500/15 text-red-400"
                }`}
              >
                {active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col bg-[#F3F3F3]">
          <div className="flex shrink-0 items-center justify-between border-b border-[#D5D5D5] px-6 py-5 md:px-10">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-[#777777]">
                Staff Profile
              </p>

              <h2 className="mt-1 text-2xl font-bold text-black">
                {isEditingProfile ? "Edit Person Profile" : "Person Information"}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {!isEditingProfile && (
                <button
                  type="button"
                  disabled={!canEditProfile}
                  onClick={() => setIsEditingProfile(true)}
                  className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-5 font-mono text-xs font-bold uppercase tracking-[0.18em] transition ${
                    canEditProfile
                      ? "border-[#FF6600] bg-transparent text-[#FF6600] hover:bg-[#FF6600] hover:text-black"
                      : "cursor-not-allowed border-[#CFCFCF] bg-[#E6E6E6] text-[#9A9A9A]"
                  }`}
                >
                  <Pencil size={14} />
                  Edit Profile
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-black text-black transition hover:border-[#FF6600] hover:bg-[#FF6600]"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-7 md:px-10">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="lg:col-span-2">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#777777]">
                  ID
                </p>
                <p className="mt-1 font-mono text-xl font-bold text-black">
                  {id}
                </p>
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#777777]">
                  First Name
                </p>
                <p className="mt-1 font-mono text-base font-semibold text-black">
                  {name}
                </p>
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#777777]">
                  Last Name
                </p>
                <p className="mt-1 font-mono text-base font-semibold text-black">
                  {lastName}
                </p>
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#777777]">
                  Sex
                </p>
                <p className="mt-1 font-mono text-base font-semibold text-black">
                  {formatSex(sex)}
                </p>
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#777777]">
                  Birth Date
                </p>
                <p className="mt-1 font-mono text-base font-semibold text-black">
                  {formatDate(birthdate)}
                </p>
              </div>
            </div>

            <div className="my-7 border-t border-[#C7C7C7]" />

            {!isEditingProfile ? (
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <div className="rounded-xl border border-[#D1D1D1] bg-white/70 p-5">
                    <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#777777]">
                      Profession
                    </p>
                    <p className="mt-2 font-mono text-lg font-bold text-black">
                      {formatProfessionName(profession)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#D1D1D1] bg-white/70 p-5">
                    <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#777777]">
                      Role
                    </p>
                    <p className="mt-2 font-mono text-lg font-bold text-black">
                      {role || "Worker"}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-[#D1D1D1] bg-white/70 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#777777]">
                    Description
                  </p>
                  <p className="mt-2 whitespace-pre-wrap font-mono text-sm leading-relaxed text-black">
                    {description || "No description registered."}
                  </p>
                </div>

                <div className="rounded-xl border border-[#D1D1D1] bg-white/70 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#777777]">
                    Conditions
                  </p>
                  <p className="mt-2 whitespace-pre-wrap font-mono text-sm leading-relaxed text-black">
                    {conditions || "No conditions registered."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-2xl border border-[#D1D1D1] bg-white/60 p-5">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#777777]">
                        Editable Fields
                      </p>
                      <h3 className="mt-1 font-mono text-lg font-bold text-black">
                        Profile Details
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="text-[#555555] transition hover:text-[#FF6600]"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#777777]">
                        Description
                      </p>
                      <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="mt-2 min-h-[95px] w-full resize-none rounded-lg border border-[#D1D1D1] bg-[#E8E8E8] px-4 py-3 font-mono text-sm font-semibold text-black outline-none transition focus:border-[#FF6600] focus:bg-white focus:shadow-[0_0_0_3px_rgba(255,102,0,0.18)]"
                        placeholder="Description"
                      />
                    </div>

                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#777777]">
                        Conditions
                      </p>
                      <textarea
                        value={editedConditions}
                        onChange={(e) => setEditedConditions(e.target.value)}
                        className="mt-2 min-h-[95px] w-full resize-none rounded-lg border border-[#D1D1D1] bg-[#E8E8E8] px-4 py-3 font-mono text-sm font-semibold text-black outline-none transition focus:border-[#FF6600] focus:bg-white focus:shadow-[0_0_0_3px_rgba(255,102,0,0.18)]"
                        placeholder="Health conditions"
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="inline-flex h-11 items-center justify-center rounded-lg border border-black bg-white px-5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-black transition hover:border-[#FF6600] hover:bg-[#FF6600]"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        disabled={isSavingProfile}
                        onClick={handleSaveProfile}
                        className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-5 font-mono text-xs font-bold uppercase tracking-[0.18em] transition ${
                          isSavingProfile
                            ? "cursor-not-allowed border-[#CFCFCF] bg-[#E6E6E6] text-[#9A9A9A]"
                            : "border-[#FF6600] bg-[#FF6600] text-black hover:bg-black hover:text-[#FF6600]"
                        }`}
                      >
                        <Save size={14} />
                        {isSavingProfile ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#D1D1D1] bg-white/60 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#777777]">
                    Profession Assignment
                  </p>

                  <select
                    value={selectedProfession}
                    onChange={(e) => setSelectedProfession(e.target.value)}
                    className="mt-2 h-12 w-full rounded-lg border border-[#D1D1D1] bg-[#E8E8E8] px-4 font-mono text-sm font-semibold text-black outline-none transition focus:border-[#FF6600] focus:bg-white focus:shadow-[0_0_0_3px_rgba(255,102,0,0.18)]"
                  >
                    {displayedProfessionOptions.map((item) => (
                      <option key={item} value={item}>
                        {formatProfessionName(item)}
                      </option>
                    ))}
                  </select>

                  <label className="mt-4 flex items-center gap-3 font-mono text-sm text-black">
                    <input
                      type="checkbox"
                      checked={isTemporary}
                      onChange={(e) => {
                        setIsTemporary(e.target.checked);

                        if (!e.target.checked) {
                          setTemporaryUntil("");
                        }
                      }}
                      className="h-4 w-4 accent-[#FF6600]"
                    />
                    Temporary assignment
                  </label>

                  {isTemporary && (
                    <div className="mt-4">
                      <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#777777]">
                        Temporary Until
                      </p>
                      <input
                        type="date"
                        value={temporaryUntil}
                        onChange={(e) => setTemporaryUntil(e.target.value)}
                        className="mt-2 h-12 w-full rounded-lg border border-[#D1D1D1] bg-[#E8E8E8] px-4 font-mono text-sm font-semibold text-black outline-none transition focus:border-[#FF6600] focus:bg-white focus:shadow-[0_0_0_3px_rgba(255,102,0,0.18)]"
                      />
                    </div>
                  )}

                  <div className="mt-5 flex justify-end">
                    <button
                      type="button"
                      disabled={isApplyDisabled}
                      onClick={handleApplyProfession}
                      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-5 font-mono text-xs font-bold uppercase tracking-[0.18em] transition ${
                        isApplyDisabled
                          ? "cursor-not-allowed border-[#CFCFCF] bg-[#E6E6E6] text-[#9A9A9A]"
                          : "border-[#FF6600] bg-transparent text-[#FF6600] hover:bg-[#FF6600] hover:text-black"
                      }`}
                    >
                      <BriefcaseBusiness size={15} />
                      {isSavingProfession ? "Applying..." : "Apply Assignment"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="my-7 border-t border-[#C7C7C7]" />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#777777]">
                  Registration Date
                </p>
                <p className="mt-1 font-mono text-lg font-semibold text-[#555555]">
                  {formatDate(registrationDate)}
                </p>
              </div>

              <div className="flex flex-col items-start justify-end gap-3 lg:items-end">
                <button
                  type="button"
                  disabled={!canOpenIdCard}
                  onClick={handleOpenIdCard}
                  className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border px-5 font-mono text-xs font-bold uppercase tracking-[0.18em] transition lg:w-auto ${
                    canOpenIdCard
                      ? "border-[#FF6600] bg-transparent text-[#FF6600] hover:bg-[#FF6600] hover:text-black"
                      : "cursor-not-allowed border-[#CFCFCF] bg-[#E6E6E6] text-[#9A9A9A]"
                  }`}
                >
                  <IdCard size={16} />
                  View ID Card
                </button>

                <button
                  onClick={handleToggleClick}
                  className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg px-5 font-mono text-sm font-bold uppercase tracking-[0.12em] transition lg:w-auto ${
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}