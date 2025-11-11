"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Modal,
  InputGroup,
} from "react-bootstrap";
import { motion } from "framer-motion";
import { CiEdit } from "react-icons/ci";
import {
  AiOutlineDelete,
  AiOutlineDollarCircle,
  AiOutlineArrowUp,
  AiOutlineArrowDown,
} from "react-icons/ai";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BsPeople } from "react-icons/bs";

// ---------------------
// Utils
// ---------------------
function initials(name = "") {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function colorFromString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  h |= 0;
  const hue = Math.abs(h) % 360;
  return `linear-gradient(135deg,hsl(${hue} 70% 50%), hsl(${
    (hue + 30) % 360
  } 70% 45%))`;
}

function qtyLabel(n) {
  return `${n} item${n > 1 ? "s" : ""}`;
}

// ---------------------
// Main Component
// ---------------------
export default function IncomeManagement() {
  const API_URL =
    process.env.NEXT_PUBLIC_INCOME_API || "http://localhost:5000/income";

  const [data, setData] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "date", dir: "desc" });

  // modal
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    id: null,
    customer: "",
    quantity: 1,
    total: "",
    date: "",
  });

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [goToValue, setGoToValue] = useState("");

  // ---------------------
  // Fetch data from backend (with pagination + search)
  // ---------------------
  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage, search]);

  async function fetchData() {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: search.trim(),
      });
      const res = await fetch(`${API_URL}?${params.toString()}`);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const json = await res.json();
      setData(json.data || []);
      setTotalPages(json.totalPages || 1);
    } catch (err) {
      console.error("Failed to load income data:", err);
    }
  }

  // ---------------------
  // Save form
  // ---------------------
  async function saveForm(e) {
    e.preventDefault();
    if (!form.customer || !form.date || !form.total)
      return alert("Please fill all fields");

    const payload = {
      customer: form.customer,
      quantity: Number(form.quantity),
      total: Number(form.total),
      date: form.date,
    };

    try {
      if (editing) {
        // update
        const res = await fetch(`${API_URL}/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      } else {
        // create
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Create failed: ${res.status}`);
      }

      // refresh data
      setShowModal(false);
      setForm({ id: null, customer: "", quantity: 1, total: "", date: "" });
      setEditing(null);
      fetchData();
    } catch (err) {
      console.error("Save income error:", err);
      alert("Failed to save income (check console)");
    }
  }

  // ---------------------
  // Delete
  // ---------------------
  async function onDelete(id) {
    if (!confirm("Delete this entry?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      fetchData();
    } catch (err) {
      console.error("Delete income error:", err);
      alert("Failed to delete (check console)");
    }
  }

  // ---------------------
  // Stats
  // ---------------------
  const totals = useMemo(() => {
    const totalIncome = data.reduce((s, r) => s + Number(r.total || 0), 0);
    const productIncome = data
      .filter((r) => Number(r.quantity || 0) > 1)
      .reduce((s, r) => s + Number(r.total || 0), 0);
    const boostIncome = data
      .filter((r) => (r.customer || "").toLowerCase().includes("boost"))
      .reduce((s, r) => s + Number(r.total || 0), 0);
    const panhaIncome = data
      .filter((r) => (r.customer || "").toLowerCase() === "panha")
      .reduce((s, r) => s + Number(r.total || 0), 0);

    return {
      totalIncome,
      productIncome,
      boostIncome,
      panhaIncome,
      customers: data.length,
    };
  }, [data]);

  // ---------------------
  // Sort
  // ---------------------
  const sorted = [...data].sort((a, b) => {
    let av = a[sortConfig.key];
    let bv = b[sortConfig.key];
    if (sortConfig.key === "date") {
      av = new Date(av);
      bv = new Date(bv);
    } else {
      av = Number(av || 0);
      bv = Number(bv || 0);
    }
    if (av < bv) return sortConfig.dir === "asc" ? -1 : 1;
    if (av > bv) return sortConfig.dir === "asc" ? 1 : -1;
    return 0;
  });

  // ---------------------
  // UI Handlers
  // ---------------------
  const openAdd = () => {
    setForm({ id: null, customer: "", quantity: 1, total: "", date: "" });
    setEditing(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setForm({ ...item });
    setEditing(item.id);
    setShowModal(true);
  };

  const toggleSort = (key) => {
    setSortConfig((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );
  };

  const goToPageInput = () => {
    const p = parseInt(goToValue || "", 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      setGoToValue("");
    }
  };

  // ---------------------
  // Render
  // ---------------------
  return (
    <Container fluid className="p-3">
      {/* Title */}
      <div className="text-center text-info mb-3">
        <h2 className="mb-0 ms-2">
          <AiOutlineDollarCircle
            style={{ marginRight: 8, color: "#000" }}
            size={35}
          />
          Income Management
        </h2>
        <small style={{ fontSize: 15 }} className="text-muted">
          Track and manage all revenue streams
        </small>
      </div>

      {/* Stat Cards */}
      <Row className="g-3 mb-3">
        {[
          {
            id: "panha",
            icon: <AiOutlineDollarCircle size={35} />,
            value: `$${totals.panhaIncome.toFixed(2)}`,
            label: "Panha",
            color:
              "linear-gradient(135deg, rgb(79, 172, 254), rgb(0, 242, 254))",
          },
          {
            id: "chenda",
            icon: <AiOutlineDollarCircle size={35} />,
            value: `$${totals.productIncome.toFixed(2)}`,
            label: "Chenda",
            color:
              "linear-gradient(135deg, rgb(79, 172, 254), rgb(0, 242, 254))",
          },
          {
            id: "total",
            icon: <AiOutlineDollarCircle size={35} />,
            value: `$${totals.totalIncome.toFixed(2)}`,
            label: "Total Income",
            color:
              "linear-gradient(135deg, rgb(79, 172, 254), rgb(0, 242, 254))",
          },
          {
            id: "customers",
            icon: <BsPeople size={35} />,
            value: `${totals.customers}`,
            label: "Total Customers",
            color: "linear-gradient(135deg, #a8edea, #fed6e3)",
          },
        ].map((c) => (
          <Col xs={12} sm={6} md={3} key={c.id}>
            <motion.div
              whileHover={{ y: -3 }}
              className="d-flex align-items-center bg-white rounded-4 p-3 shadow-sm"
              style={{ gap: 15 }}
            >
              <div
                className="rounded-3 text-white d-flex align-items-center justify-content-center"
                style={{ width: 70, height: 70, background: c.color }}
              >
                {c.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 27 }}>{c.value}</div>
                <div className="text-muted">{c.label}</div>
              </div>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Add Button */}
      <div className="bg-white rounded-3 shadow-sm p-3 mb-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
        {/* Add Button */}
        <Button
          variant="primary"
          onClick={openAdd}
          className="px-4 py-2 fw-semibold"
          style={{
            background: "linear-gradient(135deg, #00d2ff, #3a7bd5)",
            border: "none",
            borderRadius: 12,
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.95rem",
            letterSpacing: "0.5px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = "0 6px 14px rgba(0, 123, 255, 0.35)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 4px 10px rgba(0, 123, 255, 0.2)";
          }}
        >
          + Add Income
        </Button>

        {/* Search Bar */}
        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
          <Form.Control
            type="text"
            placeholder="🔍 Search by customer..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              width: "260px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              padding: "8px 12px",
              backgroundColor: "#fafafa",
              transition: "transform 0.25s ease, border-color 0.25s ease",
            }}
            onFocus={(e) => {
              e.target.style.transform = "scale(1.03)";
              e.target.style.borderColor = "#3a7bd5";
              e.target.style.backgroundColor = "#fff";
            }}
            onBlur={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.borderColor = "#ddd";
              e.target.style.backgroundColor = "#fafafa";
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3 shadow-sm p-3">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Customer</th>
                <th onClick={() => toggleSort("quantity")}>
                  Quantity{" "}
                  {sortConfig.key === "quantity" &&
                    (sortConfig.dir === "asc" ? (
                      <AiOutlineArrowUp size={14} />
                    ) : (
                      <AiOutlineArrowDown size={14} />
                    ))}
                </th>
                <th onClick={() => toggleSort("total")}>
                  Total Amount{" "}
                  {sortConfig.key === "total" &&
                    (sortConfig.dir === "asc" ? (
                      <AiOutlineArrowUp size={14} />
                    ) : (
                      <AiOutlineArrowDown size={14} />
                    ))}
                </th>
                <th onClick={() => toggleSort("date")}>
                  Buy Date{" "}
                  {sortConfig.key === "date" &&
                    (sortConfig.dir === "asc" ? (
                      <AiOutlineArrowUp size={14} />
                    ) : (
                      <AiOutlineArrowDown size={14} />
                    ))}
                </th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No records found
                  </td>
                </tr>
              )}
              {sorted.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white"
                        style={{
                          width: 40,
                          height: 40,
                          background: colorFromString(r.customer),
                        }}
                      >
                        {initials(r.customer)}
                      </div>
                      <div>{r.customer}</div>
                    </div>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      style={{
                        color: "#0958d9",
                        background: "#e6f4ff",
                        border: "2px solid #91caff",
                      }}
                    >
                      {qtyLabel(r.quantity)}
                    </Button>
                  </td>
                  <td style={{ fontWeight: 700 }}>
                    ${Number(r.total).toFixed(2)}
                  </td>
                  <td>{r.date}</td>
                  <td className="text-end">
                    <Button
                      size="sm"
                      variant="primary"
                      className="me-2"
                      onClick={() => openEdit(r)}
                    >
                      <CiEdit /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onDelete(r.id)}
                    >
                      <AiOutlineDelete /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-2 mt-3">
          <Form.Select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={{ width: 120 }}
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </Form.Select>

          <nav aria-label="Page navigation" className="mx-auto">
            <ul className="pagination mb-0">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button className="page-link" onClick={() => setCurrentPage(1)}>
                  «
                </button>
              </li>
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <FaChevronLeft />
                </button>
              </li>

              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                return (
                  <li
                    key={page}
                    className={`page-item ${
                      page === currentPage ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                );
              })}

              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  <FaChevronRight />
                </button>
              </li>
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(totalPages)}
                >
                  »
                </button>
              </li>
            </ul>
          </nav>

          <InputGroup style={{ maxWidth: 160 }}>
            <Form.Control
              placeholder="Go to"
              type="number"
              min={1}
              max={totalPages}
              value={goToValue}
              onChange={(e) => setGoToValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") goToPageInput();
              }}
            />
            <Button onClick={goToPageInput}>Go</Button>
          </InputGroup>
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <form onSubmit={saveForm}>
          <Modal.Header closeButton>
            <Modal.Title>{editing ? "Edit Income" : "Add Income"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-2">
              <Col xs={12}>
                <Form.Label>Customer</Form.Label>
                <Form.Control
                  required
                  value={form.customer}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, customer: e.target.value }))
                  }
                />
              </Col>
              <Col xs={6}>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  required
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, quantity: e.target.value }))
                  }
                />
              </Col>
              <Col xs={6}>
                <Form.Label>Total Amount</Form.Label>
                <Form.Control
                  required
                  type="number"
                  step="0.01"
                  value={form.total}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, total: e.target.value }))
                  }
                />
              </Col>
              <Col xs={12}>
                <Form.Label>Buy Date</Form.Label>
                <Form.Control
                  required
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editing ? "Update" : "Save"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </Container>
  );
}
