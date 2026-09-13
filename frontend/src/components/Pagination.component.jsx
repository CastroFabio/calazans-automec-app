import React from "react";

const Pagination = ({
  osPage,
  totalPages,
  pagesArray = [],
  onPageChange,
  totalItems = 0,
}) => {
  return (
    <div className="pagination">
      <div className="pagination-wrapper">
        <div className="pagination-controls">
          {/* Botão Anterior */}
          <button
            className="pg-btn"
            disabled={osPage === 1}
            onClick={() => onPageChange(osPage - 1)}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Páginas Numéricas */}
          {pagesArray.map((p, index) =>
            p === "..." ? (
              <span key={`ellipsis-${index}`} className="pg-ellipsis ">
                …
              </span>
            ) : (
              <button
                key={p}
                className={`pg-btn ${p === osPage ? "active" : ""}`}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            ),
          )}

          {/* Botão Próximo */}
          <button
            className="pg-btn"
            disabled={osPage === totalPages}
            onClick={() => onPageChange(osPage + 1)}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
