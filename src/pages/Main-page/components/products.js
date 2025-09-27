"use client";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import products from "../items";
import Filters from "./filter";
import Footer from "./footer";

export default function Products() {
  const [index, setIndex] = useState(null);

  // ✅ store filters from Filters.js
  const [filters, setFilters] = useState({
    type: "",
    size: "",
    stock: "",
    search: "",
  });
  const filterProducts = products.filter((p) => {
    return (
      (!filters.type || p.type === filters.type) &&
      (!filters.size || p.size === filters.size) &&
      (!filters.stock || (filters.stock === "in" ? p.inStock : !p.inStock)) &&
      (!filters.search ||
        p.name.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  const { type, size, stock, search } = filters;

  // ✅ Filtering logic
  const filteredProducts = products.filter((p) => {
    // search by name
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());

    // filter by type
    const matchType = type ? p.type === type : true;

    // filter by size
    const matchSize = size ? p.sizes.includes(size) : true;

    // filter by stock
    let matchStock = true;
    if (stock === "in") matchStock = p.inStock;
    if (stock === "out") matchStock = !p.inStock;

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
    height: "118px",
    display: "flex",
    flexDirection: "row",
    padding: "4px",
    transition: "all .3s ease",
  };

  const imgStyle = {
    width: "170px",
    height: "110px",
    objectFit: "cover",
    borderRadius: "16px",
    transition: "transform .3s ease-in-out",
  };

  const badgeStyle = (inStock) => ({
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "8px",
    fontSize: "0.75rem",
    fontWeight: "normal",
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

  return (
    <div className="container py-4">
      {/* ✅ Filters Section */}
      <>
        <Filters filters={filters} setFilters={setFilters} />
        {/* products display */}
      </>

      <div className="row g-3 mt-3">
        {filteredProducts.map((product, i) => (
          <div key={product.id} className="col-md-6 col-lg-4">
            <div
              style={cardStyle}
              className="d-flex align-items-center"
              onClick={() => setIndex(i)}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.2)";
                e.currentTarget.style.transform = "translateY(-5px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px #0000000f";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Image */}
              <div style={{ flex: "0 0 200px" }}>
                <img src={product.image} alt={product.name} style={imgStyle} />
              </div>

              {/* Info */}
              <div style={{ marginLeft: "12px", flex: 1 }}>
                {/* Stock Badge */}
                <span style={badgeStyle(product.inStock)}>
                  {product.inStock ? "IN STOCK" : "OUT OF STOCK"}
                </span>

                {/* Sizes */}
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
                    {product.sizes.length > 0 ? product.sizes.join(" • ") : "—"}
                  </span>
                </p>

                {/* Price Section */}
                <div style={{ marginTop: "4px" }}>
                  <span
                    style={{
                      color: "#dc3545",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    ${product.salePrice.toFixed(2)}
                  </span>
                  <span
                    style={{
                      textDecoration: "line-through",
                      color: "#888",
                      marginLeft: "6px",
                      fontSize: "0.9rem",
                    }}
                  >
                    ${product.price.toFixed(2)}
                  </span>
                  <span style={discountStyle}>{product.discount}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <>
          {/* footer number show*/}
          <Footer
            filteredCount={filterProducts.length}
            totalCount={products.length}
          />
        </>
      </div>

      {/* ✅ Product Popup */}
      {index !== null && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.6)",
          }}
          onClick={() => setIndex(null)}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 rounded-4 overflow-hidden">
              {/* Close Button */}
              <button
                type="button"
                className="btn-close position-absolute end-0 m-3"
                onClick={() => setIndex(null)}
                style={{ zIndex: 10 }}
              ></button>

              <div className="modal-body d-flex flex-column flex-lg-row p-0">
                {/* Left: Product Image */}
                <div
                  className="flex-fill d-flex justify-content-center align-items-center bg-light"
                  style={{ minHeight: "500px" }}
                >
                  <img
                    src={filteredProducts[index].image}
                    alt={filteredProducts[index].name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "450px",
                      objectFit: "cover",
                      borderRadius: "5%",
                    }}
                  />
                </div>

                {/* Right: Product Info */}
                <div className="flex-fill p-4 text-start">
                  <span style={badgeStyle(filteredProducts[index].inStock)}>
                    {filteredProducts[index].inStock
                      ? "IN STOCK"
                      : "OUT OF STOCK"}
                  </span>

                  <p style={{ marginTop: "16px" }}>
                    <strong>Available Sizes:</strong>
                    <br />
                    {filteredProducts[index].sizes.length > 0
                      ? filteredProducts[index].sizes.join(" • ")
                      : "—"}
                  </p>

                  <div className="mt-3">
                    <span
                      style={{
                        color: "#dc3545",
                        fontWeight: "bold",
                        fontSize: "1.8rem",
                      }}
                    >
                      ${filteredProducts[index].salePrice.toFixed(2)}
                    </span>
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "#888",
                        marginLeft: "8px",
                        fontSize: "1.1rem",
                      }}
                    >
                      ${filteredProducts[index].price.toFixed(2)}
                    </span>
                    <span style={discountStyle}>
                      {filteredProducts[index].discount}
                    </span>
                  </div>

                  {/* Navigation Buttons */}
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
