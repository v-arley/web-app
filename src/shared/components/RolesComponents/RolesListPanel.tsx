import { Search } from "lucide-react";
import type { Role } from "../../../models/Role";

type RolesListPanelProps = {
  searchTerm: string;
  page: number;
  selectedId: number | null;
  filteredCount: number;
  totalPages: number;
  pageItems: Role[];
  loading: boolean;
  onSearchChange: (value: string) => void;
  onRoleClick: (role: Role) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
};

export function RolesListPanel({
  searchTerm,
  page,
  selectedId,
  filteredCount,
  totalPages,
  pageItems,
  loading,
  onSearchChange,
  onRoleClick,
  onPrevPage,
  onNextPage,
}: RolesListPanelProps) {
  return (
    <section className="flex w-[54%] shrink-0 flex-col border-r border-border-default bg-bg-secondary p-5">
      <div className="relative shrink-0">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-secondary"
          size={18}
        />

        <input
          type="text"
          aria-label="Search roles"
          title="Search roles"
          placeholder="Search by ID or role name..."
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-12 w-full border border-border-default bg-bg-tertiary pl-12 pr-4 text-[15px] font-bold uppercase tracking-[0.06em] text-txt-primary outline-none transition-colors placeholder:text-txt-disabled focus:border-accent"
        />
      </div>

      <div className="mt-4 flex h-11 shrink-0 items-stretch gap-3">
        <div className="flex flex-1 items-center border border-border-default bg-bg-primary px-4">
          <span className="text-[15px] font-bold uppercase tracking-[0.16em] text-txt-primary">
            List
          </span>
        </div>

        <div className="flex items-center justify-center bg-accent px-5">
          <span className="text-[14px] font-bold uppercase tracking-[0.12em] text-accent-fg">
            PG-{String(page + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-hidden border border-border-default bg-bg-primary">
        <div className="grid grid-cols-[0.8fr_1.7fr_2.6fr] border-b border-border-default bg-bg-secondary px-4 py-3">
          {["ID", "Role Name", "Description"].map((header) => (
            <div
              key={header}
              className="text-center text-[12px] font-bold uppercase tracking-[0.14em] text-txt-secondary"
            >
              {header}
            </div>
          ))}
        </div>

        <div className="h-full overflow-y-auto pb-10">
          {loading ? (
            <div className="flex h-full min-h-[240px] items-center justify-center text-[14px] font-bold uppercase tracking-[0.15em] text-txt-disabled">
              Loading roles...
            </div>
          ) : pageItems.length === 0 ? (
            <div className="flex h-full min-h-[240px] items-center justify-center text-[14px] font-bold uppercase tracking-[0.15em] text-txt-disabled">
              No roles found.
            </div>
          ) : (
            pageItems.map((role) => {
              const isSelected = selectedId === role.id;

              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => onRoleClick(role)}
                  className={[
                    "grid w-full grid-cols-[0.8fr_1.7fr_2.6fr] border-b border-border-default px-4 py-4 text-left transition-colors",
                    isSelected
                      ? "border-l-2 border-l-accent bg-bg-tertiary"
                      : "border-l-2 border-l-transparent hover:bg-bg-tertiary/70",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-center text-[14px] font-bold tracking-[0.08em] text-accent">
                    R-{String(role.id).padStart(3, "0")}
                  </div>

                  <div className="flex items-center justify-center px-2 text-[14px] font-bold uppercase tracking-[0.07em] text-txt-primary">
                    {role.name}
                  </div>

                  <div className="flex items-center justify-center truncate px-2 text-[13px] font-bold tracking-[0.04em] text-txt-secondary">
                    {role.description}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-4 flex h-10 shrink-0 items-center border border-border-default bg-bg-primary px-4">
        <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-txt-secondary">
          Found: {String(filteredCount).padStart(4, "0")}
        </span>
      </div>

      <div className="mt-3 flex h-11 shrink-0 gap-3">
        <button
          type="button"
          onClick={onPrevPage}
          disabled={page === 0}
          className="flex-1 border border-border-default bg-bg-secondary text-[14px] font-bold uppercase tracking-[0.13em] text-txt-primary transition-colors hover:border-accent hover:bg-bg-tertiary hover:text-accent disabled:cursor-default disabled:opacity-40"
        >
          Prev
        </button>

        <button
          type="button"
          onClick={onNextPage}
          disabled={page >= totalPages - 1}
          className="flex-1 border border-accent bg-accent text-[14px] font-bold uppercase tracking-[0.13em] text-accent-fg transition-colors hover:bg-accent-hover disabled:cursor-default disabled:border-border-default disabled:bg-bg-tertiary disabled:text-txt-disabled disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </section>
  );
}