import { useCallback, useMemo, useState, type SetStateAction } from "react";

export function useClientPagination<T>(items: T[], initialPageSize = 20) {
  const [requestedPage, setRequestedPage] = useState(1);
  const pageSize = initialPageSize;

  const totalRecords = items.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const page = Math.min(Math.max(1, requestedPage), totalPages);

  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const setPage = useCallback((nextPage: SetStateAction<number>) => {
    setRequestedPage((currentPage) => {
      const resolvedPage = typeof nextPage === "function" ? nextPage(currentPage) : nextPage;
      return Math.min(Math.max(1, resolvedPage), totalPages);
    });
  }, [totalPages]);

  return { page, setPage, pageSize, totalPages, totalRecords, pagedItems } as const;
}

export default useClientPagination;
