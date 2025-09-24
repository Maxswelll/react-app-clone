"use cilent";
import { useRouter } from "next/navigation";

export default function Log() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    router.push("/login");
  };
  return (
    <button
      className="btn btn-outline-danger position-absolute top-0 end-0 m-3"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}
