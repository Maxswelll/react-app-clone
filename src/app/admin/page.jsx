"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import Header from "./components/header";
import Sidebar from "./components/sidebar";
import BatchManagement from "./components/BatchManagement";
import IncomeManagement from "./components/IncomeManagment";
import ExpenseManagement from "./components/ExpensesManagment";
import Expenses from "./components/expensesData";
import StockManagment from "./components/stockManagment"; 

import productsData from "./components/items";

export default function AdminPage() {
  const router = useRouter();
  const [products] = useState(productsData);
  const [activeMenu, setActiveMenu] = useState("stock");

  // ✅ State to track access
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    if (username === "Heang" && tokenExpiry && Date.now() <= parseInt(tokenExpiry)) {
      setHasAccess(true); // allow access
    } else {
      alert("Access denied: Admins only");
      router.push("/login"); // redirect immediately
    }
  }, [router]);

  // Only render admin content if hasAccess
  if (!hasAccess) return null; // hide everything

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login?logout=success");
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "stock":
        return <StockManagment products={products} />;
      case "batch":
        return <BatchManagement products={products} />;
      case "expense":
        return <ExpenseManagement Expenses={Expenses} />;
      case "income":
        return <IncomeManagement products={products} />;
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
