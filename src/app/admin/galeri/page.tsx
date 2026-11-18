import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminGalleryManager from "@/components/AdminGalleryManager";
import AdminShell from "@/components/AdminShell";
import { getAdminSession } from "@/lib/admin-auth";
import { getGalleryItems } from "@/lib/content-store";

async function AdminGaleriContent() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const items = await getGalleryItems();

  return (
    <AdminShell email={session.email}>
      <AdminGalleryManager initialItems={items} />
    </AdminShell>
  );
}

export default function AdminGaleriPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f7f2ee] text-sm font-semibold text-[#8d6a5e]">
          Memuat pengelola galeri...
        </div>
      }
    >
      <AdminGaleriContent />
    </Suspense>
  );
}
