import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import {
  getOfficialsData,
  saveOfficialsData,
  type StoredOfficialItem,
} from "@/lib/content-store";

export async function GET() {
  const officials = await getOfficialsData();
  return NextResponse.json({ officials });
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Tidak diizinkan. Silakan login terlebih dahulu." },
      { status: 401 }
    );
  }

  try {
    const body = (await request.json()) as {
      officials?: StoredOfficialItem[];
    };

    if (!Array.isArray(body.officials)) {
      return NextResponse.json(
        { error: "Format data pengurus tidak valid." },
        { status: 400 }
      );
    }

    const saved = await saveOfficialsData(body.officials);
    revalidatePath("/pengurus");

    return NextResponse.json({ officials: saved });
  } catch {
    return NextResponse.json(
      { error: "Gagal menyimpan data pengurus." },
      { status: 500 }
    );
  }
}
