"use client";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { VscAccount } from "react-icons/vsc";
import { CiLock } from "react-icons/ci";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!userId || !password) {
      toast.warning("Please fill in both fields.", { position: "top-center" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userId, password }),
      });

      const data = await res.json();
      console.log("🧾 Login response:", data);

      if (res.ok) {
        // Save token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);

        // Save token expiry (1 hour)
        const expiryTime = Date.now() + 60 * 60 * 1000;
        localStorage.setItem("tokenExpiry", expiryTime.toString());

        toast.success("Login successful!", { position: "top-center" });

        // ✅ Fetch role-based message automatically
        const authHeader = { Authorization: `Bearer ${data.token}` };

        // If admin, fetch /api/admin
        if (data.role === "admin") {
          const adminRes = await fetch("http://localhost:5000/admin", {
            headers: authHeader,
          });
          const adminData = await adminRes.json();
          console.log("Admin Route:", adminData);
        } else {
          // Otherwise, fetch /api/user
          const userRes = await fetch("http://localhost:5000/user", {
            headers: authHeader,
          });
          const userData = await userRes.json();
          console.log("User Route:", userData);
        }

        // Redirect after short delay
        setTimeout(() => {
          window.location.href = "/Main-page";
        }, 1500);
      } else {
        toast.error(data.message || "Invalid username or password!", {
          position: "top-center",
        });
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      toast.error("Server error. Try again later.", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
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
                <VscAccount size={20} color="#00e9faff" />
              </span>
              <input
                type="text"
                id="userId"
                className="form-control"
                placeholder="Enter your user ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value.trim())} // trim spaces
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

          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="rememberMe" />
            <label className="form-check-label" htmlFor="rememberMe">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", border: "none" }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
}
