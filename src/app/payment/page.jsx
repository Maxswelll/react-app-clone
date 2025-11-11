"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import AnimatedDropdown from "./componets/AnimatedDropdown";

export default function PaymentPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [error, setError] = useState("");

  const [showQR, setShowQR] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Fetch product details
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);

    if (cart.length === 0) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/items")
      .then((res) => res.json())
      .then((data) => {
        const itemsArray = Array.isArray(data.data) ? data.data : [];

        // Map cart items to full products and convert sell_price to number
        const fullProducts = cart
          .map((cartItem) => {
            const product = itemsArray.find(
              (p) => p.id === Number(cartItem.id) || p._id === cartItem.id
            );
            if (!product) return null;
            return {
              ...product,
              quantity: cartItem.quantity,
              sell_price: Number(product.sell_price), // convert to number
            };
          })
          .filter(Boolean);

        setProducts(fullProducts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  // Calculate totals
  const subtotal = products.reduce(
    (sum, item) => sum + item.sell_price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 2 : 0;
  const total = subtotal + shipping;

  // Step 1: show QR
  const handlePayment = () => {
    if (!bankName || !accountNumber) {
      setError("⚠️ Please fill in all bank details before confirming payment.");
      return;
    }
    setError("");
    setShowQR(true);
  };

  // Step 2: simulate payment success after scanning
  const handleConfirmPaid = async () => {
    try {
      await fetch("http://localhost:5000/items/update-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: products.map((p) => ({ id: p.id, quantity: p.quantity })),
        }),
      });

      setPaymentSuccess(true);
      localStorage.removeItem("cart");

      setTimeout(() => router.push("/Main-page"), 3000);
    } catch (error) {
      console.error("Failed to update stock:", error);
      alert("⚠️ Error updating stock. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center dark-bg">
        <h3 className="text-white">Loading your order...</h3>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="vh-100 d-flex flex-column justify-content-center align-items-center dark-bg text-center">
        <h2 className="text-white mb-3">Your cart is empty 😢</h2>
        <p className="text-gray mb-4">Please add items to your cart before checkout.</p>
        <button className="btn btn-neon px-5 py-2" onClick={() => router.push("/Main-page")}>
          Go to Main Page
        </button>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center dark-bg py-5">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container p-5 rounded-5 glass shadow-lg"
        style={{ maxWidth: "1000px" }}
      >
        <h1 className="text-center mb-5 neon-text">🏦 Bank Payment</h1>

        <div className="row g-4">
          {/* Order Summary */}
          <div className="col-md-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="p-4 rounded-4 glass-sm shadow-sm"
            >
              <h4 className="mb-3 neon-text">🛍️ Order Summary</h4>
              {products.map((item) => (
                <div
                  key={item.id}
                  className="d-flex align-items-center justify-content-between mb-3 border-bottom border-gray pb-2"
                >
                  <img
                    src={
                      item.image
                        ? item.image.startsWith("http")
                          ? item.image
                          : `http://localhost:5000${item.image}`
                        : "/placeholder.png"
                    }
                    alt={item.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginRight: "10px",
                    }}
                  />
                  <div className="flex-grow-1 text-white ms-2">
                    <p className="mb-1">{item.name}</p>
                    <small>
                      {item.quantity} × ${item.sell_price.toFixed(2)}
                    </small>
                  </div>
                  <span className="text-white">${(item.sell_price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr className="border-gray" />
              <div className="d-flex justify-content-between">
                <span className="text-gray">Subtotal</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-gray">Shipping</span>
                <span className="text-white">${shipping.toFixed(2)}</span>
              </div>
              <hr className="border-gray" />
              <div className="d-flex justify-content-between fw-bold fs-5 text-white">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </motion.div>
          </div>

          {/* Bank Payment Section */}
          <div className="col-md-6">
            {!showQR && !paymentSuccess && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="p-4 rounded-4 glass-sm shadow-sm"
              >
                <h4 className="mb-3 neon-text">💳 Bank Payment Details</h4>

                <div className="mb-3">
                  <AnimatedDropdown
                    label="Select Bank"
                    options={["ABA Bank", "Acleda Bank", "Wing Bank", "Canadia Bank"]}
                    selected={bankName}
                    onSelect={(value) => setBankName(value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-white">Account Number</label>
                  <input
                    type="text"
                    className="form-control bg-dark text-white border-gray"
                    placeholder="Enter your bank account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </div>

                {error && <div className="alert alert-danger">{error}</div>}
                <button className="btn btn-neon w-100 py-3 mt-3" onClick={handlePayment}>
                  Show QR Code 💳
                </button>
              </motion.div>
            )}

            {/* QR Display */}
            {showQR && !paymentSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center p-4 rounded-4 glass-sm shadow-sm"
              >
                <h4 className="mb-3 neon-text">📱 Scan to Pay</h4>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                    `Bank: ${bankName}\nAccount: ${accountNumber}\nAmount: $${total}\nItems: ${products
                      .map((i) => i.name + " x" + i.quantity)
                      .join(", ")}`
                  )}`}
                  alt="Payment QR"
                  className="rounded-3 shadow mb-3 bg-white p-2"
                />
                <p className="text-white">
                  Scan with <b>{bankName}</b> app to pay <b>${total.toFixed(2)}</b>
                </p>
                <button className="btn btn-dark me-2 px-4" onClick={() => setShowQR(false)}>
                  ← Edit Info
                </button>
                <button className="btn btn-neon px-4" onClick={handleConfirmPaid}>
                  ✅ I Have Paid
                </button>
              </motion.div>
            )}

            {/* Payment Success */}
            {paymentSuccess && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="alert text-center fs-5 w-100 mt-5 glass-sm"
                style={{ color: "#0ff", border: "1px solid rgba(0,255,255,0.4)" }}
              >
                ✅ Payment Successful via {bankName}!<br />
                Redirecting to Main Page...
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .dark-bg {
          background: #0f0f1a;
        }
        .glass {
          background: rgba(20, 20, 30, 0.3);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
        }
        .glass-sm {
          background: rgba(20, 20, 30, 0.25);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .border-gray {
          border-color: rgba(255, 255, 255, 0.2) !important;
        }
        .text-gray {
          color: rgba(255, 255, 255, 0.6);
        }
        .btn-neon {
          background: linear-gradient(90deg, #0ff, #0af);
          color: #0f0;
          font-weight: bold;
          border: none;
          box-shadow: 0 0 8px #0ff, 0 0 16px #0af;
          transition: all 0.3s ease;
        }
        .btn-neon:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 12px #0ff, 0 0 24px #0af;
        }
        .neon-text {
          color: #0ff;
          text-shadow: 0 0 6px #0ff, 0 0 12px #0af;
        }
      `}</style>
    </div>
  );
}
