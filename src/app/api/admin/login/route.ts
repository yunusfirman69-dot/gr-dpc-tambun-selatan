import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  getAdminCredentials,
  signSessionToken,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = body.email?.trim() || "";
    const password = body.password || "";
    const expected = getAdminCredentials();

    if (
      email.toLowerCase() !== expected.email.toLowerCase() ||
      password !== expected.password
    ) {
      return NextResponse.json(
        { error: "Email atau kata sandi salah." },
        { status: 401 }
      );
    }

    const token = signSessionToken(email);
    const response = NextResponse.json({ ok: true, email });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Permintaan login tidak valid." },
      { status: 400 }
    );
  }
}
