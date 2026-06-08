import { IdCard } from "lucide-react";

type UserProfileDetailsPanelProps = {
  id: string;
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
  canOpenIdCard: boolean;
  canEditProfile: boolean;
  isEditingProfile: boolean;
  formatProfessionName: (value?: string | null) => string;
  onOpenIdCard: () => void;
  onDescriptionChange: (value: string) => void;
  onConditionsChange: (value: string) => void;
  onProfessionChange: (value: string) => void;
  onTemporaryChange: (value: boolean) => void;
  onTemporaryUntilChange: (value: string) => void;
};

const labelClass =
  "text-[12px] font-bold uppercase tracking-[0.16em] text-txt-secondary";

const valueClass =
  "mt-2 text-[16px] font-bold leading-relaxed tracking-[0.04em] text-txt-primary";

const inputClass =
  "h-12 w-full border border-border-default bg-bg-tertiary px-4 text-[15px] font-bold tracking-[0.05em] text-txt-primary outline-none transition-all placeholder:text-txt-disabled focus:border-accent focus:shadow-[0_0_0_2px_rgba(232,93,4,0.22)] disabled:cursor-not-allowed disabled:opacity-70";

const textareaClass =
  "min-h-[100px] w-full resize-none border border-border-default bg-bg-tertiary px-4 py-3 text-[15px] font-bold leading-relaxed tracking-[0.04em] text-txt-primary outline-none transition-all placeholder:text-txt-disabled focus:border-accent focus:shadow-[0_0_0_2px_rgba(232,93,4,0.22)] disabled:cursor-not-allowed disabled:opacity-70";

export function UserProfileDetailsPanel({
  id,
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
  canOpenIdCard,
  canEditProfile,
  isEditingProfile,
  formatProfessionName,
  onOpenIdCard,
  onDescriptionChange,
  onConditionsChange,
  onProfessionChange,
  onTemporaryChange,
  onTemporaryUntilChange,
}: UserProfileDetailsPanelProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
      <div className="space-y-5">
        <section className="border border-border-default bg-bg-primary p-5">
          <div className="mb-5 flex items-center justify-between border-b border-border-default pb-4">
            <div>
              <p className="text-[14px] font-bold uppercase tracking-[0.18em] text-txt-primary">
                Personal Information
              </p>
              <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-txt-secondary">
                Identity and registry data
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenIdCard}
              disabled={!canOpenIdCard}
              className="flex h-10 items-center gap-2 border border-border-default bg-bg-secondary px-4 text-[12px] font-bold uppercase tracking-[0.13em] text-txt-primary transition-colors hover:border-accent hover:bg-bg-tertiary hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              <IdCard size={15} />
              ID Card
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className={labelClass}>DNI</p>
              <p className={valueClass}>{id || "Not specified"}</p>
            </div>

            <div>
              <p className={labelClass}>Sex</p>
              <p className={valueClass}>{sex}</p>
            </div>

            <div>
              <p className={labelClass}>Registration Date</p>
              <p className={valueClass}>{registrationDate}</p>
            </div>

            <div>
              <p className={labelClass}>Birthdate</p>
              <p className={valueClass}>{birthdate}</p>
            </div>
          </div>
        </section>

        <section className="border border-border-default bg-bg-primary p-5">
          <div className="mb-5 border-b border-border-default pb-4">
            <p className="text-[14px] font-bold uppercase tracking-[0.18em] text-txt-primary">
              Profile Notes
            </p>
            <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-txt-secondary">
              Description and health conditions
            </p>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className={labelClass}>Description</span>
              {canEditProfile && isEditingProfile ? (
                <textarea
                  value={editedDescription}
                  onChange={(event) => onDescriptionChange(event.target.value)}
                  placeholder="Write profile description..."
                  className={`${textareaClass} mt-2`}
                />
              ) : (
                <p className={valueClass}>
                  {description?.trim() || "No description registered."}
                </p>
              )}
            </label>

            <label className="block">
              <span className={labelClass}>Conditions</span>
              {canEditProfile && isEditingProfile ? (
                <textarea
                  value={editedConditions}
                  onChange={(event) => onConditionsChange(event.target.value)}
                  placeholder="Write relevant conditions..."
                  className={`${textareaClass} mt-2`}
                />
              ) : (
                <p className={valueClass}>
                  {conditions?.trim() || "No conditions registered."}
                </p>
              )}
            </label>
          </div>
        </section>
      </div>

      <aside className="space-y-5">
        <section className="border border-border-default bg-bg-primary p-5">
          <div className="mb-5 border-b border-border-default pb-4">
            <p className="text-[14px] font-bold uppercase tracking-[0.18em] text-txt-primary">
              Profession Assignment
            </p>
            <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-txt-secondary">
              Current or temporary profession
            </p>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className={labelClass}>Profession</span>
              {isEditingProfile ? (
                <select
                  value={selectedProfession}
                  onChange={(event) => onProfessionChange(event.target.value)}
                  className={`${inputClass} mt-2`}
                >
                  {displayedProfessionOptions.map((option) => (
                    <option key={option} value={option}>
                      {formatProfessionName(option)}
                    </option>
                  ))}
                </select>
              ) : (
                <p className={valueClass}>
                  {formatProfessionName(selectedProfession)}
                </p>
              )}
            </label>

            {isEditingProfile ? (
              <>
                <label className="flex items-center gap-3 border border-border-default bg-bg-secondary px-4 py-3">
                  <input
                    type="checkbox"
                    checked={isTemporary}
                    onChange={(event) => onTemporaryChange(event.target.checked)}
                    className="h-4 w-4 accent-accent"
                  />
                  <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-txt-primary">
                    Temporary assignment
                  </span>
                </label>

                {isTemporary ? (
                  <label className="block">
                    <span className={labelClass}>Temporary Until</span>
                    <input
                      type="date"
                      min={today}
                      value={temporaryUntil}
                      onChange={(event) =>
                        onTemporaryUntilChange(event.target.value)
                      }
                      className={`${inputClass} mt-2`}
                    />
                  </label>
                ) : null}
              </>
            ) : null}
          </div>
        </section>
      </aside>
    </div>
  );
}