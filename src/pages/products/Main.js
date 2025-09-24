"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BabyOutfitPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    router.push("/login");
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Welcome to Baby Outfit Page 👶</h1>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <p>This is your main page after login.</p>
    </div>
  );
}
