"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [pendingNotice, setPendingNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPendingNotice("");

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
        }),
      });

      const data = (await res.json()) as {
        pending?: boolean;
        message?: string;
        error?: string;
      };

      if (!res.ok) {
        setError(data.error || "Gagal mendaftarkan akun admin.");
        setLoading(false);
        return;
      }

      if (data.pending) {
        setPendingNotice(
          data.message ||
            "Permintaan registrasi dikirim! Menunggu persetujuan dari gerakanrakyattamsel@gmail.com."
        );
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
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
          Setiap pendaftaran akun admin baru wajib mendapat persetujuan terlebih
          dahulu dari admin{" "}
          <span className="font-semibold text-[#ffc3b3]">
            gerakanrakyattamsel@gmail.com
          </span>
          .
        </p>

        {pendingNotice ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-xs leading-relaxed text-emerald-200">
              <p className="text-sm font-extrabold text-emerald-300">
                ✓ Permintaan Terkirim (Menunggu Persetujuan)
              </p>
              <p className="mt-2">{pendingNotice}</p>
            </div>
            <Link
              href="/admin/login"
              className="block w-full rounded-full bg-[#ff491a] px-6 py-3.5 text-center text-sm font-bold text-white transition-colors hover:bg-[#e03a0e]"
            >
              Ke Halaman Login Admin
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
                  placeholder="email@anda.com"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#ff491a] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#e03a0e] disabled:opacity-50"
              >
                {loading ? "Mengirim Permintaan..." : "Ajukan Registrasi Admin"}
              </button>
            </form>
          </>
        )}

        <div className="mt-6 flex items-center justify-between text-xs text-neutral-400">
          <Link
            href="/admin/login"
            className="font-semibold text-[#ffc3b3] hover:text-[#ff491a]"
          >
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
