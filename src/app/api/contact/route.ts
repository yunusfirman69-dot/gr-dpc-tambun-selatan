import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import {
  getContactData,
  saveContactData,
  type StoredContactInfo,
} from "@/lib/content-store";

export async function GET() {
  const contact = await getContactData();
  return NextResponse.json({ contact });
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
      contact?: StoredContactInfo;
    };

    if (!body.contact || typeof body.contact.address !== "string") {
      return NextResponse.json(
        { error: "Format data kontak tidak valid." },
        { status: 400 }
      );
    }

    const saved = await saveContactData(body.contact);
    revalidatePath("/kontak");
    revalidatePath("/");

    return NextResponse.json({ contact: saved });
  } catch {
    return NextResponse.json(
      { error: "Gagal menyimpan data kontak." },
      { status: 500 }
    );
  }
}
