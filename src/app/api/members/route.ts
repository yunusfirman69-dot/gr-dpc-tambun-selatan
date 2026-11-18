import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { addMemberData, getMembersData } from "@/lib/content-store";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Akses ditolak. Data anggota bersifat privat." },
      { status: 401 }
    );
  }

  const members = await getMembersData();
  return NextResponse.json({ members });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const fullName = String(formData.get("fullName") || "").trim();
    const nik = String(formData.get("nik") || "").replace(/\s+/g, "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const village = String(formData.get("village") || "").trim();
    const consent = formData.get("consent") === "true";
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

    if (!consent) {
      return NextResponse.json(
        { error: "Anda harus menyetujui pernyataan privasi data anggota." },
        { status: 400 }
      );
    }

    if (!(ktpFile instanceof File)) {
      return NextResponse.json(
        { error: "Foto KTP wajib diunggah." },
        { status: 400 }
      );
    }

    const ext = ALLOWED_TYPES[ktpFile.type];
    if (!ext) {
      return NextResponse.json(
        { error: "Format foto KTP harus JPG, PNG, atau WEBP." },
        { status: 400 }
      );
    }

    if (ktpFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Ukuran foto KTP maksimal 5 MB." },
        { status: 400 }
      );
    }

    const bytes = await ktpFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ktpFileName = `ktp-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}${ext}`;
    const privateDir = path.join(process.cwd(), "src", "data", "private-ktp");

    try {
      await fs.mkdir(privateDir, { recursive: true });
      await fs.writeFile(path.join(privateDir, ktpFileName), buffer);

      await addMemberData({
        fullName,
        nik,
        phone,
        email,
        village: village || "Tambun Selatan",
        ktpFileName,
      });
    } catch {
      return NextResponse.json(
        {
          error:
            "Penyimpanan file lokal tidak tersedia di server ini. Hubungkan database & storage (Supabase / D1+R2) untuk menerima pendaftaran online.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message:
          "Pendaftaran anggota berhasil diterima dan disimpan secara privat untuk verifikasi pengurus.",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Gagal memproses pendaftaran anggota." },
      { status: 500 }
    );
  }
}
