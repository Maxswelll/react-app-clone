"use client";
import React from "react";
import { CiEdit } from "react-icons/ci";
import { AiOutlineDelete } from "react-icons/ai";

export default function ProductTable({
  products,
  onDelete,
  setEditingProduct,
}) {
  return (
    <div className="table-responsive mt-3">
      <table className="table align-middle table-hover">
        <thead className="table-light">
          <tr>
            <th>Image</th>
            <th>Type</th>
            <th>Buy Price</th>
            <th>Sell Price</th>
            <th>Stock Qty</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <img
                  src={p.image}
                  alt={p.type}
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
              </td>
              <td>{p.type}</td>
              <td>${p.buyPrice.toFixed(2)}</td>
              <td>
                <span className="fw-semibold">${p.sellPrice.toFixed(2)}</span>
              </td>
              <td>{p.stock}</td>
              <td>
                <span
                  className="badge px-3 py-2 rounded-pill text-white"
                  style={{
                    background:
                      p.status === "In Stock"
                        ? "linear-gradient(135deg, #48bb78, #68d391)"
                        : "linear-gradient(135deg, #f56565, #9e0c0cff)",
                  }}
                >
                  {p.status}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => setEditingProduct(p)}
                >
                  <CiEdit size={15} /> Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(p.id)}
                >
                  <AiOutlineDelete size={15} /> Delete
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center text-muted">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
