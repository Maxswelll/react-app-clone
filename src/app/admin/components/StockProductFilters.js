"use client";
import React from "react";

export default function ProductFilters({
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  searchTerm,
  setSearchTerm,
  setCurrentPage,
}) {
  return (
    <div className="d-flex flex-wrap gap-3 my-3">
      {/* Product Type Filter */}
      <select
        className="form-select w-auto"
        value={filterType}
        onChange={(e) => {
          setFilterType(e.target.value);
          setCurrentPage(1);
        }}
      >
        <option value="All">All Products</option>
        <option value="dress">Dress</option>
        <option value="shirt">Shirt</option>
        <option value="baby suit">Baby Suit</option>
      </select>

      {/* Status Filter */}
      <select
        className="form-select w-auto"
        value={filterStatus}
        onChange={(e) => {
          setFilterStatus(e.target.value);
          setCurrentPage(1);
        }}
      >
        <option value="All">All Status</option>
        <option value="In Stock">In Stock</option>
        <option value="Out of Stock">Out of Stock</option>
      </select>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Search product..."
        className="form-control w-auto"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
