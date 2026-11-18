import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";

const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Akses ditolak. Foto KTP hanya dapat dilihat oleh admin." },
      { status: 401 }
    );
  }

  const { filename } = await context.params;
  const safeName = path.basename(filename);
  const filePath = path.join(
    process.cwd(),
    "src",
    "data",
    "private-ktp",
    safeName
  );

  try {
    const buffer = await fs.readFile(filePath);
    const ext = path.extname(safeName).toLowerCase();
    const contentType = MIME_MAP[ext] || "application/octet-stream";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "File KTP tidak ditemukan." },
      { status: 404 }
    );
  }
}
