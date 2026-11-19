import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import { getGalleryItems } from "@/lib/content-store";

export const dynamic = "force-dynamic";

async function GaleriGrid() {
  const items = await getGalleryItems();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="overflow-hidden rounded-2xl border border-[#e7deda] bg-white shadow-sm transition-all hover:border-[#ff491a]/50 hover:shadow-md"
        >
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.title}
              className="aspect-[16/10] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[16/10] flex-col items-center justify-center bg-[#090909] p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff491a]/20 text-sm font-black text-[#ff491a]">
                FOTO
              </div>
              <span className="mt-3 text-xs font-medium text-neutral-400">
                Placeholder Foto Kegiatan
              </span>
            </div>
          )}

          <div className="p-5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#ff491a]">{item.category}</span>
              <span className="text-[#8d6a5e]">{item.date}</span>
            </div>
            <h2 className="mt-2 text-base font-extrabold text-[#090909]">
              {item.title}
            </h2>
            <p className="mt-1.5 text-sm text-[#8d6a5e]">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GaleriPage() {
  return (
    <div>
      <PageHeader
        badge="Dokumentasi"
        title="Galeri Foto Kegiatan"
        description="Kumpulan dokumentasi kegiatan resmi Partai Gerakan Rakyat DPC Tambun Selatan yang telah mendapat izin publikasi."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <p className="text-sm text-[#8d6a5e]">Memuat galeri foto...</p>
          }
        >
          <GaleriGrid />
        </Suspense>
      </section>
    </div>
  );
}
