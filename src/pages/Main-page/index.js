import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import Header from "./components/header";
import Filters from "./components/filter";
import Log from "./components/Button";
import Products from "./components/products";

function BabyOutfitPage() {
  return (
    <div>
      {/* Header / Navbar */}
      <Header />
      <Log />

      {/* Filters Section */}
      <Filters />
      <Products />
    </div>
  );
}

export default BabyOutfitPage;
