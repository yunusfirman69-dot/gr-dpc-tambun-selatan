import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { deleteGalleryItem } from "@/lib/content-store";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Tidak diizinkan. Silakan login terlebih dahulu." },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const deleted = await deleteGalleryItem(id);

  if (!deleted) {
    return NextResponse.json(
      { error: "Foto galeri tidak ditemukan." },
      { status: 404 }
    );
  }

  revalidatePath("/galeri");

  return NextResponse.json({ ok: true });
}
