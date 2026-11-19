"use client";

import { FormEvent, useState } from "react";
import type { StoredGalleryItem } from "@/lib/content-store";

export default function AdminGalleryManager({
  initialItems,
}: {
  initialItems: StoredGalleryItem[];
}) {
  const [items, setItems] = useState<StoredGalleryItem[]>(initialItems);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Kegiatan DPC");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  function handleFileChange(selected: File | null) {
    setFile(selected);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!file) {
      setMessage({ type: "err", text: "Silakan pilih file foto terlebih dahulu." });
      return;
    }

    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "gallery");
      const upRes = await fetch("/api/upload", { method: "POST", body: fd });
      const upData = (await upRes.json()) as {
        url?: string;
        storageId?: string;
        error?: string;
      };

      if (!upRes.ok || (!upData.url && !upData.storageId)) {
        setMessage({
          type: "err",
          text: upData.error || "Gagal mengunggah foto.",
        });
        setSubmitting(false);
        return;
      }

      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          date,
          description,
          imageUrl: upData.url,
          imageStorageId: upData.storageId,
        }),
      });

      const data = (await res.json()) as {
        item?: StoredGalleryItem;
        error?: string;
      };

      if (!res.ok || !data.item) {
        setMessage({
          type: "err",
          text: data.error || "Gagal menyimpan metadata galeri.",
        });
        setSubmitting(false);
        return;
      }

      setItems((prev) => [data.item!, ...prev]);
      setTitle("");
      setDate("");
      setDescription("");
      handleFileChange(null);
      setMessage({
        type: "ok",
        text: "Foto kegiatan berhasil diunggah ke Galeri!",
      });
    } catch {
      setMessage({ type: "err", text: "Terjadi kesalahan saat mengunggah." });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus foto ini dari galeri?")) return;
    const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Form Upload Foto */}
      <div className="lg:col-span-5">
        <div className="rounded-3xl border border-[#e7deda] bg-white p-6 shadow-sm sm:p-7">
          <h1 className="text-xl font-black text-[#090909]">
            Upload Foto Galeri
          </h1>
          <p className="mt-1 text-xs text-[#8d6a5e]">
            Unggah foto dokumentasi resmi (JPG, PNG, atau WEBP, maks 5 MB).
          </p>

          {message && (
            <div
              className={`mt-4 rounded-xl px-4 py-3 text-xs font-semibold ${
                message.type === "ok"
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#090909]">
                File Foto *
              </label>
              <input
                type="file"
                required
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) =>
                  handleFileChange(e.target.files?.[0] || null)
                }
                className="mt-1 block w-full text-xs text-[#8d6a5e] file:mr-3 file:rounded-full file:border-0 file:bg-[#f7f2ee] file:px-4 file:py-2 file:text-xs file:font-bold file:text-[#ff491a] hover:file:bg-[#ffc3b3]/40"
              />
              {previewUrl && (
                <div className="mt-3 overflow-hidden rounded-xl border border-[#e7deda]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Preview foto galeri"
                    className="h-44 w-full object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#090909]">
                Judul Kegiatan *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Ngopi Perubahan Bersama Warga"
                className="mt-1 w-full rounded-xl border border-[#e7deda] px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-[#090909]">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#e7deda] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
                >
                  <option value="Kegiatan DPC">Kegiatan DPC</option>
                  <option value="Rapat & Konsolidasi">Rapat & Konsolidasi</option>
                  <option value="Sosial">Sosial</option>
                  <option value="Ekonomi Rakyat">Ekonomi Rakyat</option>
                  <option value="Kaderisasi">Kaderisasi</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#090909]">
                  Tanggal / Bulan
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Contoh: November 2026"
                  className="mt-1 w-full rounded-xl border border-[#e7deda] px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#090909]">
                Keterangan Foto
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi singkat kegiatan..."
                className="mt-1 w-full rounded-xl border border-[#e7deda] px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-[#ff491a] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#e03a0e] disabled:opacity-50"
            >
              {submitting ? "Mengunggah..." : "Simpan ke Galeri"}
            </button>
          </form>
        </div>
      </div>

      {/* Daftar Foto Galeri */}
      <div className="space-y-4 lg:col-span-7">
        <h2 className="text-xl font-black text-[#090909]">
          Foto di Galeri ({items.length})
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-[#e7deda] bg-white shadow-sm"
            >
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="aspect-[16/10] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center bg-[#090909] text-xs font-bold text-[#ff491a]">
                  Placeholder Foto
                </div>
              )}

              <div className="p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#ff491a]">
                    {item.category}
                  </span>
                  <span className="text-[#8d6a5e]">{item.date}</span>
                </div>
                <h3 className="mt-1.5 text-sm font-extrabold text-[#090909]">
                  {item.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-[#8d6a5e]">
                  {item.description}
                </p>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="mt-3 rounded-full border border-red-200 bg-red-50 px-3.5 py-1 text-xs font-bold text-red-600 hover:bg-red-100"
                >
                  Hapus Foto
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
