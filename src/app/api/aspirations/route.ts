import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { addAspirationData, getAspirationsData } from "@/lib/content-store";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const aspirations = await getAspirationsData();
  return NextResponse.json({ aspirations });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      fullName?: string;
      contact?: string;
      village?: string;
      message?: string;
    };

    const fullName = body.fullName?.trim() || "";
    const contact = body.contact?.trim() || "";
    const village = body.village?.trim() || "";
    const message = body.message?.trim() || "";

    if (!fullName || !contact || !village || !message) {
      return NextResponse.json(
        { error: "Semua kolom pesan/aspirasi wajib diisi." },
        { status: 400 }
      );
    }

    const created = await addAspirationData({
      fullName,
      contact,
      village,
      message,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/aspirasi");
    return NextResponse.json({ aspiration: created }, { status: 201 });
  } catch (err) {
    console.error("Failed to save aspiration:", err);
    return NextResponse.json(
      { error: "Gagal mengirim pesan aspirasi. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
