import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminShell from "@/components/AdminShell";
import { getAdminSession } from "@/lib/admin-auth";
import {
  getAspirationsData,
  getGalleryItems,
  getMembersData,
  getNewsPosts,
  getOfficialsData,
  getProgramKerjaData,
} from "@/lib/content-store";

async function AdminDashboardContent() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [news, gallery, programKerja, officials, members, aspirations] =
    await Promise.all([
      getNewsPosts(),
      getGalleryItems(),
      getProgramKerjaData(),
      getOfficialsData(),
      getMembersData(),
      getAspirationsData(),
    ]);

  const totalSubPrograms = programKerja.fields.reduce(
    (sum, f) => sum + f.items.length,
    0
  );

  return (
    <AdminShell email={session.email}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-black text-[#090909] sm:text-3xl">
            Ringkasan Dashboard Admin
          </h1>
          <p className="mt-1 text-sm text-[#8d6a5e]">
            Kelola berita, pengumuman, dan foto galeri kegiatan DPC Tambun
            Selatan.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#e7deda] bg-white p-7 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-[#8d6a5e]">
              Total Berita & Pengumuman
            </p>
            <p className="mt-2 text-4xl font-black text-[#090909]">
              {news.length}
            </p>
            <Link
              href="/admin/berita"
              className="mt-5 inline-block rounded-full bg-[#ff491a] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#e03a0e]"
            >
              + Upload Berita Baru
            </Link>
          </div>

          <div className="rounded-2xl border border-[#e7deda] bg-white p-7 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-[#8d6a5e]">
              Total Foto Galeri
            </p>
            <p className="mt-2 text-4xl font-black text-[#090909]">
              {gallery.length}
            </p>
            <Link
              href="/admin/galeri"
              className="mt-5 inline-block rounded-full bg-[#090909] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-neutral-800"
            >
              + Upload Foto Galeri
            </Link>
          </div>

          <div className="rounded-2xl border border-[#e7deda] bg-white p-7 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-[#8d6a5e]">
              Total Program Kerja
            </p>
            <p className="mt-2 text-4xl font-black text-[#090909]">
              {totalSubPrograms}
            </p>
            <Link
              href="/admin/program-kerja"
              className="mt-5 inline-block rounded-full border border-[#090909] px-5 py-2.5 text-xs font-bold text-[#090909] transition-colors hover:bg-[#090909] hover:text-white"
            >
              Edit & Tambah Program
            </Link>
          </div>

          <div className="rounded-2xl border border-[#e7deda] bg-white p-7 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-[#8d6a5e]">
              Total Pengurus Publik
            </p>
            <p className="mt-2 text-4xl font-black text-[#090909]">
              {officials.length}
            </p>
            <Link
              href="/admin/pengurus"
              className="mt-5 inline-block rounded-full border border-[#090909] px-5 py-2.5 text-xs font-bold text-[#090909] transition-colors hover:bg-[#090909] hover:text-white"
            >
              Edit Pengurus
            </Link>
          </div>

          <div className="rounded-2xl border border-[#e7deda] bg-white p-7 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-[#8d6a5e]">
              Profil &amp; Visi Misi
            </p>
            <p className="mt-2 text-lg font-extrabold text-[#090909]">
              Sejarah, Visi &amp; Misi
            </p>
            <Link
              href="/admin/profil"
              className="mt-5 inline-block rounded-full border border-[#090909] px-5 py-2.5 text-xs font-bold text-[#090909] transition-colors hover:bg-[#090909] hover:text-white"
            >
              Edit Profil &amp; Visi Misi
            </Link>
          </div>

          <div className="rounded-2xl border border-[#e7deda] bg-white p-7 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-[#8d6a5e]">
              Kontak Sekretariat
            </p>
            <p className="mt-2 text-lg font-extrabold text-[#090909]">
              Alamat & Medsos
            </p>
            <Link
              href="/admin/kontak"
              className="mt-5 inline-block rounded-full border border-[#090909] px-5 py-2.5 text-xs font-bold text-[#090909] transition-colors hover:bg-[#090909] hover:text-white"
            >
              Edit Kontak
            </Link>
          </div>

          <div className="rounded-2xl border border-[#e7deda] bg-white p-7 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-[#ff491a]">
              Data Anggota (Privat)
            </p>
            <p className="mt-2 text-4xl font-black text-[#090909]">
              {members.length}
            </p>
            <Link
              href="/admin/anggota"
              className="mt-5 inline-block rounded-full bg-[#ff491a] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#e03a0e]"
            >
              Lihat Data Anggota
            </Link>
          </div>

          <div className="rounded-2xl border border-[#e7deda] bg-white p-7 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-[#ff491a]">
              Aspirasi &amp; Pesan Warga
            </p>
            <p className="mt-2 text-4xl font-black text-[#090909]">
              {aspirations.length}
            </p>
            <Link
              href="/admin/aspirasi"
              className="mt-5 inline-block rounded-full bg-[#090909] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-neutral-800"
            >
              Lihat Aspirasi &amp; Excel
            </Link>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f7f2ee] text-sm font-semibold text-[#8d6a5e]">
          Memuat Dashboard Admin...
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
