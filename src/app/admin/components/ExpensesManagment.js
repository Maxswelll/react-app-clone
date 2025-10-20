// ExpenseManagement.jsx
"use client";
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Modal,
  Pagination,
} from "react-bootstrap";
import { motion } from "framer-motion";
import { CiEdit } from "react-icons/ci";
import { AiOutlineDelete, AiOutlineShoppingCart } from "react-icons/ai";
import {
  BsBag,
  BsGraphUp,
  BsPeople,
  BsCurrencyDollar,
  BsArrowUp,
  BsArrowDown,
} from "react-icons/bs";
import ExpenseStatCards from "./ExpensesCard";

// ---- use correct API base for ExpensesServer ----
const API_BASE =
  process.env.NEXT_PUBLIC_EXPENSES_API || "http://localhost:5000";

export default function ExpenseManagement() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filterType, setFilterType] = useState("All");
  const [filterDate, setFilterDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [newExpense, setNewExpense] = useState({
    type: "boost page",
    price: "",
    description: "",
    date: "",
  });

  // sorting & pagination
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // ✅ normalize rows (simplified, no timezone shift)
  const normalize = (row) => ({
    ...row,
    price: row.price != null ? String(row.price) : "",
    date: row.date || "", // already in YYYY-MM-DD from backend
  });

  // Fetch expenses
  const fetchExpenses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/expenses/expenses`);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();
      setExpenses(data.map(normalize));
    } catch (err) {
      console.error(err);
      setError("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ✅ Add expense
  const handleAddExpense = async (ev) => {
    ev.preventDefault();
    if (!newExpense.price || !newExpense.description || !newExpense.date)
      return;

    try {
      const payload = {
        type: newExpense.type,
        price: parseFloat(newExpense.price),
        description: newExpense.description,
        date: newExpense.date, // plain YYYY-MM-DD
      };

      const res = await fetch(`${API_BASE}/api/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Add failed");
      const saved = await res.json();
      setExpenses((prev) => [...prev, normalize(saved)]);
      setShowModal(false);
      setNewExpense({
        type: "boost page",
        price: "",
        description: "",
        date: "",
      });
    } catch (err) {
      console.error("Add error:", err);
      setError("Failed to add expense");
    }
  };

  // ✅ Prepare edit
  const openEdit = (e) => {
    setEditingExpense({ ...e, price: e.price != null ? String(e.price) : "" });
  };

  // ✅ Save edit
  const handleSaveEdit = async (ev) => {
    ev.preventDefault();
    if (!editingExpense) return;

    try {
      const payload = {
        type: editingExpense.type,
        price: parseFloat(editingExpense.price),
        description: editingExpense.description,
        date: editingExpense.date, // plain YYYY-MM-DD
      };

      const res = await fetch(`${API_BASE}/api/expenses/${editingExpense.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      const saved = await res.json();
      setExpenses((prev) =>
        prev.map((p) => (p.id === saved.id ? normalize(saved) : p))
      );
      setEditingExpense(null);
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update expense");
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!confirm("Delete this expense?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/expenses/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete expense");
    }
  };

  // Sorting handler
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Filter + sort pipeline
  const filteredAndSorted = expenses
    .filter((e) => (filterType === "All" ? true : e.type === filterType))
    .filter((e) => (!filterDate ? true : e.date === filterDate))
    .slice() // clone before sort
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if (sortConfig.key === "date") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else if (sortConfig.key === "price") {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSorted.length / itemsPerPage)
  );
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentExpenses = filteredAndSorted.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, filterDate, sortConfig.key, sortConfig.direction]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages || 1);
  }, [totalPages, currentPage]);

  // Totals
  const total = expenses.reduce((t, e) => t + (parseFloat(e.price) || 0), 0);
  const productTotal = expenses
    .filter((e) => e.type === "product purchase")
    .reduce((t, e) => t + (parseFloat(e.price) || 0), 0);
  const boostTotal = expenses
    .filter((e) => e.type === "boost page")
    .reduce((t, e) => t + (parseFloat(e.price) || 0), 0);
  const othersTotal = expenses
    .filter((e) => e.type === "other")
    .reduce((t, e) => t + (parseFloat(e.price) || 0), 0);

  const getTypeVariant = (type) => {
    switch (type) {
      case "boost page":
        return {
          style: {
            color: "#389e0d",
            background: "#f6ffed",
            border: "2px solid #b7eb8f",
            fontWeight: "600",
            borderRadius: "6px",
            padding: ".25rem .75rem",
          },
          label: "Boost Pages",
        };
      case "product purchase":
        return {
          style: {
            color: "#0ba1f8ff",
            background: "#fdfffbff",
            border: "2px solid #13c7efff",
            fontWeight: "600",
            borderRadius: "6px",
            padding: ".25rem .75rem",
          },
          label: "Product Purchases",
        };
      case "other":
        return {
          style: {
            color: "#e3d800ff",
            background: "#fdfffbff",
            border: "2px solid #d0c00fff",
            fontWeight: "600",
            borderRadius: "6px",
            padding: ".25rem .75rem",
          },
          label: "Others",
        };
      default:
        return {
          style: {
            color: "#f62aecff",
            background: "#fdfffbff",
            border: "2px solid #e00b96ff",
            fontWeight: "600",
            borderRadius: "6px",
            padding: ".25rem .75rem",
          },
          label: type,
        };
    }
  };

  const cards = [
    {
      id: "total",
      icon: <BsCurrencyDollar size={28} />,
      color: "linear-gradient(135deg, #f857a6, #ff5858)",
      value: `$${total.toFixed(2)}`,
      label: "Total Expenses",
      popup: "All expenses recorded in the system",
    },
    {
      id: "product",
      icon: <BsBag size={28} />,
      color: "linear-gradient(135deg, #667eea, #764ba2)",
      value: `$${productTotal.toFixed(2)}`,
      label: "Product Purchases",
      popup: "Expenses spent on buying products",
    },
    {
      id: "boost",
      icon: <BsGraphUp size={28} />,
      color: "linear-gradient(135deg, #56ab2f, #a8e063)",
      value: `$${boostTotal.toFixed(2)}`,
      label: "Boost Pages",
      popup: "Expenses spent on ads/boosts",
    },
    {
      id: "others",
      icon: <BsPeople size={28} />,
      color: "linear-gradient(135deg, #f46b45, #eea849)",
      value: `$${othersTotal.toFixed(2)}`,
      label: "Others Expenses",
      popup: "Other miscellaneous expenses",
    },
  ];

  return (
    <Container fluid className="title">
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: 10,
          marginBottom: 5,
          textAlign: "center",
        }}
      >
        <h2
          style={{ color: "#f35c96ff", fontWeight: 600, margin: "8px 0 4px 0" }}
        >
          <AiOutlineShoppingCart size={40} color="#524f4fff" /> Expense
          Management
        </h2>
        <p style={{ color: "#666", marginBottom: 30, textAlign: "center" }}>
          Track and manage all business expenses
        </p>
      </div>

      <ExpenseStatCards cards={cards} />

      {/* FILTERS */}
      <Row className="mb-3 align-items-center">
        <Col xs={12} md={3}>
          <Form.Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="boost page">Boost Page</option>
            <option value="product purchase">Product Purchase</option>
            <option value="other">Others</option>
          </Form.Select>
        </Col>
        <Col xs={12} md={3}>
          <Form.Control
            type={filterDate ? "date" : "text"}
            value={filterDate}
            placeholder="Filter by Date"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
              if (!filterDate) e.target.type = "text";
            }}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </Col>
        <Col xs={12} md="auto" className="text-md-start text-center">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              style={{
                background: "linear-gradient(to right, #f77fbe, #e84a87)",
                border: "none",
              }}
              onClick={() => setShowModal(true)}
            >
              + Add Expense
            </Button>
          </motion.div>
        </Col>
      </Row>

      {/* TABLE */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

      <div className="table-responsive mt-3">
        <motion.table
          className="table align-middle table-hover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <thead className="table-light">
            <tr>
              <th style={{ color: "#344767", fontWeight: 600 }}>Type</th>
              <th
                onClick={() => handleSort("price")}
                style={{ color: "#344767", fontWeight: 600, cursor: "pointer" }}
              >
                Price{" "}
                {sortConfig.key === "price" ? (
                  sortConfig.direction === "asc" ? (
                    <BsArrowUp />
                  ) : (
                    <BsArrowDown />
                  )
                ) : null}
              </th>
              <th style={{ color: "#344767", fontWeight: 600 }}>Description</th>
              <th
                onClick={() => handleSort("date")}
                style={{ color: "#344767", fontWeight: 600, cursor: "pointer" }}
              >
                Date{" "}
                {sortConfig.key === "date" ? (
                  sortConfig.direction === "asc" ? (
                    <BsArrowUp />
                  ) : (
                    <BsArrowDown />
                  )
                ) : null}
              </th>
              <th style={{ color: "#344767", fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentExpenses.map((e) => (
              <motion.tr
                key={e.id}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <td>
                  {(() => {
                    const { style, label } = getTypeVariant(e.type);
                    return (
                      <Button size="sm" style={style}>
                        {label}
                      </Button>
                    );
                  })()}
                </td>
                <td>${(parseFloat(e.price) || 0).toFixed(2)}</td>
                <td>{e.description}</td>
                <td>{e.date}</td>
                <td>
                  <Button
                    size="sm"
                    variant="primary"
                    className="me-2"
                    onClick={() => openEdit(e)}
                  >
                    <CiEdit /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(e.id)}
                  >
                    <AiOutlineDelete /> Delete
                  </Button>
                </td>
              </motion.tr>
            ))}

            {currentExpenses.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No expenses found
                </td>
              </tr>
            )}
          </tbody>
        </motion.table>
      </div>

      {/* PAGINATION */}
      {filteredAndSorted.length > itemsPerPage && (
        <Row className="mt-3">
          <Col className="d-flex justify-content-center">
            <Pagination>
              <Pagination.First
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item
                  key={i}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </Col>
        </Row>
      )}

      {/* EDIT MODAL */}
      <Modal
        show={!!editingExpense}
        onHide={() => setEditingExpense(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingExpense && (
            <Form onSubmit={handleSaveEdit}>
              <Form.Group className="mb-2">
                <Form.Label>Type</Form.Label>
                <Form.Select
                  value={editingExpense.type}
                  onChange={(ev) =>
                    setEditingExpense({
                      ...editingExpense,
                      type: ev.target.value,
                    })
                  }
                >
                  <option value="boost page">Boost Page</option>
                  <option value="product purchase">Product Purchase</option>
                  <option value="other">Others</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  value={editingExpense.price}
                  onChange={(ev) =>
                    setEditingExpense({
                      ...editingExpense,
                      price: ev.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={editingExpense.description}
                  onChange={(ev) =>
                    setEditingExpense({
                      ...editingExpense,
                      description: ev.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={editingExpense.date}
                  onChange={(ev) =>
                    setEditingExpense({
                      ...editingExpense,
                      date: ev.target.value,
                    })
                  }
                />
              </Form.Group>

              <div className="mt-3 text-end">
                <Button
                  variant="secondary"
                  className="me-2"
                  onClick={() => setEditingExpense(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  style={{
                    background: "linear-gradient(to right, #f77fbe, #e84a87)",
                    border: "none",
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* ADD MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Form onSubmit={handleAddExpense}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Expense</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={newExpense.type}
                onChange={(ev) =>
                  setNewExpense({ ...newExpense, type: ev.target.value })
                }
              >
                <option value="boost page">Boost Page</option>
                <option value="product purchase">Product Purchase</option>
                <option value="other">Others</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={newExpense.price}
                onChange={(ev) =>
                  setNewExpense({ ...newExpense, price: ev.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={newExpense.description}
                onChange={(ev) =>
                  setNewExpense({ ...newExpense, description: ev.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={newExpense.date}
                onChange={(ev) =>
                  setNewExpense({ ...newExpense, date: ev.target.value })
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              style={{
                background: "linear-gradient(to right, #f77fbe, #e84a87)",
                border: "none",
              }}
            >
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}
