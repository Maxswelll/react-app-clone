"use client";
import React from "react";

export default function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  setCurrentPage,
  setItemsPerPage,
}) {
  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      {/* Items per page */}
      <div>
        <select
          className="form-select d-inline-block w-auto"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1); // reset to first page
          }}
        >
          <option value={5}>5 / page</option>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>
      </div>

      {/* Page numbers */}
      <nav>
        <ul className="pagination mb-0">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              {"<"}
            </button>
          </li>

          {Array.from({ length: totalPages }, (_, i) => (
            <li
              key={i}
              className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            </li>
          ))}

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              {">"}
            </button>
          </li>
        </ul>
      </nav>

      {/* Go to page */}
      <div>
        <input
          type="number"
          min="1"
          max={totalPages}
          className="form-control d-inline-block w-auto"
          placeholder="Go to"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const page = Number(e.target.value);
              if (page >= 1 && page <= totalPages) {
                setCurrentPage(page);
              }
            }
          }}
        />
      </div>
    </div>
  );
}
