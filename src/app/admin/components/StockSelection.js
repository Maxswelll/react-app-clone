"use client";
import { useState, useEffect } from "react";

export default function ProductToolbar({
  onAddProduct,
  onEditProduct,
  editingProduct,
  setEditingProduct,
}) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "dress",
    buy_price: "",
    sell_price: "",
    stock: "",
    status: "In Stock",
    image: null,
  });

  // Pre-fill form if editing
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        type: editingProduct.type || "dress",
        buy_price: editingProduct.buy_price?.toString() || "",
        sell_price: editingProduct.sell_price?.toString() || "",
        stock: editingProduct.stock?.toString() || "",
        status: editingProduct.status || "In Stock",
        image: null,
      });
      setShowForm(true);
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      name: formData.type, // you may add separate "name" later
      type: formData.type,
      buy_price: Number(formData.buy_price),
      sell_price: Number(formData.sell_price),
      stock: Number(formData.stock),
      status: formData.status,
      image:
        formData.image && typeof formData.image !== "string"
          ? URL.createObjectURL(formData.image) // preview only
          : editingProduct?.image || "https://via.placeholder.com/48",
    };

    try {
      let res;
      if (editingProduct) {
        res = await fetch(
          `http://localhost:5000/api/items/${editingProduct.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
          }
        );
      } else {
        res = await fetch("http://localhost:5000/api/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
      }

      const savedProduct = await res.json();

      if (editingProduct) {
        onEditProduct(savedProduct);
      } else {
        onAddProduct(savedProduct);
      }

      // reset form
      setFormData({
        buy_price: "",
        sell_price: "",
        stock: "",
        status: "In Stock",
        type: "dress",
        image: null,
      });
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save product. Check console.");
    }
  };

  return (
    <div className="container mt-4">
      <button
        onClick={() => setShowForm(true)}
        className="btn btn-success mb-3"
      >
        + Add New Product
      </button>

      {showForm && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingProduct ? "Edit Product" : "Add Product"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowForm(false);
                      setEditingProduct(null);
                    }}
                  />
                </div>

                <div className="modal-body">
                  <input
                    type="number"
                    name="buy_price"
                    value={formData.buy_price}
                    onChange={handleChange}
                    placeholder="Buy Price"
                    className="form-control mb-2"
                    required
                  />

                  <input
                    type="number"
                    name="sell_price"
                    value={formData.sell_price}
                    onChange={handleChange}
                    placeholder="Sell Price"
                    className="form-control mb-2"
                    required
                  />

                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Stock"
                    className="form-control mb-2"
                    required
                  />

                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="form-select mb-2"
                  >
                    <option value="dress">Dress</option>
                    <option value="shirt">Shirt</option>
                    <option value="pants">Pants</option>
                    <option value="shoes">Shoes</option>
                  </select>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-select mb-2"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>

                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="form-control mb-2"
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowForm(false);
                      setEditingProduct(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    {editingProduct ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
