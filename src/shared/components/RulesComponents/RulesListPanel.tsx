import { Search } from "lucide-react";
import type { Rule } from "../../../models/Rule";

type RulesListPanelProps = {
  searchTerm: string;
  page: number;
  selectedId: number | null;
  filteredCount: number;
  totalPages: number;
  pageItems: Rule[];
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onSelectRule: (rule: Rule) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
};

function formatRuleName(value?: string) {
  const raw = value?.trim();

  if (!raw) return "";

  return raw
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function RulesListPanel({
  searchTerm,
  page,
  selectedId,
  filteredCount,
  totalPages,
  pageItems,
  isLoading,
  onSearchChange,
  onSelectRule,
  onPrevPage,
  onNextPage,
}: RulesListPanelProps) {
  return (
    <section
      className="flex shrink-0 flex-col gap-4 border-r border-border-default bg-bg-secondary p-6"
      style={{ width: "52%" }}
    >
      <div className="relative shrink-0">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-disabled"
        />

        <input
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="SEARCH BY RULE NAME, CONDITION OR DESCRIPTION..."
          className="h-12 w-full border border-border-default bg-bg-tertiary pl-11 pr-4 text-[13px] font-bold uppercase tracking-[0.12em] text-txt-primary outline-none placeholder:text-txt-disabled focus:border-accent"
        />
      </div>

      <div className="flex h-11 shrink-0 items-stretch gap-3">
        <div className="flex flex-1 items-center border border-border-default bg-bg-primary px-5">
          <span className="text-[14px] font-bold uppercase tracking-[0.18em] text-txt-primary">
            List
          </span>
        </div>

        <div className="flex items-center justify-center bg-accent px-6">
          <span className="text-[13px] font-black uppercase tracking-[0.12em] text-accent-fg">
            PG-{String(page + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[190px_minmax(0,1fr)_90px] gap-5 border-b border-border-default px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.16em] text-txt-secondary">
        <div>Rule Name</div>
        <div>Condition</div>
        <div>Status</div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto border border-border-default bg-bg-primary">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-[12px] font-bold uppercase tracking-[0.18em] text-txt-disabled">
            Loading rules...
          </div>
        ) : pageItems.length === 0 ? (
          <div className="flex h-full items-center justify-center text-[12px] font-bold uppercase tracking-[0.18em] text-txt-disabled">
            No rules found.
          </div>
        ) : (
          pageItems.map((rule) => {
            const isSelected = rule.id === selectedId;
            const isActive = rule.status !== "I";

            return (
              <button
                key={rule.id}
                type="button"
                onClick={() => onSelectRule(rule)}
                className={`grid w-full grid-cols-[190px_minmax(0,1fr)_90px] items-start gap-5 border-b border-border-subtle px-4 py-4 text-left transition-colors ${
                  isSelected
                    ? "border-l-2 border-l-accent bg-accent/10"
                    : "border-l-2 border-l-transparent hover:bg-bg-secondary"
                }`}
              >
                <div className="min-w-0 text-[12px] font-bold uppercase tracking-[0.08em] text-accent">
                  <span className="block leading-relaxed">
                    {formatRuleName(rule.name)}
                  </span>
                </div>

                <div className="min-w-0 whitespace-normal break-words text-[12px] font-medium leading-relaxed tracking-[0.05em] text-txt-secondary">
                  {rule.condition}
                </div>

                <div
                  className={`text-[12px] font-bold uppercase tracking-[0.08em] ${
                    isActive ? "text-status-ok" : "text-status-inactive"
                  }`}
                >
                  {isActive ? "Active" : "Inactive"}
                </div>
              </button>
            );
          })
        )}
      </div>

      <div className="flex h-10 shrink-0 items-center border border-border-default bg-bg-primary px-5">
        <span className="text-[13px] font-bold uppercase tracking-[0.18em] text-txt-primary">
          Found: {String(filteredCount).padStart(4, "0")}
        </span>
      </div>

      <div className="grid h-12 shrink-0 grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onPrevPage}
          disabled={page === 0}
          className="border border-border-default bg-bg-tertiary text-[13px] font-bold uppercase tracking-[0.18em] text-txt-secondary transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
        >
          Prev
        </button>

        <button
          type="button"
          onClick={onNextPage}
          disabled={page >= totalPages - 1}
          className="border border-border-default bg-bg-tertiary text-[13px] font-bold uppercase tracking-[0.18em] text-txt-secondary transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
        >
          Next
        </button>
      </div>
    </section>
  );
}