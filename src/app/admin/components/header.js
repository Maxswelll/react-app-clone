"use client";
import { Navbar, Container } from "react-bootstrap";
import { IoMdLogOut } from "react-icons/io";
import { LiaBusinessTimeSolid } from "react-icons/lia";
import { useRouter } from "next/navigation";

export default function Header({ onLogout }) {
  const router = useRouter();

  return (
    <Navbar bg="light" className="shadow-sm mb-4">
      <Container className="d-flex justify-content-between align-items-center">
        {/* Logo + Brand */}
        <div className="d-flex align-items-center">
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
        <div>
          <button
            className="btn btn-outline-primary me-2"
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
