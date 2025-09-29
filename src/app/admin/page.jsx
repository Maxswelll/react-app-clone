"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Stock system components
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

// Expense system
import ExpenseManagement from "./components/ExpensesManagment";

export default function AdminPage() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("stock");
  const [products, setProducts] = useState(initialProducts);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // filters + search + Edit
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  // Add product
  const addProduct = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  // Edit product
  const editProduct = (updated) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  // Delete product
  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // filter + search logic
  const filteredProducts = products.filter((p) => {
    const typeMatch = filterType === "All" || p.type === filterType;
    const statusMatch = filterStatus === "All" || p.status === filterStatus;
    const searchMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return typeMatch && statusMatch && searchMatch;
  });

  // pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Logout
  const handleLogout = () => {
    router.push("/login?logout=success");
  };

  // Render main content based on activeMenu
  const renderContent = () => {
    switch (activeMenu) {
      case "stock":
        return (
          <>
            {/* Summary Cards - based on current filtered data */}
            <StatCards products={currentProducts} />

            {/* Toolbar (Add + Edit) */}
            <ProductToolbar
              onAddProduct={addProduct}
              onEditProduct={editProduct}
              editingProduct={editingProduct}
              setEditingProduct={setEditingProduct}
            />

            {/* Filters + Search */}
            <ProductFilters
              filterType={filterType}
              setFilterType={setFilterType}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setCurrentPage={setCurrentPage}
            />

            {/*  Product Table */}
            <ProductTable
              products={currentProducts}
              onDelete={handleDelete}
              setEditingProduct={setEditingProduct}
            />

            {/*  Pagination */}
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
        return <BatchManagement products={products} />;

      case "expense":
        return <ExpenseManagement products={products} />;

      case "income":
        return <IncomeManagment products={products}/>;

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Header */}
      <Header onLogout={handleLogout} />

      {/* Layout */}
      <div
        className="container-fluid"
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
          padding: "0 2rem 2rem",
        }}
      >
        <div className="d-flex gap-4">
          {/* Sidebar */}
          <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

          {/* Main Content */}
          <div className="flex-grow-1">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
