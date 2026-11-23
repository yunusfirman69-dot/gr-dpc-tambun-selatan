"use client";

import { FormEvent, useState } from "react";
import { organizationInfo } from "@/data/placeholder";

export default function ContactForm() {
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [village, setVillage] = useState(organizationInfo.areas[0] || "");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/aspirations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, contact, village, message }),
      });

      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        setErrorMsg(err.error || "Gagal mengirim pesan. Silakan coba lagi.");
        return;
      }

      setSubmitted(true);
      setFullName("");
      setContact("");
      setVillage(organizationInfo.areas[0] || "");
      setMessage("");
    } catch {
      setErrorMsg("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-3xl border border-[#e7deda] bg-white p-7 text-[#090909] shadow-sm sm:p-9">
      <h2 className="text-2xl font-extrabold text-[#090909]">
        Kirim Pesan atau Aspirasi
      </h2>

      {submitted ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-[#090909]">
          <p className="font-bold text-emerald-700">
            Aspirasi Berhasil Dikirim
          </p>
          <p className="mt-1 text-emerald-800">
            Terima kasih. Pesan dan aspirasi Anda telah tersimpan dan diteruskan
            ke Sekretariat DPC Partai Gerakan Rakyat Tambun Selatan.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-4 rounded-full bg-[#090909] px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-neutral-800"
          >
            Kirim Pesan Lain
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {errorMsg && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
              {errorMsg}
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-[#090909]">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Masukkan nama Anda"
              className="mt-1.5 w-full rounded-xl border border-[#e7deda] px-4 py-3 text-sm outline-none transition-colors focus:border-[#ff491a]"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-bold text-[#090909]">
                Email / No. WhatsApp
              </label>
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="email@contoh.com"
                className="mt-1.5 w-full rounded-xl border border-[#e7deda] px-4 py-3 text-sm outline-none transition-colors focus:border-[#ff491a]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#090909]">
                Asal Desa / Kelurahan
              </label>
              <select
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#e7deda] bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#ff491a]"
              >
                {organizationInfo.areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#090909]">
              Pesan / Aspirasi
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan pesan atau aspirasi Anda..."
              className="mt-1.5 w-full rounded-xl border border-[#e7deda] px-4 py-3 text-sm outline-none transition-colors focus:border-[#ff491a]"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-[#ff491a] px-8 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#e03a0e] disabled:opacity-60"
          >
            {submitting ? "Mengirim..." : "Kirim Pesan"}
          </button>
        </form>
      )}
    </div>
  );
}
