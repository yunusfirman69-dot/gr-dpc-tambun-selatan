"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function LupaSandiAnggotaPage() {
  const [email, setEmail] = useState("");
  const [nik, setNik] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccessMsg("");

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/anggota/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, nik, phone, newPassword }),
      });

      const data = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) {
        setError(data.error || "Gagal mereset kata sandi.");
        return;
      }

      setSuccessMsg(
        data.message ||
          "Kata sandi berhasil direset! Silakan masuk menggunakan kata sandi baru."
      );
      setEmail("");
      setNik("");
      setPhone("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Terjadi kesalahan koneksi.");
    } finally {
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
          Reset Kata Sandi Anggota
        </h1>
        <p className="mt-1.5 text-sm text-[#8d6a5e]">
          Verifikasi identitas Anda dengan memasukkan Email, NIK, dan No. HP
          yang terdaftar untuk membuat kata sandi baru.
        </p>

        {successMsg ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
              ✓ {successMsg}
            </div>
            <Link
              href="/anggota/login"
              className="block w-full rounded-full bg-[#ff491a] px-6 py-3.5 text-center text-sm font-bold text-white transition-colors hover:bg-[#e03a0e]"
            >
              Masuk ke Login Anggota →
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#090909]">
                  Email Terdaftar *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="mt-1.5 w-full rounded-xl border border-[#e7deda] px-4 py-3 text-base outline-none transition-colors focus:border-[#ff491a] sm:text-sm"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#090909]">
                    NIK (16 Digit) *
                  </label>
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    maxLength={16}
                    pattern="\d{16}"
                    value={nik}
                    onChange={(e) => setNik(e.target.value.replace(/\D/g, ""))}
                    placeholder="3216xxxxxxxxxxxx"
                    className="mt-1.5 w-full rounded-xl border border-[#e7deda] px-4 py-3 text-base outline-none transition-colors focus:border-[#ff491a] sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#090909]">
                    No. HP Terdaftar *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0812xxxxxxxx"
                    className="mt-1.5 w-full rounded-xl border border-[#e7deda] px-4 py-3 text-base outline-none transition-colors focus:border-[#ff491a] sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#090909]">
                    Sandi Baru (Min. 8) *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1.5 w-full rounded-xl border border-[#e7deda] px-4 py-3 text-base outline-none transition-colors focus:border-[#ff491a] sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#090909]">
                    Ulangi Sandi Baru *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1.5 w-full rounded-xl border border-[#e7deda] px-4 py-3 text-base outline-none transition-colors focus:border-[#ff491a] sm:text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#ff491a] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#e03a0e] disabled:opacity-50"
              >
                {loading ? "Memverifikasi..." : "Reset Kata Sandi"}
              </button>
            </form>
          </>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-[#e7deda] pt-4 text-xs">
          <Link
            href="/anggota/login"
            className="font-bold text-[#ff491a] hover:underline"
          >
            ← Kembali ke Login Anggota
          </Link>
          <Link
            href="/#daftar-anggota"
            className="font-semibold text-[#8d6a5e] hover:text-[#090909]"
          >
            Daftar Anggota
          </Link>
        </div>
      </div>
    </div>
  );
}
