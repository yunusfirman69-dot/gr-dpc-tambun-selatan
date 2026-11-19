import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import {
  getConvexClient,
  uploadFileToConvexStorage,
} from "@/lib/convex-client";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/gif": ".gif",
};

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Tidak diizinkan. Silakan login terlebih dahulu." },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folderRaw = formData.get("folder");
    const folder =
      folderRaw === "news"
        ? "news"
        : folderRaw === "officials"
          ? "officials"
          : "gallery";

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "File gambar belum dipilih." },
        { status: 400 }
      );
    }

    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: "Format file harus JPG, PNG, WEBP, AVIF, atau GIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file maksimal adalah 5 MB." },
        { status: 400 }
      );
    }

    if (getConvexClient()) {
      const { storageId, url } = await uploadFileToConvexStorage(file);
      return NextResponse.json({ url, storageId });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = `${folder}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, safeName), buffer);

    return NextResponse.json({
      url: `/uploads/${folder}/${safeName}`,
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengunggah gambar." },
      { status: 500 }
    );
  }
}
