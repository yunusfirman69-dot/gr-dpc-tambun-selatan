"use client";

import { FormEvent, useState } from "react";
import type { StoredOfficialItem } from "@/lib/content-store";
import {
  getOfficialPhotoClasses,
  type PhotoFit,
  type PhotoPosition,
  type PhotoShape,
} from "@/lib/photo-format";

export default function AdminOfficialsManager({
  initialOfficials,
}: {
  initialOfficials: StoredOfficialItem[];
}) {
  const [officials, setOfficials] =
    useState<StoredOfficialItem[]>(initialOfficials);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [division, setDivision] = useState("Pimpinan Harian");
  const [period, setPeriod] = useState("2026 – 2031");
  const [bio, setBio] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  const [editing, setEditing] = useState<StoredOfficialItem | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState("");

  function handleFileChange(selected: File | null) {
    setFile(selected);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : "");
  }

  function handleEditFileChange(selected: File | null) {
    setEditFile(selected);
    if (editPreviewUrl) URL.revokeObjectURL(editPreviewUrl);
    setEditPreviewUrl(selected ? URL.createObjectURL(selected) : "");
  }

  function startEditing(official: StoredOfficialItem) {
    setEditing(official);
    handleEditFileChange(null);
  }

  function cancelEditing() {
    setEditing(null);
    handleEditFileChange(null);
  }

  async function persist(nextList: StoredOfficialItem[], successMsg: string) {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/officials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ officials: nextList }),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        setStatus({
          type: "err",
          text: err.error || "Gagal menyimpan data pengurus.",
        });
        return false;
      }
      const data = (await res.json()) as { officials: StoredOfficialItem[] };
      setOfficials(data.officials);
      setStatus({ type: "ok", text: successMsg });
      return true;
    } catch {
      setStatus({ type: "err", text: "Terjadi kesalahan koneksi." });
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !position.trim()) return;

    let photoUrl: string | undefined;
    if (file) {
      setSaving(true);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "officials");
      const upRes = await fetch("/api/upload", { method: "POST", body: fd });
      const upData = (await upRes.json()) as { url?: string; error?: string };
      if (!upRes.ok || !upData.url) {
        setStatus({
          type: "err",
          text: upData.error || "Gagal mengunggah foto pengurus.",
        });
        setSaving(false);
        return;
      }
      photoUrl = upData.url;
    }

    const newItem: StoredOfficialItem = {
      id: `off-${Date.now()}`,
      name: name.trim(),
      position: position.trim(),
      division: division.trim() || "Pengurus DPC",
      period: period.trim() || "2026 – 2031",
      bio: bio.trim(),
      photoUrl,
    };

    const ok = await persist(
      [...officials, newItem],
      "Pengurus baru berhasil ditambahkan!"
    );
    if (ok) {
      setName("");
      setPosition("");
      setBio("");
      handleFileChange(null);
    }
  }

  async function handleSaveEdit() {
    if (!editing) return;

    let nextPhotoUrl = editing.photoUrl;

    if (editFile) {
      setSaving(true);
      const fd = new FormData();
      fd.append("file", editFile);
      fd.append("folder", "officials");
      const upRes = await fetch("/api/upload", { method: "POST", body: fd });
      const upData = (await upRes.json()) as { url?: string; error?: string };
      if (!upRes.ok || !upData.url) {
        setStatus({
          type: "err",
          text: upData.error || "Gagal mengunggah foto pengurus baru.",
        });
        setSaving(false);
        return;
      }
      nextPhotoUrl = upData.url;
    }

    const updatedItem: StoredOfficialItem = {
      ...editing,
      photoUrl: nextPhotoUrl,
    };

    const nextList = officials.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    const ok = await persist(
      nextList,
      "Data & foto pengurus berhasil diperbarui!"
    );
    if (ok) {
      cancelEditing();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus pengurus ini dari daftar publik?")) return;
    const nextList = officials.filter((item) => item.id !== id);
    await persist(nextList, "Pengurus berhasil dihapus.");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#090909] sm:text-3xl">
          Kelola Struktur Pengurus
        </h1>
        <p className="mt-1 text-sm text-[#8d6a5e]">
          Tambah, ubah, atau hapus daftar pengurus DPC Tambun Selatan yang
          tampil di halaman publik.
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

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Form Tambah Pengurus */}
        <div className="lg:col-span-4">
          <form
            onSubmit={handleAdd}
            className="rounded-3xl border border-[#e7deda] bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-extrabold text-[#090909]">
              Tambah Pengurus Baru
            </h2>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#090909]">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: H. Ahmad Fauzi"
                  className="mt-1 w-full rounded-xl border border-[#e7deda] px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#090909]">
                  Jabatan *
                </label>
                <input
                  type="text"
                  required
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Contoh: Ketua DPC"
                  className="mt-1 w-full rounded-xl border border-[#e7deda] px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#090909]">
                    Divisi / Bidang
                  </label>
                  <input
                    type="text"
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#e7deda] px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#090909]">
                    Masa Bakti
                  </label>
                  <input
                    type="text"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#e7deda] px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#090909]">
                  Foto Pengurus (Opsional, maks 5 MB)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) =>
                    handleFileChange(e.target.files?.[0] || null)
                  }
                  className="mt-1 block w-full text-xs text-[#8d6a5e] file:mr-3 file:rounded-full file:border-0 file:bg-[#f7f2ee] file:px-4 file:py-2 file:text-xs file:font-bold file:text-[#ff491a]"
                />
                {previewUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Preview foto pengurus"
                    className="mt-2 h-24 w-24 rounded-2xl object-cover"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#090909]">
                  Keterangan / Tugas Singkat
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tugas atau profil singkat..."
                  className="mt-1 w-full rounded-xl border border-[#e7deda] px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-full bg-[#ff491a] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#e03a0e] disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "+ Tambah Pengurus"}
              </button>
            </div>
          </form>
        </div>

        {/* Daftar Pengurus */}
        <div className="space-y-4 lg:col-span-8">
          <h2 className="text-lg font-extrabold text-[#090909]">
            Daftar Pengurus ({officials.length})
          </h2>

          {officials.map((off) => {
            if (editing?.id === off.id) {
              return (
                <div
                  key={off.id}
                  className="space-y-3 rounded-2xl border border-[#ff491a] bg-white p-5 shadow-sm"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      value={editing.name}
                      onChange={(e) =>
                        setEditing({ ...editing, name: e.target.value })
                      }
                      placeholder="Nama Lengkap"
                      className="rounded-xl border border-[#e7deda] px-3 py-2 text-sm font-bold outline-none focus:border-[#ff491a]"
                    />
                    <input
                      type="text"
                      value={editing.position}
                      onChange={(e) =>
                        setEditing({ ...editing, position: e.target.value })
                      }
                      placeholder="Jabatan"
                      className="rounded-xl border border-[#e7deda] px-3 py-2 text-sm outline-none focus:border-[#ff491a]"
                    />
                    <input
                      type="text"
                      value={editing.division}
                      onChange={(e) =>
                        setEditing({ ...editing, division: e.target.value })
                      }
                      placeholder="Bidang / Divisi"
                      className="rounded-xl border border-[#e7deda] px-3 py-2 text-sm outline-none focus:border-[#ff491a]"
                    />
                    <input
                      type="text"
                      value={editing.period}
                      onChange={(e) =>
                        setEditing({ ...editing, period: e.target.value })
                      }
                      placeholder="Masa Bakti"
                      className="rounded-xl border border-[#e7deda] px-3 py-2 text-sm outline-none focus:border-[#ff491a]"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={editing.bio}
                    onChange={(e) =>
                      setEditing({ ...editing, bio: e.target.value })
                    }
                    placeholder="Keterangan singkat"
                    className="w-full rounded-xl border border-[#e7deda] px-3 py-2 text-sm outline-none focus:border-[#ff491a]"
                  />

                  <div className="rounded-xl border border-[#e7deda] bg-[#f7f2ee]/50 p-3.5">
                    <label className="block text-xs font-bold text-[#090909]">
                      Edit & Sesuaikan Format Foto (JPG, PNG, WEBP, AVIF, GIF — maks 5 MB)
                    </label>
                    <div className="mt-2.5 flex flex-wrap items-center gap-4">
                      {(editPreviewUrl || editing.photoUrl) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={editPreviewUrl || editing.photoUrl}
                          alt={editing.name}
                          className={getOfficialPhotoClasses({
                            photoFit: editing.photoFit,
                            photoPosition: editing.photoPosition,
                            photoShape: editing.photoShape,
                            size: "md",
                          })}
                        />
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#090909] text-xs font-black text-[#ff491a]">
                          GR
                        </div>
                      )}
                      <div className="flex flex-col gap-2">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                          onChange={(e) =>
                            handleEditFileChange(e.target.files?.[0] || null)
                          }
                          className="block text-xs text-[#8d6a5e] file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-3.5 file:py-1.5 file:text-xs file:font-bold file:text-[#ff491a]"
                        />
                        {(editing.photoUrl || editPreviewUrl) && (
                          <button
                            type="button"
                            onClick={() => {
                              handleEditFileChange(null);
                              setEditing({ ...editing, photoUrl: undefined });
                            }}
                            className="self-start text-xs font-bold text-red-600 hover:underline"
                          >
                            Hapus Foto
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#8d6a5e]">
                          Bentuk Bingkai
                        </label>
                        <select
                          value={editing.photoShape || "square"}
                          onChange={(e) =>
                            setEditing({
                              ...editing,
                              photoShape: e.target.value as PhotoShape,
                            })
                          }
                          className="mt-1 w-full rounded-lg border border-[#e7deda] bg-white px-2.5 py-1.5 text-xs font-semibold outline-none focus:border-[#ff491a]"
                        >
                          <option value="square">Kotak (1:1)</option>
                          <option value="circle">Bulat (Lingkaran)</option>
                          <option value="portrait">Potret (3:4)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#8d6a5e]">
                          Penyesuaian Foto
                        </label>
                        <select
                          value={editing.photoFit || "cover"}
                          onChange={(e) =>
                            setEditing({
                              ...editing,
                              photoFit: e.target.value as PhotoFit,
                            })
                          }
                          className="mt-1 w-full rounded-lg border border-[#e7deda] bg-white px-2.5 py-1.5 text-xs font-semibold outline-none focus:border-[#ff491a]"
                        >
                          <option value="cover">Isi Penuh (Potong Rapi)</option>
                          <option value="contain">Tampil Utuh (Tanpa Potong)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#8d6a5e]">
                          Posisi Fokus
                        </label>
                        <select
                          value={editing.photoPosition || "center"}
                          onChange={(e) =>
                            setEditing({
                              ...editing,
                              photoPosition: e.target.value as PhotoPosition,
                            })
                          }
                          className="mt-1 w-full rounded-lg border border-[#e7deda] bg-white px-2.5 py-1.5 text-xs font-semibold outline-none focus:border-[#ff491a]"
                        >
                          <option value="top">Atas (Wajah)</option>
                          <option value="center">Tengah</option>
                          <option value="bottom">Bawah</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={handleSaveEdit}
                      className="rounded-full bg-[#ff491a] px-4 py-1.5 text-xs font-bold text-white"
                    >
                      {saving ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="rounded-full border border-[#e7deda] px-4 py-1.5 text-xs font-bold text-[#090909]"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={off.id}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-[#e7deda] bg-white p-5 shadow-sm sm:flex-row sm:items-center"
              >
                <div className="flex items-start gap-4">
                  {off.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={off.photoUrl}
                      alt={off.name}
                      className={getOfficialPhotoClasses({
                        photoFit: off.photoFit,
                        photoPosition: off.photoPosition,
                        photoShape: off.photoShape,
                        size: "sm",
                      })}
                    />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#090909] text-sm font-black text-[#ff491a]">
                      GR
                    </div>
                  )}
                  <div>
                    <span className="inline-block rounded-full bg-[#f7f2ee] px-2.5 py-0.5 text-[11px] font-bold text-[#ff491a]">
                      {off.division} • {off.period}
                    </span>
                    <h3 className="mt-1 text-base font-extrabold text-[#090909]">
                      {off.name}
                    </h3>
                    <p className="text-xs font-bold text-[#090909]/80">
                      {off.position}
                    </p>
                    <p className="mt-1 text-xs text-[#8d6a5e]">{off.bio}</p>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => startEditing(off)}
                    className="rounded-full border border-[#e7deda] px-3.5 py-1.5 text-xs font-bold text-[#090909] hover:border-[#ff491a] hover:text-[#ff491a]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(off.id)}
                    className="rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
