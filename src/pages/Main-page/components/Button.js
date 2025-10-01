"use client";
import { useRouter } from "next/navigation";
import { IoMdLogOut } from "react-icons/io";
import { IoSpeedometerOutline } from "react-icons/io5";

export default function Log() {
  const router = useRouter();

  const handleLogout = () => {
    // Redirect with query param
    router.push("/login?logout=success");
  };

  const handleAdmin = () => {
    router.push("/admin"); // redirect to /admin page
  };

  return (
    <div
      className=" position-absolute top-0 end-0 m-3 d-flex"
      style={{ gap: "10px" }}
    >
      {/* Admin Button */}
      <button
        className="btn btn-primary rounded-3"
        onClick={handleAdmin}
        style={{ padding: "7px" }}
      >
        <IoSpeedometerOutline size={20} /> Admin
      </button>

      {/* Logout Button */}
      <button
        className="btn btn-outline-danger rounded-3"
        onClick={handleLogout}
        style={{ padding: "7px" }}
      >
        <IoMdLogOut size={20} /> Logout
      </button>
    </div>
  );
}
