import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminOfficialsManager from "@/components/AdminOfficialsManager";
import AdminShell from "@/components/AdminShell";
import { getAdminSession } from "@/lib/admin-auth";
import { getOfficialsData } from "@/lib/content-store";

async function AdminPengurusContent() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const officials = await getOfficialsData();

  return (
    <AdminShell email={session.email}>
      <AdminOfficialsManager initialOfficials={officials} />
    </AdminShell>
  );
}

export default function AdminPengurusPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f7f2ee] text-sm font-semibold text-[#8d6a5e]">
          Memuat pengelola pengurus...
        </div>
      }
    >
      <AdminPengurusContent />
    </Suspense>
  );
}
