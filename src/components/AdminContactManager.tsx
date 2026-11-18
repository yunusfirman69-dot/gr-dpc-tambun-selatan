"use client";

import { FormEvent, useState } from "react";
import type { StoredContactInfo } from "@/lib/content-store";

export default function AdminContactManager({
  initialContact,
}: {
  initialContact: StoredContactInfo;
}) {
  const [contact, setContact] = useState<StoredContactInfo>(initialContact);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact }),
      });

      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        setStatus({
          type: "err",
          text: err.error || "Gagal menyimpan kontak.",
        });
        return;
      }

      const data = (await res.json()) as { contact: StoredContactInfo };
      setContact(data.contact);
      setStatus({
        type: "ok",
        text: "Informasi kontak sekretariat & media sosial berhasil diperbarui!",
      });
    } catch {
      setStatus({ type: "err", text: "Terjadi kesalahan koneksi." });
    } finally {
      setSaving(false);
    }
  }

  function updateSocial(
    idx: number,
    field: "name" | "handle" | "href",
    value: string
  ) {
    setContact((prev) => ({
      ...prev,
      socials: prev.socials.map((s, i) =>
        i === idx ? { ...s, [field]: value } : s
      ),
    }));
  }

  function addSocial() {
    setContact((prev) => ({
      ...prev,
      socials: [
        ...prev.socials,
        { name: "Media Sosial", handle: "@akun", href: "https://" },
      ],
    }));
  }

  function removeSocial(idx: number) {
    setContact((prev) => ({
      ...prev,
      socials: prev.socials.filter((_, i) => i !== idx),
    }));
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#090909] sm:text-3xl">
          Kelola Kontak Sekretariat & Media Sosial
        </h1>
        <p className="mt-1 text-sm text-[#8d6a5e]">
          Perbarui alamat sekretariat, nomor telepon/WhatsApp, email resmi, jam
          layanan, dan tautan media sosial DPC.
        </p>
      </div>

      {status && (
        <div
          className={`rounded-2xl px-5 py-3.5 text-sm font-semibold ${
            status.type === "ok"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {status.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-[#e7deda] bg-white p-7 shadow-sm sm:p-9"
      >
        <div>
          <label className="block text-xs font-bold text-[#090909]">
            Alamat Sekretariat *
          </label>
          <textarea
            rows={2}
            required
            value={contact.address}
            onChange={(e) =>
              setContact({ ...contact, address: e.target.value })
            }
            className="mt-1.5 w-full rounded-xl border border-[#e7deda] px-4 py-3 text-sm outline-none focus:border-[#ff491a]"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-[#090909]">
              Nomor Telepon
            </label>
            <input
              type="text"
              value={contact.phone}
              onChange={(e) =>
                setContact({ ...contact, phone: e.target.value })
              }
              className="mt-1.5 w-full rounded-xl border border-[#e7deda] px-4 py-3 text-sm outline-none focus:border-[#ff491a]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#090909]">
              Nomor WhatsApp Resmi
            </label>
            <input
              type="text"
              value={contact.whatsapp}
              onChange={(e) =>
                setContact({ ...contact, whatsapp: e.target.value })
              }
              className="mt-1.5 w-full rounded-xl border border-[#e7deda] px-4 py-3 text-sm outline-none focus:border-[#ff491a]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#090909]">
              Email Resmi
            </label>
            <input
              type="email"
              value={contact.email}
              onChange={(e) =>
                setContact({ ...contact, email: e.target.value })
              }
              className="mt-1.5 w-full rounded-xl border border-[#e7deda] px-4 py-3 text-sm outline-none focus:border-[#ff491a]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#090909]">
              Jam Operasional
            </label>
            <input
              type="text"
              value={contact.hours}
              onChange={(e) =>
                setContact({ ...contact, hours: e.target.value })
              }
              className="mt-1.5 w-full rounded-xl border border-[#e7deda] px-4 py-3 text-sm outline-none focus:border-[#ff491a]"
            />
          </div>
        </div>

        <div className="border-t border-[#e7deda] pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[#090909]">
              Media Sosial Resmi
            </h2>
            <button
              type="button"
              onClick={addSocial}
              className="rounded-full border border-[#090909] px-4 py-1.5 text-xs font-bold text-[#090909] hover:bg-[#090909] hover:text-white"
            >
              + Tambah Akun
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {contact.socials.map((soc, idx) => (
              <div
                key={idx}
                className="grid gap-3 rounded-2xl border border-[#e7deda] bg-[#f7f2ee]/40 p-4 sm:grid-cols-12"
              >
                <input
                  type="text"
                  value={soc.name}
                  onChange={(e) => updateSocial(idx, "name", e.target.value)}
                  placeholder="Platform (Instagram)"
                  className="rounded-xl border border-[#e7deda] bg-white px-3 py-2 text-xs font-bold outline-none focus:border-[#ff491a] sm:col-span-3"
                />
                <input
                  type="text"
                  value={soc.handle}
                  onChange={(e) => updateSocial(idx, "handle", e.target.value)}
                  placeholder="@username"
                  className="rounded-xl border border-[#e7deda] bg-white px-3 py-2 text-xs outline-none focus:border-[#ff491a] sm:col-span-4"
                />
                <input
                  type="text"
                  value={soc.href}
                  onChange={(e) => updateSocial(idx, "href", e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="rounded-xl border border-[#e7deda] bg-white px-3 py-2 text-xs outline-none focus:border-[#ff491a] sm:col-span-4"
                />
                <button
                  type="button"
                  onClick={() => removeSocial(idx)}
                  className="rounded-xl border border-red-200 bg-red-50 px-2 py-2 text-xs font-bold text-red-600 hover:bg-red-100 sm:col-span-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[#ff491a] px-8 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#e03a0e] disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan Kontak"}
        </button>
      </form>
    </div>
  );
}
