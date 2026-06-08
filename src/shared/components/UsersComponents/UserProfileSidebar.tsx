import { Camera, UserRound } from "lucide-react";
import type { ChangeEvent, ComponentType, RefObject } from "react";

type UserProfileSidebarProps = {
  active: boolean;
  role: string;
  name: string;
  lastName: string;
  displayedPhoto?: string;
  selectedProfession: string;
  canEditProfile: boolean;
  isEditingProfile: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  ProfessionIcon: ComponentType<{ className?: string }>;
  iconColorClass?: string;
  formatProfessionName: (value?: string | null) => string;
  onSelectPhoto: (file?: File) => void;
};

export function UserProfileSidebar({
  active,
  role,
  name,
  lastName,
  displayedPhoto,
  selectedProfession,
  canEditProfile,
  isEditingProfile,
  fileInputRef,
  ProfessionIcon,
  iconColorClass,
  formatProfessionName,
  onSelectPhoto,
}: UserProfileSidebarProps) {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSelectPhoto(event.target.files?.[0]);
  };

  return (
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
                  onChange={handleFileChange}
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
            <ProfessionIcon className={`h-6 w-6 ${iconColorClass || "text-accent"}`} />
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
  );
}