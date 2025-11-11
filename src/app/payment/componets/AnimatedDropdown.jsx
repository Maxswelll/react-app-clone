import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnimatedDropdown({ options, selected, onSelect, label }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-3 position-relative">
      <label className="form-label text-white">{label}</label>
      <div
        className="bg-dark text-white border-gray p-2 rounded d-flex justify-content-between align-items-center"
        style={{ cursor: "pointer" }}
        onClick={() => setOpen(!open)}
      >
        <span>{selected || "-- Choose --"}</span>
        <span style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "0.3s" }}>
          ▼
        </span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="position-absolute w-100 bg-dark rounded border-gray mt-1 shadow"
            style={{ zIndex: 10 }}
          >
            {options.map((option) => (
              <div
                key={option}
                className="p-2 text-white hover-bg"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  onSelect(option);
                  setOpen(false);
                }}
              >
                {option}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .border-gray {
          border: 1px solid rgba(255,255,255,0.2);
        }
        .hover-bg:hover {
          background: rgba(0,255,255,0.2);
        }
      `}</style>
    </div>
  );
}
