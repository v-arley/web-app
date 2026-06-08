import { Power, Search, Shield } from "lucide-react";
import type { Person } from "../../../models/Person";

type CampSettingsForm = {
  campId: string;
  code: string;
  creationDate: string;
  designation: string;
  maxCapacity: string;
  latitude: string;
  longitude: string;
  state: "A" | "I";
  adminId: number | null;
};

type CampAdminControlPanelProps = {
  form: CampSettingsForm;
  selectedAdmin: Person | null;
  nodeOnline: boolean;
  onOpenAdminSearch: () => void;
  onToggleNode: () => void;
};

function getPersonDisplayName(person: Person | null, fallbackId: number | null) {
  if (!person) {
    return fallbackId
      ? `Administrator ID: ${fallbackId}`
      : "No administrator selected";
  }

  const raw = person as any;
  const name = raw.name ?? "";
  const surname = raw.surname ?? raw.lastName ?? "";

  return `${name} ${surname}`.trim() || `Administrator ID: ${fallbackId}`;
}

export function CampAdminControlPanel({
  form,
  selectedAdmin,
  nodeOnline,
  onOpenAdminSearch,
  onToggleNode,
}: CampAdminControlPanelProps) {
  return (
    <section className="flex min-h-0 flex-col">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center border border-border-default bg-bg-tertiary text-txt-secondary">
          <Shield size={20} />
        </div>

        <div>
          <h2 className="text-[18px] font-bold uppercase tracking-[0.18em] text-txt-primary">
            Administrative Control
          </h2>

          <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.16em] text-txt-secondary">
            Master administrator / node status
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="border border-border-default bg-bg-primary px-6 py-6">
          <div className="mb-6 border-b border-border-default pb-4">
            <p className="text-[15px] font-bold uppercase tracking-[0.16em] text-txt-primary">
              Master Administrator
            </p>

            <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-txt-secondary">
              Select the main user assigned to this camp
            </p>
          </div>

          <div>
            <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.16em] text-txt-secondary">
              Selected Administrator
            </p>

            <div className="flex h-12 border border-border-default bg-bg-tertiary">
              <div className="flex min-w-0 flex-1 items-center px-4 font-mono text-[13px] font-bold uppercase tracking-[0.08em] text-txt-primary">
                <span className="truncate">
                  {getPersonDisplayName(selectedAdmin, form.adminId)}
                </span>
              </div>

              <button
                type="button"
                aria-label="Search administrator"
                title="Search administrator"
                onClick={onOpenAdminSearch}
                className="flex w-14 items-center justify-center border-l border-border-default text-txt-secondary transition-colors hover:bg-accent hover:text-accent-fg"
              >
                <Search size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="border border-border-default bg-bg-primary px-6 py-6">
          <div className="mb-6 border-b border-border-default pb-4">
            <p className="text-[15px] font-bold uppercase tracking-[0.16em] text-txt-primary">
              System Node Status
            </p>

            <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-txt-secondary">
              Main connectivity toggle
            </p>
          </div>

          <button
            type="button"
            onClick={onToggleNode}
            className={`flex w-full items-center justify-between border px-5 py-4 transition-colors ${
              nodeOnline
                ? "border-status-ok/40 bg-status-ok/10"
                : "border-status-critical/40 bg-status-critical/10"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-11 w-11 items-center justify-center ${
                  nodeOnline
                    ? "bg-status-ok/10 text-status-ok"
                    : "bg-status-critical/10 text-status-critical"
                }`}
              >
                <Power size={20} />
              </div>

              <div className="text-left">
                <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-txt-primary">
                  {nodeOnline ? "Online" : "Offline"}
                </p>

                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-txt-secondary">
                  {nodeOnline
                    ? "System node is active"
                    : "System node is disabled"}
                </p>
              </div>
            </div>

            <div
              className={`flex h-8 w-16 items-center px-1 transition-colors ${
                nodeOnline ? "bg-status-ok" : "bg-status-critical"
              }`}
            >
              <div
                className={`h-6 w-6 bg-white shadow transition-transform ${
                  nodeOnline ? "translate-x-8" : "translate-x-0"
                }`}
              />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}