"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdLogOut } from "react-icons/io";
import { IoSpeedometerOutline } from "react-icons/io5";
import { TbPlayerTrackNextFilled } from "react-icons/tb";

export default function Log() {
  const router = useRouter();
  const [username, setUsername] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUsername(storedUser);
      setToken(storedToken);
    } else {
      setUsername(null);
      setToken(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    setToken(null);
    router.push("/login?logout=success");
  };

  const handleAdmin = () => router.push("/admin");
  const handleSignUp = () => router.push("/signup");

  return (
    <div
      className="position-absolute top-0 end-0 m-3 d-flex flex-wrap justify-content-end align-items-center"
      style={{
        gap: "10px",
        zIndex: 1050,
        maxWidth: "100%",
      }}
    >
      {/* ✅ Show Sign Up if not logged in */}
      {!token && (
        <button
          type="button"
          className="btn btn-outline-info d-flex align-items-center justify-content-center"
          onClick={handleSignUp}
          style={{
            padding: "6px 10px",
            minWidth: "90px",
            fontSize: "14px",
            whiteSpace: "nowrap",
          }}
        >
          <span className="me-1">Sign Up</span>
          <TbPlayerTrackNextFilled size={18} />
        </button>
      )}

      {/* ✅ Show Admin + Logout if logged in */}
      {token && (
        <>
          {username === "Heang" && (
            <button
              className="btn btn-primary d-flex align-items-center justify-content-center rounded-3"
              onClick={handleAdmin}
              style={{
                padding: "6px 10px",
                minWidth: "90px",
                fontSize: "14px",
                whiteSpace: "nowrap",
              }}
            >
              <IoSpeedometerOutline size={18} className="me-1" /> Admin
            </button>
          )}

          <button
            className="btn btn-outline-danger d-flex align-items-center justify-content-center rounded-3"
            onClick={handleLogout}
            style={{
              padding: "6px 10px",
              minWidth: "90px",
              fontSize: "14px",
              whiteSpace: "nowrap",
            }}
          >
            <IoMdLogOut size={18} className="me-1" /> Logout
          </button>
        </>
      )}
    </div>
  );
}
