"use client";

import { useMemo, useState } from "react";
import type { StoredMemberItem } from "@/lib/content-store";

export default function AdminMembersManager({
  initialMembers,
}: {
  initialMembers: StoredMemberItem[];
}) {
  const [members, setMembers] = useState<StoredMemberItem[]>(initialMembers);
  const [query, setQuery] = useState("");
  const [selectedKtp, setSelectedKtp] = useState<StoredMemberItem | null>(null);

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

  function escapeXml(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function handleExportExcel() {
    const rowsXml = filtered
      .map(
        (m, idx) => `
      <Row>
        <Cell><Data ss:Type="Number">${idx + 1}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(m.fullName)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(m.nik)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(m.phone)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(m.email)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(m.village)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(m.createdAt)}</Data></Cell>
      </Row>`
      )
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#FF491A" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Data Anggota DPC">
  <Table>
   <Column ss:Width="40"/>
   <Column ss:Width="180"/>
   <Column ss:Width="140"/>
   <Column ss:Width="120"/>
   <Column ss:Width="180"/>
   <Column ss:Width="140"/>
   <Column ss:Width="140"/>
   <Row>
    <Cell ss:StyleID="Header"><Data ss:Type="String">No</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Nama Lengkap</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">NIK</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">No. HP / WhatsApp</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Email</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Desa / Kelurahan</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Waktu Daftar</Data></Cell>
   </Row>
   ${rowsXml}
  </Table>
 </Worksheet>
</Workbook>`;

    const blob = new Blob(["\uFEFF" + xml], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data-anggota-dpc-tambun-selatan.xls";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleExportCsv() {
    const header = [
      "Nama Lengkap",
      "NIK",
      "No HP",
      "Email",
      "Desa/Kelurahan",
      "Waktu Daftar",
    ];
    const rows = filtered.map((m) => [
      `"${m.fullName.replace(/"/g, '""')}"`,
      `"'${m.nik}"`,
      `"'${m.phone}"`,
      `"${m.email}"`,
      `"${m.village}"`,
      `"${m.createdAt}"`,
    ]);
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
              className="rounded-full bg-[#ff491a] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#e03a0e]"
            >
              Download Excel (.xls) ({filtered.length})
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
                      <button
                        type="button"
                        onClick={() => handleDelete(m.id)}
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
    </div>
  );
}
