import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  getAdminCredentials,
  signSessionToken,
  verifyPassword,
  type AdminRole,
} from "@/lib/admin-auth";
import { convexApi, getConvexClient } from "@/lib/convex-client";

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

    let authenticated = false;
    let role: AdminRole = "super_admin";
    let name: string | undefined;

    // 1. Cek di database Convex (tabel admins) terlebih dahulu
    const convex = getConvexClient();
    if (convex) {
      try {
        const adminRow = (await convex.query(convexApi.admins.getAdminByEmail, {
          email,
        })) as {
          fullName: string;
          email: string;
          passwordHash: string;
          role: AdminRole;
          status?: "pending" | "approved" | "rejected";
        } | null;

        if (adminRow && (await verifyPassword(password, adminRow.passwordHash))) {
          if (adminRow.status === "pending") {
            return NextResponse.json(
              {
                error:
                  "Akun admin Anda masih menunggu persetujuan dari gerakanrakyattamsel@gmail.com.",
              },
              { status: 403 }
            );
          }
          if (adminRow.status === "rejected") {
            return NextResponse.json(
              { error: "Permintaan akun admin Anda tidak disetujui." },
              { status: 403 }
            );
          }
          authenticated = true;
          role = adminRow.role;
          name = adminRow.fullName;
        }
      } catch {
        // Lanjut ke fallback env jika fungsi Convex belum di-deploy
      }
    }

    // 2. Fallback ke kredensial environment variable jika diset secara eksplisit
    if (!authenticated) {
      const expected = getAdminCredentials();
      if (
        expected &&
        email === expected.email.toLowerCase() &&
        password === expected.password
      ) {
        authenticated = true;
        role = "super_admin";
      }
    }

    if (!authenticated) {
      return NextResponse.json(
        { error: "Email atau kata sandi salah." },
        { status: 401 }
      );
    }

    const token = signSessionToken(email, role, name);
    const response = NextResponse.json({ ok: true, email, role, name });

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
