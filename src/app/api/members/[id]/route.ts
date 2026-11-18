import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { deleteMemberData, getMembersData } from "@/lib/content-store";

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
  const existing = (await getMembersData()).find((m) => m.id === id);

  const deleted = await deleteMemberData(id);
  if (!deleted) {
    return NextResponse.json(
      { error: "Data anggota tidak ditemukan." },
      { status: 404 }
    );
  }

  if (existing?.ktpFileName) {
    const safeName = path.basename(existing.ktpFileName);
    const ktpPath = path.join(
      process.cwd(),
      "src",
      "data",
      "private-ktp",
      safeName
    );
    await fs.unlink(ktpPath).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
