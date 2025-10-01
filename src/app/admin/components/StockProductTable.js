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
            <th
              style={{
                color: "#344767",
                fontWeight: 600,
                cursor: "pointer",
              }}
              scope="col"
            >
              Image
            </th>
            <th
              style={{
                color: "#344767",
                fontWeight: 600,
                cursor: "pointer",
              }}
              scope="col"
            >
              Type
            </th>
            <th
              style={{
                color: "#344767",
                fontWeight: 600,
                cursor: "pointer",
              }}
              scope="col"
            >
              Buy Price
            </th>
            <th
              style={{
                color: "#344767",
                fontWeight: 600,
                cursor: "pointer",
              }}
              scope="col"
            >
              Sell Price
            </th>
            <th
              style={{
                color: "#344767",
                fontWeight: 600,
                cursor: "pointer",
              }}
              scope="col"
            >
              Stock Qty
            </th>
            <th
              style={{
                color: "#344767",
                fontWeight: 600,
                cursor: "pointer",
              }}
              scope="col"
            >
              Status
            </th>
            <th
              style={{
                color: "#344767",
                fontWeight: 600,
                cursor: "pointer",
              }}
              scope="col"
              className="text-center"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <img
                  src={p.image}
                  alt={p.type}
                  className="img-fluid rounded"
                  style={{
                    width: "48px",
                    height: "48px",
                    objectFit: "cover",
                  }}
                />
              </td>
              <td className="fw-medium">{p.type}</td>
              <td>${p.buyPrice.toFixed(2)}</td>
              <td>
                <span
                  style={{
                    color: "red",
                  }}
                  className="fw-semibold"
                >
                  ${p.sellPrice.toFixed(2)}
                </span>
              </td>
              <td>{p.stock}</td>

              {/* custom stock colors */}
              <td>
                {p.stock > 0 ? (
                  <span
                    style={{
                      color: "#389e0d",
                      background: "#f6ffed",
                      border: "2px solid #b7eb8f",
                      fontWeight: "600",
                      borderRadius: "6px",
                      padding: ".25rem .75rem",
                      display: "inline-block",
                      whiteSpace: "nowrap", // keeps it tidy on mobile
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
                      whiteSpace: "nowrap",
                    }}
                  >
                    Out of Stock
                  </span>
                )}
              </td>

              <td className="text-center">
                <div className="d-flex flex-wrap justify-content-center gap-2">
                  <button
                    className="btn btn-sm btn-primary"
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
