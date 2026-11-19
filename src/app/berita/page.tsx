import Link from "next/link";
import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import { getNewsPosts } from "@/lib/content-store";

export const dynamic = "force-dynamic";

async function BeritaList() {
  const posts = await getNewsPosts();

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {posts.map((post) => (
        <article
          key={post.slug}
          className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e7deda] bg-white shadow-sm transition-all hover:border-[#ff491a]/50 hover:shadow-md"
        >
          <div>
            {post.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.imageUrl}
                alt={post.title}
                className="aspect-[16/9] w-full object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="rounded-full bg-[#ffc3b3]/50 px-3 py-1 font-bold text-[#ff491a]">
                  {post.category}
                </span>
                <span className="font-medium text-[#8d6a5e]">
                  {post.publishedAt}
                </span>
              </div>
              <h2 className="mt-4 text-lg font-extrabold leading-snug text-[#090909]">
                <Link
                  href={`/berita/${post.slug}`}
                  className="transition-colors hover:text-[#ff491a]"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#8d6a5e]">
                {post.excerpt}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#e7deda] px-6 py-4 text-xs">
            <span className="text-[#8d6a5e]">{post.author}</span>
            <Link
              href={`/berita/${post.slug}`}
              className="font-bold text-[#ff491a] hover:underline"
            >
              Baca →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function BeritaPage() {
  return (
    <div>
      <PageHeader
        badge="Suara & Aktivitas"
        title="Berita & Pengumuman"
        description="Informasi terkini mengenai kegiatan, pengumuman resmi, dan aktivitas pengabdian DPC Tambun Selatan."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <p className="text-sm text-[#8d6a5e]">Memuat daftar berita...</p>
          }
        >
          <BeritaList />
        </Suspense>
      </section>
    </div>
  );
}
