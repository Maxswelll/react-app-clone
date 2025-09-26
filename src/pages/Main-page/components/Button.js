"use client";
import { useRouter } from "next/navigation";
import { IoMdLogOut } from "react-icons/io";

export default function Log() {
  const router = useRouter();

  const handleLogout = () => {
    // Redirect with query param
    router.push("/login?logout=success");
  };

  return (
    <button
      className="btn btn-outline-danger position-absolute top-0 end-0 m-3 rounded-4"
      onClick={handleLogout}
      style={{
        padding: "7px",
      }}
    >
      <IoMdLogOut />
      Logout
    </button>
  );
}
