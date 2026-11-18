import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import {
  getProgramKerjaData,
  saveProgramKerjaData,
  type StoredProgramKerja,
} from "@/lib/content-store";

export async function GET() {
  const data = await getProgramKerjaData();
  return NextResponse.json(data);
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
    const body = (await request.json()) as Partial<StoredProgramKerja>;
    const current = await getProgramKerjaData();

    const updated: StoredProgramKerja = {
      intro: typeof body.intro === "string" ? body.intro.trim() : current.intro,
      landasan:
        typeof body.landasan === "string"
          ? body.landasan.trim()
          : current.landasan,
      fields: Array.isArray(body.fields) ? body.fields : current.fields,
      implementationMatrix: Array.isArray(body.implementationMatrix)
        ? body.implementationMatrix
        : current.implementationMatrix,
    };

    const saved = await saveProgramKerjaData(updated);
    revalidatePath("/program-kerja");

    return NextResponse.json(saved);
  } catch {
    return NextResponse.json(
      { error: "Gagal menyimpan perubahan program kerja." },
      { status: 400 }
    );
  }
}
