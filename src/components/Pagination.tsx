// components/Pagination.jsx
export default function Pagination({
    currentPage,
    totalPages,
    nextPage,
    prevPage
}) {
    return (
        <div className="pagination">
            <button
                onClick={prevPage}
                disabled={currentPage === 1}
            >
                Prev
            </button>

            <span>
                Page {currentPage} of {totalPages}
            </span>

            <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
}