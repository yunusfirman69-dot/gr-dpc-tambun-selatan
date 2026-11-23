import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminAspirationsManager from "@/components/AdminAspirationsManager";
import AdminShell from "@/components/AdminShell";
import { getAdminSession } from "@/lib/admin-auth";
import { getAspirationsData } from "@/lib/content-store";

async function AdminAspirasiContent() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const aspirations = await getAspirationsData();

  return (
    <AdminShell email={session.email}>
      <AdminAspirationsManager initialAspirations={aspirations} />
    </AdminShell>
  );
}

export default function AdminAspirasiPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f7f2ee] text-sm font-semibold text-[#8d6a5e]">
          Memuat data aspirasi &amp; pesan...
        </div>
      }
    >
      <AdminAspirasiContent />
    </Suspense>
  );
}
