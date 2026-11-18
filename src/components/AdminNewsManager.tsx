"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import type { StoredNewsPost } from "@/lib/content-store";

export default function AdminNewsManager({
  initialPosts,
}: {
  initialPosts: StoredNewsPost[];
}) {
  const [posts, setPosts] = useState<StoredNewsPost[]>(initialPosts);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Berita DPC");
  const [author, setAuthor] = useState("Tim Komunikasi DPC");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  function handleFileChange(selected: File | null) {
    setFile(selected);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setSubmitting(true);

    try {
      let imageUrl: string | undefined;

      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "news");
        const upRes = await fetch("/api/upload", { method: "POST", body: fd });
        const upData = (await upRes.json()) as { url?: string; error?: string };
        if (!upRes.ok || !upData.url) {
          setMessage({
            type: "err",
            text: upData.error || "Gagal mengunggah gambar cover.",
          });
          setSubmitting(false);
          return;
        }
        imageUrl = upData.url;
      }

      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          author,
          excerpt,
          content,
          imageUrl,
        }),
      });

      const data = (await res.json()) as {
        post?: StoredNewsPost;
        error?: string;
      };

      if (!res.ok || !data.post) {
        setMessage({
          type: "err",
          text: data.error || "Gagal menyimpan berita.",
        });
        setSubmitting(false);
        return;
      }

      setPosts((prev) => [data.post!, ...prev]);
      setTitle("");
      setExcerpt("");
      setContent("");
      handleFileChange(null);
      setMessage({
        type: "ok",
        text: "Berita berhasil dipublikasikan ke website!",
      });
    } catch {
      setMessage({ type: "err", text: "Terjadi kesalahan saat menyimpan." });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm("Hapus berita ini?")) return;
    const res = await fetch(`/api/news/${slug}`, { method: "DELETE" });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Form Upload Berita */}
      <div className="lg:col-span-5">
        <div className="rounded-3xl border border-[#e7deda] bg-white p-6 shadow-sm sm:p-7">
          <h1 className="text-xl font-black text-[#090909]">
            Upload Berita Baru
          </h1>
          <p className="mt-1 text-xs text-[#8d6a5e]">
            Berita akan langsung tampil di Beranda dan halaman Berita.
          </p>

          {message && (
            <div
              className={`mt-4 rounded-xl px-4 py-3 text-xs font-semibold ${
                message.type === "ok"
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#090909]">
                Judul Berita *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Kegiatan Bakti Sosial di Jatimulya"
                className="mt-1 w-full rounded-xl border border-[#e7deda] px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-[#090909]">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#e7deda] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
                >
                  <option value="Berita DPC">Berita DPC</option>
                  <option value="Organisasi">Organisasi</option>
                  <option value="Kegiatan Sosial">Kegiatan Sosial</option>
                  <option value="Pengumuman">Pengumuman</option>
                  <option value="Pendidikan Politik">Pendidikan Politik</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#090909]">
                  Penulis
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#e7deda] px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#090909]">
                Gambar Cover (JPG/PNG/WEBP, maks 5 MB)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) =>
                  handleFileChange(e.target.files?.[0] || null)
                }
                className="mt-1 block w-full text-xs text-[#8d6a5e] file:mr-3 file:rounded-full file:border-0 file:bg-[#f7f2ee] file:px-4 file:py-2 file:text-xs file:font-bold file:text-[#ff491a] hover:file:bg-[#ffc3b3]/40"
              />
              {previewUrl && (
                <div className="mt-3 overflow-hidden rounded-xl border border-[#e7deda]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Preview cover berita"
                    className="h-40 w-full object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#090909]">
                Ringkasan Singkat *
              </label>
              <textarea
                rows={2}
                required
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Ringkasan 1-2 kalimat untuk kartu berita..."
                className="mt-1 w-full rounded-xl border border-[#e7deda] px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#090909]">
                Isi Berita Lengkap *
              </label>
              <textarea
                rows={5}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tulis isi berita. Tekan Enter untuk membuat paragraf baru..."
                className="mt-1 w-full rounded-xl border border-[#e7deda] px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-[#ff491a] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#e03a0e] disabled:opacity-50"
            >
              {submitting ? "Mengunggah..." : "Publikasikan Berita"}
            </button>
          </form>
        </div>
      </div>

      {/* Daftar Berita */}
      <div className="space-y-4 lg:col-span-7">
        <h2 className="text-xl font-black text-[#090909]">
          Daftar Berita Terbit ({posts.length})
        </h2>

        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="flex flex-col gap-4 rounded-2xl border border-[#e7deda] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-4">
                {post.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="h-16 w-24 shrink-0 rounded-xl object-cover"
                  />
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-[#ffc3b3]/50 px-2.5 py-0.5 font-bold text-[#ff491a]">
                      {post.category}
                    </span>
                    <span className="text-[#8d6a5e]">{post.publishedAt}</span>
                  </div>
                  <h3 className="mt-1.5 text-sm font-extrabold text-[#090909]">
                    {post.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-[#8d6a5e]">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/berita/${post.slug}`}
                  className="rounded-full border border-[#e7deda] px-3.5 py-1.5 text-xs font-bold text-[#090909] hover:border-[#ff491a] hover:text-[#ff491a]"
                >
                  Lihat
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(post.slug)}
                  className="rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
