import { Search, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import PaginationFooter from "./PaginationFooter";
import useClientPagination from "../hooks/useClientPagination";

export type SearchPickerColumn<T> = {
  key: string;
  header: string;
  className?: string;
  render: (item: T) => ReactNode;
};

export type SearchPickerModalProps<T extends { id?: unknown } & Record<string, unknown>> = {
  isOpen: boolean;
  title: string;
  icon: ReactNode;
  items: T[];
  columns: SearchPickerColumn<T>[];
  searchFields: (keyof T)[];
  onSelect: (item: T) => void;
  onClose: () => void;
  isLoading?: boolean;
  pageSize?: number;
  emptyMessage?: string;
};

export type SearchPickerOption = {
  id: number;
  label: string;
  [key: string]: unknown;
};

export type SearchPickerButtonProps = {
  label: string;
  placeholder: string;
  onOpen: () => void;
  onClear?: () => void;
  disabled?: boolean;
  className?: string;
};

function normalize(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

export function SearchPickerButton({
  label,
  placeholder,
  onOpen,
  onClear,
  disabled = false,
  className = "",
}: SearchPickerButtonProps) {
  const hasValue = Boolean(label);

  return (
    <div className={`flex min-w-0 gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={onOpen}
        disabled={disabled}
        className="app-input flex min-w-0 flex-1 items-center justify-between gap-3 text-left disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={`truncate ${hasValue ? "text-txt-primary" : "text-txt-disabled"}`}>
          {hasValue ? label : placeholder}
        </span>
        <Search size={14} className="shrink-0 text-txt-muted" />
      </button>
      {onClear && hasValue ? (
        <button
          type="button"
          onClick={onClear}
          disabled={disabled}
          className="app-btn app-btn--secondary app-btn--icon"
          title="Clear selection"
        >
          <X size={14} />
        </button>
      ) : null}
    </div>
  );
}

export function SearchPickerModal<T extends { id?: unknown } & Record<string, unknown>>({
  isOpen,
  title,
  icon,
  items,
  columns,
  searchFields,
  onSelect,
  onClose,
  isLoading = false,
  pageSize = 10,
  emptyMessage = "No results found",
}: SearchPickerModalProps<T>) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = useMemo(() => {
    const q = normalize(query);
    if (!q) return items;

    return items.filter((item) =>
      searchFields.some((field) => normalize(item[field]).includes(q))
    );
  }, [items, query, searchFields]);

  const pagination = useClientPagination(filteredItems, pageSize);

  useEffect(() => {
    if (isOpen) {
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  const handleSelect = (item: T) => {
    onSelect(item);
    handleClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-120 flex items-stretch justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center sm:p-6">
      <button
        type="button"
        className="fixed inset-0 cursor-default"
        onClick={handleClose}
        aria-label="Close search picker"
      />
      <section
        className="app-modal app-card--glass relative flex h-[min(34rem,92vh)] min-h-[28rem] w-full max-w-3xl flex-col overflow-hidden border border-border-default bg-bg-secondary shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="app-panel-header border-b border-border-default bg-bg-secondary/80">
          <div className="flex min-w-0 items-center gap-2">
            <span className="text-accent">{icon}</span>
            <span className="app-panel-title truncate">{title}</span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="app-btn app-btn--ghost app-btn--icon app-btn--sm"
            title="Close"
          >
            <X size={16} />
          </button>
        </header>

        <div className="border-b border-border-default bg-bg-primary/30 px-4 py-3">
          <div className="app-input flex items-center gap-2">
            <Search size={14} className="shrink-0 text-txt-muted" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search..."
              className="min-w-0 flex-1 bg-transparent font-mono text-[11px] text-txt-primary outline-none placeholder:text-txt-disabled"
            />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div className="flex min-h-0 min-w-full flex-1 flex-col">
            <div
              className="grid shrink-0 border-b border-border-default bg-bg-primary/60 px-4 py-2"
              style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
            >
              {columns.map((column) => (
                <div
                  key={column.key}
                  className={`font-mono text-[9px] font-bold uppercase tracking-widest text-txt-disabled ${column.className ?? ""}`}
                >
                  {column.header}
                </div>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {isLoading ? (
              <div className="flex h-full min-h-48 items-center justify-center font-mono text-[11px] uppercase tracking-widest text-txt-disabled">
                Loading...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex h-full min-h-48 items-center justify-center font-mono text-[11px] uppercase tracking-widest text-txt-disabled">
                {emptyMessage}
              </div>
            ) : (
              <div className="divide-y divide-border-default">
                {pagination.pagedItems.map((item, index) => (
                  <button
                    key={String(item.id ?? index)}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="grid w-full px-4 py-3 text-left transition-colors hover:bg-accent/10 focus:bg-accent/10 focus:outline-none"
                    style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
                  >
                    {columns.map((column) => (
                      <div
                        key={column.key}
                        className={`min-w-0 font-mono text-[10px] text-txt-primary ${column.className ?? ""}`}
                      >
                        {column.render(item)}
                      </div>
                    ))}
                  </button>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>

        <PaginationFooter
          page={pagination.page}
          setPage={pagination.setPage}
          totalPages={pagination.totalPages}
          totalRecords={filteredItems.length}
          compact
          className="border-border-default"
        />
      </section>
    </div>,
    document.body,
  );
}
