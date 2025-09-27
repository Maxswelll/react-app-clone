import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import Header from "./components/header";
import Filters from "./components/filter";
import Log from "./components/Button";
import Products from "./components/products";
import Footer from "./components/footer";
import Admin from "./components/Button";

function BabyOutfitPage() {
  return (
    <div>
      <Header />
      <Log />
      <Admin />
      {/* <Filters /> */}
      <Products />
      {/* <Footer /> */}
    </div>
  );
}

export default BabyOutfitPage;
