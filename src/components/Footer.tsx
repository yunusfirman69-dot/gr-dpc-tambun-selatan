"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { organizationInfo } from "@/data/placeholder";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t-2 border-[#ff491a] bg-[#090909] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white p-1">
                <Image
                  src="/images/logo.png"
                  alt="Logo Partai Gerakan Rakyat"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-extrabold tracking-wide text-white">
                  PARTAI GERAKAN RAKYAT
                </p>
                <p className="text-xs font-semibold text-[#ff491a]">
                  DPC Tambun Selatan
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-neutral-400">
              {organizationInfo.tagline}. Bersama membangun gerakan warga yang
              solid, transparan, dan gotong royong di {organizationInfo.region}.
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#ffc3b3]">
              Navigasi
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-neutral-300">
              <li>
                <Link href="/" className="transition-colors hover:text-[#ff491a]">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/profil" className="transition-colors hover:text-[#ff491a]">
                  Profil DPC
                </Link>
              </li>
              <li>
                <Link href="/pengurus" className="transition-colors hover:text-[#ff491a]">
                  Struktur Pengurus
                </Link>
              </li>
              <li>
                <Link href="/program-kerja" className="transition-colors hover:text-[#ff491a]">
                  Program Kerja
                </Link>
              </li>
            </ul>
          </div>

          {/* Informasi */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#ffc3b3]">
              Informasi Publik
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-neutral-300">
              <li>
                <Link href="/berita" className="transition-colors hover:text-[#ff491a]">
                  Berita & Pengumuman
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="transition-colors hover:text-[#ff491a]">
                  Galeri Kegiatan
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="transition-colors hover:text-[#ff491a]">
                  Kontak Sekretariat
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="transition-colors hover:text-[#ff491a]">
                  Portal Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Sekretariat */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#ffc3b3]">
              Sekretariat DPC
            </h3>
            <div className="mt-4 space-y-2.5 text-sm text-neutral-400">
              <p>{organizationInfo.contact.address}</p>
              <p>Email: {organizationInfo.contact.email}</p>
              <p>Jam Layanan: {organizationInfo.contact.hours}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {organizationInfo.contact.socials.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.href}
                  className="rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-medium text-neutral-300 transition-colors hover:border-[#ff491a] hover:text-[#ff491a]"
                >
                  {soc.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-6 text-xs text-neutral-500 sm:flex-row">
          <p>
            © 2026 {organizationInfo.partyName} — {organizationInfo.unitName},{" "}
            {organizationInfo.region}.
          </p>
          <p>Dibangun untuk transparansi & pelayanan informasi publik.</p>
        </div>
      </div>
    </footer>
  );
}
