"use client";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Pagination from "./StockPagination";
import { AiOutlineDollarCircle } from "react-icons/ai";
import products from "./items"; // 👈 import items.js directly

export default function BatchManagement() {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // --- Sorting Logic ---
  const sortedProducts = [...products].sort((a, b) => {
    let valA, valB;

    if (sortConfig.key === "size") {
      const getMinSize = (sizes) =>
        Array.isArray(sizes)
          ? Math.min(...sizes.map((s) => parseInt(s, 10) || 0))
          : 0;
      valA = getMinSize(a.sizes);
      valB = getMinSize(b.sizes);
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

  // --- Pagination ---
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getArrow = (key) => {
    if (sortConfig.key !== key) return "⬍";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  return (
    <div className="container px-2 px-md-4 mt-4">
      <h3 className="d-flex align-items-center justify-content-center text-info">
        <AiOutlineDollarCircle size={35} className="me-2" color="#000" />
        Batch Management
      </h3>

      <p className="text-center text-muted mb-3 ms-3">
        To manage product for batch selling.
      </p>

      <div className="table-responsive shadow rounded bg-white p-2 p-md-3">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Image</th>
              <th>Price</th>
              <th
                className="d-none d-sm-table-cell"
                style={{ cursor: "pointer" }}
                onClick={() => setSortConfig({ key: "size", direction: "asc" })}
              >
                Available Sizes {getArrow("size")}
              </th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setSortConfig({ key: "stock", direction: "asc" })
                }
              >
                Stock Qty {getArrow("stock")}
              </th>
              <th>
                Status{" "}
                <select
                  className="form-select form-select-sm d-inline w-auto ms-2"
                  value={statusFilter}
                  onChange={(e) => {
                    setCurrentPage(1);
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
            {currentProducts.map((p) => (
              <tr key={p.id}>
                <td>
                  <img
                    src={p.image}
                    alt={p.name}
                    width="50"
                    height="50"
                    className="rounded"
                  />
                </td>
                <td>${p.sell_price}</td>
                <td className="d-none d-sm-table-cell">
                  {p.sizes?.join("kg/   ") || "—"}
                </td>
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
    </div>
  );
}
