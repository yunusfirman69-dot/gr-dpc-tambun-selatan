"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((data: { authenticated?: boolean }) => {
        if (data.authenticated) {
          router.replace("/admin");
        }
      })
      .catch(() => {});
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Gagal masuk. Periksa kembali data Anda.");
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

        <h1 className="mt-6 text-2xl font-black">Login Admin</h1>
        <p className="mt-1.5 text-sm text-neutral-400">
          Masuk untuk mengunggah berita dan foto galeri kegiatan DPC.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
              Email Admin
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email-admin@anda.com"
              className="mt-1.5 w-full rounded-xl border border-neutral-700 bg-[#090909] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#ff491a]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
              Kata Sandi
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-xl border border-neutral-700 bg-[#090909] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#ff491a]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#ff491a] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#e03a0e] disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Masuk ke Dashboard"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-xs">
          <Link
            href="/admin/register"
            className="font-semibold text-[#ffc3b3] hover:text-[#ff491a]"
          >
            Registrasi Akun Admin
          </Link>
          <Link
            href="/"
            className="font-semibold text-neutral-400 hover:text-[#ff491a]"
          >
            ← Kembali ke Website
          </Link>
        </div>
      </div>
    </div>
  );
}
