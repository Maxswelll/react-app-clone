"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";

export default function ExpenseDropdown({ value, onChange, options }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Dropdown Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "0.5rem 0.75rem",
          borderRadius: "12px",
          border: "1px solid #ddd",
          background: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 500,
          cursor: "pointer",
          boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
        }}
      >
        {value}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <IoChevronDown size={18} />
        </motion.span>
      </button>

      {/* Dropdown List */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "100%",
              background: "#fff",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
              zIndex: 999,
              marginTop: "6px",
            }}
          >
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                style={{
                  padding: "0.5rem 0.75rem",
                  cursor: "pointer",
                  fontWeight: opt === value ? "600" : "400",
                  background: opt === value ? "rgba(0,0,0,0.05)" : "transparent",
                  transition: "0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.07)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = opt === value ? "rgba(0,0,0,0.05)" : "transparent")}
              >
                {opt}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}