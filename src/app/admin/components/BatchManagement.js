"use client";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Pagination from "./StockPagination";

export default function BatchManagement({ products }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // --- Handle Sort ---
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  // --- Sorting Logic ---
  const sortedProducts = [...products].sort((a, b) => {
    let valA, valB;

    if (sortConfig.key === "size") {
      const getMinSize = (s) => {
        const match = s.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      };
      valA = getMinSize(a.Size);
      valB = getMinSize(b.Size);
    } else if (sortConfig.key === "stock") {
      valA = a.stock;
      valB = b.stock;
    } else {
      return 0;
    }

    if (sortConfig.direction === "asc") return valA - valB;
    if (sortConfig.direction === "desc") return valB - valA;
    return 0;
  });

  // --- Filtering ---
  const filteredProducts = sortedProducts.filter((p) => {
    if (statusFilter === "In Stock") return p.stock > 0;
    if (statusFilter === "Out of Stock") return p.stock === 0;
    return true;
  });

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // --- Arrow icon helper ---
  const getArrow = (key) => {
    if (sortConfig.key !== key) return "⬍";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center text-primary">💲 Batch Management</h3>
      <p className="text-center text-muted">
        To manage product for batch selling.
      </p>

      <div
        className="table-responsive shadow rounded bg-white p-3"
        style={{ transition: "all 0.3s ease-in-out" }}
      >
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Image</th>
              <th>Price</th>
              <th
                style={{ cursor: "pointer", userSelect: "none" }}
                onClick={() => handleSort("size")}
              >
                Size {getArrow("size")}
              </th>
              <th
                style={{ cursor: "pointer", userSelect: "none" }}
                onClick={() => handleSort("stock")}
              >
                Stock Qty {getArrow("stock")}
              </th>
              <th>
                Status{" "}
                <select
                  className="form-select form-select-sm d-inline w-auto ms-2"
                  value={statusFilter}
                  onChange={(e) => {
                    setCurrentPage(1); // reset to page 1 on filter
                    setStatusFilter(e.target.value);
                  }}
                >
                  <option value="">All</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((p, i) => (
              <tr
                key={i}
                style={{
                  animation: "fadeIn 0.4s ease-in-out",
                }}
              >
                <td>
                  <img
                    src={p.image}
                    alt="product"
                    width="50"
                    height="50"
                    className="rounded"
                  />
                </td>
                <td>${p.Price}</td>
                <td>{p.Size}</td>
                <td>{p.stock}</td>
                <td>
                  {p.stock > 0 ? (
                    <span className="badge bg-success">In Stock</span>
                  ) : (
                    <span className="badge bg-danger">Out of Stock</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
        />
      </div>

      {/* Inline animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
