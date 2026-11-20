"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

interface RegisterStatus {
  convexReady: boolean;
  hasAdmins: boolean;
  isSuperAdmin: boolean;
  hasInviteCodeConfigured: boolean;
}

export default function AdminRegisterPage() {
  const router = useRouter();
  const [status, setStatus] = useState<RegisterStatus | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [role, setRole] = useState<"super_admin" | "editor">("editor");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/register")
      .then((r) => r.json())
      .then((data: RegisterStatus) => setStatus(data))
      .catch(() => {});
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
          role,
          inviteCode,
        }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Gagal mendaftarkan akun admin.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan koneksi.");
      setLoading(false);
    }
  }

  const adminClosed = Boolean(status && status.hasAdmins);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#090909] px-4 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl">
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
            <p className="text-sm font-extrabold tracking-wide">
              PORTAL ADMIN DPC
            </p>
            <p className="text-xs text-[#ffc3b3]">Tambun Selatan</p>
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-black">Registrasi Akun Admin</h1>
        <p className="mt-1.5 text-sm text-neutral-400">
          {adminClosed
            ? "Akun Admin Utama sudah terdaftar. Hanya 1 akun admin yang diizinkan."
            : "Belum ada admin terdaftar di database Convex. Buat 1 akun Admin Utama Anda."}
        </p>

        {adminClosed ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-[#ff491a]/40 bg-[#ff491a]/10 px-4 py-3 text-xs leading-relaxed text-[#ffc3b3]">
              Pendaftaran akun admin sudah ditutup karena hanya 1 akun admin
              utama yang diizinkan. Untuk pengguna lain, silakan daftar atau
              masuk sebagai <strong>Anggota</strong>.
            </div>
            <Link
              href="/anggota/login"
              className="block w-full rounded-full bg-[#ff491a] px-6 py-3.5 text-center text-sm font-bold text-white transition-colors hover:bg-[#e03a0e]"
            >
              Masuk sebagai Anggota
            </Link>
            <Link
              href="/#daftar-anggota"
              className="block w-full rounded-full border border-neutral-700 px-6 py-3 text-center text-xs font-bold text-neutral-200 hover:border-[#ff491a]"
            >
              Daftar Menjadi Anggota
            </Link>
          </div>
        ) : (
          <>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
              Nama Lengkap *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nama pengurus admin"
              className="mt-1.5 w-full rounded-xl border border-neutral-700 bg-[#090909] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#ff491a]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
              Email Admin *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@dpc-tambunselatan.org"
              className="mt-1.5 w-full rounded-xl border border-neutral-700 bg-[#090909] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#ff491a]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
                Kata Sandi (Min. 8) *
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-xl border border-neutral-700 bg-[#090909] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#ff491a]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
                Ulangi Sandi *
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-xl border border-neutral-700 bg-[#090909] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#ff491a]"
              />
            </div>
          </div>

          {status?.isSuperAdmin && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
                Peran Admin
              </label>
              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as "super_admin" | "editor")
                }
                className="mt-1.5 w-full rounded-xl border border-neutral-700 bg-[#090909] px-4 py-3 text-sm text-white outline-none focus:border-[#ff491a]"
              >
                <option value="editor">Editor Konten</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          )}

          {status?.hasInviteCodeConfigured && !status?.isSuperAdmin && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
                Kode Undangan Admin *
              </label>
              <input
                type="password"
                required
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Masukkan kode undangan"
                className="mt-1.5 w-full rounded-xl border border-neutral-700 bg-[#090909] px-4 py-3 text-sm text-white outline-none focus:border-[#ff491a]"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#ff491a] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#e03a0e] disabled:opacity-50"
          >
            {loading ? "Mendaftarkan..." : "Daftar Akun Admin"}
          </button>
        </form>
        </>
        )}

        <div className="mt-6 flex items-center justify-between text-xs text-neutral-400">
          <Link href="/admin/login" className="font-semibold text-[#ffc3b3] hover:text-[#ff491a]">
            Sudah punya akun? Login
          </Link>
          <Link href="/" className="hover:text-white">
            Beranda →
          </Link>
        </div>
      </div>
    </div>
  );
}
