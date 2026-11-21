import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import {
  deleteMemberData,
  getMembersData,
  updateMemberData,
} from "@/lib/content-store";
import {
  getConvexClient,
  uploadFileToConvexStorage,
} from "@/lib/convex-client";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/heic": ".heic",
  "image/heif": ".heif",
};

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Tidak diizinkan. Silakan login terlebih dahulu." },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;
    const formData = await request.formData();

    const fullName = String(formData.get("fullName") || "").trim();
    const nik = String(formData.get("nik") || "").replace(/\s+/g, "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const village = String(formData.get("village") || "").trim();
    const ktpFile = formData.get("ktpFile");

    if (!fullName || !nik || !phone || !email) {
      return NextResponse.json(
        { error: "Nama, NIK, No. HP, dan Email wajib diisi." },
        { status: 400 }
      );
    }

    if (!/^\d{16}$/.test(nik)) {
      return NextResponse.json(
        { error: "NIK harus terdiri dari 16 digit angka." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Format alamat email tidak valid." },
        { status: 400 }
      );
    }

    let nextKtpFileName: string | undefined;

    if (ktpFile instanceof File && ktpFile.size > 0) {
      const ext = ALLOWED_TYPES[ktpFile.type];
      if (!ext) {
        return NextResponse.json(
          { error: "Format foto KTP harus JPG, PNG, WEBP, atau HEIC." },
          { status: 400 }
        );
      }
      if (ktpFile.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "Ukuran foto KTP maksimal 10 MB." },
          { status: 400 }
        );
      }

      if (getConvexClient()) {
        const { storageId } = await uploadFileToConvexStorage(ktpFile);
        nextKtpFileName = storageId;
      } else {
        const existing = (await getMembersData()).find((m) => m.id === id);
        const bytes = await ktpFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        nextKtpFileName = `ktp-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}${ext}`;
        const privateDir = path.join(
          process.cwd(),
          "src",
          "data",
          "private-ktp"
        );
        await fs.mkdir(privateDir, { recursive: true });
        await fs.writeFile(path.join(privateDir, nextKtpFileName), buffer);

        if (existing?.ktpFileName) {
          await fs
            .unlink(path.join(privateDir, path.basename(existing.ktpFileName)))
            .catch(() => {});
        }
      }
    }

    const updated = await updateMemberData(id, {
      fullName,
      nik,
      phone,
      email,
      village: village || "Tambun Selatan",
      ktpFileName: nextKtpFileName,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Data anggota tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, member: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("MEMBER_EMAIL_EXISTS")) {
      return NextResponse.json(
        { error: "Email tersebut sudah digunakan oleh anggota lain." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Gagal memperbarui data anggota." },
      { status: 500 }
    );
  }
}

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

  if (!getConvexClient() && existing?.ktpFileName) {
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
