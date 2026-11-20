import { NextResponse } from "next/server";
import { getAdminSession, PRIMARY_APPROVER_EMAIL } from "@/lib/admin-auth";
import { convexApi, getConvexClient } from "@/lib/convex-client";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const convex = getConvexClient();
  if (!convex) {
    return NextResponse.json({ admins: [] });
  }

  try {
    const admins = await convex.query(convexApi.admins.listAdmins, {});
    return NextResponse.json({ admins });
  } catch {
    return NextResponse.json({ admins: [] });
  }
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (
    !session ||
    session.email.toLowerCase() !== PRIMARY_APPROVER_EMAIL.toLowerCase()
  ) {
    return NextResponse.json(
      {
        error: `Hanya admin ${PRIMARY_APPROVER_EMAIL} yang dapat menyetujui atau menolak pendaftaran admin.`,
      },
      { status: 403 }
    );
  }

  const convex = getConvexClient();
  if (!convex) {
    return NextResponse.json(
      { error: "Convex belum dikonfigurasi." },
      { status: 503 }
    );
  }

  try {
    const { id, status } = (await request.json()) as {
      id?: string;
      status?: "approved" | "rejected";
    };

    if (!id || (status !== "approved" && status !== "rejected")) {
      return NextResponse.json(
        { error: "ID admin dan status (approved/rejected) wajib diisi." },
        { status: 400 }
      );
    }

    const updated = await convex.mutation(convexApi.admins.updateAdminStatus, {
      id,
      status,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Akun admin tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, admin: updated });
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui status persetujuan admin." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (
    !session ||
    (session.email.toLowerCase() !== PRIMARY_APPROVER_EMAIL.toLowerCase() &&
      session.role !== "super_admin")
  ) {
    return NextResponse.json(
      { error: `Hanya ${PRIMARY_APPROVER_EMAIL} yang dapat menghapus akun admin.` },
      { status: 403 }
    );
  }

  const convex = getConvexClient();
  if (!convex) {
    return NextResponse.json(
      { error: "Convex belum dikonfigurasi." },
      { status: 503 }
    );
  }

  try {
    const { id } = (await request.json()) as { id?: string };
    if (!id) {
      return NextResponse.json({ error: "ID admin wajib diisi." }, { status: 400 });
    }

    await convex.mutation(convexApi.admins.deleteAdmin, { id });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("CANNOT_DELETE_LAST_ADMIN")) {
      return NextResponse.json(
        { error: "Tidak dapat menghapus satu-satunya akun admin." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Gagal menghapus akun admin." },
      { status: 500 }
    );
  }
}
