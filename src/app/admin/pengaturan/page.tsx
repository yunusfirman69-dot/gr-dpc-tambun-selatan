import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminAccountsManager, {
  type AdminAccountRow,
} from "@/components/AdminAccountsManager";
import AdminShell from "@/components/AdminShell";
import { getAdminSession, PRIMARY_APPROVER_EMAIL } from "@/lib/admin-auth";
import { convexApi, getConvexClient } from "@/lib/convex-client";

async function AdminPengaturanContent() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  let admins: AdminAccountRow[] = [];
  const convex = getConvexClient();
  if (convex) {
    try {
      admins = (await convex.query(
        convexApi.admins.listAdmins,
        {}
      )) as AdminAccountRow[];
    } catch {
      admins = [];
    }
  }

  const isPrimaryApprover =
    session.email.toLowerCase() === PRIMARY_APPROVER_EMAIL.toLowerCase();

  return (
    <AdminShell email={session.email}>
      <AdminAccountsManager
        initialAdmins={admins}
        currentUserEmail={session.email}
        isPrimaryApprover={isPrimaryApprover}
      />
    </AdminShell>
  );
}

export default function AdminPengaturanPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f7f2ee] text-sm font-semibold text-[#8d6a5e]">
          Memuat pengaturan admin...
        </div>
      }
    >
      <AdminPengaturanContent />
    </Suspense>
  );
}
