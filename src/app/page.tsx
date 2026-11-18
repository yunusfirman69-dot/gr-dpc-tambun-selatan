import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import {
  organizationInfo,
  pillars,
  programsPlaceholder,
} from "@/data/placeholder";
import { getNewsPosts } from "@/lib/content-store";

async function LatestNewsGrid() {
  await connection();
  const posts = (await getNewsPosts()).slice(0, 3);

  return (
    <div className="mt-10 grid gap-6 md:grid-cols-3">
      {posts.map((post) => (
        <article
          key={post.slug}
          className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e7deda] bg-[#f7f2ee]/50 transition-all hover:border-[#ff491a]/50 hover:bg-white hover:shadow-md"
        >
          <div>
            {post.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.imageUrl}
                alt={post.title}
                className="aspect-[16/9] w-full object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="rounded-full bg-[#ffc3b3]/50 px-3 py-1 font-bold text-[#ff491a]">
                  {post.category}
                </span>
                <span className="font-medium text-[#8d6a5e]">
                  {post.publishedAt}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-extrabold leading-snug text-[#090909]">
                <Link
                  href={`/berita/${post.slug}`}
                  className="transition-colors hover:text-[#ff491a]"
                >
                  {post.title}
                </Link>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#8d6a5e]">
                {post.excerpt}
              </p>
            </div>
          </div>

          <div className="border-t border-[#e7deda] px-6 py-4">
            <Link
              href={`/berita/${post.slug}`}
              className="text-sm font-bold text-[#090909] transition-colors hover:text-[#ff491a]"
            >
              Baca Selengkapnya →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-neutral-800 bg-gradient-to-br from-[#090909] via-[#150f0d] to-[#2e1208] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#ff491a]/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-[#ff491a]/15 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-28">
          <div className="space-y-6 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ff491a]/40 bg-[#ff491a]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#ffc3b3]">
              <span className="h-2 w-2 rounded-full bg-[#ff491a]" />
              {organizationInfo.unitName} • {organizationInfo.region}
            </div>

            <h1 className="text-4xl font-black uppercase leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Partai{" "}
              <span className="text-[#ff491a]">Gerakan Rakyat</span>
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-neutral-300 sm:text-lg">
              {organizationInfo.tagline}. Portal informasi resmi Dewan Pimpinan
              Cabang Kecamatan Tambun Selatan untuk menyampaikan profil
              organisasi, program kerja, berita kegiatan, serta saluran aspirasi
              masyarakat.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/program-kerja"
                className="rounded-full bg-[#ff491a] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#ff491a]/30 transition-all hover:bg-[#e03a0e]"
              >
                Lihat Program Kerja
              </Link>
              <Link
                href="/profil"
                className="rounded-full border border-neutral-700 bg-neutral-900/70 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:border-[#ff491a] hover:text-[#ffc3b3]"
              >
                Profil & Visi Misi
              </Link>
            </div>
          </div>

          {/* Right Identity Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/95 p-7 shadow-2xl">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#ff491a]">
                    Wilayah Kerja
                  </p>
                  <p className="mt-1 text-xl font-extrabold text-white">
                    Kecamatan Tambun Selatan
                  </p>
                </div>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5">
                  <Image
                    src="/images/logo.png"
                    alt="Logo Partai Gerakan Rakyat"
                    width={48}
                    height={48}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-neutral-800 bg-[#090909]/80 p-4">
                  <p className="text-2xl font-black text-[#ff491a]">10</p>
                  <p className="mt-1 text-xs font-medium text-neutral-400">
                    Desa & Kelurahan Wilayah Ranting
                  </p>
                </div>
                <div className="rounded-2xl border border-neutral-800 bg-[#090909]/80 p-4">
                  <p className="text-2xl font-black text-white">100%</p>
                  <p className="mt-1 text-xs font-medium text-neutral-400">
                    Komitmen Gotong Royong Warga
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-[#ff491a]/30 bg-[#ff491a]/10 p-4 text-xs leading-relaxed text-[#ffc3b3]">
                <span className="font-bold text-white">Landasan Gerakan:</span>{" "}
                Pancakarya & Panca Dharma Partai Gerakan Rakyat menuju
                Tambun Selatan yang adil, makmur, dan berdaya.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOUR PILLARS SECTION */}
      <section className="border-b border-[#e7deda] bg-gradient-to-b from-white to-[#f7f2ee] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#ff491a]">
              Arah Gerakan DPC
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#090909] sm:text-4xl">
              Empat Pilar Pengabdian di Tambun Selatan
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => (
              <div
                key={pillar.number}
                className="group rounded-2xl border border-[#e7deda] bg-white p-6 transition-all hover:-translate-y-1 hover:border-[#ff491a]/50 hover:shadow-lg"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7f2ee] text-sm font-black text-[#ff491a] transition-colors group-hover:bg-[#ff491a] group-hover:text-white">
                  {pillar.number}
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-[#090909]">
                  {pillar.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#8d6a5e]">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. VISI UTAMA & HALUAN GERAKAN BANNER */}
      <section className="relative overflow-hidden border-y border-neutral-800 bg-[#090909] py-20 text-center text-white">
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffc3b3]">
            Visi Utama Partai Gerakan Rakyat
          </p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            <span className="text-[#ff491a]">
              {organizationInfo.visiMisiResmi.visiUtama}
            </span>
          </h2>
          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-900/90 px-6 py-5 shadow-lg">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ffc3b3]">
              Haluan Gerakan
            </p>
            <p className="mt-1.5 text-lg font-extrabold text-white sm:text-2xl">
              {organizationInfo.visiMisiResmi.haluanGerakan}
            </p>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-neutral-300 sm:text-base">
            &ldquo;Kekuatan Utama Rakyat adalah Gotong Royong.&rdquo;
          </p>
          <div className="mt-7">
            <Link
              href="/profil"
              className="inline-flex items-center gap-2 rounded-full border border-[#ff491a]/50 bg-[#ff491a]/15 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#ffc3b3] transition-colors hover:bg-[#ff491a] hover:text-white"
            >
              Lihat 5 Agenda, Panca Dharma & Lima Jalan →
            </Link>
          </div>
        </div>
      </section>

      {/* 4. BERITA & AKTIVITAS */}
      <section className="border-b border-[#e7deda] bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#ff491a]">
                Pembaruan Terkini
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#090909] sm:text-4xl">
                Berita & Aktivitas DPC
              </h2>
            </div>
            <Link
              href="/berita"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#ff491a] transition-colors hover:text-[#e03a0e]"
            >
              Lihat Semua Berita
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <Suspense
            fallback={
              <div className="mt-10 text-sm text-[#8d6a5e]">
                Memuat berita terbaru...
              </div>
            }
          >
            <LatestNewsGrid />
          </Suspense>
        </div>
      </section>

      {/* 5. PROGRAM KERJA PREVIEW */}
      <section className="bg-[#f7f2ee] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#ff491a]">
                Agenda Nyata
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#090909] sm:text-4xl">
                Program Kerja DPC
              </h2>
            </div>
            <Link
              href="/program-kerja"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#ff491a] transition-colors hover:text-[#e03a0e]"
            >
              Semua Program Kerja →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {programsPlaceholder.map((prog) => (
              <div
                key={prog.id}
                className="rounded-2xl border border-[#e7deda] bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8d6a5e]">
                    {prog.category}
                  </span>
                  <span className="rounded-full bg-[#ff491a]/10 px-3 py-1 text-xs font-bold text-[#ff491a]">
                    {prog.status}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-extrabold text-[#090909]">
                  {prog.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#8d6a5e]">
                  {prog.summary}
                </p>
                <p className="mt-4 text-xs font-semibold text-[#090909]">
                  Cakupan: <span className="text-[#8d6a5e]">{prog.targetArea}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CLOSING CTA BANNER */}
      <section className="bg-gradient-to-r from-[#ff491a] via-[#d9390f] to-[#090909] py-16 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-black tracking-tight sm:text-4xl">
              Bersinergi Bangun Tambun Selatan
            </h2>
            <p className="mt-2 text-sm text-white/90 sm:text-base">
              Sampaikan aspirasi, saran, atau hubungi Sekretariat DPC Partai
              Gerakan Rakyat Kecamatan Tambun Selatan.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/kontak"
              className="rounded-full bg-[#090909] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-neutral-800"
            >
              Hubungi Sekretariat
            </Link>
            <Link
              href="/pengurus"
              className="rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#ff491a] transition-colors hover:bg-[#f7f2ee]"
            >
              Struktur Pengurus
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
