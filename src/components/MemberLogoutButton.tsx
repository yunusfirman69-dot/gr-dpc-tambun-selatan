"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MemberLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/anggota/logout", { method: "POST" });
    router.push("/anggota/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-full bg-[#090909] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
    >
      {loading ? "Keluar..." : "Logout Anggota"}
    </button>
  );
}
