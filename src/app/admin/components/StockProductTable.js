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
      <table className="table align-middle table-hover text-nowrap">
        <thead className="table-light">
          <tr>
            <th style={{ color: "#344767", fontWeight: 600 }}>Image</th>
            <th style={{ color: "#344767", fontWeight: 600 }}>Type</th>
            <th style={{ color: "#344767", fontWeight: 600 }}>Buy Price</th>
            <th style={{ color: "#344767", fontWeight: 600 }}>Sell Price</th>
            <th style={{ color: "#344767", fontWeight: 600 }}>Stock Qty</th>
            <th style={{ color: "#344767", fontWeight: 600 }}>Status</th>
            <th
              style={{ color: "#344767", fontWeight: 600 }}
              className="text-center"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              {/* Image */}
              <td>
                {p.image ? (
                  <img
                    src={
                      p.image.startsWith("http")
                        ? p.image // already full URL
                        : `http://localhost:5000${
                            p.image.startsWith("/uploads")
                              ? p.image
                              : `/uploads/${p.image}`
                          }`
                    }
                    alt={p.type || "product"}
                    className="img-fluid rounded"
                    style={{
                      width: "48px",
                      height: "48px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span className="text-muted">No Image</span>
                )}
              </td>

              {/* Type */}
              <td className="fw-medium">{p.type || "-"}</td>

              {/* Buy Price */}
              <td>${Number(p.buy_price || 0).toFixed(2)}</td>

              {/* Sell Price */}
              <td>
                <span style={{ color: "red" }} className="fw-semibold">
                  ${Number(p.sell_price || 0).toFixed(2)}
                </span>
              </td>

              {/* Stock */}
              <td>{p.stock ?? 0}</td>

              {/* Status */}
              <td>
                {Number(p.stock) > 0 ? (
                  <span
                    style={{
                      color: "#389e0d",
                      background: "#f6ffed",
                      border: "2px solid #b7eb8f",
                      fontWeight: "600",
                      borderRadius: "6px",
                      padding: ".25rem .75rem",
                      display: "inline-block",
                    }}
                  >
                    In Stock
                  </span>
                ) : (
                  <span
                    style={{
                      color: "#cf1322",
                      background: "#fff1f0",
                      border: "2px solid #ffa39e",
                      fontWeight: "600",
                      borderRadius: "6px",
                      padding: ".25rem .75rem",
                      display: "inline-block",
                    }}
                  >
                    Out of Stock
                  </span>
                )}
              </td>

              {/* Actions */}
              <td className="text-center">
                <div className="d-flex flex-wrap justify-content-center gap-2">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setEditingProduct?.(p)}
                  >
                    <CiEdit size={15} /> Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(p.id)} // ✅ delegate delete to parent
                  >
                    <AiOutlineDelete size={15} /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {/* Empty State */}
          {products.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center text-muted py-4">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
