import Link from "next/link";
import { redirect } from "next/navigation";
import MemberLogoutButton from "@/components/MemberLogoutButton";
import PageHeader from "@/components/PageHeader";
import { getMemberSession } from "@/lib/admin-auth";
import { getMemberByEmail } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function AnggotaPortalPage() {
  const session = await getMemberSession();
  if (!session) {
    redirect("/anggota/login");
  }

  const member = await getMemberByEmail(session.email);

  return (
    <div>
      <PageHeader
        badge="Portal Anggota"
        title={`Selamat Datang, ${session.fullName}`}
        description="Halaman khusus anggota terdaftar Partai Gerakan Rakyat DPC Tambun Selatan, Kabupaten Bekasi."
      />

      <section className="mx-auto max-w-5xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#e7deda] bg-white p-7 shadow-sm sm:p-9">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e7deda] pb-5">
            <div>
              <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                Status: Terdaftar sebagai Anggota
              </span>
              <h2 className="mt-2 text-2xl font-black text-[#090909]">
                Kartu Data Keanggotaan
              </h2>
            </div>
            <MemberLogoutButton />
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#e7deda] bg-[#f7f2ee]/50 p-4">
              <p className="text-xs font-bold uppercase text-[#8d6a5e]">
                Nama Lengkap
              </p>
              <p className="mt-1 text-base font-extrabold text-[#090909]">
                {member?.fullName || session.fullName}
              </p>
            </div>

            <div className="rounded-2xl border border-[#e7deda] bg-[#f7f2ee]/50 p-4">
              <p className="text-xs font-bold uppercase text-[#8d6a5e]">
                Email Terdaftar
              </p>
              <p className="mt-1 text-base font-bold text-[#090909]">
                {member?.email || session.email}
              </p>
            </div>

            {member && (
              <>
                <div className="rounded-2xl border border-[#e7deda] bg-[#f7f2ee]/50 p-4">
                  <p className="text-xs font-bold uppercase text-[#8d6a5e]">
                    No. HP / WhatsApp
                  </p>
                  <p className="mt-1 text-base font-bold text-[#090909]">
                    {member.phone}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e7deda] bg-[#f7f2ee]/50 p-4">
                  <p className="text-xs font-bold uppercase text-[#8d6a5e]">
                    Desa / Kelurahan
                  </p>
                  <p className="mt-1 text-base font-bold text-[#090909]">
                    {member.village}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e7deda] bg-[#f7f2ee]/50 p-4">
                  <p className="text-xs font-bold uppercase text-[#8d6a5e]">
                    NIK
                  </p>
                  <p className="mt-1 font-mono text-sm font-bold text-[#090909]">
                    {member.nik.slice(0, 6)}******{member.nik.slice(-4)}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e7deda] bg-[#f7f2ee]/50 p-4">
                  <p className="text-xs font-bold uppercase text-[#8d6a5e]">
                    Tanggal Daftar
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#090909]">
                    {member.createdAt}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/program-kerja"
            className="rounded-2xl border border-[#e7deda] bg-white p-5 transition-all hover:border-[#ff491a]"
          >
            <p className="text-sm font-extrabold text-[#090909]">
              Program Kerja DPC →
            </p>
            <p className="mt-1 text-xs text-[#8d6a5e]">
              Lihat agenda dan matriks kerja DPC Tambun Selatan.
            </p>
          </Link>
          <Link
            href="/berita"
            className="rounded-2xl border border-[#e7deda] bg-white p-5 transition-all hover:border-[#ff491a]"
          >
            <p className="text-sm font-extrabold text-[#090909]">
              Berita & Pengumuman →
            </p>
            <p className="mt-1 text-xs text-[#8d6a5e]">
              Ikuti informasi kegiatan terbaru DPC.
            </p>
          </Link>
          <Link
            href="/galeri"
            className="rounded-2xl border border-[#e7deda] bg-white p-5 transition-all hover:border-[#ff491a]"
          >
            <p className="text-sm font-extrabold text-[#090909]">
              Galeri Kegiatan →
            </p>
            <p className="mt-1 text-xs text-[#8d6a5e]">
              Dokumentasi foto kegiatan resmi partai.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
