// components/Pagination.jsx
export default function Pagination({
    currentPage,
    totalPages,
    nextPage,
    prevPage
}: {
    currentPage: number;
    totalPages: number;
    nextPage: () => void;
    prevPage: () => void;
}) {
    return (
        <div className="pagination">
            <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="btn btn--secondary btn--sm"
            >
                Prev
            </button>

            <span>
                Page {currentPage} of {totalPages}
            </span>

            <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="btn btn--secondary btn--sm"
            >
                Next
            </button>
        </div>
    );
}
