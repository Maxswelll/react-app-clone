"use client";
import { useRouter } from "next/navigation";
import { IoMdLogOut } from "react-icons/io";
import { SiPhpmyadmin } from "react-icons/si";

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
        className="btn btn-primary rounded-4"
        onClick={handleAdmin}
        style={{ padding: "7px" }}
      >
        <SiPhpmyadmin />
        Admin
      </button>

      {/* Logout Button */}
      <button
        className="btn btn-outline-danger rounded-4"
        onClick={handleLogout}
        style={{ padding: "7px" }}
      >
        <IoMdLogOut />
        Logout
      </button>
    </div>
  );
}
