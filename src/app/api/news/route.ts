import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { addNewsPost, getNewsPosts } from "@/lib/content-store";

export async function GET() {
  const posts = await getNewsPosts();
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Tidak diizinkan. Silakan login terlebih dahulu." },
      { status: 401 }
    );
  }

  try {
    const body = (await request.json()) as {
      title?: string;
      category?: string;
      author?: string;
      excerpt?: string;
      content?: string;
      imageUrl?: string;
      imageStorageId?: string;
    };

    const title = body.title?.trim() || "";
    const category = body.category?.trim() || "Berita DPC";
    const author = body.author?.trim() || "Tim Komunikasi DPC";
    const excerpt = body.excerpt?.trim() || "";
    const contentRaw = body.content?.trim() || "";
    const imageUrl = body.imageUrl?.trim() || undefined;
    const imageStorageId = body.imageStorageId?.trim() || undefined;

    if (!title || !excerpt || !contentRaw) {
      return NextResponse.json(
        { error: "Judul, ringkasan, dan isi berita wajib diisi." },
        { status: 400 }
      );
    }

    const paragraphs = contentRaw
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);

    const formattedDate = new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date());

    const created = await addNewsPost({
      title,
      category,
      author,
      excerpt,
      content: paragraphs,
      publishedAt: formattedDate,
      imageUrl,
      imageStorageId,
    });

    revalidatePath("/");
    revalidatePath("/berita");
    revalidatePath(`/berita/${created.slug}`);

    return NextResponse.json({ post: created }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Gagal menyimpan berita." },
      { status: 500 }
    );
  }
}
