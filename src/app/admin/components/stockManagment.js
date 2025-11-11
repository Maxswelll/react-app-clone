"use client";
import React, { useState, useEffect } from "react";
import StatCards from "./StockCard";
import ProductToolbar from "./StockSelection";
import ProductTable from "./StockProductTable";
import Pagination from "./StockPagination";

export default function StockManagement() {
  const [products, setProducts] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch products from backend (normal pagination endpoint)
  const fetchProducts = async (
    page = 1,
    limit = itemsPerPage,
    type = filterType,
    status = filterStatus,
    search = searchTerm
  ) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", limit.toString());
      if (type && type !== "All") queryParams.append("type", type);
      if (status && status !== "All") queryParams.append("status", status);
      if (search && search.trim() !== "")
        queryParams.append("search", search.trim());

      // ✅ Use /items/paginated for StockManagement
      const res = await fetch(
        `http://localhost:5000/items/paginated?${queryParams}`
      );
      const result = await res.json();

      if (result.data && result.pagination) {
        setProducts(result.data); // only current page
        setTotalPages(result.pagination.totalPages || 1);
        setCurrentPage(result.pagination.page || 1);
      } else {
        setProducts([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Refetch whenever page, filters, search, or itemsPerPage change
  useEffect(() => {
    fetchProducts(
      currentPage,
      itemsPerPage,
      filterType,
      filterStatus,
      searchTerm
    );
  }, [currentPage, itemsPerPage, filterType, filterStatus, searchTerm]);

  // ✅ Add product
  const addProduct = async () => fetchProducts(1);

  // ✅ Edit product
  const editProduct = async (updated) => {
    try {
      const res = await fetch(`http://localhost:5000/items/${updated.id}`, {
        method: "PATCH",
        body: JSON.stringify(updated),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) fetchProducts(currentPage);
    } catch (err) {
      console.error("Error editing product:", err);
    }
  };

  // ✅ Delete product
  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/items/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (products.length === 1 && currentPage > 1)
          setCurrentPage(currentPage - 1);
        else fetchProducts(currentPage);
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <>
      <StatCards products={products} />

      <ProductToolbar
        onAddProduct={addProduct}
        onEditProduct={editProduct}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
        refreshProducts={() => fetchProducts(1)}
        filterType={filterType}
        setFilterType={setFilterType}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        setCurrentPage={setCurrentPage}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ProductTable
          products={products}
          onDelete={deleteProduct}
          setEditingProduct={setEditingProduct}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={(limit) => {
          setItemsPerPage(limit);
          setCurrentPage(1); // reset to first page
        }}
      />
    </>
  );
}
