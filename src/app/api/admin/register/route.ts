import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  getAdminSession,
  hashPassword,
  PRIMARY_APPROVER_EMAIL,
  signSessionToken,
  type AdminRole,
} from "@/lib/admin-auth";
import { convexApi, getConvexClient } from "@/lib/convex-client";

export async function GET() {
  const session = await getAdminSession();
  const convex = getConvexClient();
  let adminCount = 0;

  if (convex) {
    try {
      adminCount = (await convex.query(convexApi.admins.countAdmins, {})) as number;
    } catch {
      adminCount = 0;
    }
  }

  return NextResponse.json({
    convexReady: Boolean(convex),
    hasAdmins: adminCount > 0,
    isPrimaryApprover:
      session?.email.toLowerCase() === PRIMARY_APPROVER_EMAIL.toLowerCase(),
    approverEmail: PRIMARY_APPROVER_EMAIL,
  });
}

export async function POST(request: Request) {
  const convex = getConvexClient();
  if (!convex) {
    return NextResponse.json(
      { error: "Database Convex belum dikonfigurasi." },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as {
      fullName?: string;
      email?: string;
      password?: string;
      role?: AdminRole;
    };

    const fullName = body.fullName?.trim() || "";
    const email = body.email?.trim().toLowerCase() || "";
    const password = body.password || "";

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Nama lengkap, email, dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Kata sandi minimal 8 karakter." },
        { status: 400 }
      );
    }

    const session = await getAdminSession();
    const adminCount = (await convex.query(
      convexApi.admins.countAdmins,
      {}
    )) as number;

    const isPrimaryApproverSession =
      session?.email.toLowerCase() === PRIMARY_APPROVER_EMAIL.toLowerCase();
    const isInitialPrimarySetup =
      adminCount === 0 && email === PRIMARY_APPROVER_EMAIL.toLowerCase();

    const shouldAutoApprove = isInitialPrimarySetup || isPrimaryApproverSession;
    const assignedStatus = shouldAutoApprove ? "approved" : "pending";
    const assignedRole: AdminRole = isInitialPrimarySetup
      ? "super_admin"
      : isPrimaryApproverSession &&
          (body.role === "super_admin" || body.role === "editor")
        ? body.role
        : "editor";

    const createdAt = new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date());

    const passwordHash = await hashPassword(password);

    const created = (await convex.mutation(convexApi.admins.createAdmin, {
      fullName,
      email,
      passwordHash,
      role: assignedRole,
      status: assignedStatus,
      createdAt,
    })) as {
      id: string;
      fullName: string;
      email: string;
      role: AdminRole;
      status: "pending" | "approved" | "rejected";
      createdAt: string;
    };

    const response = NextResponse.json(
      {
        ok: true,
        pending: assignedStatus === "pending",
        message:
          assignedStatus === "pending"
            ? `Permintaan registrasi dikirim! Akun Anda menunggu persetujuan dari ${PRIMARY_APPROVER_EMAIL} sebelum bisa login.`
            : "Akun admin berhasil didaftarkan dan langsung aktif.",
        admin: created,
      },
      { status: 201 }
    );

    if (isInitialPrimarySetup && !session) {
      const token = signSessionToken(
        created.email,
        created.role,
        created.fullName
      );
      response.cookies.set(ADMIN_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });
    }

    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    const causeMsg =
      err instanceof Error && err.cause instanceof Error ? err.cause.message : "";
    const fullErr = `${message} ${causeMsg}`;

    if (fullErr.includes("EMAIL_EXISTS")) {
      return NextResponse.json(
        { error: "Email tersebut sudah terdaftar atau sedang menunggu persetujuan." },
        { status: 409 }
      );
    }
    if (
      fullErr.includes("UNABLE_TO_GET_ISSUER_CERT") ||
      fullErr.includes("certificate") ||
      fullErr.includes("fetch failed")
    ) {
      return NextResponse.json(
        {
          error:
            "Koneksi SSL ke Convex terblokir sertifikat Windows. Jalankan `$env:NODE_OPTIONS = \"--use-system-ca\"` sebelum `npm run dev`.",
        },
        { status: 500 }
      );
    }
    if (fullErr.includes("Could not find public function")) {
      return NextResponse.json(
        {
          error:
            "Fungsi Convex belum di-deploy. Jalankan `npx convex dev --once` di terminal terlebih dahulu.",
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        error: `Gagal mendaftarkan akun admin: ${message || "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}
