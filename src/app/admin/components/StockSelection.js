"use client";
import { useState, useEffect } from "react";
import AnimatedSelect from "./AnimatedSelect";

export default function ProductToolbar({
  onAddProduct,
  onEditProduct,
  editingProduct,
  setEditingProduct,
  filterStatus,
  setFilterStatus,
  filterType,
  setFilterType,
  setCurrentPage,
  refreshProducts, // passed from StockManagement
}) {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    type: "dress",
    buy_price: "",
    sell_price: "",
    discount: "",
    stock: "",
    sizes: "",
    status: "In Stock",
    image: null,
  });

  // Prefill when editing
  useEffect(() => {
    if (editingProduct) {
      const cleanSizes = (() => {
        if (!editingProduct.sizes) return "";
        if (Array.isArray(editingProduct.sizes)) {
          return editingProduct.sizes
            .map((s) => s.replace(/['"]+/g, ""))
            .join(",");
        }
        return editingProduct.sizes.replace(/[{}"']/g, "").trim();
      })();

      setFormData({
        name: editingProduct.name || "",
        type: editingProduct.type || "dress",
        buy_price: editingProduct.buy_price?.toString() || "",
        sell_price: editingProduct.sell_price?.toString() || "",
        discount: editingProduct.discount?.toString() || "",
        stock: editingProduct.stock?.toString() || "",
        sizes: cleanSizes,
        status: editingProduct.status || "In Stock",
        image: null,
      });

      setShowForm(true);
    }
  }, [editingProduct]);

  const calculateDiscount = (buy, sell) => {
    const buyPrice = parseFloat(buy);
    const sellPrice = parseFloat(sell);
    if (buyPrice > 0 && sellPrice > 0 && sellPrice < buyPrice) {
      return ((1 - sellPrice / buyPrice) * 100).toFixed(1);
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "sizes") {
      return setFormData((prev) => ({
        ...prev,
        sizes: value.replace(/[^0-9,]/g, ""),
      }));
    }

    if (name === "stock") {
      const stockQty = parseInt(value, 10);
      return setFormData((prev) => ({
        ...prev,
        stock: value,
        status: stockQty > 0 ? "In Stock" : "Out of Stock",
      }));
    }

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: files && files.length > 0 ? files[0] : value,
      };
      if (
        (name === "buy_price" && prev.sell_price) ||
        (name === "sell_price" && prev.buy_price)
      ) {
        newData.discount = calculateDiscount(
          name === "buy_price" ? value : prev.buy_price,
          name === "sell_price" ? value : prev.sell_price
        );
      }
      return newData;
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("buy_price", formData.buy_price);
      formDataToSend.append("sell_price", formData.sell_price);
      formDataToSend.append("discount", formData.discount);
      formDataToSend.append("stock", formData.stock);

      const cleanedSizes = formData.sizes
        .split(",")
        .map((s) => s.replace(/['"\s]/g, "").trim())
        .filter((s) => s !== "")
        .join(",");
      formDataToSend.append("sizes", `{${cleanedSizes}}`);
      formDataToSend.append("status", formData.status);

      if (formData.image) formDataToSend.append("image", formData.image);

      let res;
      if (editingProduct) {
        res = await fetch(`http://localhost:5000/items/${editingProduct.id}`, {
          method: "PATCH",
          body: formDataToSend,
        });
      } else {
        res = await fetch("http://localhost:5000/items", {
          method: "POST",
          body: formDataToSend,
        });
      }

      const savedProduct = await res.json();
      if (!res.ok) throw new Error(savedProduct.message);

      if (editingProduct) onEditProduct(savedProduct);
      else onAddProduct(savedProduct);

      // Refresh list with current filters and page
      refreshProducts();

      setFormData({
        name: "",
        type: "dress",
        buy_price: "",
        sell_price: "",
        discount: "",
        stock: "",
        sizes: "",
        status: "In Stock",
        image: null,
      });
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      alert("❌ Failed to save product.");
      console.error(err);
    }
  };

  // ✅ When filters/search change, reset page to 1 and refresh backend
  const handleFilterChange = (type, value) => {
    setCurrentPage(1);
    if (type === "status") setFilterStatus(value);
    if (type === "type") setFilterType(value);
    refreshProducts(
      1,
      value === "status" ? value : undefined,
      value === "type" ? value : undefined,
      searchTerm
    );
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    refreshProducts(1, filterStatus, filterType, value);
  };

  return (
    <div className="container mt-4">
      {/* Filters + Search */}
      <div
        className="d-flex align-items-center gap-3 p-3 mb-4"
        style={{
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <AnimatedSelect
          value={filterStatus}
          onChange={(v) => handleFilterChange("status", v)}
          options={["All", "In Stock", "Out of Stock"]}
        />

        <AnimatedSelect
          value={filterType}
          onChange={(v) => handleFilterChange("type", v)}
          options={["All", "dress", "shirt", "pants", "shoes"]}
        />

        <input
          type="text"
          placeholder="Search by name..."
          className="form-control w-auto"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <button
          onClick={() => setShowForm(true)}
          className="btn fw-semibold"
          style={{
            background: "linear-gradient(135deg, #48bb78, #38a169)",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          + Add New Product
        </button>
      </div>

      {/* Add/Edit Modal */}
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
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Product Name"
                    className="form-control mb-2"
                    required
                  />
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

                  {formData.discount && (
                    <div className="alert alert-success py-2 text-center fw-bold">
                      {formData.discount}% OFF
                    </div>
                  )}

                  <input
                    type="text"
                    name="sizes"
                    value={formData.sizes}
                    onChange={handleChange}
                    placeholder="Sizes (e.g. 66,73,80)"
                    className="form-control mb-2"
                    required
                  />
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Stock Quantity"
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

                  {formData.image && typeof formData.image !== "string" && (
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="preview"
                      style={{ width: "100px", marginTop: "10px" }}
                    />
                  )}
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
