import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { getNewsBySlug } from "@/lib/content-store";

async function BeritaDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await params;
  const post = await getNewsBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-white">
      <section className="border-b border-neutral-800 bg-[#090909] py-14 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ffc3b3] hover:text-[#ff491a]"
          >
            ← Kembali ke Daftar Berita
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded-full bg-[#ff491a] px-3 py-1 font-bold text-white">
              {post.category}
            </span>
            <span className="text-neutral-400">{post.publishedAt}</span>
            <span className="text-neutral-400">• Oleh {post.author}</span>
          </div>
          <h1 className="mt-4 text-2xl font-black leading-tight sm:text-4xl">
            {post.title}
          </h1>
        </div>
      </section>

      <article className="mx-auto max-w-4xl space-y-6 px-4 py-14 text-base leading-relaxed text-[#090909]/85 sm:px-6">
        {post.imageUrl && (
          <div className="overflow-hidden rounded-2xl border border-[#e7deda]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.imageUrl}
              alt={post.title}
              className="max-h-[460px] w-full object-cover"
            />
          </div>
        )}

        {post.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </article>
    </div>
  );
}

export default function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl px-4 py-16 text-sm text-[#8d6a5e]">
          Memuat artikel...
        </div>
      }
    >
      <BeritaDetailContent params={params} />
    </Suspense>
  );
}
