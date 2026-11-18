import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminNewsManager from "@/components/AdminNewsManager";
import AdminShell from "@/components/AdminShell";
import { getAdminSession } from "@/lib/admin-auth";
import { getNewsPosts } from "@/lib/content-store";

async function AdminBeritaContent() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const posts = await getNewsPosts();

  return (
    <AdminShell email={session.email}>
      <AdminNewsManager initialPosts={posts} />
    </AdminShell>
  );
}

export default function AdminBeritaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f7f2ee] text-sm font-semibold text-[#8d6a5e]">
          Memuat pengelola berita...
        </div>
      }
    >
      <AdminBeritaContent />
    </Suspense>
  );
}
