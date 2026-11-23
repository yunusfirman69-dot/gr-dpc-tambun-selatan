"use client";

import { FormEvent, useMemo, useState } from "react";
import { organizationInfo } from "@/data/placeholder";
import type { StoredMemberItem } from "@/lib/content-store";

export default function AdminMembersManager({
  initialMembers,
}: {
  initialMembers: StoredMemberItem[];
}) {
  const [members, setMembers] = useState<StoredMemberItem[]>(initialMembers);
  const [query, setQuery] = useState("");
  const [selectedKtp, setSelectedKtp] = useState<StoredMemberItem | null>(null);
  const [editingMember, setEditingMember] = useState<StoredMemberItem | null>(
    null
  );
  const [editKtpFile, setEditKtpFile] = useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  function openEditModal(member: StoredMemberItem) {
    setEditingMember({ ...member });
    setEditKtpFile(null);
    if (editPreviewUrl) URL.revokeObjectURL(editPreviewUrl);
    setEditPreviewUrl("");
    setStatusMsg(null);
  }

  function closeEditModal() {
    setEditingMember(null);
    setEditKtpFile(null);
    if (editPreviewUrl) URL.revokeObjectURL(editPreviewUrl);
    setEditPreviewUrl("");
  }

  function handleEditFileChange(selected: File | null) {
    setEditKtpFile(selected);
    if (editPreviewUrl) URL.revokeObjectURL(editPreviewUrl);
    setEditPreviewUrl(selected ? URL.createObjectURL(selected) : "");
  }

  async function handleSaveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingMember) return;
    setSavingEdit(true);
    setStatusMsg(null);

    try {
      const fd = new FormData();
      fd.append("fullName", editingMember.fullName);
      fd.append("nik", editingMember.nik);
      fd.append("phone", editingMember.phone);
      fd.append("email", editingMember.email);
      fd.append("village", editingMember.village);
      if (editKtpFile) {
        fd.append("ktpFile", editKtpFile);
      }

      const res = await fetch(`/api/members/${editingMember.id}`, {
        method: "PATCH",
        body: fd,
      });

      const data = (await res.json()) as {
        member?: StoredMemberItem;
        error?: string;
      };

      if (!res.ok || !data.member) {
        setStatusMsg({
          type: "err",
          text: data.error || "Gagal menyimpan perubahan data anggota.",
        });
        return;
      }

      setMembers((prev) =>
        prev.map((m) => (m.id === data.member!.id ? data.member! : m))
      );
      setStatusMsg({
        type: "ok",
        text: `Data anggota "${data.member.fullName}" berhasil diperbarui!`,
      });
      closeEditModal();
    } catch {
      setStatusMsg({ type: "err", text: "Terjadi kesalahan koneksi." });
    } finally {
      setSavingEdit(false);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.fullName.toLowerCase().includes(q) ||
        m.nik.includes(q) ||
        m.phone.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.village.toLowerCase().includes(q)
    );
  }, [members, query]);

  async function handleDelete(id: string) {
    if (!confirm("Hapus data anggota ini secara permanen?")) return;
    const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      if (selectedKtp?.id === id) setSelectedKtp(null);
    }
  }

  function getMemberKtpPath(m: StoredMemberItem): string {
    return m.ktpFileName
      ? `/api/members/ktp/${encodeURIComponent(m.ktpFileName)}`
      : "";
  }

  async function fetchKtpImageForExcel(
    url: string
  ): Promise<{ base64: string; extension: "jpeg" } | null> {
    if (!url) return null;
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      try {
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const el = new Image();
          el.onload = () => resolve(el);
          el.onerror = () => reject(new Error("Image load failed"));
          el.src = objectUrl;
        });
        const maxWidth = 600;
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        const base64 = dataUrl.split(",")[1];
        return base64 ? { base64, extension: "jpeg" } : null;
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    } catch {
      return null;
    }
  }

  async function handleExportExcel() {
    if (exportingExcel) return;
    setExportingExcel(true);
    setStatusMsg(null);

    try {
      const ExcelJS = (await import("exceljs")).default;
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Data Anggota DPC");

      sheet.columns = [
        { header: "No", key: "no", width: 6 },
        { header: "Nama Lengkap", key: "fullName", width: 28 },
        { header: "NIK", key: "nik", width: 20 },
        { header: "No. HP / WhatsApp", key: "phone", width: 18 },
        { header: "Email", key: "email", width: 28 },
        { header: "Desa / Kelurahan", key: "village", width: 22 },
        { header: "Waktu Daftar", key: "createdAt", width: 22 },
        { header: "Foto KTP", key: "ktpPhoto", width: 26 },
        { header: "Link Foto KTP", key: "ktpUrl", width: 38 },
      ];

      const headerRow = sheet.getRow(1);
      headerRow.height = 26;
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFF491A" },
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });

      const images = await Promise.all(
        filtered.map((m) => fetchKtpImageForExcel(getMemberKtpPath(m)))
      );

      filtered.forEach((m, idx) => {
        const ktpPath = getMemberKtpPath(m);
        const fullKtpUrl = ktpPath ? `${window.location.origin}${ktpPath}` : "-";

        const row = sheet.addRow({
          no: idx + 1,
          fullName: m.fullName,
          nik: m.nik,
          phone: m.phone,
          email: m.email,
          village: m.village,
          createdAt: m.createdAt,
          ktpPhoto: images[idx] ? "" : "Foto tidak tersedia",
          ktpUrl: fullKtpUrl,
        });

        row.height = 85;
        row.eachCell((cell) => {
          cell.alignment = { vertical: "middle", wrapText: true };
        });

        const imgData = images[idx];
        if (imgData) {
          const imageId = workbook.addImage({
            base64: imgData.base64,
            extension: imgData.extension,
          });
          sheet.addImage(imageId, {
            tl: { col: 7, row: idx + 1 },
            ext: { width: 160, height: 100 },
            editAs: "oneCell",
          });
        }
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data-anggota-dpc-tambun-selatan.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setStatusMsg({
        type: "err",
        text: "Gagal membuat file Excel. Silakan coba lagi.",
      });
    } finally {
      setExportingExcel(false);
    }
  }

  function handleExportCsv() {
    const header = [
      "Nama Lengkap",
      "NIK",
      "No HP",
      "Email",
      "Desa/Kelurahan",
      "Waktu Daftar",
      "Link Foto KTP",
    ];
    const rows = filtered.map((m) => {
      const ktpPath = getMemberKtpPath(m);
      const fullKtpUrl = ktpPath ? `${window.location.origin}${ktpPath}` : "-";
      return [
        `"${m.fullName.replace(/"/g, '""')}"`,
        `"'${m.nik}"`,
        `"'${m.phone}"`,
        `"${m.email}"`,
        `"${m.village}"`,
        `"${m.createdAt}"`,
        `"${fullKtpUrl}"`,
      ];
    });
    const csv =
      "\uFEFF" + [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data-anggota-dpc-tambun-selatan.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="inline-block rounded-full bg-[#ff491a]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#ff491a]">
            Privat & Internal Admin
          </span>
          <h1 className="mt-2 text-2xl font-black text-[#090909] sm:text-3xl">
            Data Anggota Terdaftar ({members.length})
          </h1>
          <p className="mt-1 text-sm text-[#8d6a5e]">
            Data NIK, No. HP, Email, dan Foto KTP bersifat rahasia dan hanya
            dapat diakses oleh admin yang login.
          </p>
        </div>

        {filtered.length > 0 && (
          <div className="flex flex-wrap gap-2 self-start">
            <button
              type="button"
              onClick={handleExportExcel}
              disabled={exportingExcel}
              className="rounded-full bg-[#ff491a] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#e03a0e] disabled:opacity-60"
            >
              {exportingExcel
                ? "Menyiapkan Excel + Foto KTP..."
                : `Download Excel (.xlsx) (${filtered.length})`}
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="rounded-full bg-[#090909] px-5 py-2.5 text-xs font-bold text-white hover:bg-neutral-800"
            >
              Ekspor CSV
            </button>
          </div>
        )}
      </div>

      <div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama, NIK, No. HP, email, atau desa/kelurahan..."
          className="w-full max-w-md rounded-xl border border-[#e7deda] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#ff491a]"
        />
      </div>

      {statusMsg && !editingMember && (
        <div
          className={`rounded-2xl px-5 py-3.5 text-sm font-semibold ${
            statusMsg.type === "ok"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-[#e7deda] bg-white p-10 text-center text-sm text-[#8d6a5e]">
          Belum ada data pendaftar anggota yang sesuai.
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-[#e7deda] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="bg-[#090909] text-white">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Nama Lengkap</th>
                  <th className="px-5 py-3.5 font-bold">NIK</th>
                  <th className="px-5 py-3.5 font-bold">No. HP & Email</th>
                  <th className="px-5 py-3.5 font-bold">Domisili</th>
                  <th className="px-5 py-3.5 font-bold">Foto KTP</th>
                  <th className="px-5 py-3.5 font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7deda]">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-[#f7f2ee]/40">
                    <td className="px-5 py-4">
                      <p className="font-extrabold text-[#090909]">
                        {m.fullName}
                      </p>
                      <p className="text-xs text-[#8d6a5e]">{m.createdAt}</p>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-[#090909]">
                      {m.nik}
                    </td>
                    <td className="px-5 py-4 text-xs text-[#8d6a5e]">
                      <p className="font-semibold text-[#090909]">{m.phone}</p>
                      <p>{m.email}</p>
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-[#090909]">
                      {m.village}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedKtp(m)}
                        className="rounded-full border border-[#ff491a] px-3.5 py-1 text-xs font-bold text-[#ff491a] hover:bg-[#ff491a] hover:text-white"
                      >
                        Lihat KTP
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(m)}
                          className="rounded-full border border-[#e7deda] bg-white px-3.5 py-1 text-xs font-bold text-[#090909] hover:border-[#ff491a] hover:text-[#ff491a]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(m.id)}
                          className="rounded-full border border-red-200 bg-red-50 px-3.5 py-1 text-xs font-bold text-red-600 hover:bg-red-100"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Preview KTP */}
      {selectedKtp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e7deda] pb-3">
              <div>
                <h3 className="text-base font-extrabold text-[#090909]">
                  Foto KTP — {selectedKtp.fullName}
                </h3>
                <p className="text-xs text-[#8d6a5e]">
                  NIK: {selectedKtp.nik}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedKtp(null)}
                className="rounded-full bg-[#f7f2ee] px-3 py-1 text-xs font-bold text-[#090909]"
              >
                Tutup
              </button>
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-[#e7deda] bg-[#090909] p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/members/ktp/${encodeURIComponent(selectedKtp.ktpFileName)}`}
                alt={`KTP ${selectedKtp.fullName}`}
                className="max-h-80 w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Data & Foto KTP Anggota */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex items-center justify-between border-b border-[#e7deda] pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-[#090909]">
                  Edit Data Anggota
                </h3>
                <p className="text-xs text-[#8d6a5e]">
                  Revisi data diri atau ganti foto KTP yang salah unggah.
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-full bg-[#f7f2ee] px-3 py-1 text-xs font-bold text-[#090909]"
              >
                Tutup
              </button>
            </div>

            {statusMsg && (
              <div
                className={`mt-4 rounded-xl px-4 py-3 text-xs font-semibold ${
                  statusMsg.type === "ok"
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {statusMsg.text}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#090909]">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.fullName}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        fullName: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#e7deda] px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#090909]">
                    NIK (16 Digit) *
                  </label>
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    maxLength={16}
                    pattern="\d{16}"
                    value={editingMember.nik}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        nik: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#e7deda] px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#090909]">
                    No. HP / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={editingMember.phone}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        phone: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#e7deda] px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#090909]">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={editingMember.email}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        email: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#e7deda] px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#090909]">
                  Desa / Kelurahan Domisili
                </label>
                <select
                  value={editingMember.village}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      village: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-[#e7deda] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
                >
                  {organizationInfo.areas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl border border-[#e7deda] bg-[#f7f2ee]/60 p-4">
                <label className="block text-xs font-bold text-[#090909]">
                  Ganti Foto KTP (Opsional — maks 10 MB)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleEditFileChange(e.target.files?.[0] || null)
                  }
                  className="mt-2 block w-full text-xs text-[#8d6a5e] file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-xs file:font-bold file:text-[#ff491a]"
                />
                <div className="mt-3 overflow-hidden rounded-xl border border-[#e7deda] bg-[#090909] p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      editPreviewUrl ||
                      `/api/members/ktp/${encodeURIComponent(editingMember.ktpFileName)}`
                    }
                    alt={`KTP ${editingMember.fullName}`}
                    className="max-h-44 w-full object-contain"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded-full border border-[#e7deda] px-5 py-2.5 text-xs font-bold text-[#090909]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="rounded-full bg-[#ff491a] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#e03a0e] disabled:opacity-50"
                >
                  {savingEdit ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
