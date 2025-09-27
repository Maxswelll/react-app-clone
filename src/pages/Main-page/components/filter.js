"use client";
import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Collapse,
} from "react-bootstrap";
import { BsCaretRightFill, BsCaretDownFill } from "react-icons/bs";

export default function Filters({ filters, setFilters }) {
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  // Reset all filters (show all products)
  const showAllProducts = () => {
    setFilters({ type: "", size: "", stock: "", search: "" });
  };

  return (
    <Container>
      <Card className="shadow-sm p-4 position-relative">
        {/* Show All Products Button (TOP RIGHT) */}
        <Button
          className="btn btn-success position-absolute"
          style={{ top: "15px", right: "15px" }}
          onClick={showAllProducts}
        >
          Show All Products
        </Button>

        {/* Main Filter Toggle */}
        <h5 className="mb-3">
          <button
            className="btn fw-bold"
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            style={{
              color: "#262626",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            Filters
            {showFilters ? <BsCaretDownFill /> : <BsCaretRightFill />}
          </button>
        </h5>

        <Collapse in={showFilters}>
          <div>
            {/* Type */}
            <div className="mb-3">
              <Form.Label className="fw-bold">Type:</Form.Label>
              <Form.Select
                value={filters.type}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, type: e.target.value }))
                }
              >
                <option value="">Select types</option>
                <option value="dress">Dress</option>
                <option value="jumpsuit">Jumpsuit</option>
                <option value="pyjama">Pyjama</option>
                <option value="shirt">Shirt</option>
                <option value="shirtandshort">Shirt & Short</option>
              </Form.Select>
            </div>

            {/* Size */}
            <div className="mb-3">
              <Form.Label className="fw-bold">Size:</Form.Label>
              <Form.Select
                value={filters.size}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, size: e.target.value }))
                }
              >
                <option value="">Select sizes</option>
                <option value="66">66 (56-65 cm, 3-6 kg)</option>
                <option value="73">73 (65-73 cm, 6-9 kg)</option>
                <option value="80">80 (73-81 cm, 9-11 kg)</option>
                <option value="90">90 (81-91 cm, 11-13 kg)</option>
                <option value="100">100 (91-101 cm, 13-15 kg)</option>
                <option value="110">110 (101-110 cm, 15-17 kg)</option>
              </Form.Select>
            </div>

            {/* Stock */}
            <div className="mb-3">
              <Form.Label className="fw-bold">Stock:</Form.Label>
              <Form.Select
                value={filters.stock}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, stock: e.target.value }))
                }
              >
                <option value="">Select stock status</option>
                <option value="in">In Stock</option>
                <option value="out">Out of Stock</option>
              </Form.Select>
            </div>

            {/* Search */}
            <Row className="align-items-center mt-3">
              <Col xs={9}>
                <Form.Control
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                />
              </Col>
              <Col xs={3} className="text-end">
                <Button
                  variant="primary"
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, search: filters.search }))
                  }
                >
                  Search
                </Button>
              </Col>
            </Row>
          </div>
        </Collapse>
      </Card>
    </Container>
  );
}
