"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import initialProducts from "./components/StockProducts";
import StatCards from "./components/StockCard";
import Header from "./components/header";
import ProductToolbar from "./components/StockSelection";
import Sidebar from "./components/sidebar";
import Pagination from "./components/StockPagination";  
import ProductTable from "./components/StockProductTable"; 
import ProductFilters from "./components/StockProductFilters";
import BatchManagement from "./components/BatchManagement";
import IncomeManagment from "./components/IncomeManagment";
import Expenses from "./components/expensesData";
import ExpenseManagement from "./components/ExpensesManagment";
import StockProducts from "./components/StockProducts";

export default function AdminPage() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("stock");
  const [products, setProducts] = useState(initialProducts);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  // ✅ Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Add product
  const addProduct = async (newProduct) => {
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  // ✅ Edit product
  const editProduct = async (updated) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${updated.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        fetchProducts();
        setEditingProduct(null); // reset form after edit
      }
    } catch (err) {
      console.error("Error editing product:", err);
    }
  };

  // ✅ Delete product
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // Filtering
  const filteredProducts = products.filter((p) => {
    const typeMatch = filterType === "All" || p.type === filterType;
    const statusMatch = filterStatus === "All" || p.status === filterStatus;
    const searchMatch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return typeMatch && statusMatch && searchMatch;
  });

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleLogout = () => router.push("/login?logout=success");

  const renderContent = () => {
    switch (activeMenu) {
      case "stock":
        return (
          <>
            <StatCards products={currentProducts} />

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
              onDelete={handleDelete}
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

      case "batch":
        return <BatchManagement StockProducts={StockProducts} />;
      case "expense":
        return <ExpenseManagement Expenses={Expenses} />;
      case "income":
        return <IncomeManagment products={products} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Header onLogout={handleLogout} />
      <div
        className="container-fluid"
        style={{ maxWidth: "1600px", margin: "0 auto", padding: "0 2rem 2rem" }}
      >
        <div className="d-flex gap-4">
          <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
          <div className="flex-grow-1">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
