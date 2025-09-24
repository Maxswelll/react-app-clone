import { Navbar, Container, Button } from "react-bootstrap";
export default function Header() {
  return (
    <Navbar bg="light" className="shadow-sm mb-4 ">
      <Container className="d-flex  ">
        <div className="row align-items-start">
          <img
            src="https://babyoutfitcambodia.netlify.app/assets/profile_image1.png"
            alt="Logo"
            className="mb-auto rounded-5  "
            style={{
              width: "48px",
              height: "48px",
              objectFit: "cover",
              border: "2px solid #ddd",
            }}
          ></img>
          <div className="col">
            <h4 className="ms-auto fw-bold ">Baby Outfit Cambodia</h4>
            <small className="ms-auto text-muted">Premium Baby Clothes</small>
          </div>
        </div>
        <Button variant="outline-danger">Logout</Button>
      </Container>
    </Navbar>
  );
}
