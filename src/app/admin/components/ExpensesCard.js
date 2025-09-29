"use client";
import { useState } from "react";

export default function ExpenseStatCards({ cards }) {
  const [hovered, setHovered] = useState(null);

  if (!cards) return null;

  return (
    <div className="d-flex gap-4 mb-4 flex-wrap justify-content-center">
      {cards.map((card) => {
        const isHovered = hovered === card.id;

        return (
          <div
            key={card.id}
            className="position-relative flex-grow-1 d-flex align-items-center bg-white p-4 rounded-4 shadow-sm"
            style={{
              minWidth: "220px",
              maxWidth: "100%",
              transition: "all 0.3s ease",
              cursor: "pointer",
              overflow: "visible",
              boxShadow: isHovered
                ? "0 12px 24px rgba(0,0,0,0.25)"
                : "0 4px 10px rgba(0,0,0,0.15)",
              transform: isHovered ? "translateY(-8px) scale(1.05)" : "none",
            }}
            onMouseEnter={() => setHovered(card.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              className="p-3 rounded-3 text-white flex-shrink-0"
              style={{ background: card.color }}
            >
              {card.icon}
            </div>
            <div className="ms-3 text-truncate">
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
                width: "min(260px, 90vw)",
                zIndex: 10,
                opacity: isHovered ? 1 : 0,
                visibility: isHovered ? "visible" : "hidden",
                transition: "opacity 0.3s ease, visibility 0.3s ease",
              }}
            >
              <p className="mb-0 fw-semibold">{card.popup}</p>
            </div>
          </div>
        );
      })}

      {/* Extra mobile tweaks */}
      <style jsx>{`
        @media (max-width: 576px) {
          .position-relative {
            flex-direction: column;
            align-items: flex-start !important;
            padding: 1rem !important;
          }
          .position-relative .ms-3 {
            margin-left: 0 !important;
            margin-top: 0.5rem;
          }
          .position-relative .position-absolute {
            top: 100% !important;
            left: 0 !important;
            transform: none !important;
            margin-top: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
