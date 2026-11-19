import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import { getOfficialsData } from "@/lib/content-store";
import { getOfficialPhotoClasses } from "@/lib/photo-format";

export const dynamic = "force-dynamic";

async function PengurusGrid() {
  const officials = await getOfficialsData();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {officials.map((official) => (
        <div
          key={official.id}
          className="flex flex-col justify-between rounded-2xl border border-[#e7deda] bg-white p-6 shadow-sm transition-all hover:border-[#ff491a]/50 hover:shadow-md"
        >
          <div>
            <div className="flex items-center gap-4">
              {official.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={official.photoUrl}
                  alt={official.name}
                  className={getOfficialPhotoClasses({
                    photoFit: official.photoFit,
                    photoPosition: official.photoPosition,
                    photoShape: official.photoShape,
                    size: "sm",
                  })}
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#090909] text-lg font-black text-[#ff491a]">
                  GR
                </div>
              )}
              <div>
                <span className="inline-block rounded-full bg-[#f7f2ee] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#ff491a]">
                  {official.division}
                </span>
                <h2 className="mt-1 text-base font-extrabold text-[#090909]">
                  {official.name}
                </h2>
              </div>
            </div>
            <p className="mt-4 text-sm font-bold text-[#090909]">
              {official.position}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#8d6a5e]">
              {official.bio}
            </p>
          </div>
          <div className="mt-5 border-t border-[#e7deda] pt-3 text-xs font-medium text-[#8d6a5e]">
            Masa Bakti: {official.period}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PengurusPage() {
  return (
    <div>
      <PageHeader
        badge="Kepengurusan Resmi"
        title="Struktur Pengurus DPC"
        description="Jajaran pengurus Dewan Pimpinan Cabang Partai Gerakan Rakyat Kecamatan Tambun Selatan yang disetujui untuk publikasi."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <p className="text-sm text-[#8d6a5e]">Memuat data pengurus...</p>
          }
        >
          <PengurusGrid />
        </Suspense>
      </section>
    </div>
  );
}
