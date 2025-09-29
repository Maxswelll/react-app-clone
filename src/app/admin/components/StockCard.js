"use client";
import { useState } from "react";
import { IoBagHandleOutline } from "react-icons/io5";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { Row, Col } from "react-bootstrap";

export default function StatCards({ products }) {
  const [hovered, setHovered] = useState(null);

  if (!products) return null;

  const total = products.length;
  const inStock = products.filter((p) => p.status === "In Stock").length;
  const outStock = products.filter((p) => p.status === "Out of Stock").length;

  const cards = [
    {
      id: "total",
      icon: <IoBagHandleOutline size={28} />,
      color: "linear-gradient(135deg, #667eea , #764ba2)",
      value: total,
      label: "Total Products",
      popup: "All products currently in the system",
    },
    {
      id: "inStock",
      icon: <FaCheckCircle size={28} />,
      color: "linear-gradient(135deg, #48bb78 , #38a169)",
      value: inStock,
      label: "In Stock",
      popup: "Products available for sale",
    },
    {
      id: "outStock",
      icon: <FaExclamationCircle size={28} />,
      color: "linear-gradient(135deg, #f56565 , #e53e3e)",
      value: outStock,
      label: "Out of Stock",
      popup: "Products that are sold out",
    },
  ];

  return (
    <Row className="g-4 mb-4">
      {cards.map((card) => {
        const isHovered = hovered === card.id;

        return (
          <Col key={card.id} xs={12} sm={6} lg={4}>
            <div
              className="position-relative d-flex align-items-center bg-white p-4 rounded-4 shadow-sm h-100"
              style={{
                transition: "all 0.3s ease",
                cursor: "pointer",
                overflow: "visible", // let popup show outside
                boxShadow: isHovered
                  ? "0 12px 24px rgba(0,0,0,0.25)"
                  : "0 4px 10px rgba(0,0,0,0.15)",
                transform: isHovered ? "translateY(-8px) scale(1.05)" : "none",
              }}
              onMouseEnter={() => setHovered(card.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className="p-3 rounded-3 text-white"
                style={{ background: card.color }}
              >
                {card.icon}
              </div>
              <div className="ms-3">
                <h2 className="fw-bold mb-0">{card.value}</h2>
                <small className="text-muted">{card.label}</small>
              </div>

              {/* Popup */}
              <div
                className="position-absolute bg-white shadow-lg p-3 rounded-3"
                style={{
                  top: "-60%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  minWidth: "220px",
                  zIndex: 10,
                  opacity: isHovered ? 1 : 0,
                  visibility: isHovered ? "visible" : "hidden",
                  transition: "opacity 0.3s ease, visibility 0.3s ease",
                }}
              >
                <p className="mb-0 fw-semibold">{card.popup}</p>
              </div>
            </div>
          </Col>
        );
      })}
    </Row>
  );
}
