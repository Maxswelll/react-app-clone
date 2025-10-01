"use client";
import { useState, useEffect } from "react";

export default function ProductToolbar({
  onAddProduct,
  onEditProduct,
  editingProduct,
  setEditingProduct,
  refreshProducts, // ✅ receive fetchProducts from parent
}) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "dress",
    buyPrice: "",
    sellPrice: "",
    stock: "",
    status: "In Stock",
    image: null, // file (not bound to value)
  });

  // 🟢 Prefill form when editing
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || "",
        type: editingProduct.type || "dress",
        buyPrice: editingProduct.buyPrice?.toString() || "",
        sellPrice: editingProduct.sellPrice?.toString() || "",
        stock: editingProduct.stock?.toString() || "",
        status: editingProduct.status || "In Stock",
        image: null, // reset file input
      });
      setShowForm(true);
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value, // file or normal text
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      ...formData,
      buyPrice: Number(formData.buyPrice),
      sellPrice: Number(formData.sellPrice),
      stock: Number(formData.stock),
      image:
        formData.image && typeof formData.image !== "string"
          ? URL.createObjectURL(formData.image)
          : formData.image || "https://via.placeholder.com/48",
    };

    try {
      if (editingProduct) {
        await onEditProduct(productData);
      } else {
        await onAddProduct(productData);
      }

      if (refreshProducts) refreshProducts();

      // Reset form
      setFormData({
        name: "",
        type: "dress",
        buyPrice: "",
        sellPrice: "",
        stock: "",
        status: "In Stock",
        image: null,
      });
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      console.error("Error saving product:", err);
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
                  {/* Product Name */}
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Product Name"
                    className="form-control mb-2"
                    required
                  />

                  {/* Buy Price */}
                  <input
                    type="number"
                    name="buyPrice"
                    value={formData.buyPrice}
                    onChange={handleChange}
                    placeholder="Buy Price"
                    className="form-control mb-2"
                    required
                  />

                  {/* Sell Price */}
                  <input
                    type="number"
                    name="sellPrice"
                    value={formData.sellPrice}
                    onChange={handleChange}
                    placeholder="Sell Price"
                    className="form-control mb-2"
                    required
                  />

                  {/* Stock */}
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Stock"
                    className="form-control mb-2"
                    required
                  />

                  {/* Status */}
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-select mb-2"
                  >
                    <option>In Stock</option>
                    <option>Out of Stock</option>
                  </select>

                  {/* Image File */}
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
