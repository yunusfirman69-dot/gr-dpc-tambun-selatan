import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminProgramManager from "@/components/AdminProgramManager";
import AdminShell from "@/components/AdminShell";
import { getAdminSession } from "@/lib/admin-auth";
import { getProgramKerjaData } from "@/lib/content-store";

async function AdminProgramKerjaContent() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const programData = await getProgramKerjaData();

  return (
    <AdminShell email={session.email}>
      <AdminProgramManager initialData={programData} />
    </AdminShell>
  );
}

export default function AdminProgramKerjaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f7f2ee] text-sm font-semibold text-[#8d6a5e]">
          Memuat pengelola program kerja...
        </div>
      }
    >
      <AdminProgramKerjaContent />
    </Suspense>
  );
}
