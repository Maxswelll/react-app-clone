"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Pagination from "./StockPagination";
import { AiOutlineDollarCircle } from "react-icons/ai";
import AnimatedSelect from "./AnimatedSelect";

// Image URL helper
const getImageUrl = (image) => {
  if (!image) return "/default-placeholder.png";
  return image.startsWith("http")
    ? image
    : image.startsWith("/uploads")
    ? `http://localhost:5000${image}`
    : `http://localhost:5000/uploads/${image}`;
};

// Normalize sizes
const normalizeSizes = (sizes) => {
  if (!sizes) return [];
  if (Array.isArray(sizes)) return sizes.map((s) => s.toString().trim());
  if (typeof sizes === "string")
    return sizes
      .replace(/[{}"]/g, "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
};

export default function BatchManagement() {
  const [products, setProducts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch paginated products
  const fetchProducts = async (
    page = currentPage,
    limit = itemsPerPage,
    status = statusFilter
  ) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        status: status && status !== "All" ? status : "",
      });

      const res = await fetch(`http://localhost:5000/items/paginated?${query}`);
      const data = await res.json();

      if (data.data && data.pagination) {
        const cleaned = data.data.map((item) => ({
          ...item,
          sizes: normalizeSizes(item.sizes),
        }));

        setProducts(cleaned);
        setTotalPages(data.pagination.totalPages || 1);
        setCurrentPage(data.pagination.page || 1);
      } else {
        setProducts([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, itemsPerPage, statusFilter);
  }, [currentPage, itemsPerPage, statusFilter]);

  // Client-side sorting
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];

    if (sortConfig.key === "size") {
      const getMinSize = (sizes) => {
        const nums = normalizeSizes(sizes)
          .map((n) => parseInt(n, 10))
          .filter(Boolean);
        return nums.length ? Math.min(...nums) : 0;
      };
      valA = getMinSize(a.sizes);
      valB = getMinSize(b.sizes);
    }

    if (sortConfig.key === "stock") {
      valA = a.stock;
      valB = b.stock;
    }

    return sortConfig.direction === "asc" ? valA - valB : valB - valA;
  });

  const getArrow = (key) => {
    if (sortConfig.key !== key) return "⬍";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  return (
    <div className="container px-2 px-md-4 mt-4">
      <h3 className="d-flex align-items-center justify-content-center text-info">
        <AiOutlineDollarCircle size={35} className="me-2" />
        Batch Management
      </h3>
      <p className="text-center text-muted mb-3 ms-3">
        To manage product for batch selling.
      </p>

      <div className="table-responsive mt-3">
        <table className="table align-middle table-hover text-nowrap">
          <thead className="table-light">
            <tr>
              <th>Image</th>
              <th>Price</th>
              <th
                className="d-none d-sm-table-cell"
                style={{ cursor: "pointer" }}
                onClick={() => handleSort("size")}
              >
                Available Sizes {getArrow("size")}
              </th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => handleSort("stock")}
              >
                Stock Qty {getArrow("stock")}
              </th>
              <th>
                <AnimatedSelect
                  value={statusFilter || "All"}
                  onChange={(v) => {
                    setStatusFilter(v === "All" ? "" : v);
                    setCurrentPage(1);
                  }}
                  options={["All", "In Stock", "Out of Stock"]}
                />
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center">
                  Loading...
                </td>
              </tr>
            ) : sortedProducts.length > 0 ? (
              sortedProducts.map((p) => (
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
                    {p.sizes.length ? p.sizes.join(" • ") : "—"}
                  </td>
                  <td>{p.stock}</td>
                  <td>
                    <span
                      style={{
                        color: p.stock > 0 ? "#389e0d" : "#cf1322",
                        background: p.stock > 0 ? "#f6ffed" : "#fff1f0",
                        border:
                          p.stock > 0
                            ? "2px solid #b7eb8f"
                            : "2px solid #ffa39e",
                        fontWeight: 600,
                        borderRadius: "6px",
                        padding: ".25rem .75rem",
                        display: "inline-block",
                      }}
                    >
                      {p.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={(limit) => {
            setItemsPerPage(limit);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );
}
