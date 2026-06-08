import { BrainCircuit, UserRound } from "lucide-react";

export function AdmissionEmptyState() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center border border-border-default bg-bg-secondary p-8 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center border border-border-default bg-bg-primary text-txt-disabled">
        <UserRound size={28} />
      </div>

      <p className="text-[15px] font-bold uppercase tracking-[0.18em] text-txt-primary">
        No Pending Admissions
      </p>

      <p className="mt-2 max-w-md text-[12px] uppercase leading-relaxed tracking-[0.14em] text-txt-secondary">
        There are no admission requests waiting for review at this moment.
      </p>

      <div className="mt-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
        <BrainCircuit size={14} />
        AI queue clear
      </div>
    </div>
  );
}