import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminProfileManager from "@/components/AdminProfileManager";
import AdminShell from "@/components/AdminShell";
import { getAdminSession } from "@/lib/admin-auth";
import { getProfileData } from "@/lib/content-store";

async function AdminProfilContent() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const profile = await getProfileData();

  return (
    <AdminShell email={session.email}>
      <AdminProfileManager initialProfile={profile} />
    </AdminShell>
  );
}

export default function AdminProfilPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f7f2ee] text-sm font-semibold text-[#8d6a5e]">
          Memuat pengelola profil &amp; visi misi...
        </div>
      }
    >
      <AdminProfilContent />
    </Suspense>
  );
}
