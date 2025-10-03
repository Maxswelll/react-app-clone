"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Pagination from "./StockPagination";
import { AiOutlineDollarCircle } from "react-icons/ai";

// ✅ Utility to unify image paths
const getImageUrl = (image) => {
  if (!image) return "/default-placeholder.png"; // fallback image
  return image.startsWith("http")
    ? image
    : image.startsWith("/uploads")
    ? `http://localhost:5000${image}`
    : `http://localhost:5000/uploads/${image}`;
};

export default function BatchManagement() {
  const [products, setProducts] = useState([]); // ✅ fetched from backend
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // ✅ Fetch from backend (same as stock management)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/items");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchData();
  }, []);

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

      <div className="table-responsive mt-3">
        <table className="table align-middle table-hover text-nowrap">
          <thead className="table-light">
            <tr>
              <th
                style={{ color: "#344767", fontWeight: 600, cursor: "pointer" }}
              >
                Image
              </th>
              <th
                style={{ color: "#344767", fontWeight: 600, cursor: "pointer" }}
              >
                Price
              </th>
              <th
                style={{ color: "#344767", fontWeight: 600, cursor: "pointer" }}
                className="d-none d-sm-table-cell"
                onClick={() => setSortConfig({ key: "size", direction: "asc" })}
              >
                Available Sizes {getArrow("size")}
              </th>
              <th
                style={{ color: "#344767", fontWeight: 600, cursor: "pointer" }}
                onClick={() =>
                  setSortConfig({ key: "stock", direction: "asc" })
                }
              >
                Stock Qty {getArrow("stock")}
              </th>
              <th
                style={{ color: "#344767", fontWeight: 600, cursor: "pointer" }}
              >
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
                    src={getImageUrl(p.image)}
                    alt={p.name}
                    width="50"
                    height="50"
                    className="rounded"
                  />
                </td>
                <td>${p.sell_price}</td>
                <td className="d-none d-sm-table-cell">
                  {p.sizes?.join(", ") || "—"}
                </td>
                <td>{p.stock}</td>
                <td>
                  {p.stock > 0 ? (
                    <span
                      style={{
                        color: "#389e0d",
                        background: "#f6ffed",
                        border: "2px solid #b7eb8f",
                        fontWeight: "600",
                        borderRadius: "6px",
                        padding: ".25rem .75rem",
                        display: "inline-block",
                      }}
                    >
                      In Stock
                    </span>
                  ) : (
                    <span
                      style={{
                        color: "#cf1322",
                        background: "#fff1f0",
                        border: "2px solid #ffa39e",
                        fontWeight: "600",
                        borderRadius: "6px",
                        padding: ".25rem .75rem",
                        display: "inline-block",
                      }}
                    >
                      Out of Stock
                    </span>
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
