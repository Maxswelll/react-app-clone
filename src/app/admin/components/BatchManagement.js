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

// ✅ Clean and normalize sizes (works for array or string)
const normalizeSizes = (sizes) => {
  if (!sizes) return [];
  if (Array.isArray(sizes))
    return sizes.map((s) => s.toString().replace(/"/g, "").trim());
  if (typeof sizes === "string") {
    return sizes
      .replace(/[{}"]/g, "")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
  }
  return [];
};

export default function BatchManagement() {
  const [products, setProducts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // ✅ Fetch from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/items");
        const data = await res.json();

        // ✅ Clean all sizes immediately
        const cleaned = data.map((item) => ({
          ...item,
          sizes: normalizeSizes(item.sizes),
        }));

        setProducts(cleaned);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchData();
  }, []);

  // ✅ Sort handler (toggle asc/desc)
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  // ✅ Sorting logic
  const sortedProducts = [...products].sort((a, b) => {
    let valA, valB;

    if (sortConfig.key === "size") {
      const getMinSize = (sizes) => {
        const nums = normalizeSizes(sizes)
          .map((s) => parseInt(s, 10))
          .filter((n) => !isNaN(n));
        return nums.length > 0 ? Math.min(...nums) : 0;
      };
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

  // ✅ Filtering
  const filteredProducts = sortedProducts.filter((p) => {
    if (statusFilter === "In Stock") return p.stock > 0;
    if (statusFilter === "Out of Stock") return p.stock === 0;
    return true;
  });

  // ✅ Pagination
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
              <th style={{ color: "#344767", fontWeight: 600 }}>Image</th>
              <th style={{ color: "#344767", fontWeight: 600 }}>Price</th>

              <th
                style={{ color: "#344767", fontWeight: 600, cursor: "pointer" }}
                className="d-none d-sm-table-cell"
                onClick={() => handleSort("size")}
              >
                Available Sizes {getArrow("size")}
              </th>

              <th
                style={{ color: "#344767", fontWeight: 600, cursor: "pointer" }}
                onClick={() => handleSort("stock")}
              >
                Stock Qty {getArrow("stock")}
              </th>

              <th style={{ color: "#344767", fontWeight: 600 }}>
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

                {/* ✅ Show sizes cleanly */}
                <td className="d-none d-sm-table-cell">
                  {p.sizes && p.sizes.length > 0 ? p.sizes.join(" • ") : "—"}
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
