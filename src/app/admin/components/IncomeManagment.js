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
import { BsCurrencyDollar, BsPeople, BsBag, BsGraphUp } from "react-icons/bs";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const initialData = [
  {
    id: 1,
    customer: "Jane Moum",
    quantity: 7,
    total: 23.0,
    date: "2024-08-15",
  },
  {
    id: 2,
    customer: "Teh Channakara",
    quantity: 3,
    total: 11.75,
    date: "2024-07-06",
  },
  {
    id: 3,
    customer: "Solinda",
    quantity: 2,
    total: 12.59,
    date: "2024-09-11",
  },
  {
    id: 4,
    customer: "Nary Nary",
    quantity: 1,
    total: 16.5,
    date: "2024-09-14",
  },
  {
    id: 5,
    customer: "Ri Va",
    quantity: 4,
    total: 20.5,
    date: "2024-08-15",
  },
  {
    id: 6,
    customer: "Vothey Lim",
    quantity: 1,
    total: 20.2,
    date: "2024-09-14",
  },
  {
    id: 7,
    customer: "Ah Ny",
    quantity: 2,
    total: 10.0,
    date: "2024-09-13",
  },
  {
    id: 8,
    customer: "Soun Ramsey",
    quantity: 3,
    total: 19.8,
    date: "2024-09-12",
  },
  {
    id: 9,
    customer: "Elen Nguyen",
    quantity: 2,
    total: 13.29,
    date: "2024-09-10",
  },
  {
    id: 10,
    customer: "Chakriya Chhay",
    quantity: 1,
    total: 14.52,
    date: "2024-09-10",
  },
  {
    id: 11,
    customer: "Panha",
    quantity: 3,
    total: 45.0,
    date: "2024-09-30",
  },
  {
    id: 12,
    customer: "Panha",
    quantity: 1,
    total: 12.5,
    date: "2024-09-30",
  },
];
// Uppercase profile name with logic
function initials(name = "") {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 3).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
// return linear-gradient bg color random
function colorFromString(s) {
  //   hash value
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  //   % 360 to make sure it stays between 0-359
  const hue = Math.abs(h) % 360;
  return `linear-gradient(135deg,hsl(${hue} 70% 50%), hsl(${
    (hue + 30) % 360
  } 70% 45%))`;
}

export default function IncomeManagement() {
  const [data, setData] = useState(initialData);
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

  // derived stats
  const totals = useMemo(() => {
    const totalIncome = data.reduce((s, r) => s + Number(r.total || 0), 0);

    const productIncome = data
      .filter((r) => r.quantity > 1)
      .reduce((s, r) => s + Number(r.total || 0), 0);

    const boostIncome = data
      .filter((r) => r.customer.toLowerCase().includes("boost"))
      .reduce((s, r) => s + Number(r.total || 0), 0);

    const todayStr = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    const todayIncome = data
      .filter((r) => r.date === todayStr)
      .reduce((s, r) => s + Number(r.total || 0), 0);
    const panhaIncome = data
      .filter((r) => r.customer.toLowerCase() === "panha")
      .reduce((s, r) => s + Number(r.total || 0), 0);

    return {
      totalIncome,
      productIncome,
      boostIncome,
      panhaIncome, //
      customers: data.length,
    };
  }, [data]);

  // filtered & sorted
  const filtered = data
    .filter((r) =>
      search.trim()
        ? r.customer.toLowerCase().includes(search.toLowerCase())
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
  }, [totalPages]);

  const pageStart = (currentPage - 1) * itemsPerPage;
  const pageData = filtered.slice(pageStart, pageStart + itemsPerPage);

  // handlers
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
  function onDelete(id) {
    if (!confirm("Delete this entry?")) return;
    setData((d) => d.filter((x) => x.id !== id));
  }
  function saveForm(e) {
    e.preventDefault();
    const payload = {
      ...form,
      id: form.id || Date.now(),
      quantity: Number(form.quantity),
      total: Number(form.total),
    };
    setData((d) => {
      if (form.id) {
        return d.map((x) => (x.id === form.id ? payload : x));
      }
      return [payload, ...d];
    });
    setShowModal(false);
    setForm({ id: null, customer: "", quantity: 1, total: "", date: "" });
    setEditing(null);
    setCurrentPage(1);
  }

  function toggleSort(key) {
    setSortConfig((s) => {
      if (s.key === key) {
        return { key, dir: s.dir === "asc" ? "desc" : "asc" };
      }
      return { key, dir: "asc" };
    });
  }

  // pagination helpers
  function goToPageInput() {
    const p = parseInt(goToValue || "", 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      setGoToValue("");
    }
  }

  // small helper for quantity pill label
  function qtyLabel(n) {
    return `${n} item${n > 1 ? "s" : ""}`;
  }

  return (
    <Container fluid className="p-3">
      {/* Title */}
      <div className="text-center mb-3">
        <h2 className="mb-0" style={{ color: "#0d6efd", fontWeight: 700 }}>
          <BsCurrencyDollar style={{ marginRight: 8 }} />
          Income Management
        </h2>
        <small className="text-muted">
          Track and manage all revenue streams
        </small>
      </div>

      {/* Stat cards */}
      <Row className="g-3 mb-3">
        {[
          {
            id: "panha",
            icon: <BsCurrencyDollar size={20} />,
            value: `$${totals.panhaIncome.toFixed(2)}`,
            label: "Panha ",
            color: "linear-gradient(135deg,#74b9ff,#4d7cff)",
          },

          {
            id: "chenda",
            icon: <BsGraphUp size={20} />,
            value: `$${totals.productIncome.toFixed(2)}`,
            label: "Chenda",
            color: "linear-gradient(135deg,#9b8cff,#7a6bff)",
          },
          {
            id: "total",
            icon: <BsBag size={20} />,
            value: `$${totals.totalIncome.toFixed(2)}`,
            label: "Total Income",
            color: "linear-gradient(135deg,#56ab2f,#a8e063)",
          },

          {
            id: "customers",
            icon: <BsPeople size={20} />,
            value: `${totals.customers}`,
            label: "Total Customers",
            color: "linear-gradient(135deg,#67d1ff,#47aef8)",
          },
        ].map((c) => (
          <Col xs={12} sm={6} md={3} key={c.id}>
            <motion.div
              whileHover={{ y: -6 }}
              className="d-flex align-items-center bg-white rounded-3 p-3 shadow-sm"
              style={{ gap: 12 }}
            >
              <div
                className="rounded-3 text-white d-flex align-items-center justify-content-center"
                style={{
                  width: 56,
                  height: 56,
                  background: c.color,
                }}
              >
                {c.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{c.value}</div>
                <div className="text-muted">{c.label}</div>
              </div>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Add bar */}
      <div className="bg-white rounded-3 shadow-sm p-3 mb-3 d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
        <div className="d-flex gap-2 align-items-center w-100 w-md-auto">
          <Button variant="primary" onClick={openAdd}>
            + Add Income
          </Button>

          <Form.Control
            placeholder="Search customer..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            style={{ minWidth: 200 }}
            className="d-none d-md-block"
          />
        </div>

        <div className="d-flex gap-2 align-items-center w-100 justify-content-md-end">
          <Form.Control
            type={filterDate ? "date" : "text"}
            value={filterDate}
            placeholder="Filter by date"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
              if (!filterDate) e.target.type = "text";
            }}
            onChange={(e) => {
              setFilterDate(e.target.value);
              setCurrentPage(1);
            }}
            style={{ maxWidth: 180 }}
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
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleSort("quantity")}
                >
                  Quantity{" "}
                  {sortConfig.key === "quantity"
                    ? sortConfig.dir === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleSort("total")}
                >
                  Total Amount{" "}
                  {sortConfig.key === "total"
                    ? sortConfig.dir === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleSort("date")}
                >
                  Buy Date{" "}
                  {sortConfig.key === "date"
                    ? sortConfig.dir === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th className="text-end">Actions</th>
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
                          fontWeight: 700,
                        }}
                      >
                        {initials(r.customer)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{r.customer}</div>
                        <div className="text-muted" style={{ fontSize: 12 }}>
                          {/* optional subtitle */}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      style={{
                        borderRadius: 999,
                        padding: ".25rem .6rem",
                        fontWeight: 600,
                      }}
                    >
                      {qtyLabel(r.quantity)}
                    </Button>
                  </td>

                  <td style={{ fontWeight: 700 }}>
                    ${Number(r.total).toFixed(2)}
                  </td>

                  <td>{new Date(r.date).toLocaleDateString()}</td>

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
