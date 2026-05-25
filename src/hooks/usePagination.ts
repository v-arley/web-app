import { useState } from "react";

// const { page, next, prev, totalPages } = usePagination(120, 10);

export function usePagination(totalItems, perPage = 10) {
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(totalItems / perPage);

    return {
        page,
        totalPages,
        next: () => setPage(p => Math.min(p + 1, totalPages)),
        prev: () => setPage(p => Math.max(p - 1, 1)),
        goTo: setPage
    };
}