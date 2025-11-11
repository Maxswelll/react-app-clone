"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import { LiaAmazonPay } from "react-icons/lia";
import { motion } from "framer-motion";

export default function Checkout() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  // Fetch products
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

      // Map cart items to full products
      const fullProducts = cart
        .map((cartItem) => {
          const product = itemsArray.find(
            (p) => p.id === Number(cartItem.id) || p._id === cartItem.id
          );
          return product ? { ...product, quantity: cartItem.quantity } : null;
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


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleQuantityChange = (id, delta) => {
  const newCart = cartItems.map((item) => {
    if (item.id !== id) return item;
    const product = products.find(
      (p) => p.id === item.id || p._id === item.id
    );
    let newQty = item.quantity + delta;
    if (newQty < 1) newQty = 1;
    if (product && newQty > product.stock) newQty = product.stock;
    return { ...item, quantity: newQty };
  });
  setCartItems(newCart);
  localStorage.setItem("cart", JSON.stringify(newCart));
};


  const handleRemove = (id) => {
    const newCart = cartItems.filter((item) => item.id !== id);
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);
    return sum + ((product?.sell_price || 0) * item.quantity);
  }, 0);

  const handleCheckout = async () => {
    const { firstName, lastName, phone, address } = formData;
    if (!firstName || !lastName || !phone || !address) {
      alert("Please fill all fields");
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        totalPrice,
        items: cartItems,
      };
      const res = await fetch("http://localhost:5000/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) {
        alert(result.message || "Checkout failed");
        setSubmitting(false);
        return;
      }
      router.push("/payment");
    } catch (err) {
      console.error(err);
      alert("Failed to submit checkout");
    } finally {
      setSubmitting(false);
    }
  };

  const StepButtons = () => (
    <div className="d-flex justify-content-between mt-4">
      {step > 1 && (
      <button
  className="btn rounded-pill px-4 fw-bold"
  style={{
    position: "relative",
    overflow: "hidden",
    color: "#fff",
    fontWeight: "700",
    border: "1px solid #00e0ff",
    background: "transparent",
    boxShadow: "0 0 5px rgba(0,255,255,0.2)",
    transition: "all 0.3s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "rgba(0,255,200,0.1)";
    e.currentTarget.style.boxShadow = "0 0 15px #00e0ff";
    e.currentTarget.style.transform = "scale(1.05)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "transparent";
    e.currentTarget.style.boxShadow = "0 0 5px rgba(0,255,255,0.2)";
    e.currentTarget.style.transform = "scale(1)";
  }}
  onClick={() => setStep(step - 1)}
>
  ← Back
</button>
      )}
      {step < 3 && (
       <button
  className="btn rounded-pill px-4 fw-bold"
  style={{
    position: "relative",
    overflow: "hidden",
    color: "#000",
    fontWeight: "700",
    border: "none",
    background: "linear-gradient(270deg, #00ffb3, #00e0ff, #00ffb3)",
    backgroundSize: "600% 600%",
    boxShadow: "0 0 10px #00e0ff",
    transition: "all 0.3s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.animation = "gradientAnimation 3s ease infinite";
    e.currentTarget.style.transform = "scale(1.05)";
    e.currentTarget.style.boxShadow = "0 0 20px #00e0ff, 0 0 40px #00ffb3";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.animation = "none";
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "0 0 10px #00e0ff";
  }}
  onClick={() => setStep(step + 1)}
>
  Next →
</button>

      )}
    </div>
  );

  return (
    <div
      className="container py-5"
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top left, #001220, #000000 80%)",
        color: "#e0fdfb",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto rounded-4 p-5 shadow-lg"
        style={{
          maxWidth: "900px",
          background:
            "linear-gradient(145deg, rgba(10,20,30,0.95), rgba(0,0,0,0.95))",
          border: "1px solid rgba(0,255,200,0.2)",
          boxShadow: "0 0 30px rgba(0,255,200,0.1)",
        }}
      >
        <h2
          className="fw-bold text-center mb-4"
          style={{
            color: "#00ffb3",
            textShadow: "0 0 10px #00e0ff",
            letterSpacing: "1px",
          }}
        >
          Checkout Wizard 💫
        </h2>

        {/* Progress indicator */}
        <div className="d-flex justify-content-between mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="text-center flex-fill">
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  margin: "auto",
                  borderRadius: "50%",
                  background:
                    step >= s
                      ? "linear-gradient(90deg, #00ffb3, #00e0ff)"
                      : "rgba(255,255,255,0.1)",
                  color: step >= s ? "#000" : "#ccc",
                  lineHeight: "40px",
                  fontWeight: "bold",
                  boxShadow:
                    step === s
                      ? "0 0 12px #00e0ff"
                      : "0 0 5px rgba(255,255,255,0.2)",
                }}
              >
                {s}
              </div>
              <small
                className="d-block mt-2"
                style={{ color: step >= s ? "#00ffb3" : "#999" }}
              >
                {s === 1 ? "Info" : s === 2 ? "Review" : "Confirm"}
              </small>
            </div>
          ))}
        </div>

        {/* Step 1: Customer Info */}
        {step === 1 && (
          <>
            <h5 className="text-info mb-3">Step 1: Customer Information</h5>
            <div className="row g-3">
              {["firstName", "lastName", "phone", "address"].map((field, i) => (
                <div className="col-md-6" key={i}>
                  <input
                    type="text"
                    className="form-control bg-dark text-light"
                    placeholder={field
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (s) => s.toUpperCase())}
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    style={{
                      border: "1px solid rgba(0,255,200,0.3)",
                      boxShadow: "0 0 8px rgba(0,255,200,0.1)",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              ))}
            </div>
            <StepButtons />
          </>
        )}

  {/* Step 2: Review Cart */}
{step === 2 && (
  <>
    <h5 className="text-info mb-4">Step 2: Review Your Cart</h5>
    {loading ? (
      <p>Loading products...</p>
    ) : cartItems.length === 0 ? (
      <div className="text-center py-4">
        <h5>Your cart is empty 😢</h5>
      <button
  className="btn rounded-pill px-4 fw-bold"
  style={{
    background: "linear-gradient(270deg, #00ffb3, #00e0ff, #00ffb3)",
    backgroundSize: "600% 600%",
    color: "#000",
    fontWeight: "700",
    border: "none",
    padding: "10px 25px",
    boxShadow: "0 0 10px #00e0ff",
    transition: "all 0.3s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.animation = "gradientAnimation 3s ease infinite";
    e.currentTarget.style.transform = "scale(1.05)";
    e.currentTarget.style.boxShadow = "0 0 25px #00e0ff, 0 0 50px #00ffb3";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.animation = "none";
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "0 0 10px #00e0ff";
  }}
  onClick={() => router.push("/Main-page")}
>
  Back to Shop
</button>

{/* Add this once in your component or global CSS */}
<style jsx>{`
  @keyframes gradientAnimation {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`}</style>

      </div>
    ) : (
      <div className="d-flex flex-column gap-3">
        {cartItems.map((item) => {
          const product = products.find((p) => p.id === item.id);
          if (!product) return null;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.03, boxShadow: "0 0 20px #00e0ff" }}
              transition={{ duration: 0.3 }}
              className="d-flex align-items-center justify-content-between p-3 rounded-4"
              style={{
                background: "linear-gradient(145deg, #0a1a2e, #001220)",
                border: "1px solid rgba(0,255,200,0.2)",
              }}
            >
              <img
                src={
                  product.image?.startsWith("http")
                    ? product.image
                    : `http://localhost:5000${product.image}`
                }
                alt={product.name}
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  marginRight: "1rem",
                }}
              />
              <div className="flex-grow-1 text-light">
                <h6 className="text-info mb-1">{product.name}</h6>
                <p className="mb-1 text-light">
                  Price: <strong>${product.sell_price}</strong>
                </p>
                <p className="mb-0 fw-bold text-success">
                  Total: ${(product.sell_price * item.quantity).toFixed(2)}
                </p>
              </div>
              <div className="d-flex flex-column align-items-end gap-2">
                <div className="d-flex gap-2 mb-2">
                  <button
                    className="btn btn-sm btn-outline-light"
                    onClick={() => handleQuantityChange(item.id, -1)}
                  >
                    −
                  </button>
                  <span className="px-2 text-light">{item.quantity}</span>
                  <button
                    className="btn btn-sm btn-outline-light"
                    onClick={() => handleQuantityChange(item.id, 1)}
                  >
                    +
                  </button>
                </div>
         <button
  className="btn btn-sm rounded-pill px-3 fw-bold"
  style={{
    color: "#fff",
    border: "1px solid #ff4d6d",
    background: "linear-gradient(270deg, #ff4d6d, #ff7f6d, #ff4d6d)",
    backgroundSize: "600% 600%",
    boxShadow: "0 0 5px rgba(255,77,109,0.2)",
    transition: "all 0.3s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.animation = "gradientAnimation 3s ease infinite";
    e.currentTarget.style.transform = "scale(1.1)";
    e.currentTarget.style.boxShadow = "0 0 15px #ff4d6d";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.animation = "none";
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "0 0 5px rgba(255,77,109,0.2)";
  }}
  onClick={() => handleRemove(item.id)}
>
  Remove
</button>

<style jsx>{`
  @keyframes gradientAnimation {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`}</style>

              </div>
            </motion.div>
          );
        })}
        <div className="text-end fw-bold fs-5 text-success mt-3">
          Total: ${totalPrice.toFixed(2)}
        </div>
      </div>
    )}
    <StepButtons />
  </>
)}

{/* Step 3: Confirm & Pay */}
{step === 3 && (
  <>
    <h5 className="text-info mb-4">Step 3: Confirm & Pay</h5>

    {/* Customer Info Card */}
   <div
  className="mb-4 p-4 rounded-4"
  style={{
    background: "linear-gradient(145deg, #001220, #0a1a2e)",
    border: "1px solid rgba(0,255,200,0.2)",
    boxShadow: "0 0 20px rgba(0,255,200,0.2)",
  }}
>
  <ul className="list-group list-group-flush mb-0 text-info">
    <li style={{
      color :"whitesmoke",
    }} className="list-group-item bg-transparent border-0">
      Name:
      <span className="animated-text ">
        {formData.firstName} {formData.lastName}
      </span>
    </li>
    <li style={{
      color :"whitesmoke",
    }} 
     className="list-group-item bg-transparent border-0">
      Phone: <span className="animated-text">{formData.phone}</span>
    </li>
    <li style={{
      color :"whitesmoke",
    }} 
    className="list-group-item bg-transparent border-0">
      Address: <span className="animated-text">{formData.address}</span>
    </li>
    <li style={{
      color :"whitesmoke",
    }} 
    className="list-group-item bg-transparent border-0">
      Total: <span className="animated-text fw-bold fs-5">${totalPrice.toFixed(2)}</span>
    </li>
  </ul>

  
 
</div>


    {/* Products Grid */}
    <div className="row g-3">
      {cartItems.map((item) => {
        const product = products.find((p) => p.id === item.id);
        if (!product) return null;
        return (
          <motion.div
            key={item.id}
            className="col-md-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px #00e0ff"  ,  borderRadius:"18px"}}
            transition={{ duration: 0.3 }}
          >
            <div
              className="card bg-dark text-light h-100 rounded-4"
              style={{
                border: "1px solid rgba(0,255,200,0.2)",
              
              }}
            >
              <img
                src={
                  product.image?.startsWith("http")
                    ? product.image
                    : `http://localhost:5000${product.image}`
                }
                className="card-img-top"
                alt={product.name}
                style={{
                  height: "200px",
                  objectFit: "cover",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                }}
              />
              <div className="card-body text-center">
                <h6 className="card-title text-info">{product.name}</h6>
                <p className="mb-1 text-light">
                  Qty: <strong>{item.quantity}</strong>
                </p>
                <p className="text-success fw-bold mb-0">
                  ${(product.sell_price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>

    {/* Payment Button */}
<button
  className="btn w-100 py-3 mt-4 rounded-pill fw-bold d-flex justify-content-center align-items-center gap-2"
  style={{
    position: "relative",
    overflow: "hidden",
    color: "#000",
    fontWeight: "700",
    fontSize: "1.1rem",
    border: "none",
    background: "linear-gradient(270deg, #00ffb3, #00e0ff, #00ffb3)",
    backgroundSize: "600% 600%",
    boxShadow: "0 0 20px #00e0ff",
    transition: "all 0.3s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.animation = "gradientAnimation 3s ease infinite";
    e.currentTarget.style.transform = "scale(1.05)";
    e.currentTarget.style.boxShadow = "0 0 30px #00e0ff, 0 0 60px #00ffb3";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.animation = "none";
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "0 0 20px #00e0ff";
  }}
  onClick={handleCheckout}
  disabled={submitting}
>
  {submitting ? "Processing..." : "Complete Payment"}
  <LiaAmazonPay size={24} />
</button>

{/* Add this CSS in your global or component styles */}
 <style jsx>{`
    @keyframes gradientTextAnimation {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .animated-text {
      background: linear-gradient(270deg, #00ffb3, #00e0ff, #00ffb3);
      background-size: 600% 600%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientTextAnimation 3s ease infinite;
      font-weight: 700;
    }
  `}</style>
    <StepButtons />
  </>
)}
      </motion.div>
    </div>
  );
}
