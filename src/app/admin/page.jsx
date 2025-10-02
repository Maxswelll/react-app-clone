"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Header from "./components/header";
import Sidebar from "./components/sidebar";
import BatchManagement from "./components/BatchManagement";
import IncomeManagement from "./components/IncomeManagment";
import ExpenseManagement from "./components/ExpensesManagment";
import Expenses from "./components/expensesData";
import StockManagment from "./components/stockManagment"; // ✅ use this component

import productsData from "./components/items"; // fallback

export default function AdminPage() {
  const router = useRouter();
  const [products] = useState(productsData);
  const [activeMenu, setActiveMenu] = useState("stock");

  const handleLogout = () => router.push("/login?logout=success");

  // ✅ Page switch
  const renderContent = () => {
    switch (activeMenu) {
      case "stock":
        return <StockManagment products={products} />; // 

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
