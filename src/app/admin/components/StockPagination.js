"use client";
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  setCurrentPage,
  setItemsPerPage,
}) {
  // Generate page numbers (with ellipsis)
  const getPages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  // ✅ Add missing handler
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 gap-3">
      {/* Items per page */}
      <div>
        <select
          className="form-select w-auto"
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
          {/* Previous Button */}
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <FaChevronLeft />
            </button>
          </li>

          {/* Page Buttons */}
          {getPages().map((p, idx) =>
            p === "..." ? (
              <li key={`ellipsis-${idx}`} className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            ) : (
              <li
                key={`page-${p}-${idx}`}
                className={`page-item ${currentPage === p ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(p)}
                >
                  {p}
                </button>
              </li>
            )
          )}

          {/* Next Button */}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <FaChevronRight />
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
          className="form-control w-auto"
          placeholder="Go to"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const page = Number(e.target.value);
              handlePageChange(page);
              e.target.value = "";
            }
          }}
        />
      </div>
    </div>
  );
}
