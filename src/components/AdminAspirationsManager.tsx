"use client";

import { useMemo, useState } from "react";
import type { StoredAspirationItem } from "@/lib/content-store";

export default function AdminAspirationsManager({
  initialAspirations,
}: {
  initialAspirations: StoredAspirationItem[];
}) {
  const [aspirations, setAspirations] =
    useState<StoredAspirationItem[]>(initialAspirations);
  const [query, setQuery] = useState("");
  const [exportingExcel, setExportingExcel] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return aspirations;
    return aspirations.filter(
      (item) =>
        item.fullName.toLowerCase().includes(q) ||
        item.contact.toLowerCase().includes(q) ||
        item.village.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q)
    );
  }, [aspirations, query]);

  async function handleDelete(id: string) {
    if (!confirm("Hapus pesan aspirasi ini?")) return;
    setErrorMsg("");
    const res = await fetch(`/api/aspirations/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setAspirations((prev) => prev.filter((item) => item.id !== id));
    } else {
      setErrorMsg("Gagal menghapus data aspirasi.");
    }
  }

  async function handleExportExcel() {
    if (exportingExcel) return;
    setExportingExcel(true);
    setErrorMsg("");

    try {
      const ExcelJS = (await import("exceljs")).default;
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Aspirasi & Pesan Warga");

      sheet.columns = [
        { header: "No", key: "no", width: 6 },
        { header: "Nama Lengkap", key: "fullName", width: 26 },
        { header: "Email / No. WhatsApp", key: "contact", width: 24 },
        { header: "Asal Desa / Kelurahan", key: "village", width: 22 },
        { header: "Pesan / Aspirasi", key: "message", width: 52 },
        { header: "Waktu Kirim", key: "createdAt", width: 22 },
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

      filtered.forEach((item, idx) => {
        const row = sheet.addRow({
          no: idx + 1,
          fullName: item.fullName,
          contact: item.contact,
          village: item.village,
          message: item.message,
          createdAt: item.createdAt,
        });
        row.eachCell((cell) => {
          cell.alignment = { vertical: "top", wrapText: true };
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "aspirasi-pesan-dpc-tambun-selatan.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setErrorMsg("Gagal membuat file Excel. Silakan coba lagi.");
    } finally {
      setExportingExcel(false);
    }
  }

  function handleExportCsv() {
    const header = [
      "Nama Lengkap",
      "Email / No. WhatsApp",
      "Asal Desa / Kelurahan",
      "Pesan / Aspirasi",
      "Waktu Kirim",
    ];
    const rows = filtered.map((item) => [
      `"${item.fullName.replace(/"/g, '""')}"`,
      `"${item.contact.replace(/"/g, '""')}"`,
      `"${item.village.replace(/"/g, '""')}"`,
      `"${item.message.replace(/"/g, '""')}"`,
      `"${item.createdAt}"`,
    ]);
    const csv =
      "\uFEFF" + [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aspirasi-pesan-dpc-tambun-selatan.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="inline-block rounded-full bg-[#ff491a]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#ff491a]">
            Kotak Masuk Warga
          </span>
          <h1 className="mt-2 text-2xl font-black text-[#090909] sm:text-3xl">
            Aspirasi &amp; Pesan Masuk ({aspirations.length})
          </h1>
          <p className="mt-1 text-sm text-[#8d6a5e]">
            Daftar pesan dan aspirasi warga yang dikirim melalui formulir di
            website resmi DPC Tambun Selatan.
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
                ? "Menyiapkan Excel..."
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

      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
          {errorMsg}
        </div>
      )}

      <div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama pengirim, kontak, desa/kelurahan, atau isi pesan..."
          className="w-full max-w-md rounded-xl border border-[#e7deda] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#ff491a]"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#e7deda] bg-white p-10 text-center text-sm text-[#8d6a5e]">
          {aspirations.length === 0
            ? "Belum ada pesan atau aspirasi yang masuk."
            : "Tidak ada pesan yang cocok dengan pencarian Anda."}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#e7deda] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="bg-[#090909] text-white">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Pengirim</th>
                  <th className="px-5 py-3.5 font-bold">Email / WhatsApp</th>
                  <th className="px-5 py-3.5 font-bold">Desa / Kelurahan</th>
                  <th className="px-5 py-3.5 font-bold">Pesan / Aspirasi</th>
                  <th className="px-5 py-3.5 font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7deda]">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#f7f2ee]/40">
                    <td className="px-5 py-4 align-top">
                      <p className="font-extrabold text-[#090909]">
                        {item.fullName}
                      </p>
                      <p className="text-xs text-[#8d6a5e]">{item.createdAt}</p>
                    </td>
                    <td className="px-5 py-4 align-top text-xs font-semibold text-[#090909]">
                      {item.contact}
                    </td>
                    <td className="px-5 py-4 align-top text-xs font-semibold text-[#090909]">
                      {item.village}
                    </td>
                    <td className="max-w-md px-5 py-4 align-top text-xs leading-relaxed text-[#090909]">
                      <p className="whitespace-pre-line">{item.message}</p>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="rounded-full border border-red-200 bg-red-50 px-3.5 py-1 text-xs font-bold text-red-600 hover:bg-red-100"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
