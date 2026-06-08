import { Lock, UserCheck } from "lucide-react";

type AdmissionApprovalSidebarProps = {
  step: 1 | 2;
  admissionId?: number | null;
  personLabel?: string;
};

export function AdmissionApprovalSidebar({
  step,
  admissionId,
  personLabel,
}: AdmissionApprovalSidebarProps) {
  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-border-default bg-bg-secondary px-7 py-7 md:flex">
      <div className="mb-7 flex h-14 w-14 items-center justify-center bg-accent text-accent-fg">
        <UserCheck className="h-7 w-7" strokeWidth={2.3} />
      </div>

      <h2 className="text-[25px] font-bold uppercase leading-tight tracking-[0.12em] text-txt-primary">
        Confirm
        <br />
        Admission
      </h2>

      <p className="mt-4 text-[13px] font-bold leading-relaxed tracking-[0.04em] text-txt-secondary">
        Request #{admissionId ?? "--"} · {personLabel ?? "Selected person"}
      </p>

      <div className="mt-8 flex flex-col gap-6">
        <div
          className={`flex items-center gap-4 border-b pb-4 transition-all ${
            step === 1
              ? "border-accent text-accent shadow-[0_8px_12px_-10px_rgba(232,93,4,0.95)]"
              : "border-border-default text-txt-disabled"
          }`}
        >
          <UserCheck
            className={`h-11 w-11 border bg-transparent p-2 ${
              step === 1
                ? "border-accent text-accent shadow-[0_0_12px_rgba(232,93,4,0.7)]"
                : "border-border-strong text-txt-disabled"
            }`}
            strokeWidth={2.5}
          />

          <p className="text-[15px] font-bold leading-relaxed tracking-[0.07em]">
            Role and Profession
          </p>
        </div>

        <div
          className={`flex items-center gap-4 border-b pb-4 transition-all ${
            step === 2
              ? "border-accent text-accent shadow-[0_8px_12px_-10px_rgba(232,93,4,0.95)]"
              : "border-border-default text-txt-disabled"
          }`}
        >
          <Lock
            className={`h-11 w-11 border bg-transparent p-2 ${
              step === 2
                ? "border-accent text-accent shadow-[0_0_12px_rgba(232,93,4,0.7)]"
                : "border-border-strong text-txt-disabled"
            }`}
            strokeWidth={2.5}
          />

          <p className="text-[15px] font-bold leading-relaxed tracking-[0.07em]">
            Access Credentials
          </p>
        </div>
      </div>
    </aside>
  );
}