import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminContactManager from "@/components/AdminContactManager";
import AdminShell from "@/components/AdminShell";
import { getAdminSession } from "@/lib/admin-auth";
import { getContactData } from "@/lib/content-store";

async function AdminKontakContent() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const contact = await getContactData();

  return (
    <AdminShell email={session.email}>
      <AdminContactManager initialContact={contact} />
    </AdminShell>
  );
}

export default function AdminKontakPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f7f2ee] text-sm font-semibold text-[#8d6a5e]">
          Memuat pengelola kontak...
        </div>
      }
    >
      <AdminKontakContent />
    </Suspense>
  );
}
