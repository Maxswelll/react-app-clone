"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Filters from "./filter";
import Footer from "./footer";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Products() {
  const router = useRouter();
  const [index, setIndex] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    type: "",
    stock: "",
    search: "",
  });

  const { type, stock, search } = filters;

  // ✅ Fetch products from backend
  useEffect(() => {
    let currentPage = 1;
    let isFetching = false;
    let hasMore = true;

    const fetchItems = async () => {
      if (isFetching || !hasMore) return;
      isFetching = true;

      try {
        const res = await axios.get(
          `http://localhost:5000/items?page=${currentPage}&limit=10`
        );
        const result = res.data;
        const itemsData = result.data || [];

        const fixedData = itemsData.map((item) => {
          let sizesArray = [];

          if (Array.isArray(item.sizes)) {
            sizesArray = item.sizes.map((s) =>
              String(s)
                .replace(/['"{}]/g, "")
                .trim()
            );
          } else if (
            typeof item.sizes === "string" &&
            item.sizes.trim() !== ""
          ) {
            sizesArray = item.sizes
              .replace(/[{}]/g, "")
              .split(",")
              .map((s) => s.replace(/['"]/g, "").trim())
              .filter((s) => s !== "");
          }

          const discountLabel =
            !isNaN(item.discount) && item.discount > 0
              ? `${item.discount}% OFF`
              : "No discount";

          return { ...item, sizesArray, discountLabel };
        });

        // ✅ Append instead of replace
        setItems((prev) => [...prev, ...fixedData]);
        setLoading(false);

        hasMore = result.hasMore;
        if (result.hasMore && result.nextPage) {
          currentPage = result.nextPage;
        } else {
          hasMore = false;
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      } finally {
        isFetching = false;
      }
    };

    // ✅ Initial load
    fetchItems();

    // ✅ Scroll event listener
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
      ) {
        fetchItems();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredProducts = items.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchType = type ? p.type === type : true;
    const matchSize = filters.size
      ? p.sizesArray?.includes(filters.size)
      : true;
    let matchStock = true;
    if (stock === "in") matchStock = p.stock > 0;
    if (stock === "out") matchStock = p.stock === 0;
    return matchSearch && matchType && matchSize && matchStock;
  });

  const handleNext = () =>
    setIndex((i) => (i < filteredProducts.length - 1 ? i + 1 : i));
  const handlePrev = () => setIndex((i) => (i > 0 ? i - 1 : i));

  const cardStyle = {
    background: "#fff",
    boxShadow: "0 2px 8px #0000000f",
    cursor: "pointer",
    borderRadius: "16px",
    height: "150px",
    display: "flex",
    flexDirection: "row",
    padding: "8px",
    transition: "all .3s ease",
  };

  const imgStyle = {
    width: "150px",
    height: "130px",
    objectFit: "cover",
    borderRadius: "12px",
  };

  const badgeStyle = (inStock) => ({
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "8px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    color: inStock ? "#fff" : "#c53030",
    background: inStock
      ? "linear-gradient(135deg, #48bb78, #68d391)"
      : "#fed7d7",
  });

  const discountStyle = {
    display: "inline-block",
    padding: "2px 6px",
    borderRadius: "6px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #e53e3e, #fc8181)",
    color: "#fff",
    marginLeft: "8px",
  };

  const handleAddToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id: product.id, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    router.push("/cart");
  };

  return (
    <div className="container py-4">
      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-card {
          opacity: 0;
          animation: fadeInUp 0.5s ease forwards;
        }

        .modal-animate {
          opacity: 0;
          transform: translateY(30px);
          animation: modalFadeIn 0.4s ease forwards;
        }

        @keyframes modalFadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Filters */}
      <Filters filters={filters} setFilters={setFilters} />

      {/* Loader */}
      {loading ? (
        <div className="text-center py-5">Loading products...</div>
      ) : (
        <div className="row g-3 mt-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <h4>No products found 😢</h4>
              <p>Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            filteredProducts.map((product, i) => (
              <div
                key={product.id}
                className="col-md-6 col-lg-4 fade-card"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  style={cardStyle}
                  className="d-flex align-items-center"
                  onClick={() => setIndex(i)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 6px 16px rgba(0,0,0,0.2)";
                    e.currentTarget.style.transform = "translateY(-5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 2px 8px #0000000f";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div>
                    <img
                      src={
                        product.image?.startsWith("http")
                          ? product.image
                          : product.image?.startsWith("/uploads")
                          ? `http://localhost:5000${product.image}`
                          : `http://localhost:5000/uploads/${product.image}`
                      }
                      alt={product.name}
                      style={imgStyle}
                    />
                  </div>

                  <div style={{ marginLeft: "12px", flex: 1 }}>
                    <span style={badgeStyle(product.stock > 0)}>
                      {product.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
                    </span>

                    <p
                      style={{
                        margin: "6px 0",
                        fontSize: ".7rem",
                        fontWeight: "600",
                        color: "#64748b",
                        letterSpacing: ".5px",
                      }}
                    >
                      <span style={{ fontWeight: "normal", color: "#64748b" }}>
                        AVAILABLE SIZE
                      </span>
                      <br />
                      <span style={{ fontWeight: "bold", color: "#000" }}>
                        {product.sizesArray?.length > 0
                          ? product.sizesArray.join(" • ")
                          : "—"}
                      </span>
                    </p>

                    <div>
                      <span
                        style={{
                          color: "#dc3545",
                          fontWeight: "bold",
                          fontSize: "1rem",
                        }}
                      >
                        ${Number(product.sell_price).toFixed(2)}
                      </span>
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "#888",
                          marginLeft: "6px",
                          fontSize: "0.9rem",
                        }}
                      >
                        ${Number(product.buy_price).toFixed(2)}
                      </span>
                      {product.discountLabel && (
                        <span style={discountStyle}>
                          {product.discountLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Footer */}
          <Footer
            filteredCount={filteredProducts.length}
            totalCount={items.length}
          />
        </div>
      )}

      {/* Product Modal */}
      {index !== null && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
          onClick={() => setIndex(null)}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 rounded-4 overflow-hidden modal-animate">
              <button
                type="button"
                className="btn-close position-absolute end-0 m-3"
                onClick={() => setIndex(null)}
                style={{ zIndex: 10 }}
              ></button>

              <div className="modal-body d-flex flex-column flex-lg-row p-0">
                <div
                  className="flex-fill d-flex justify-content-center align-items-center bg-light"
                  style={{ minHeight: "500px" }}
                >
                  <img
                    src={
                      filteredProducts[index].image?.startsWith("http")
                        ? filteredProducts[index].image
                        : filteredProducts[index].image?.startsWith("/uploads")
                        ? `http://localhost:5000${filteredProducts[index].image}`
                        : `http://localhost:5000/uploads/${filteredProducts[index].image}`
                    }
                    alt={filteredProducts[index].name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "450px",
                      objectFit: "cover",
                      borderRadius: "5%",
                    }}
                  />
                </div>

                <div className="flex-fill p-4 text-start">
                  <span style={badgeStyle(filteredProducts[index].stock > 0)}>
                    {filteredProducts[index].stock > 0
                      ? "IN STOCK"
                      : "OUT OF STOCK"}
                  </span>

                  <div className="mt-3">
                    <span
                      style={{
                        color: "#dc3545",
                        fontWeight: "bold",
                        fontSize: "1.8rem",
                      }}
                    >
                      ${Number(filteredProducts[index].sell_price).toFixed(2)}
                    </span>
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "#888",
                        marginLeft: "8px",
                        fontSize: "1.1rem",
                      }}
                    >
                      ${Number(filteredProducts[index].buy_price).toFixed(2)}
                    </span>
                    {filteredProducts[index].discountLabel && (
                      <span style={discountStyle}>
                        {filteredProducts[index].discountLabel}
                      </span>
                    )}
                  </div>

                  <p style={{ marginTop: "16px" }}>
                    <strong>Available Sizes:</strong>
                    <br />
                    {filteredProducts[index].sizesArray?.length > 0
                      ? filteredProducts[index].sizesArray.join(" • ")
                      : "—"}
                  </p>

                  <div className="mt-4">
                    <button
                      style={{
                        background:
                          "linear-gradient(135deg, #22c55e, #16a34a, #4ade80)",
                        color: "#fff",
                        fontWeight: "600",
                        border: "none",
                        boxShadow: "0 0 20px rgba(34,197,94,0.3)",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.03)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                      className="btn btn-success w-100 py-2"
                      onClick={() => handleAddToCart(filteredProducts[index])}
                      disabled={filteredProducts[index].stock === 0}
                    >
                      🛒 Add to Cart
                    </button>
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={handlePrev}
                      disabled={index === 0}
                    >
                      ← Previous
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={handleNext}
                      disabled={index === filteredProducts.length - 1}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
