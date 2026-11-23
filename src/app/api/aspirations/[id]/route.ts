import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { deleteAspirationData } from "@/lib/content-store";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const { id } = await context.params;
  const deleted = await deleteAspirationData(id);
  if (!deleted) {
    return NextResponse.json(
      { error: "Data aspirasi tidak ditemukan." },
      { status: 404 }
    );
  }

  revalidatePath("/admin");
  revalidatePath("/admin/aspirasi");
  return NextResponse.json({ ok: true });
}
