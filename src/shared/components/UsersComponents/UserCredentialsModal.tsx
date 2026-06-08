import { KeyRound, Save, X } from "lucide-react";
import { useMemo, useState } from "react";

type UserCredentialsModalProps = {
  username?: string;
  onClose: () => void;
  onSubmit: (newPassword: string) => void | Promise<void>;
};

export function UserCredentialsModal({
  username,
  onClose,
  onSubmit,
}: UserCredentialsModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const validationMessage = useMemo(() => {
    if (!newPassword.trim()) return "New password is required.";
    if (newPassword.length < 8) return "Password must have at least 8 characters.";
    if (newPassword !== confirmPassword) return "Passwords do not match.";
    return "";
  }, [newPassword, confirmPassword]);

  const canSubmit = !validationMessage && !isSaving;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSaving(true);

    try {
      await onSubmit(newPassword);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4 font-mono backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        className="w-full max-w-md border border-border-default bg-bg-secondary shadow-[0_25px_55px_rgba(0,0,0,0.65)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-border-default bg-bg-primary px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center border border-accent bg-accent text-accent-fg">
              <KeyRound size={22} />
            </div>

            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-accent">
                Access
              </p>

              <h2 className="mt-1 text-[22px] font-bold uppercase tracking-[0.12em] text-txt-primary">
                Update Credentials
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close credentials modal"
            title="Close credentials modal"
            className="flex h-11 w-11 items-center justify-center border border-border-strong text-txt-primary transition-colors hover:border-accent hover:bg-accent hover:text-accent-fg"
          >
            <X size={20} />
          </button>
        </header>

        <div className="space-y-4 px-6 py-6">
          <div className="border border-border-default bg-bg-primary px-5 py-4">
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-txt-disabled">
              Username
            </p>

            <p className="mt-2 break-all text-[18px] font-bold tracking-[0.06em] text-txt-primary">
              {username?.trim() || "Not available"}
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="new-password"
              className="text-[12px] font-bold uppercase tracking-[0.16em] text-txt-disabled"
            >
              New password
            </label>

            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Minimum 8 characters"
              className="h-12 w-full border border-border-default bg-bg-primary px-4 text-[15px] font-bold tracking-[0.06em] text-txt-primary outline-none transition-colors placeholder:text-txt-disabled focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirm-password"
              className="text-[12px] font-bold uppercase tracking-[0.16em] text-txt-disabled"
            >
              Confirm password
            </label>

            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repeat new password"
              className="h-12 w-full border border-border-default bg-bg-primary px-4 text-[15px] font-bold tracking-[0.06em] text-txt-primary outline-none transition-colors placeholder:text-txt-disabled focus:border-accent"
            />
          </div>

          {validationMessage ? (
            <p className="border border-accent/40 bg-accent/10 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-accent">
              {validationMessage}
            </p>
          ) : null}
        </div>

        <footer className="flex justify-end gap-3 border-t border-border-default bg-bg-primary px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 items-center justify-center border border-border-strong bg-bg-secondary px-6 text-[13px] font-bold uppercase tracking-[0.13em] text-txt-primary transition-colors hover:border-accent hover:text-accent"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="flex h-11 items-center justify-center gap-2 border border-accent bg-accent px-6 text-[13px] font-bold uppercase tracking-[0.13em] text-accent-fg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:border-border-default disabled:bg-bg-tertiary disabled:text-txt-disabled disabled:opacity-50"
          >
            <Save size={15} />
            {isSaving ? "Saving..." : "Update Password"}
          </button>
        </footer>
      </section>
    </div>
  );
}