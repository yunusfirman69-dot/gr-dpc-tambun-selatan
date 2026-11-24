import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import {
  getProfileData,
  saveProfileData,
  type StoredOrganizationProfile,
} from "@/lib/content-store";

export async function GET() {
  const profile = await getProfileData();
  return NextResponse.json({ profile });
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
      profile?: StoredOrganizationProfile;
    };

    if (!body.profile || typeof body.profile.visiUtama !== "string") {
      return NextResponse.json(
        { error: "Format data profil & visi misi tidak valid." },
        { status: 400 }
      );
    }

    const saved = await saveProfileData(body.profile);
    revalidatePath("/profil");
    revalidatePath("/");

    return NextResponse.json({ profile: saved });
  } catch {
    return NextResponse.json(
      { error: "Gagal menyimpan profil & visi misi." },
      { status: 500 }
    );
  }
}
