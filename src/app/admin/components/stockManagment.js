"use client";
import React, { useState, useEffect } from "react";
import StatCards from "./StockCard";
import ProductToolbar from "./StockSelection";
import ProductFilters from "./StockProductFilters";
import ProductTable from "./StockProductTable";
import Pagination from "./StockPagination";
import productsData from "./items";

export default function StockManagment() {
  const [products, setProducts] = useState(productsData);
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ✅ Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/items");
      if (!res.ok) throw new Error("Backend not available");
      const data = await res.json();
      setProducts(data.length > 0 ? data : productsData);
    } catch (err) {
      console.warn("⚠️ Backend not available, using items.js fallback");
      setProducts(productsData);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ CRUD
  const addProduct = async (newItem) => {
    try {
      const res = await fetch("http://localhost:5000/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const editProduct = async (updated) => {
    try {
      const res = await fetch(`http://localhost:5000/api/items/${updated.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        fetchProducts();
        setEditingProduct(null);
      }
    } catch (err) {
      console.error("Error editing product:", err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/items/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // ✅ Filtering
  const filteredProducts = products.filter((p) => {
    const typeMatch =
      filterType === "All" ||
      p.type?.toLowerCase() === filterType.toLowerCase();

    const statusMatch =
      filterStatus === "All" ||
      (filterStatus === "In Stock" && Number(p.stock) > 0) ||
      (filterStatus === "Out of Stock" && Number(p.stock) === 0);

    const searchMatch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type?.toLowerCase().includes(searchTerm.toLowerCase());

    return typeMatch && statusMatch && searchMatch;
  });

  // ✅ Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <>
      <StatCards products={products} />
      <ProductToolbar
        onAddProduct={addProduct}
        onEditProduct={editProduct}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
        refreshProducts={fetchProducts}
      />
      <ProductFilters
        filterType={filterType}
        setFilterType={setFilterType}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setCurrentPage={setCurrentPage}
      />
      <ProductTable
        products={currentProducts}
        onDelete={deleteProduct} // ✅ now clean
        setEditingProduct={setEditingProduct}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
      />
    </>
  );
}
