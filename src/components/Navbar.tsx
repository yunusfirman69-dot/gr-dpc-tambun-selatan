"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/pengurus", label: "Pengurus" },
  { href: "/program-kerja", label: "Program Kerja" },
  { href: "/berita", label: "Berita" },
  { href: "/galeri", label: "Galeri" },
  { href: "/kontak", label: "Kontak" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((data: { authenticated?: boolean }) => {
        setIsAdminLoggedIn(Boolean(data.authenticated));
      })
      .catch(() => {});
  }, [pathname]);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#e7deda] bg-white/95 backdrop-blur-md">
      <div className="h-1 w-full bg-gradient-to-r from-[#ff491a] via-[#ff491a] to-[#090909]" />
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
          onClick={() => setMobileOpen(false)}
        >
          <Image
            src="/images/logo.png"
            alt="Logo Partai Gerakan Rakyat"
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 object-contain"
            priority
          />
          <div className="leading-tight">
            <span className="block text-sm font-extrabold tracking-wide text-[#090909] sm:text-base">
              PARTAI GERAKAN RAKYAT
            </span>
            <span className="block text-[11px] font-semibold tracking-wide text-[#ff491a]">
              DPC TAMBUN SELATAN
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-[#f7f2ee] text-[#ff491a]"
                    : "text-[#090909]/80 hover:bg-[#f7f2ee] hover:text-[#090909]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <Link
            href="/anggota/login"
            className="rounded-full border border-[#090909] px-4 py-2 text-xs font-bold text-[#090909] transition-colors hover:bg-[#090909] hover:text-white"
          >
            Login Anggota
          </Link>
          <Link
            href={isAdminLoggedIn ? "/admin" : "/admin/login"}
            className="rounded-full bg-[#ff491a] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#e03a0e]"
          >
            {isAdminLoggedIn ? "Dashboard Admin" : "Admin"}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          aria-expanded={mobileOpen}
          className="inline-flex items-center justify-center rounded-lg border border-[#e7deda] p-2 text-[#090909] transition-colors hover:bg-[#f7f2ee] lg:hidden"
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-[#e7deda] bg-white px-4 pb-5 pt-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-[#f7f2ee] text-[#ff491a]"
                      : "text-[#090909] hover:bg-[#f7f2ee]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/anggota/login"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-full border border-[#090909] px-5 py-2.5 text-center text-sm font-bold text-[#090909] transition-colors hover:bg-[#090909] hover:text-white"
            >
              Login Anggota
            </Link>
            <Link
              href={isAdminLoggedIn ? "/admin" : "/admin/login"}
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-full bg-[#ff491a] px-5 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-[#e03a0e]"
            >
              {isAdminLoggedIn ? "Dashboard Admin" : "Login Admin"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
