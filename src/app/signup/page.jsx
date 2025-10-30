"use client";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { VscAccount } from "react-icons/vsc";
import { CiLock } from "react-icons/ci";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    // ✅ Simple password check
    if (password !== confirm) {
      toast.error("Passwords do not match!", { position: "top-center" });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Account created successfully! Redirecting...", {
          position: "top-center",
        });
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        toast.error(data.message || "Failed to register user.", {
          position: "top-center",
        });
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Server error. Try again later.", { position: "top-center" });
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ width: "400px", borderRadius: "20px" }}
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
            }}
            className="mt-3 fw-bold"
          >
            Baby Outfit Cambodia
          </h3>
          <p className="text-muted">Create a new account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup}>
          {/* Username */}
          <div className="mb-3">
            <label htmlFor="username" className="text-danger">
              *{" "}
              <span className="form-label fw-semibold text-dark">Username</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <VscAccount size={20} color="#00e9faff" />
              </span>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Enter a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="text-danger">
              *{" "}
              <span className="form-label fw-semibold text-dark">Password</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <CiLock size={20} color="#00e9faff" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="input-group-text bg-light"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEye size={15} /> : <FiEyeOff size={15} />}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label htmlFor="confirm" className="text-danger">
              *{" "}
              <span className="form-label fw-semibold text-dark">
                Confirm Password
              </span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <CiLock size={20} color="#00e9faff" />
              </span>
              <input
                type={showConfirm ? "text" : "password"}
                id="confirm"
                className="form-control"
                placeholder="Re-enter your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <span
                className="input-group-text bg-light"
                style={{ cursor: "pointer" }}
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FiEye size={15} /> : <FiEyeOff size={15} />}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold"
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              border: "none",
            }}
          >
            Sign Up
          </button>
        </form>

        {/* Link to Login */}
        <p className="text-center mt-3 mb-0">
          Already have an account?{" "}
          <a href="/login" style={{ textDecoration: "none", color: "#007bff" }}>
            Login here
          </a>
        </p>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
