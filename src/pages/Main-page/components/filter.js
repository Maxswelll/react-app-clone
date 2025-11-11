"use client";
import { useState, useRef, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { BsCaretRightFill, BsCaretDownFill } from "react-icons/bs";

// Animated dropdown
function AnimatedSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectStyle = {
    borderRadius: "12px",
    border: "1px solid #ddd",
    padding: "10px",
    fontSize: "15px",
    cursor: "pointer",
    userSelect: "none",
    position: "relative",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    transition: "all 0.2s ease",
  };

  const dropdownStyle = {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transformOrigin: "top",
    transform: open ? "scaleY(1)" : "scaleY(0)",
    transition: "transform 0.4s ease",
    zIndex: 9999,
  };

  const optionStyle = {
    padding: "10px",
    cursor: "pointer",
    transition: "background 0.2s ease",
  };

  return (
    <div style={{ position: "relative", width: "100%" }} ref={containerRef}>
      <div style={selectStyle} onClick={() => setOpen(!open)}>
        {value || placeholder}
      </div>
      <div style={dropdownStyle}>
        {options.map((opt) => (
          <div
            key={opt.value}
            style={optionStyle}
            onClick={() => {
              onChange(opt.value);
              setOpen(false);
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0ff")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            {opt.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Filters({ filters, setFilters }) {
  const [showFilters, setShowFilters] = useState(true);

  const showAllProducts = () => {
    setFilters({ type: "", size: "", stock: "", search: "" });
  };

  const cardStyle = {
    border: "none",
    borderRadius: "20px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
    padding: "30px",
    background: "linear-gradient(145deg, #ffffff, #f9f9ff)",
    position: "relative",
  };

  const buttonStyle = {
    border: "none",
    borderRadius: "12px",
    padding: "10px 20px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    cursor: "pointer",
  };

  const inputStyle = {
    borderRadius: "12px",
    border: "1px solid #ddd",
    padding: "10px",
    fontSize: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    width: "100%",
  };

  const filterLabel = { fontWeight: "600", color: "#555", marginBottom: "5px" };

  return (
    <Container style={{ marginTop: "30px" }}>
      <Card style={cardStyle}>
        {/* Show All Products Button */}
        <Button
          onClick={showAllProducts}
          style={{
            ...buttonStyle,
            backgroundColor: "#4CAF50",
            position: "absolute",
            top: "20px",
            right: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#3e8e41";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#4CAF50";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Show All Products
        </Button>

        {/* Filters Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
            cursor: "pointer",
          }}
          onClick={() => setShowFilters(!showFilters)}
        >
          <h5
            style={{
              color: "#6C63FF",
              fontWeight: "700",
              marginBottom: 0,
              marginRight: "10px",
            }}
          >
            Filters
          </h5>
          {showFilters ? (
            <BsCaretDownFill color="#6C63FF" />
          ) : (
            <BsCaretRightFill color="#6C63FF" />
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <>
            {/* Type */}
            <div style={{ marginBottom: "20px" }}>
              <div style={filterLabel}>Type:</div>
              <AnimatedSelect
                value={filters.type}
                onChange={(val) =>
                  setFilters((prev) => ({ ...prev, type: val }))
                }
                placeholder="Select type"
                options={[
                  { value: "dress", label: "Dress" },
                  { value: "jumpsuit", label: "Jumpsuit" },
                  { value: "pyjama", label: "Pyjama" },
                  { value: "shirt", label: "Shirt" },
                  { value: "shirtandshort", label: "Shirt & Short" },
                ]}
              />
            </div>

            {/* Size */}
            <div style={{ marginBottom: "20px" }}>
              <div style={filterLabel}>Size:</div>
              <AnimatedSelect
                value={filters.size}
                onChange={(val) =>
                  setFilters((prev) => ({ ...prev, size: val }))
                }
                placeholder="Select size"
                options={[
                  { value: "66", label: "66 (56-65 cm, 3-6 kg)" },
                  { value: "73", label: "73 (65-73 cm, 6-9 kg)" },
                  { value: "80", label: "80 (73-81 cm, 9-11 kg)" },
                  { value: "90", label: "90 (81-91 cm, 11-13 kg)" },
                  { value: "100", label: "100 (91-101 cm, 13-15 kg)" },
                  { value: "110", label: "110 (101-110 cm, 15-17 kg)" },
                ]}
              />
            </div>

            {/* Stock */}
            <div style={{ marginBottom: "20px" }}>
              <div style={filterLabel}>Stock:</div>
              <AnimatedSelect
                value={filters.stock}
                onChange={(val) =>
                  setFilters((prev) => ({ ...prev, stock: val }))
                }
                placeholder="Select stock"
                options={[
                  { value: "in", label: "In Stock" },
                  { value: "out", label: "Out of Stock" },
                ]}
              />
            </div>

            {/* Search */}
            <Row className="align-items-center mt-3">
              <Col xs={9}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  style={inputStyle}
                />
              </Col>
              <Col xs={3} className="text-end">
                <Button
                  style={{
                    ...buttonStyle,
                    backgroundColor: "#6C63FF",
                    color: "#fff",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 6px 16px rgba(0,0,0,0.2)";
                    e.currentTarget.style.transform = "translateY(-5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 2px 8px #0000000f";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, search: filters.search }))
                  }
                >
                  Search
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Card>
    </Container>
  );
}
