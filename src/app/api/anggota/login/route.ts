import { NextResponse } from "next/server";
import {
  MEMBER_COOKIE_NAME,
  signMemberSessionToken,
  verifyPassword,
} from "@/lib/admin-auth";
import { getMemberByEmail } from "@/lib/content-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = body.email?.trim().toLowerCase() || "";
    const password = body.password || "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const member = await getMemberByEmail(email);
    if (!member) {
      return NextResponse.json(
        { error: "Email tidak terdaftar sebagai anggota." },
        { status: 401 }
      );
    }

    const valid = member.passwordHash
      ? await verifyPassword(password, member.passwordHash)
      : password === member.nik;

    if (!valid) {
      return NextResponse.json(
        { error: "Kata sandi salah." },
        { status: 401 }
      );
    }

    const token = signMemberSessionToken({
      id: member.id,
      email: member.email,
      fullName: member.fullName,
    });

    const response = NextResponse.json({
      ok: true,
      member: {
        id: member.id,
        email: member.email,
        fullName: member.fullName,
      },
    });

    response.cookies.set(MEMBER_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Gagal memproses login anggota." },
      { status: 500 }
    );
  }
}
