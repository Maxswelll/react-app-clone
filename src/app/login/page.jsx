"use client";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { VscAccount } from "react-icons/vsc";
import { CiLock } from "react-icons/ci";


export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null); //  for showing alerts

  const handleLogin = (e) => {
    e.preventDefault();

    if (userId === "Admin" && password === "12345") {
      //  Successful login
      setAlert({ type: "success", message: "Login successful!" });
      setTimeout(() => {
        window.location.href = "/Main-page"; // redirect after success
      }, 1500);
    } else {
      //  Failed login
      setAlert({ type: "danger", message: "Invalid User ID or Password!" });
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Card */}
      <div
        className="card shadow-lg p-4"
        style={{ width: "400px", borderRadius: "20px", zIndex: 10 }}
      >
        {/* Logo */}
        <div className="text-center mb-4">
          <img
            src="https://babyoutfitcambodia.netlify.app/assets/profile_image1.png"
            alt="Logo"
            className="rounded-circle border p-2"
            style={{ width: "100px", height: "130px" }}
          />
          <h3
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
            }}
            className="mt-3 fw-bold"
          >
            Baby Outfit Cambodia
          </h3>
          <p className="text-muted">Sign in to your account</p>
        </div>

        {/*  Alert Message */}
        {alert && (
          <div className={`alert alert-${alert.type} text-center`} role="alert">
            {alert.message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* User ID */}
          <div className="mb-3">
            <label htmlFor="userId" className="text-danger">
              * <span className="form-label fw-semibold text-dark">User ID</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <VscAccount />
              </span>
              <input
                type="text"
                id="userId"
                className="form-control"
                placeholder="Enter your user ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="text-danger">
              * <span className="form-label fw-semibold text-dark">Password</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <CiLock />
              </span>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Remember me */}
          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="rememberMe" />
            <label className="form-check-label" htmlFor="rememberMe">
              Remember me
            </label>
          </div>

          {/* Sign In button */}
          <button
            type="submit"
          className="btn btn-primary w-100 fw-semibold"
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              border: "none",
            }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}