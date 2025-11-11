"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoHomeOutline } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockWarnings, setStockWarnings] = useState({});

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  // Fetch product data
useEffect(() => {
  if (cartItems.length === 0) {
    setLoading(false);
    return;
  }

  fetch("http://localhost:5000/items")
    .then(res => res.json())
    .then(data => {
      // Use data.data because your backend returns { data: [...], pagination: {...} }
      const itemsArray = Array.isArray(data.data) ? data.data : [];

      const fullProducts = cartItems
        .map(cartItem => {
          // Ensure matching number/string ids
          const product = itemsArray.find(
            p => p.id === Number(cartItem.id) || p._id === cartItem.id
          );
          return product ? { ...product, quantity: cartItem.quantity } : null;
        })
        .filter(Boolean);

      setProducts(fullProducts);
      setLoading(false);
    })
    .catch(err => {
      console.error("Failed to fetch items:", err);
      setProducts([]);
      setLoading(false);
    });
}, [cartItems]);



  // Handle quantity changes
  const handleQuantityChange = (id, delta) => {
    const updatedProducts = products.map((item) => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        if (newQuantity > item.stock) {
          setStockWarnings((prev) => ({
            ...prev,
            [id]: `Only ${item.stock} left in stock.`,
          }));
          return item;
        }
        setStockWarnings((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
        return { ...item, quantity: Math.max(1, newQuantity) };
      }
      return item;
    });

    setProducts(updatedProducts);
    localStorage.setItem(
      "cart",
      JSON.stringify(updatedProducts.map((i) => ({ id: i.id, quantity: i.quantity })))
    );
  };

  const handleRemove = (id) => {
    const updatedProducts = products.filter((item) => item.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem(
      "cart",
      JSON.stringify(updatedProducts.map((i) => ({ id: i.id, quantity: i.quantity })))
    );
  };

  const subtotal = products.reduce(
    (sum, item) => sum + Number(item.sell_price || 0) * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 2 : 0;
  const total = subtotal + shipping;

  // Loading state
  if (loading)
    return (
      <div className="text-center py-5 text-light fs-5">
        Loading your cart...
      </div>
    );

  // Empty cart state
  if (products.length === 0)
    return (
      <div
        className="text-center d-flex flex-column justify-content-center align-items-center"
        style={{
          height: "100vh",
          background:
            "linear-gradient(135deg, #020617, #0f172a, #1e293b, #0f172a)",
          backgroundSize: "400% 400%",
          animation: "bgMove 12s ease infinite",
          color: "#fff",
        }}
      >
        <style jsx>{`
          @keyframes bgMove {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}</style>
        <FaShoppingCart size={70} color="rgba(12, 188, 242, 0.7)" className="mb-3" />
        <h2 className="fw-bold display-6 mb-2">Your Bag is Empty</h2>
        <p className="text-light opacity-75 mb-4">
          Add something beautiful to your cart.
        </p>
        <button
          className="btn btn-light rounded-pill px-4 py-2 fw-semibold shadow-lg"
          onClick={() => router.push("/Main-page")}
        >
          Continue Shopping
        </button>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 20% 20%, #0f172a, #020617 70%)",
        color: "#fff",
        backgroundAttachment: "fixed",
      }}
    >
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(25px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
          transition: all 0.35s ease;
        }
        .glass-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5);
        }
        .remove-btn {
          background: rgba(255, 0, 0, 0.08);
          border: 1px solid rgba(255, 100, 100, 0.3);
          color: #ff4d4f;
          border-radius: 30px;
          padding: 6px 16px;
          font-weight: 600;
          transition: all 0.25s ease;
          backdrop-filter: blur(15px);
        }
        .remove-btn:hover {
          background: rgba(255, 77, 79, 0.25);
          color: #fff;
          box-shadow: 0 0 12px rgba(255, 77, 79, 0.5);
        }
        .qty-btn {
          border: none;
          background: transparent;
          color: white;
          font-size: 1.3rem;
          font-weight: bold;
          transition: 0.2s ease;
        }
        .qty-btn:hover {
          color: #0ef;
          transform: scale(1.15);
        }
      `}</style>

      {/* Header */}
      <div className="text-center py-5" style={{ animation: "fadeIn 1s ease" }}>
        <h1 className="fw-bolder display-5 mb-2">
          <FaShoppingCart color="rgba(12, 188, 242, 0.6)" /> Your Cart
        </h1>
        <p className="lead text-light opacity-75">
          Review your selections before checkout.
        </p>
      </div>

      {/* Cart Content */}
      <div className="container pb-5">
        <div className="row g-5 align-items-start">
          {/* Cart Items */}
          <div className="col-lg-8">
            {products.map((item, index) => (
              <div
                key={item.id}
                className="glass-card rounded-4 p-4 mb-4"
                style={{
                  animation: "fadeIn 0.6s ease forwards",
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="d-flex flex-column flex-md-row align-items-center gap-4">
                  <img
                    src={
                      item.image
                        ? item.image.startsWith("http")
                          ? item.image
                          : `http://localhost:5000${item.image}`
                        : "/default-image.png"
                    }
                    alt={item.name}
                    className="rounded-3"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                    }}
                  />
                  <div className="flex-fill text-start">
                    <h5 className="fw-bold text-white mb-2">{item.name}</h5>
                    <p className="text-light opacity-75 small mb-2">
                      {item.sizes?.length > 0 ? `Sizes: ${item.sizes.join(", ")}` : "—"}
                    </p>
                    <p className="fw-semibold text-success mb-0">
                      ${Number(item.sell_price || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="d-flex flex-column align-items-end">
                    <div
                      className="d-flex align-items-center rounded-pill px-3 py-1"
                      style={{
                        background: "rgba(0,0,0,0.4)",
                        backdropFilter: "blur(15px)",
                      }}
                    >
                      <button
                        className="qty-btn"
                        onClick={() => handleQuantityChange(item.id, -1)}
                      >
                        −
                      </button>
                      <span className="fw-bold px-3">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="remove-btn mt-3"
                      onClick={() => handleRemove(item.id)}
                    >
                      🗑 Remove
                    </button>
                    {stockWarnings[item.id] && (
                      <small className="text-danger mt-2 fw-semibold">
                        {stockWarnings[item.id]}
                      </small>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="col-lg-4">
            <div
              className="glass-card p-4 rounded-4 text-center"
              style={{ animation: "fadeIn 1s ease forwards" }}
            >
              <h5 className="fw-bold mb-3 text-white">
                <IoHomeOutline size={22} /> Order Summary
              </h5>
              <p className="text-light opacity-75 small mb-4">
                Prices include VAT where applicable.
              </p>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-light opacity-75">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-light opacity-75">Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <hr className="border-light opacity-25" />
              <div className="d-flex justify-content-between fs-5 fw-semibold mb-4">
                <span>Total</span>
                <span className="text-success">${total.toFixed(2)}</span>
              </div>

              <button
                className="btn w-100 py-2 rounded-pill mb-3 fw-semibold"
                style={{
                  background: "linear-gradient(135deg, #22c55e, #16a34a, #4ade80)",
                  color: "#fff",
                  border: "none",
                  boxShadow: "0 0 25px rgba(34,197,94,0.3)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onClick={() => router.push("/checkout")}
              >
                Proceed to Checkout →
              </button>

              <button
                className="btn btn-outline-light w-100 py-2 rounded-pill"
                onClick={() => router.push("/Main-page")}
              >
                ← Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
