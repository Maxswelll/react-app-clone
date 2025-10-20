import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import Header from "./components/header";
import Log from "./components/Button"; // Login/Logout button
import Products from "./components/products";
import Admin from "./components/Button"; // Admin button (role-based)

function BabyOutfitPage() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check role from localStorage
    const role = localStorage.getItem("role");
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    if (
      role === "admin" &&
      tokenExpiry &&
      Date.now() <= parseInt(tokenExpiry)
    ) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []);

  return (
    <div>
      <Header />
      <Log />

      {/* Only show Admin button for admins */}
      {isAdmin && <Admin />}

      <Products />
    </div>
  );
}

export default BabyOutfitPage;
