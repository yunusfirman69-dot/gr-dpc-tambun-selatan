import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/admin-auth";
import { getMemberByEmail, resetMemberPassword } from "@/lib/content-store";

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("62")) {
    return "0" + digits.slice(2);
  }
  return digits;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      nik?: string;
      phone?: string;
      newPassword?: string;
    };

    const email = body.email?.trim().toLowerCase() || "";
    const nik = body.nik?.replace(/\s+/g, "").trim() || "";
    const phone = normalizePhone(body.phone || "");
    const newPassword = body.newPassword || "";

    if (!email || !nik || !phone || !newPassword) {
      return NextResponse.json(
        { error: "Email, NIK, No. HP, dan kata sandi baru wajib diisi." },
        { status: 400 }
      );
    }

    if (!/^\d{16}$/.test(nik)) {
      return NextResponse.json(
        { error: "NIK harus terdiri dari 16 digit angka." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Kata sandi baru minimal 8 karakter." },
        { status: 400 }
      );
    }

    const member = await getMemberByEmail(email);
    if (!member) {
      return NextResponse.json(
        { error: "Data verifikasi (Email, NIK, atau No. HP) tidak cocok." },
        { status: 401 }
      );
    }

    const registeredPhone = normalizePhone(member.phone);
    if (member.nik !== nik || registeredPhone !== phone) {
      return NextResponse.json(
        { error: "Data verifikasi (Email, NIK, atau No. HP) tidak cocok." },
        { status: 401 }
      );
    }

    const newHash = await hashPassword(newPassword);
    const updated = await resetMemberPassword(member.id, newHash);

    if (!updated) {
      return NextResponse.json(
        { error: "Gagal memperbarui kata sandi anggota." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message:
        "Kata sandi berhasil direset! Silakan login menggunakan kata sandi baru Anda.",
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mereset kata sandi." },
      { status: 500 }
    );
  }
}
