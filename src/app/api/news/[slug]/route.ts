import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { deleteNewsPost } from "@/lib/content-store";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Tidak diizinkan. Silakan login terlebih dahulu." },
      { status: 401 }
    );
  }

  const { slug } = await context.params;
  const deleted = await deleteNewsPost(slug);

  if (!deleted) {
    return NextResponse.json(
      { error: "Berita tidak ditemukan." },
      { status: 404 }
    );
  }

  revalidatePath("/");
  revalidatePath("/berita");

  return NextResponse.json({ ok: true });
}
