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
    // ✅ Load username and token from localStorage
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
    // ✅ Clear session
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    setToken(null);

    // Redirect to login page
    router.push("/login?logout=success");
  };

  const handleAdmin = () => {
    router.push("/admin");
  };

  const handleSignUp = () => {
    router.push("/signup"); // ✅ Redirect to sign-up page
  };

  return (
    <div
      className="position-absolute top-0 end-0 m-3 d-flex"
      style={{ gap: "10px" }}
    >
      {/* ✅ If not logged in → Show Sign Up button */}
      {!token && (
        <button
          type="button"
          class="btn btn-outline-info"
          onClick={handleSignUp}
          style={{ padding: "7px", cursor: "pointer" }}
        >
          Sign Up <TbPlayerTrackNextFilled size={20} height={7} />
        </button>
      )}

      {/* ✅ If logged in → Show Admin (only for Heang) + Logout */}
      {token && (
        <>
          {username === "Heang" && (
            <button
              className="btn btn-primary rounded-3"
              onClick={handleAdmin}
              style={{ padding: "7px", cursor: "pointer" }}
            >
              <IoSpeedometerOutline size={20} /> Admin
            </button>
          )}

          <button
            className="btn btn-outline-danger rounded-3"
            onClick={handleLogout}
            style={{ padding: "7px", cursor: "pointer" }}
          >
            <IoMdLogOut size={20} /> Logout
          </button>
        </>
      )}
    </div>
  );
}
