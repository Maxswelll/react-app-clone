"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { VscAccount } from "react-icons/vsc";
import { CiLock } from "react-icons/ci";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";


export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const[showPassword,setShowPassword]=useState(false);

  //  Show toast when redirected from logout
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("logout") ==="success") {
        toast.success("Logged out successfully!", { position: "top-center" });
      }
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    if (userId === "Admin" && password === "12345") {
      toast.success("Login successful!", { position: "top-center" });
      setTimeout(() => {
        window.location.href = "/Main-page";
      }, 1500);
    } else {
      toast.error("Invalid User ID or Password!", { position: "top-center" });
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      <div className="card shadow-lg p-4" style={{ width: "400px", borderRadius: "20px" }}>
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
            }}
            className="mt-3 fw-bold"
          >
            Baby Outfit Cambodia
          </h3>
          <p className="text-muted">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="userId" className="text-danger">
              * <span className="form-label fw-semibold text-dark">User ID</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <VscAccount  size={20} color="#00e9faff"/>
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

          <div className="mb-3">
            <label htmlFor="password" className="text-danger">
              * <span className="form-label fw-semibold text-dark">Password</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <CiLock  size={20} color="#00e9faff"/>
              </span>
              <input
                type={showPassword ? "text":"password"}
                id="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span 
              className="input-group-text bg-light" 
                style={{cursor: "poniter"}}
                onClick={() =>setShowPassword(!showPassword)}
                >
                  {showPassword? <FiEye size={15}/>:<FiEyeOff  size={15}/>}
              </span>
            </div>
          </div>

          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="rememberMe" />
            <label className="form-check-label" htmlFor="rememberMe">
              Remember me
            </label>
          </div>

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

      {/*  Toast container */}
      <ToastContainer />
    </div>
  );
}