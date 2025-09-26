import { useEffect, useState } from "react";
import { Container, Button, Card, Form } from "react-bootstrap";
import { BsCaretRightFill } from "react-icons/bs";
import { BsCaretDownFill } from "react-icons/bs";

export default function Filters() {
  const [showIcon, setIcon] = useState(false);
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <div>
      <Container>
        <Card className="shadow-sm p-4">
          <h5 className="mb-3" id="headingOne">
            <button
              className="btn fw-normal "
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseExample"
              aria-expanded="false"
              aria-controls="collapseExample"
              onClick={() => setIcon(!showIcon)}
              style={{
                color: "#8c8c8c",
                margin: "0",
                weight: "600",
                display: "flex",
                align: "center",
                gap: "8px",
              }}
            >
              <p
                style={{
                  margin: "0",
                  color: "#262626",
                }}
                className="Filters"
              >
                Filters
              </p>
              {showIcon ? <BsCaretDownFill /> : <BsCaretRightFill />}
            </button>
          </h5>
          <div className="collapse" id="collapseExample">
            {/* Type */}
            <div className="mb-3">
              <label className="form-label fw-bold">TYPE:</label>
              <div className="d-flex flex-wrap gap-2">
                <Button variant="outline-primary rounded-3" size="sm">
                  Dress
                </Button>
                <Button variant="outline-primary rounded-3" size="sm">
                  Jumpsuit
                </Button>
                <Button variant="outline-primary rounded-3" size="sm">
                  Pyjama
                </Button>
                <Button variant="outline-primary rounded-3" size="sm">
                  Shirt
                </Button>
                <Button variant="outline-primary rounded-3" size="sm">
                  ShirtAndShort
                </Button>
              </div>
            </div>

            {/* Size */}
            <div className="mb-3">
              <label className="form-label fw-bold">SIZE:</label>
              <div className="d-flex flex-wrap gap-2">
                <Button variant="outline-secondary rounded-3" size="sm">
                  66 (56-65 cm, 3-6 kg)
                </Button>
                <Button variant="outline-secondary rounded-3" size="sm">
                  73 (65-73 cm, 6-9 kg)
                </Button>
                <Button variant="outline-secondary rounded-3" size="sm">
                  80 (73-81 cm, 9-11 kg)
                </Button>
                <Button variant="outline-secondary rounded-3" size="sm">
                  90 (81-91 cm, 11-13 kg)
                </Button>
                <Button variant="outline-secondary rounded-3 " size="sm">
                  100 (91-101 cm, 13-15 kg)
                </Button>
                <Button variant="outline-secondary rounded-3" size="sm">
                  110 (101-110 cm, 15-17 kg)
                </Button>
              </div>
            </div>

            {/* Stock */}
            <div className="mb-3">
              <label className="form-label fw-bold">STOCK:</label>
              <span>ℹ️</span>
              <Form>
                <Form.Check type="switch" id="stockSwitch" label="In stock" />
              </Form>
            </div>
            {/*line*/}
            <div className="border-top my-3"></div>

            {/* Product count */}
            <p className="text-muted small hr">showing 20 of 138 products</p>
          </div>
        </Card>
      </Container>
    </div>
  );
}
