"use client";

import { FormEvent, useState } from "react";
import { organizationInfo } from "@/data/placeholder";

export default function MemberRegistrationForm() {
  const [fullName, setFullName] = useState("");
  const [nik, setNik] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [village, setVillage] = useState(organizationInfo.areas[0]);
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  function handleFileChange(selected: File | null) {
    setKtpFile(selected);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    if (!ktpFile) {
      setStatus({ type: "err", text: "Silakan unggah foto KTP terlebih dahulu." });
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("fullName", fullName);
      fd.append("nik", nik);
      fd.append("phone", phone);
      fd.append("email", email);
      fd.append("village", village);
      fd.append("consent", String(consent));
      fd.append("ktpFile", ktpFile);

      const res = await fetch("/api/members", {
        method: "POST",
        body: fd,
      });

      const data = (await res.json()) as { message?: string; error?: string };

      if (!res.ok) {
        setStatus({
          type: "err",
          text: data.error || "Gagal mengirim pendaftaran anggota.",
        });
        return;
      }

      setStatus({
        type: "ok",
        text:
          data.message ||
          "Pendaftaran anggota berhasil! Data Anda disimpan secara privat.",
      });
      setFullName("");
      setNik("");
      setPhone("");
      setEmail("");
      setConsent(false);
      handleFileChange(null);
    } catch {
      setStatus({ type: "err", text: "Terjadi kesalahan koneksi." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-3xl border border-[#e7deda] bg-white p-7 shadow-sm sm:p-9">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-block rounded-full bg-[#ff491a]/10 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#ff491a]">
          Pendaftaran Anggota
        </span>
        <span className="text-xs font-semibold text-[#8d6a5e]">
          Data Dijaga Privat & Internal
        </span>
      </div>

      <h2 className="mt-3 text-2xl font-extrabold text-[#090909]">
        Daftar Anggota DPC Tambun Selatan
      </h2>
      <p className="mt-1.5 text-sm text-[#8d6a5e]">
        Lengkapi data di bawah ini untuk mendaftar sebagai anggota. NIK, nomor
        HP, email, dan foto KTP tidak akan ditampilkan di website publik.
      </p>

      {status && (
        <div
          className={`mt-5 rounded-2xl px-4 py-3.5 text-xs font-semibold ${
            status.type === "ok"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {status.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-bold text-[#090909]">
              Nama Lengkap (Sesuai KTP) *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="mt-1.5 w-full rounded-xl border border-[#e7deda] px-4 py-3 text-sm outline-none transition-colors focus:border-[#ff491a]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#090909]">
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
              className="mt-1.5 w-full rounded-xl border border-[#e7deda] px-4 py-3 text-sm outline-none transition-colors focus:border-[#ff491a]"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-bold text-[#090909]">
              No. HP / WhatsApp *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0812xxxxxxxx"
              className="mt-1.5 w-full rounded-xl border border-[#e7deda] px-4 py-3 text-sm outline-none transition-colors focus:border-[#ff491a]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#090909]">
              Email *
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
        </div>

        <div>
          <label className="block text-sm font-bold text-[#090909]">
            Desa / Kelurahan Domisili
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

        <div className="rounded-2xl border border-[#e7deda] bg-[#f7f2ee]/60 p-4">
          <label className="block text-sm font-bold text-[#090909]">
            Upload Foto KTP (JPG, PNG, WEBP — maks 5 MB) *
          </label>
          <input
            type="file"
            required
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="mt-2 block w-full text-xs text-[#8d6a5e] file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-xs file:font-bold file:text-[#ff491a] hover:file:bg-[#ffc3b3]/30"
          />
          {previewUrl && (
            <div className="mt-3 overflow-hidden rounded-xl border border-[#e7deda] bg-white p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Preview foto KTP"
                className="max-h-44 w-full rounded-lg object-contain"
              />
            </div>
          )}
        </div>

        <label className="flex items-start gap-3 text-xs leading-relaxed text-[#8d6a5e]">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#ff491a]"
          />
          <span>
            Saya menyetujui data pribadi dan foto KTP yang dikirimkan digunakan
            secara internal dan privat oleh pengurus DPC Partai Gerakan Rakyat
            Tambun Selatan untuk keperluan pendataan anggota.
          </span>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-[#ff491a] px-8 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#e03a0e] disabled:opacity-50 sm:w-auto"
        >
          {submitting ? "Mengirim Pendaftaran..." : "Daftar Sebagai Anggota"}
        </button>
      </form>
    </div>
  );
}
