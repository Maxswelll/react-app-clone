"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockWarnings, setStockWarnings] = useState({});


  // 1️⃣ Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  // 2️⃣ Fetch product details from backend
  useEffect(() => {
    if (cartItems.length === 0) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/items")
      .then((res) => res.json())
      .then((data) => {
        // Match products with items in cart
        const fullProducts = cartItems.map((cartItem) => {
          const product = data.find((p) => p.id === cartItem.id);
          return product
            ? { ...product, quantity: cartItem.quantity }
            : null;
        }).filter(Boolean);
        setProducts(fullProducts);
        setLoading(false);
      });
  }, [cartItems]);

  // 3️⃣ Handlers
 const handleQuantityChange = (id, delta) => {
  const updatedProducts = products.map((item) => {
    if (item.id === id) {
      const newQuantity = item.quantity + delta;
      if (newQuantity > item.stock) {
        // set warning for this item
        setStockWarnings((prev) => ({
          ...prev,
          [id]: `Not enough items in stock.`,
        }));
        return item; // quantity stays the same
      } else {
        // clear warning if valid
        setStockWarnings((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
        return { ...item, quantity: Math.max(1, newQuantity) };
      }
    }
    return item;
  });

  setProducts(updatedProducts);

  // Update localStorage
  const updatedCart = updatedProducts.map((item) => ({
    id: item.id,
    quantity: item.quantity,
  }));
  localStorage.setItem("cart", JSON.stringify(updatedCart));
};


  // 4️⃣ Calculate totals
  const subtotal = products.reduce(
    (sum, item) => sum + item.sell_price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 2 : 0;
  const total = subtotal + shipping;

  if (loading)
    return <div className="text-center py-5">Loading cart products...</div>;

  if (products.length === 0)
    return (
      <div className="text-center py-5">
        <h4 className="mb-3 text-muted">Your cart is empty 😢</h4>
        <button className="btn btn-primary" onClick={() => router.push("/Main-page")}>
          🛒 Continue Shopping
        </button>
      </div>
    );

  return (
    <div className="container py-5">
      <h2 className="fw-bold text-center mb-5">🛒 Your Shopping Cart</h2>
      <div className="row g-4">
        {/* Cart Items */}
        <div className="col-lg-8">
          {products.map((item) => (
            <div key={item.id} className="card shadow-sm mb-3 rounded-4">
              <div className="card-body d-flex align-items-center flex-column flex-md-row">
                <img
  src={
    item.image
      ? item.image.startsWith("http")
        ? item.image
        : `http://localhost:5000${item.image}`
      : "/default-image.png"
  }
  alt={item.name}
  className="rounded"
  style={{ width: "120px", height: "120px", objectFit: "cover", marginRight: "20px" }}
/>

                <div className="flex-fill text-start">
                  <h5 className="fw-bold">{item.name}</h5>
                  <p className="text-danger fw-bold mb-1">${item.sell_price}</p>
                  <p className="text-muted mb-0">
                    Stock: {item.stock} |Sizes: {item.sizes?.length > 0 ? item.sizes.join(" • ") : "—"}

                  </p>
                </div>
             <div className="d-flex flex-column mt-3">
  {/* Controls: quantity + remove button */}
  <div className="d-flex align-items-center gap-3">
    {/* Quantity controls */}
    <div className="d-flex align-items-center border rounded-3 p-1">
      <button
        className="btn btn-outline-secondary btn-sm px-2"
        onClick={() => handleQuantityChange(item.id, -1)}
      >
        −
      </button>
      <span className="px-3 fw-bold">{item.quantity}</span>
      <button
        className="btn btn-outline-secondary btn-sm px-2"
        onClick={() => handleQuantityChange(item.id, 1)}
      >
        +
      </button>
    </div>

    {/* Remove button */}
    <button
      className="btn btn-outline-danger btn-sm"
      onClick={() => handleRemove(item.id)}
    >
      Remove
    </button>
  </div>

  {/* Stock warning directly under the controls */}
  {stockWarnings[item.id] && (
    <p className="text-danger mt-2 mb-0" style={{ fontSize: "0.85rem" }}>
      {stockWarnings[item.id]}
    </p>
  )}
</div>


              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm p-4 rounded-4">
            <h5 className="fw-bold mb-4 text-center">Order Summary</h5>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal</span>
              <span className="fw-bold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Shipping</span>
              <span className="fw-bold">${shipping.toFixed(2)}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-3">
              <span className="fw-bold fs-5">Total</span>
              <span className="fw-bold fs-5 text-success">${total.toFixed(2)}</span>
            </div>
            <button className="btn btn-success w-100 py-2 fw-bold mb-2">Proceed to Checkout →</button>
            <button className="btn btn-outline-secondary w-100 py-2" onClick={() => router.push("/Main-page")}>← Continue Shopping</button>
          </div>
        </div>
      </div>
    </div>
  );
}
