"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";

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

  // Load cart
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  // Fetch product details
  useEffect(() => {
    if (cartItems.length === 0) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/stock/items")
      .then((res) => res.json())
      .then((data) => {
        const fullProducts = cartItems
          .map((cartItem) => {
            const product = data.find((p) => p.id === cartItem.id);
            return product ? { ...product, quantity: cartItem.quantity } : null;
          })
          .filter(Boolean);

        setProducts(fullProducts);
        setLoading(false);
      });
  }, [cartItems]);

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
    // Update stock in backend
    await fetch("http://localhost:5000/api/stock/items/update-stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: products.map((p) => ({
          id: p.id,
          quantity: p.quantity,
        })),
      }),
    });

    // Continue success flow
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
      <div className="vh-100 d-flex justify-content-center align-items-center text-white bg-dark">
        <h3>Loading your order...</h3>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        className="vh-100 d-flex flex-column justify-content-center align-items-center text-white"
        style={{
          background: "linear-gradient(135deg, #667eea, #764ba2)",
        }}
      >
        <h2>Your cart is empty 😢</h2>
        <p>Please add items to your cart before checkout.</p>
        <button
          className="btn btn-light mt-3 px-4 py-2"
          onClick={() => router.push("/Main-page")}
        >
          Go to Main Page
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        padding: "40px 20px",
      }}
    >
      <div
        className="container p-5 rounded-4 shadow-lg"
        style={{
          maxWidth: "950px",
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "white",
          animation: "fadeIn 0.8s ease-in-out",
        }}
      >
        <h1 className="text-center mb-4 fw-bold">🏦 Pay with Bank</h1>

        <div className="row g-4">
          {/* Order Summary */}
          <div className="col-md-6">
            <div className="p-4 rounded-3 bg-light bg-opacity-10 shadow-sm">
              <h4 className="mb-3 text-white">🛍️ Order Summary</h4>
              {products.map((item) => (
                <div
                  key={item.id}
                  className="d-flex justify-content-between mb-2 border-bottom border-secondary pb-2"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>${(item.sell_price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr className="border-light" />
              <div className="d-flex justify-content-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <hr className="border-light" />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Bank Payment Section */}
          <div className="col-md-6">
            {!showQR && !paymentSuccess && (
              <div className="p-4 rounded-3 bg-light bg-opacity-10 shadow-sm w-100">
                <h4 className="text-white mb-3">💳 Bank Payment Details</h4>

                <div className="mb-3">
                  <label className="form-label">Select Bank</label>
                  <select
                    className="form-select"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  >
                    <option value="">-- Choose Bank --</option>
                    <option value="ABA Bank">ABA Bank</option>
                    <option value="Acleda Bank">Acleda Bank</option>
                    <option value="Wing Bank">Wing Bank</option>
                    <option value="Canadia Bank">Canadia Bank</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Account Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your bank account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <button
                  className="btn btn-success w-100 py-3 fw-semibold shadow"
                  style={{
                    borderRadius: "50px",
                    transition: "all 0.3s ease",
                  }}
                  onClick={handlePayment}
                >
                  Show QR Code 💳
                </button>
              </div>
            )}

            {/* QR Display */}
            {showQR && !paymentSuccess && (
              <div className="text-center p-4 rounded-3 bg-light bg-opacity-10 shadow-sm">
                <h4 className="mb-3 text-white">📱 Scan to Pay</h4>
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
                  Please scan this QR with your <b>{bankName}</b> app to pay{" "}
                  <b>${total.toFixed(2)}</b>
                </p>
                <button
                  className="btn btn-light me-2 px-4"
                  onClick={() => setShowQR(false)}
                >
                  ← Edit Info
                </button>
                <button
                  className="btn btn-success px-4"
                  onClick={handleConfirmPaid}
                >
                  ✅ I Have Paid
                </button>
              </div>
            )}

            {/* Payment Success */}
            {paymentSuccess && (
              <div
                className="alert alert-success text-center fs-5 w-100 mt-5"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                ✅ Payment Successful via {bankName}!
                <br />
                Redirecting to Main Page...
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
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
