import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminMembersManager from "@/components/AdminMembersManager";
import AdminShell from "@/components/AdminShell";
import { getAdminSession } from "@/lib/admin-auth";
import { getMembersData } from "@/lib/content-store";

async function AdminAnggotaContent() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const members = await getMembersData();

  return (
    <AdminShell email={session.email}>
      <AdminMembersManager initialMembers={members} />
    </AdminShell>
  );
}

export default function AdminAnggotaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f7f2ee] text-sm font-semibold text-[#8d6a5e]">
          Memuat data anggota privat...
        </div>
      }
    >
      <AdminAnggotaContent />
    </Suspense>
  );
}
