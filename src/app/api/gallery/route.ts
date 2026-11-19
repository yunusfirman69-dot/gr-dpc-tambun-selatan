import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { addGalleryItem, getGalleryItems } from "@/lib/content-store";

export async function GET() {
  const items = await getGalleryItems();
  return NextResponse.json({ items });
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
      date?: string;
      description?: string;
      imageUrl?: string;
      imageStorageId?: string;
    };

    const title = body.title?.trim() || "";
    const category = body.category?.trim() || "Kegiatan DPC";
    const date =
      body.date?.trim() ||
      new Intl.DateTimeFormat("id-ID", {
        month: "long",
        year: "numeric",
      }).format(new Date());
    const description = body.description?.trim() || "";
    const imageUrl = body.imageUrl?.trim() || "";
    const imageStorageId = body.imageStorageId?.trim() || undefined;

    if (!title || (!imageUrl && !imageStorageId)) {
      return NextResponse.json(
        { error: "Judul kegiatan dan file foto wajib diisi." },
        { status: 400 }
      );
    }

    const created = await addGalleryItem({
      title,
      category,
      date,
      description,
      imageUrl,
      imageStorageId,
    });

    revalidatePath("/galeri");

    return NextResponse.json({ item: created }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Gagal menyimpan foto galeri." },
      { status: 500 }
    );
  }
}
