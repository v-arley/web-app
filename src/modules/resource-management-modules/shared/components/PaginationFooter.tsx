import React from "react";

interface Props {
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
  totalRecords?: number;
  leftContent?: React.ReactNode;
  compact?: boolean;
  className?: string;
}

export function PaginationFooter({ page, setPage, totalPages, totalRecords, leftContent, compact = false, className = "" }: Props) {
  return (
    <footer className={`app-pagination-footer ${compact ? "app-pagination-footer--compact" : ""} bg-bg-secondary/30 border-t border-border-subtle shrink-0 ${className}`}>
      <div className="app-pagination-footer__meta font-mono text-txt-muted uppercase">
        {leftContent ? (
          leftContent
        ) : (
          <>
            <span>Total: <span className="text-accent font-bold">{String(totalRecords ?? 0).padStart(4, "0")}</span></span>
          </>
        )}
      </div>

      <div className="app-pagination-footer__controls font-mono uppercase">
        <button
          disabled={page <= 1}
          onClick={() => setPage(Math.max(1, page - 1))}
          className="app-btn app-btn--secondary app-btn--sm"
        >
          PREV
        </button>

        <span className="app-page-counter border border-border-subtle text-txt-secondary tabular-nums">
          {String(page).padStart(2, "0")}
          <span className="text-txt-muted opacity-40 mx-1">/</span>
          {String(totalPages).padStart(2, "0")}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          className="app-btn app-btn--secondary app-btn--sm"
        >
          NEXT
        </button>
      </div>
    </footer>
  );
}

export default PaginationFooter;
