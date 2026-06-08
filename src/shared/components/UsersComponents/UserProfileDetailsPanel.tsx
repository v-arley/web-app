import type { ReactNode } from "react";

type UserProfileDetailsPanelProps = {
  id: string;
  name: string;
  lastName: string;
  role: string;
  active: boolean;
  sex: string;
  registrationDate: string;
  birthdate: string;
  description: string;
  conditions: string;
  editedDescription: string;
  editedConditions: string;
  selectedProfession: string;
  displayedProfessionOptions: string[];
  isTemporary: boolean;
  temporaryUntil: string;
  today: string;
  canEditProfile: boolean;
  isEditingProfile: boolean;
  formatProfessionName: (value?: string | null) => string;
  onDescriptionChange: (value: string) => void;
  onConditionsChange: (value: string) => void;
  onProfessionChange: (value: string) => void;
  onTemporaryChange: (value: boolean) => void;
  onTemporaryUntilChange: (value: string) => void;
};

const labelClass =
  "text-[12px] font-bold uppercase tracking-[0.18em] text-txt-secondary";

const valueClass =
  "mt-3 text-[17px] font-bold leading-relaxed tracking-[0.04em] text-txt-primary";

const inputClass =
  "h-12 w-full border border-border-default bg-bg-tertiary px-4 text-[15px] font-bold tracking-[0.05em] text-txt-primary outline-none transition-all placeholder:text-txt-disabled focus:border-accent focus:shadow-[0_0_0_2px_rgba(232,93,4,0.22)] disabled:cursor-not-allowed disabled:opacity-70";

const textareaClass =
  "min-h-[100px] w-full resize-none border border-border-default bg-bg-tertiary px-4 py-3 text-[15px] font-bold leading-relaxed tracking-[0.04em] text-txt-primary outline-none transition-all placeholder:text-txt-disabled focus:border-accent focus:shadow-[0_0_0_2px_rgba(232,93,4,0.22)] disabled:cursor-not-allowed disabled:opacity-70";

function InfoItem({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className={labelClass}>{label}</p>
      <div className={valueClass}>{children}</div>
    </div>
  );
}

export function UserProfileDetailsPanel({
  id,
  name,
  lastName,
  role,
  active,
  sex,
  registrationDate,
  birthdate,
  description,
  conditions,
  editedDescription,
  editedConditions,
  selectedProfession,
  displayedProfessionOptions,
  isTemporary,
  temporaryUntil,
  today,
  canEditProfile,
  isEditingProfile,
  formatProfessionName,
  onDescriptionChange,
  onConditionsChange,
  onProfessionChange,
  onTemporaryChange,
  onTemporaryUntilChange,
}: UserProfileDetailsPanelProps) {
  return (
    <div className="space-y-5">
      <section className="border border-border-default bg-bg-primary p-5">
        <div className="grid grid-cols-[260px_1fr_1fr] gap-5">
          <div className="border-r border-border-default pr-5">
            <p className={labelClass}>ID</p>

            <p className="mt-4 text-[26px] font-bold uppercase tracking-[0.12em] text-txt-primary">
              {id || "Not specified"}
            </p>

            <div className="mt-6 flex gap-2">
              <span
                className={`border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] ${
                  active
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-status-critical/40 bg-status-critical/10 text-status-critical"
                }`}
              >
                {active ? "Active" : "Inactive"}
              </span>

              <span className="border border-accent/40 bg-accent/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                {role || "Worker"}
              </span>
            </div>
          </div>

          <div className="grid gap-5">
            <InfoItem label="First Name">{name || "Not specified"}</InfoItem>
            <InfoItem label="Sex">{sex}</InfoItem>
            <InfoItem label="Registration Date">{registrationDate}</InfoItem>
          </div>

          <div className="grid gap-5">
            <InfoItem label="Last Name">{lastName || "Not specified"}</InfoItem>
            <InfoItem label="Birth Date">{birthdate}</InfoItem>
            <InfoItem label="Current Profession">
              {formatProfessionName(selectedProfession)}
            </InfoItem>
          </div>
        </div>
      </section>

      <section className="border border-border-default bg-bg-primary p-5">
        <div className="mb-5 border-b border-border-default pb-4">
          <p className="text-[16px] font-bold uppercase tracking-[0.18em] text-txt-primary">
            Profile Details
          </p>

          <p className="mt-2 text-[12px] uppercase tracking-[0.18em] text-txt-secondary">
            Description / Conditions / Profession Assignment
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-accent">
              Description
            </span>

            {canEditProfile && isEditingProfile ? (
              <textarea
                value={editedDescription}
                onChange={(event) => onDescriptionChange(event.target.value)}
                placeholder="Write profile description..."
                className={`${textareaClass} mt-3`}
              />
            ) : (
              <div className={`${textareaClass} mt-3 cursor-default opacity-90`}>
                {description?.trim() || "No description registered."}
              </div>
            )}
          </label>

          <label className="block">
            <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-accent">
              Conditions
            </span>

            {canEditProfile && isEditingProfile ? (
              <textarea
                value={editedConditions}
                onChange={(event) => onConditionsChange(event.target.value)}
                placeholder="Write relevant conditions..."
                className={`${textareaClass} mt-3`}
              />
            ) : (
              <div className={`${textareaClass} mt-3 cursor-default opacity-90`}>
                {conditions?.trim() || "No conditions registered."}
              </div>
            )}
          </label>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-[1fr_220px]">
          <label className="block">
            <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-accent">
              Profession Assignment
            </span>

            {isEditingProfile ? (
              <select
                value={selectedProfession}
                onChange={(event) => onProfessionChange(event.target.value)}
                className={`${inputClass} mt-3`}
              >
                {displayedProfessionOptions.map((option) => (
                  <option key={option} value={option}>
                    {formatProfessionName(option)}
                  </option>
                ))}
              </select>
            ) : (
              <div className={`${inputClass} mt-3 flex items-center`}>
                {formatProfessionName(selectedProfession)}
              </div>
            )}
          </label>

          {isEditingProfile ? (
            <div>
              <label className="mt-8 flex h-12 items-center gap-3 border border-border-default bg-bg-tertiary px-4">
                <input
                  type="checkbox"
                  checked={isTemporary}
                  onChange={(event) => onTemporaryChange(event.target.checked)}
                  className="h-4 w-4 accent-accent"
                />

                <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-accent">
                  Temporary
                </span>
              </label>

              {isTemporary ? (
                <input
                  type="date"
                  aria-label="Temporary profession end date"
                  title="Temporary profession end date"
                  min={today}
                  value={temporaryUntil}
                  onChange={(event) =>
                    onTemporaryUntilChange(event.target.value)
                  }
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}