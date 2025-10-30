// IncomeManagement.jsx
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
import { AiOutlineDelete } from "react-icons/ai";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

// Uppercase profile name with logic
function initials(name = "") {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
// return linear-gradient bg color random
function colorFromString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  const hue = Math.abs(h) % 360;
  return `linear-gradient(135deg,hsl(${hue} 70% 50%), hsl(${
    (hue + 30) % 360
  } 70% 45%))`;
}

export default function IncomeManagement() {
  // API endpoint (change if your server runs elsewhere)
  const API_URL =
    process.env.NEXT_PUBLIC_INCOME_API || "http://localhost:5000/income";

  const [data, setData] = useState([]); // will be loaded from backend
  const [filterDate, setFilterDate] = useState("");
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "date", dir: "desc" });

  // modal state
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
  const [goToValue, setGoToValue] = useState("");

  // -------------------------
  // Backend interaction
  // -------------------------
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const json = await res.json();
      // Normalize rows: ensure quantity & total are numbers and date is YYYY-MM-DD
      const normalized = json.map((r) => ({
        id: r.id,
        customer: r.customer || "",
        quantity: Number(r.quantity || 0),
        total: Number(r.total || 0),
        date: r.date || "", // backend returns YYYY-MM-DD
      }));
      setData(normalized);
    } catch (err) {
      console.error("Failed to load income data:", err);
    }
  }

  async function saveForm(e) {
    e.preventDefault();

    // validate minimal
    if (!form.customer || !form.date || !form.total) return;

    const payload = {
      customer: form.customer,
      quantity: Number(form.quantity || 0),
      total: Number(form.total || 0),
      date: form.date, // plain YYYY-MM-DD
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
        const updated = await res.json();
        // normalized
        const row = {
          id: updated.id,
          customer: updated.customer,
          quantity: Number(updated.quantity || 0),
          total: Number(updated.total || 0),
          date: updated.date || "",
        };
        setData((d) => d.map((x) => (x.id === row.id ? row : x)));
      } else {
        // create
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Create failed: ${res.status}`);
        const created = await res.json();
        const row = {
          id: created.id,
          customer: created.customer,
          quantity: Number(created.quantity || 0),
          total: Number(created.total || 0),
          date: created.date || "",
        };
        setData((d) => [row, ...d]);
      }

      // cleanup
      setShowModal(false);
      setForm({ id: null, customer: "", quantity: 1, total: "", date: "" });
      setEditing(null);
      setCurrentPage(1);
    } catch (err) {
      console.error("Save income error:", err);
      alert("Failed to save income (check console)");
    }
  }

  async function onDelete(id) {
    if (!confirm("Delete this entry?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setData((d) => d.filter((x) => x.id !== id));
    } catch (err) {
      console.error("Delete income error:", err);
      alert("Failed to delete (check console)");
    }
  }

  // -------------------------
  // Derived stats
  // -------------------------
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

  // -------------------------
  // Filtering / Sorting / Pagination
  // -------------------------
  const filtered = data
    .filter((r) =>
      search.trim()
        ? (r.customer || "").toLowerCase().includes(search.toLowerCase())
        : true
    )
    .filter((r) => (filterDate ? r.date === filterDate : true))
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const pageStart = (currentPage - 1) * itemsPerPage;
  const pageData = filtered.slice(pageStart, pageStart + itemsPerPage);

  // -------------------------
  // UI handlers
  // -------------------------
  function openAdd() {
    setForm({ id: null, customer: "", quantity: 1, total: "", date: "" });
    setEditing(null);
    setShowModal(true);
  }
  function openEdit(item) {
    setForm({
      id: item.id,
      customer: item.customer,
      quantity: item.quantity,
      total: item.total,
      date: item.date,
    });
    setEditing(item.id);
    setShowModal(true);
  }
  function toggleSort(key) {
    setSortConfig((s) => {
      if (s.key === key) {
        return { key, dir: s.dir === "asc" ? "desc" : "asc" };
      }
      return { key, dir: "asc" };
    });
  }

  function goToPageInput() {
    const p = parseInt(goToValue || "", 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      setGoToValue("");
    }
  }

  function qtyLabel(n) {
    return `${n} item${n > 1 ? "s" : ""}`;
  }

  // -------------------------
  // Render
  // -------------------------
  return (
    <Container fluid className="p-3">
      {/* Title */}
      <div className="text-center text-info mb-3">
        <h2 className="mb-0 ms-2">
          <AiOutlineDollarCircle
            style={{ marginRight: "8px", color: "#000" }}
            size={35}
          />
          Income Management
        </h2>
        <small style={{ fontSize: "15px" }} className="text-muted">
          Track and manage all revenue streams
        </small>
      </div>

      {/* Stat cards */}
      <Row className="g-3 mb-3">
        {[
          {
            id: "panha",
            icon: <AiOutlineDollarCircle size={35} />,
            value: `$${totals.panhaIncome.toFixed(2)}`,
            label: "Panha ",
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

      {/* Add bar */}
      <div className="bg-white rounded-3 shadow-sm p-3 mb-3 d-flex justify-content-start">
        <Button
          variant="primary"
          onClick={openAdd}
          className="px-4 py-2 fw-semibold shadow-sm"
          style={{
            background: "linear-gradient(to right, #00d2ff, #3a7bd5)",
            border: "none",
            borderRadius: "8px",
            transition: "all 0.3s ease",
          }}
        >
          + Add Income
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3 shadow-sm p-3">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th
                  style={{
                    color: "#344767",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Customer
                </th>
                <th
                  style={{
                    color: "#344767",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  onClick={() => toggleSort("quantity")}
                >
                  Quantity{" "}
                  {sortConfig.key === "quantity" ? (
                    sortConfig.dir === "asc" ? (
                      <AiOutlineArrowUp size={14} />
                    ) : (
                      <AiOutlineArrowDown size={14} />
                    )
                  ) : null}
                </th>

                <th
                  style={{
                    color: "#344767",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  onClick={() => toggleSort("total")}
                >
                  Total Amount{" "}
                  {sortConfig.key === "total" ? (
                    sortConfig.dir === "asc" ? (
                      <AiOutlineArrowUp size={14} />
                    ) : (
                      <AiOutlineArrowDown size={14} />
                    )
                  ) : null}
                </th>
                <th
                  style={{
                    color: "#344767",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  onClick={() => toggleSort("date")}
                >
                  Buy Date{" "}
                  {sortConfig.key === "date" ? (
                    sortConfig.dir === "asc" ? (
                      <AiOutlineArrowUp size={14} />
                    ) : (
                      <AiOutlineArrowDown size={14} />
                    )
                  ) : null}
                </th>

                <th
                  className="text-end"
                  style={{ fontWeight: 600, color: "#344767" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white"
                        style={{
                          width: 40,
                          height: 40,
                          background: colorFromString(r.customer),
                          fontWeight: 300,
                        }}
                      >
                        {initials(r.customer)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{r.customer}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <Button
                      size="sm"
                      style={{
                        color: "#0958d9",
                        background: "#e6f4ff",
                        border: "2px solid #91caff",
                        fontWeight: "600",
                        borderRadius: "6px",
                        padding: ".25rem .75rem",
                      }}
                    >
                      {qtyLabel(r.quantity)}
                    </Button>
                  </td>

                  <td style={{ fontWeight: 700 }}>
                    ${Number(r.total).toFixed(2)}
                  </td>

                  {/* show date string directly to avoid timezone shift */}
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

              {pageData.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-2 mt-3">
          <div>
            <Form.Select
              aria-label="Items per page"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{ width: "120px" }}
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </Form.Select>
          </div>

          <nav aria-label="Page navigation" className="mx-auto">
            <ul className="pagination mb-0">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(1)}
                  aria-label="First"
                >
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
                  aria-label="Last"
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

      {/* Add/Edit Modal */}
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
