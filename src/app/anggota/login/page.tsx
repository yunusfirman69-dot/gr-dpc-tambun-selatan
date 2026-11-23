"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AnggotaLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/anggota/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Gagal masuk. Periksa email dan kata sandi Anda.");
        setLoading(false);
        return;
      }

      router.push("/anggota");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan koneksi.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-[#f7f2ee] px-4 py-14">
      <div className="w-full max-w-md rounded-3xl border border-[#e7deda] bg-white p-8 shadow-xl">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Logo Partai Gerakan Rakyat"
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 object-contain"
          />
          <div>
            <p className="text-sm font-extrabold tracking-wide text-[#090909]">
              PORTAL ANGGOTA
            </p>
            <p className="text-xs font-semibold text-[#ff491a]">
              DPC Tambun Selatan
            </p>
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-black text-[#090909]">
          Login Anggota
        </h1>
        <p className="mt-1.5 text-sm text-[#8d6a5e]">
          Masuk menggunakan email dan kata sandi yang Anda buat saat mendaftar
          sebagai anggota.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#090909]">
              Email Terdaftar
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="mt-1.5 w-full rounded-xl border border-[#e7deda] px-4 py-3 text-sm outline-none transition-colors focus:border-[#ff491a]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#090909]">
                Kata Sandi
              </label>
              <Link
                href="/anggota/lupa-sandi"
                className="text-xs font-bold text-[#ff491a] hover:underline"
              >
                Lupa Kata Sandi?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-xl border border-[#e7deda] px-4 py-3 text-sm outline-none transition-colors focus:border-[#ff491a]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#ff491a] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#e03a0e] disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Masuk sebagai Anggota"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between border-t border-[#e7deda] pt-4 text-xs">
          <Link
            href="/daftar-anggota"
            className="font-bold text-[#ff491a] hover:underline"
          >
            Belum punya akun? Daftar Anggota
          </Link>
          <Link href="/" className="font-semibold text-[#8d6a5e] hover:text-[#090909]">
            Beranda →
          </Link>
        </div>
      </div>
    </div>
  );
}
