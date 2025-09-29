"use client";
import { Navbar, Container } from "react-bootstrap";
import { IoMdLogOut } from "react-icons/io";
import { LiaBusinessTimeSolid } from "react-icons/lia";
import { useRouter } from "next/navigation";

export default function Header({ onLogout }) {
  const router = useRouter();

  return (
    <Navbar bg="light" expand="md" className="shadow-sm mb-4">
      <Container className="flex-column flex-md-row justify-content-between align-items-center gap-3">
        {/* Logo + Brand */}
        <div className="d-flex align-items-center text-center text-md-start">
          <img
            src="https://babyoutfitcambodia.netlify.app/assets/profile_image1.png"
            alt="Logo"
            className="rounded-5 me-3"
            style={{
              width: "48px",
              height: "48px",
              objectFit: "cover",
              border: "2px solid #ddd",
              padding: "5px",
            }}
          />
          <div
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            <h4 className="fw-bold mb-0">Baby Outfit Cambodia</h4>
            <small className="text-muted">Premium Baby Clothes</small>
          </div>
        </div>

        {/* Buttons */}
        <div className="d-flex flex-column flex-md-row gap-2">
          <button
            className="btn btn-outline-primary"
            onClick={() => router.push("/Main-page")}
          >
            <LiaBusinessTimeSolid size={20} /> Products
          </button>
          <button className="btn btn-outline-danger" onClick={onLogout}>
            <IoMdLogOut size={20} /> Logout
          </button>
        </div>
      </Container>
    </Navbar>
  );
}
