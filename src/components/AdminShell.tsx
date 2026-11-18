"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const adminNav = [
  { href: "/admin", label: "Ringkasan" },
  { href: "/admin/berita", label: "Upload & Kelola Berita" },
  { href: "/admin/galeri", label: "Upload & Kelola Galeri" },
  { href: "/admin/program-kerja", label: "Kelola Program Kerja" },
  { href: "/admin/pengurus", label: "Kelola Pengurus" },
  { href: "/admin/kontak", label: "Kelola Kontak" },
];

export default function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f7f2ee]">
      <header className="border-b border-neutral-800 bg-[#090909] text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white p-1">
              <Image
                src="/images/logo.png"
                alt="Logo Partai Gerakan Rakyat"
                width={36}
                height={36}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-extrabold tracking-wide">
                DASHBOARD ADMIN DPC
              </p>
              <p className="text-xs text-[#ffc3b3]">
                Tambun Selatan • {email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-neutral-700 px-4 py-2 text-xs font-bold text-neutral-200 transition-colors hover:border-[#ff491a] hover:text-white"
            >
              Lihat Website
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-full bg-[#ff491a] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#e03a0e] disabled:opacity-50"
            >
              {loggingOut ? "Keluar..." : "Logout"}
            </button>
          </div>
        </div>

        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto border-t border-neutral-800 px-4 py-2.5 sm:px-6 lg:px-8">
          {adminNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold transition-colors ${
                  active
                    ? "bg-[#ff491a] text-white"
                    : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
