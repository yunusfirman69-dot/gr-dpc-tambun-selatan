"use client";

import { FormEvent, useState } from "react";
import { organizationInfo } from "@/data/placeholder";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="rounded-3xl border border-[#e7deda] bg-white p-7 text-[#090909] shadow-sm sm:p-9">
      <h2 className="text-2xl font-extrabold text-[#090909]">
        Kirim Pesan atau Aspirasi
      </h2>

      {submitted ? (
        <div className="mt-6 rounded-2xl border border-[#ff491a]/30 bg-[#f7f2ee] p-6 text-sm text-[#090909]">
          <p className="font-bold text-[#ff491a]">
            Simulasi Pengiriman Berhasil
          </p>
          <p className="mt-1 text-[#8d6a5e]">
            Terima kasih. Pada tahap integrasi backend nanti, pesan Anda akan
            diteruskan ke sekretariat DPC.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-4 rounded-full bg-[#090909] px-5 py-2 text-xs font-bold text-white"
          >
            Kirim Pesan Lain
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-[#090909]">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
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
                placeholder="email@contoh.com"
                className="mt-1.5 w-full rounded-xl border border-[#e7deda] px-4 py-3 text-sm outline-none transition-colors focus:border-[#ff491a]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#090909]">
                Asal Desa / Kelurahan
              </label>
              <select className="mt-1.5 w-full rounded-xl border border-[#e7deda] bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#ff491a]">
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
              placeholder="Tuliskan pesan atau aspirasi Anda..."
              className="mt-1.5 w-full rounded-xl border border-[#e7deda] px-4 py-3 text-sm outline-none transition-colors focus:border-[#ff491a]"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-[#ff491a] px-8 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#e03a0e]"
          >
            Kirim Pesan
          </button>
        </form>
      )}
    </div>
  );
}
