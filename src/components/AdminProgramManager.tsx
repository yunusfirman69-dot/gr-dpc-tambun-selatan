"use client";

import { FormEvent, useState } from "react";
import type { StoredProgramKerja } from "@/lib/content-store";
import type { ImplementationMatrixRow, ProgramField } from "@/data/placeholder";

export default function AdminProgramManager({
  initialData,
}: {
  initialData: StoredProgramKerja;
}) {
  const [data, setData] = useState<StoredProgramKerja>(initialData);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  // Form tambah sub-program
  const [selectedFieldIdx, setSelectedFieldIdx] = useState(0);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");

  // Form tambah bidang baru
  const [showNewFieldForm, setShowNewFieldForm] = useState(false);
  const [newFieldTitle, setNewFieldTitle] = useState("");
  const [newFieldPillar, setNewFieldPillar] = useState("");
  const [newFieldFocus, setNewFieldFocus] = useState("");

  // Inline edit sub-program
  const [editingItem, setEditingItem] = useState<{
    fieldIdx: number;
    itemIdx: number;
    name: string;
    description: string;
  } | null>(null);

  // Inline edit matrix row
  const [editingMatrix, setEditingMatrix] = useState<{
    rowIdx: number;
    row: ImplementationMatrixRow;
  } | null>(null);

  async function persist(nextData: StoredProgramKerja, successText: string) {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/programs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextData),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        setStatus({
          type: "err",
          text: err.error || "Gagal menyimpan perubahan.",
        });
        return false;
      }
      const saved = (await res.json()) as StoredProgramKerja;
      setData(saved);
      setStatus({ type: "ok", text: successText });
      return true;
    } catch {
      setStatus({ type: "err", text: "Terjadi kesalahan koneksi." });
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleAddSubItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newItemName.trim() || !newItemDesc.trim()) return;

    const nextFields = data.fields.map((field, idx) =>
      idx === selectedFieldIdx
        ? {
            ...field,
            items: [
              ...field.items,
              { name: newItemName.trim(), description: newItemDesc.trim() },
            ],
          }
        : field
    );

    const ok = await persist(
      { ...data, fields: nextFields },
      "Program kerja baru berhasil ditambahkan!"
    );
    if (ok) {
      setNewItemName("");
      setNewItemDesc("");
    }
  }

  async function handleAddField(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newFieldTitle.trim()) return;

    const nextNumber = String(data.fields.length + 1).padStart(2, "0");
    const newField: ProgramField = {
      number: nextNumber,
      title: newFieldTitle.trim(),
      pillar: newFieldPillar.trim() || "Pilar Pancakarya",
      focus: newFieldFocus.trim() || "Fokus pelaksanaan program bidang.",
      items: [],
    };

    const nextFields = [...data.fields, newField];
    const ok = await persist(
      { ...data, fields: nextFields },
      `Bidang baru (${nextNumber}) berhasil ditambahkan!`
    );
    if (ok) {
      setNewFieldTitle("");
      setNewFieldPillar("");
      setNewFieldFocus("");
      setShowNewFieldForm(false);
      setSelectedFieldIdx(nextFields.length - 1);
    }
  }

  async function handleSaveEditItem() {
    if (!editingItem) return;
    const nextFields = data.fields.map((field, fIdx) => {
      if (fIdx !== editingItem.fieldIdx) return field;
      return {
        ...field,
        items: field.items.map((item, iIdx) =>
          iIdx === editingItem.itemIdx
            ? {
                name: editingItem.name.trim(),
                description: editingItem.description.trim(),
              }
            : item
        ),
      };
    });

    const ok = await persist(
      { ...data, fields: nextFields },
      "Perubahan program kerja berhasil disimpan!"
    );
    if (ok) setEditingItem(null);
  }

  async function handleDeleteItem(fieldIdx: number, itemIdx: number) {
    if (!confirm("Hapus item program kerja ini?")) return;
    const nextFields = data.fields.map((field, fIdx) =>
      fIdx === fieldIdx
        ? {
            ...field,
            items: field.items.filter((_, iIdx) => iIdx !== itemIdx),
          }
        : field
    );
    await persist(
      { ...data, fields: nextFields },
      "Item program kerja berhasil dihapus."
    );
  }

  async function handleSaveMatrixRow() {
    if (!editingMatrix) return;
    const nextMatrix = data.implementationMatrix.map((row, idx) =>
      idx === editingMatrix.rowIdx ? editingMatrix.row : row
    );
    const ok = await persist(
      { ...data, implementationMatrix: nextMatrix },
      "Matriks rencana implementasi berhasil diperbarui!"
    );
    if (ok) setEditingMatrix(null);
  }

  async function handleAddMatrixRow() {
    const nextMatrix = [
      ...data.implementationMatrix,
      {
        field: "Bidang Baru",
        shortTerm: "Rencana jangka pendek (0–6 bulan)...",
        mediumTerm: "Rencana jangka menengah (6–18 bulan)...",
        indicator: "Indikator keberhasilan...",
      },
    ];
    const ok = await persist(
      { ...data, implementationMatrix: nextMatrix },
      "Baris baru ditambahkan ke Matriks Implementasi. Silakan edit isinya."
    );
    if (ok) {
      setEditingMatrix({
        rowIdx: nextMatrix.length - 1,
        row: nextMatrix[nextMatrix.length - 1],
      });
    }
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-[#090909] sm:text-3xl">
            Kelola Program Kerja DPC
          </h1>
          <p className="mt-1 text-sm text-[#8d6a5e]">
            Tambah, ubah, atau hapus program kerja dan matriks implementasi.
            Perubahan langsung tampil di halaman Program Kerja publik.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowNewFieldForm((prev) => !prev)}
          className="rounded-full border border-[#090909] bg-white px-5 py-2.5 text-xs font-bold text-[#090909] transition-colors hover:bg-[#090909] hover:text-white"
        >
          {showNewFieldForm ? "Tutup Form Bidang" : "+ Tambah Bidang Baru"}
        </button>
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

      {/* Optional: Form Tambah Bidang Baru */}
      {showNewFieldForm && (
        <form
          onSubmit={handleAddField}
          className="rounded-3xl border border-[#ff491a]/30 bg-white p-6 shadow-sm sm:p-7"
        >
          <h2 className="text-lg font-extrabold text-[#090909]">
            Tambah Bidang Program Kerja Baru
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-[#090909]">
                Nama Bidang *
              </label>
              <input
                type="text"
                required
                value={newFieldTitle}
                onChange={(e) => setNewFieldTitle(e.target.value)}
                placeholder="Contoh: Bidang Ekonomi Kreatif & Pemuda"
                className="mt-1 w-full rounded-xl border border-[#e7deda] px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#090909]">
                Pilar Landasan
              </label>
              <input
                type="text"
                value={newFieldPillar}
                onChange={(e) => setNewFieldPillar(e.target.value)}
                placeholder="Contoh: Pilar Pancakarya 5"
                className="mt-1 w-full rounded-xl border border-[#e7deda] px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs font-bold text-[#090909]">
              Fokus Utama Bidang
            </label>
            <input
              type="text"
              value={newFieldFocus}
              onChange={(e) => setNewFieldFocus(e.target.value)}
              placeholder="Penjelasan singkat fokus bidang..."
              className="mt-1 w-full rounded-xl border border-[#e7deda] px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-4 rounded-full bg-[#ff491a] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#e03a0e] disabled:opacity-50"
          >
            Simpan Bidang Baru
          </button>
        </form>
      )}

      {/* Grid: Form Tambah Sub-Program + Daftar Bidang */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <form
            onSubmit={handleAddSubItem}
            className="sticky top-6 rounded-3xl border border-[#e7deda] bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-extrabold text-[#090909]">
              Tambah Program Kerja
            </h2>
            <p className="mt-1 text-xs text-[#8d6a5e]">
              Tambahkan kegiatan atau sub-program baru ke dalam bidang yang
              dipilih.
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#090909]">
                  Pilih Bidang
                </label>
                <select
                  value={selectedFieldIdx}
                  onChange={(e) => setSelectedFieldIdx(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-[#e7deda] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
                >
                  {data.fields.map((f, idx) => (
                    <option key={f.number} value={idx}>
                      {f.number} — {f.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#090909]">
                  Nama Program *
                </label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Contoh: Posko Layanan Kesehatan Keliling"
                  className="mt-1 w-full rounded-xl border border-[#e7deda] px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#090909]">
                  Deskripsi Pelaksanaan *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="Jelaskan sasaran dan bentuk kegiatan..."
                  className="mt-1 w-full rounded-xl border border-[#e7deda] px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-full bg-[#ff491a] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#e03a0e] disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "+ Tambah Program Kerja"}
              </button>
            </div>
          </form>
        </div>

        {/* Daftar Bidang & Sub-Program */}
        <div className="space-y-6 lg:col-span-8">
          {data.fields.map((field, fIdx) => (
            <div
              key={field.number}
              className="rounded-3xl border border-[#e7deda] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 border-b border-[#e7deda] pb-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff491a] text-sm font-black text-white">
                  {field.number}
                </span>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff491a]">
                    {field.pillar}
                  </span>
                  <h3 className="text-lg font-extrabold text-[#090909]">
                    {field.title}
                  </h3>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {field.items.length === 0 && (
                  <p className="text-xs italic text-[#8d6a5e]">
                    Belum ada sub-program di bidang ini.
                  </p>
                )}

                {field.items.map((item, iIdx) => {
                  const isEditing =
                    editingItem?.fieldIdx === fIdx &&
                    editingItem?.itemIdx === iIdx;

                  if (isEditing && editingItem) {
                    return (
                      <div
                        key={iIdx}
                        className="space-y-3 rounded-2xl border border-[#ff491a] bg-[#f7f2ee]/60 p-4"
                      >
                        <input
                          type="text"
                          value={editingItem.name}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              name: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-[#e7deda] bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[#ff491a]"
                        />
                        <textarea
                          rows={3}
                          value={editingItem.description}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              description: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-[#e7deda] bg-white px-3 py-2 text-sm outline-none focus:border-[#ff491a]"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={saving}
                            onClick={handleSaveEditItem}
                            className="rounded-full bg-[#ff491a] px-4 py-1.5 text-xs font-bold text-white"
                          >
                            Simpan
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingItem(null)}
                            className="rounded-full border border-[#e7deda] bg-white px-4 py-1.5 text-xs font-bold text-[#090909]"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={iIdx}
                      className="flex flex-col justify-between gap-3 rounded-2xl border border-[#e7deda] bg-[#f7f2ee]/40 p-4 sm:flex-row sm:items-start"
                    >
                      <div>
                        <h4 className="text-sm font-extrabold text-[#090909]">
                          {item.name}
                        </h4>
                        <p className="mt-1 text-xs leading-relaxed text-[#8d6a5e]">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingItem({
                              fieldIdx: fIdx,
                              itemIdx: iIdx,
                              name: item.name,
                              description: item.description,
                            })
                          }
                          className="rounded-full border border-[#e7deda] bg-white px-3 py-1 text-xs font-bold text-[#090909] hover:border-[#ff491a] hover:text-[#ff491a]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(fIdx, iIdx)}
                          className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-100"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kelola Matriks Rencana Implementasi */}
      <div className="rounded-3xl border border-[#e7deda] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-[#090909]">
              Matriks Rencana Implementasi
            </h2>
            <p className="mt-1 text-xs text-[#8d6a5e]">
              Klik &ldquo;Edit Baris&rdquo; untuk memperbarui target jangka
              pendek, jangka menengah, atau indikator keberhasilan.
            </p>
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={handleAddMatrixRow}
            className="rounded-full bg-[#090909] px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800"
          >
            + Tambah Baris Matriks
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {data.implementationMatrix.map((row, idx) => {
            const isEditing = editingMatrix?.rowIdx === idx;
            if (isEditing && editingMatrix) {
              return (
                <div
                  key={idx}
                  className="space-y-3 rounded-2xl border border-[#ff491a] bg-[#f7f2ee]/60 p-5"
                >
                  <input
                    type="text"
                    value={editingMatrix.row.field}
                    onChange={(e) =>
                      setEditingMatrix({
                        ...editingMatrix,
                        row: { ...editingMatrix.row, field: e.target.value },
                      })
                    }
                    placeholder="Nama Bidang"
                    className="w-full rounded-xl border border-[#e7deda] bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[#ff491a]"
                  />
                  <div className="grid gap-3 md:grid-cols-3">
                    <textarea
                      rows={3}
                      value={editingMatrix.row.shortTerm}
                      onChange={(e) =>
                        setEditingMatrix({
                          ...editingMatrix,
                          row: {
                            ...editingMatrix.row,
                            shortTerm: e.target.value,
                          },
                        })
                      }
                      placeholder="Jangka Pendek (0-6 Bulan)"
                      className="w-full rounded-xl border border-[#e7deda] bg-white px-3 py-2 text-xs outline-none focus:border-[#ff491a]"
                    />
                    <textarea
                      rows={3}
                      value={editingMatrix.row.mediumTerm}
                      onChange={(e) =>
                        setEditingMatrix({
                          ...editingMatrix,
                          row: {
                            ...editingMatrix.row,
                            mediumTerm: e.target.value,
                          },
                        })
                      }
                      placeholder="Jangka Menengah (6-18 Bulan)"
                      className="w-full rounded-xl border border-[#e7deda] bg-white px-3 py-2 text-xs outline-none focus:border-[#ff491a]"
                    />
                    <textarea
                      rows={3}
                      value={editingMatrix.row.indicator}
                      onChange={(e) =>
                        setEditingMatrix({
                          ...editingMatrix,
                          row: {
                            ...editingMatrix.row,
                            indicator: e.target.value,
                          },
                        })
                      }
                      placeholder="Indikator Keberhasilan"
                      className="w-full rounded-xl border border-[#e7deda] bg-white px-3 py-2 text-xs outline-none focus:border-[#ff491a]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={handleSaveMatrixRow}
                      className="rounded-full bg-[#ff491a] px-4 py-1.5 text-xs font-bold text-white"
                    >
                      Simpan Baris
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingMatrix(null)}
                      className="rounded-full border border-[#e7deda] bg-white px-4 py-1.5 text-xs font-bold text-[#090909]"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={idx}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-[#e7deda] p-5 md:flex-row md:items-start"
              >
                <div className="grid flex-1 gap-3 md:grid-cols-4">
                  <div className="text-sm font-extrabold text-[#090909]">
                    {row.field}
                  </div>
                  <div className="text-xs leading-relaxed text-[#8d6a5e]">
                    <span className="block font-bold text-[#090909]">
                      Jangka Pendek:
                    </span>
                    {row.shortTerm}
                  </div>
                  <div className="text-xs leading-relaxed text-[#8d6a5e]">
                    <span className="block font-bold text-[#090909]">
                      Jangka Menengah:
                    </span>
                    {row.mediumTerm}
                  </div>
                  <div className="text-xs font-semibold leading-relaxed text-[#ff491a]">
                    <span className="block font-bold text-[#090909]">
                      Indikator:
                    </span>
                    {row.indicator}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingMatrix({ rowIdx: idx, row })}
                  className="shrink-0 self-start rounded-full border border-[#e7deda] px-3.5 py-1.5 text-xs font-bold text-[#090909] hover:border-[#ff491a] hover:text-[#ff491a]"
                >
                  Edit Baris
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
