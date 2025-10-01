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
    id: null,
    name: "",
    type: "dress",
    buyPrice: "",
    sellPrice: "",
    stock: "",
    status: "In Stock",
    image: null,
  });

  // Fill form if editing
  useEffect(() => {
    if (editingProduct) {
      setFormData(editingProduct);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = {
      ...formData,
      id: formData.id || Date.now(),
      buyPrice: Number(formData.buyPrice),
      sellPrice: Number(formData.sellPrice),
      stock: Number(formData.stock),
      image: formData.image
        ? typeof formData.image === "string"
          ? formData.image
          : URL.createObjectURL(formData.image)
        : "https://via.placeholder.com/48",
    };

    if (formData.id) {
      onEditProduct(productData);
    } else {
      onAddProduct(productData);
    }

    // Reset
    setFormData({
      id: null,
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
  };

  return (
    <div className="d-flex gap-3 mb-3 flex-wrap">
      <button
        onClick={() => setShowForm(true)}
        className="btn btn-success"
        disabled={!!editingProduct}
        style={{
          background: "linear-gradient( 135deg, #48bb78, #38a169)",
          fontWeight: "600",
          boxShadow: "0 4px 12px #48bb784d",
          transition: "all .3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
          e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = "0 3px 6px rgba(0,0,0,0.1)";
        }}
      >
        + Add New Product
      </button>

      {/* Bootstrap Modal */}
      {showForm && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg modal-fullscreen-sm-down">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {formData.id ? "Edit Product" : "Add Product"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowForm(false);
                      setEditingProduct(null);
                    }}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Name</label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Type</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="dress">Dress</option>
                        <option value="shirt">Shirt</option>
                        <option value="baby suit">Baby Suit</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Buy Price</label>
                      <input
                        type="number"
                        name="buyPrice"
                        value={formData.buyPrice}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Sell Price</label>
                      <input
                        type="number"
                        name="sellPrice"
                        value={formData.sellPrice}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Stock</label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option>In Stock</option>
                        <option>Out of Stock</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Image</label>
                      <input
                        type="file"
                        name="image"
                        onChange={handleChange}
                        className="form-control"
                        accept="image/*"
                      />
                    </div>
                  </div>
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
                    {formData.id ? "Update" : "Save"}
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
