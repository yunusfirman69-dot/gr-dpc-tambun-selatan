import { connection } from "next/server";
import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import { getProgramKerjaData } from "@/lib/content-store";

async function ProgramKerjaContent() {
  await connection();
  const programKerja = await getProgramKerjaData();

  return (
    <section className="mx-auto max-w-7xl space-y-14 px-4 py-16 sm:px-6 lg:px-8">
      {/* Landasan & Konteks Wilayah */}
      <div className="rounded-3xl border border-[#e7deda] bg-[#f7f2ee] p-7 sm:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[#ff491a] px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-white">
            Landasan: {programKerja.landasan}
          </span>
          <span className="rounded-full border border-[#e7deda] bg-white px-4 py-1 text-xs font-bold text-[#090909]">
            Wilayah: Kecamatan Tambun Selatan, Kabupaten Bekasi
          </span>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-[#090909]/85 sm:text-base">
          {programKerja.intro}
        </p>
      </div>

      {/* Bidang Program Kerja */}
      <div className="space-y-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff491a]">
            Bidang Utama
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#090909] sm:text-3xl">
            Struktur Program Kerja Per Bidang
          </h2>
        </div>

        <div className="grid gap-8">
          {programKerja.fields.map((field) => (
            <div
              key={field.number}
              className="rounded-3xl border border-[#e7deda] bg-white p-7 shadow-sm sm:p-9"
            >
              <div className="flex flex-col gap-4 border-b border-[#e7deda] pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ff491a] text-base font-black text-white">
                    {field.number}
                  </div>
                  <div>
                    <span className="inline-block rounded-full bg-[#f7f2ee] px-3 py-0.5 text-xs font-bold text-[#ff491a]">
                      {field.pillar}
                    </span>
                    <h3 className="mt-1.5 text-xl font-extrabold text-[#090909] sm:text-2xl">
                      {field.title}
                    </h3>
                  </div>
                </div>
              </div>

              <p className="mt-5 text-sm font-medium text-[#8d6a5e] sm:text-base">
                {field.focus}
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {field.items.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-2xl border border-[#e7deda] bg-[#f7f2ee]/50 p-5"
                  >
                    <h4 className="text-base font-extrabold text-[#090909]">
                      {item.name}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-[#8d6a5e]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Matriks Rencana Implementasi */}
      <div className="space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff491a]">
            Peta Jalan Pelaksanaan
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#090909] sm:text-3xl">
            Matriks Rencana Implementasi (Jangka Pendek & Menengah)
          </h2>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#e7deda] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-[#090909] text-white">
                <tr>
                  <th className="px-6 py-4 font-bold">Bidang</th>
                  <th className="px-6 py-4 font-bold">
                    Jangka Pendek (0–6 Bulan)
                  </th>
                  <th className="px-6 py-4 font-bold">
                    Jangka Menengah (6–18 Bulan)
                  </th>
                  <th className="px-6 py-4 font-bold">
                    Indikator Keberhasilan
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7deda]">
                {programKerja.implementationMatrix.map((row) => (
                  <tr
                    key={row.field}
                    className="align-top transition-colors hover:bg-[#f7f2ee]/50"
                  >
                    <td className="px-6 py-5 font-extrabold text-[#090909]">
                      {row.field}
                    </td>
                    <td className="px-6 py-5 leading-relaxed text-[#8d6a5e]">
                      {row.shortTerm}
                    </td>
                    <td className="px-6 py-5 leading-relaxed text-[#8d6a5e]">
                      {row.mediumTerm}
                    </td>
                    <td className="px-6 py-5 font-semibold leading-relaxed text-[#ff491a]">
                      {row.indicator}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProgramKerjaPage() {
  return (
    <div>
      <PageHeader
        badge="Rancangan Program Kerja"
        title="Program Kerja DPC Tambun Selatan"
        description="Disusun selaras dengan instruksi utama DPP Partai Gerakan Rakyat (Pancakarya & Panca Dharma) serta karakteristik wilayah Tambun Selatan, Kabupaten Bekasi."
      />

      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 py-16 text-sm text-[#8d6a5e]">
            Memuat program kerja...
          </div>
        }
      >
        <ProgramKerjaContent />
      </Suspense>
    </div>
  );
}
