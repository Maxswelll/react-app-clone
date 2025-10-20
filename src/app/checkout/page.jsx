"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import { LiaAmazonPay } from "react-icons/lia";


export default function Checkout() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    fetch("http://localhost:5000/api/stock/items")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  // Load cart
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  // Handle quantity changes
  const handleQuantityChange = (id, delta) => {
    const newCart = cartItems.map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return item;

      let newQty = Math.max(1, item.quantity + delta);
      if (newQty > product.stock) newQty = product.stock;

      return { ...item, quantity: newQty };
    });

    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // Remove item
  const handleRemove = (id) => {
    const newCart = cartItems.filter((item) => item.id !== id);
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // Total
  const totalPrice = cartItems.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);
    return sum + (product?.sell_price || 0) * item.quantity;
  }, 0);

  return (
    <div
      className="container py-5"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0fdf4, #dcfce7, #bbf7d0)",
        borderRadius: "16px",
        boxShadow: "0 0 20px rgba(0,0,0,0.05)",
      }}
    >
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
        .fade-item {
          opacity: 0;
          animation: fadeInUp 0.4s ease forwards;
        }
      `}</style>

      <h2
        className="text-center mb-4 fw-bold"
        style={{
          background: "linear-gradient(135deg, #16a34a, #22c55e)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        🛒 Checkout Page
        
      </h2>
       <p
       style={{
      
        paddingBottom:"15px",
       }}
        className="lead opacity-75 text-center text-gray">
          Review your products before payment.
        </p>
      

      {loading ? (
        <div className="text-center py-5 fs-5 text-secondary">
          Loading products...
        </div>
      ) : cartItems.length === 0 ? (
        <div className="text-center py-5">
          <h5>Your cart is empty 😢</h5>
          <button
            className="btn btn-success mt-3 rounded-pill px-4"
            onClick={() => router.push("/Main-page")}
          >
            Back to Shop
          </button>
        </div>
      ) : (
        <div
          className="p-4 bg-white shadow-sm rounded-4 fade-item"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-success">
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th
                  style={{ paddingLeft: "220px" }}
                  >Quantity</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => {
                  const product = products.find((p) => p.id === item.id);
                  if (!product) return null;
                  const outOfStock = product.stock <= 0;
                  const isMax = item.quantity >= product.stock;

                  return (
                    <tr
                      key={item.id}
                      className="fade-item"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <td className="d-flex align-items-center">
                        <img
                          src={
                            product.image?.startsWith("http")
                              ? product.image
                              : product.image?.startsWith("/uploads")
                              ? `http://localhost:5000${product.image}`
                              : `http://localhost:5000/uploads/${product.image}`
                          }
                          alt={product.name}
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "12px",
                            marginRight: "12px",
                            boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                          }}
                        />
                        <div>
                          <span className="fw-semibold">{product.name}</span>
                          <br />
                          <small
                            className={`fw-bold ${
                              outOfStock ? "text-danger" : "text-success"
                            }`}
                          >
                            {outOfStock
                              ? "Out of Stock"
                              : `In Stock: ${product.stock}`}
                          </small>
                        </div>
                      </td>

                      <td>${Number(product.sell_price).toFixed(2)}</td>

                      <td>
                        <div className="d-flex flex-column align-items-center">
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-sm btn-outline-secondary rounded-circle"
                              onClick={() =>
                                handleQuantityChange(item.id, -1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              −
                            </button>
                            <span className="px-3 fw-semibold">
                              {item.quantity}
                            </span>
                            <button
                              className="btn btn-sm btn-outline-secondary rounded-circle"
                              onClick={() =>
                                handleQuantityChange(item.id, 1)
                              }
                              disabled={isMax || outOfStock}
                            >
                              +
                            </button>
                          </div>

                          {/* Stock limit info — always visible */}
                          {outOfStock ? (
                            <small className="text-danger mt-1 fw-semibold">
                              Out of stock
                            </small>
                          ) : isMax ? (
                            <small className="text-danger mt-1 fw-semibold">
                              Max stock reached ({product.stock})
                            </small>
                          ) : (
                            <small className="text-secondary mt-1">
                              {product.stock - item.quantity} left in stock
                            </small>
                          )}
                        </div>
                      </td>

                      <td>
                        ${(product.sell_price * item.quantity).toFixed(2)}
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-danger rounded-pill"
                          onClick={() => handleRemove(item.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan={3} className="text-end fw-bold fs-5">
                    Grand Total:
                  </td>
                  <td className="fw-bold fs-5 text-success">
                    ${totalPrice.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <button
            className="btn w-100 py-3 mt-3 rounded-pill fs-5"
            style={{
              background:
                "linear-gradient(135deg, #22c55e, #16a34a, #4ade80)",
              color: "#fff",
              fontWeight: "600",
              border: "none",
              boxShadow: "0 8px 20px rgba(22,163,74,0.3)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
            onClick={() => router.push("/payment")}
          >
            Proceed to Payment <LiaAmazonPay size={20} />

          </button>
        </div>
      )}
    </div>
  );
}
