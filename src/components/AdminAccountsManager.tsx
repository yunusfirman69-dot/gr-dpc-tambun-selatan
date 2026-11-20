"use client";

import { FormEvent, useState } from "react";
import type { AdminRole } from "@/lib/admin-auth";

export interface AdminAccountRow {
  id: string;
  fullName: string;
  email: string;
  role: AdminRole;
  createdAt: string;
}

export default function AdminAccountsManager({
  initialAdmins,
  currentUserEmail,
  isSuperAdmin,
}: {
  initialAdmins: AdminAccountRow[];
  currentUserEmail: string;
  isSuperAdmin: boolean;
}) {
  const [admins, setAdmins] = useState<AdminAccountRow[]>(initialAdmins);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("editor");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setSaving(true);

    try {
      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, role }),
      });

      const data = (await res.json()) as {
        admin?: AdminAccountRow;
        error?: string;
      };

      if (!res.ok || !data.admin) {
        setStatus({
          type: "err",
          text: data.error || "Gagal menambah akun admin.",
        });
        return;
      }

      setAdmins((prev) => [data.admin!, ...prev]);
      setFullName("");
      setEmail("");
      setPassword("");
      setStatus({
        type: "ok",
        text: `Akun admin ${data.admin.email} berhasil ditambahkan ke Convex!`,
      });
    } catch {
      setStatus({ type: "err", text: "Terjadi kesalahan koneksi." });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus akun admin ini?")) return;
    setStatus(null);
    const res = await fetch("/api/admin/accounts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setStatus({
        type: "err",
        text: data.error || "Gagal menghapus akun admin.",
      });
      return;
    }
    setAdmins((prev) => prev.filter((a) => a.id !== id));
    setStatus({ type: "ok", text: "Akun admin berhasil dihapus." });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#090909] sm:text-3xl">
          Pengaturan Akun & Peran Admin
        </h1>
        <p className="mt-1 text-sm text-[#8d6a5e]">
          Kelola akun admin yang tersimpan di tabel <code>admins</code> Convex.
        </p>
      </div>

      {status && (
        <div
          className={`rounded-2xl px-5 py-3.5 text-sm font-semibold ${
            status.type === "ok"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {status.text}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-12">
        {isSuperAdmin && admins.length === 0 && (
          <div className="lg:col-span-5">
            <form
              onSubmit={handleCreate}
              className="rounded-3xl border border-[#e7deda] bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-extrabold text-[#090909]">
                Tambah Akun Admin Baru
              </h2>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#090909]">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nama pengurus"
                    className="mt-1 w-full rounded-xl border border-[#e7deda] px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#090909]">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@dpc-tambunselatan.org"
                    className="mt-1 w-full rounded-xl border border-[#e7deda] px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#090909]">
                    Kata Sandi (Min. 8 karakter) *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1 w-full rounded-xl border border-[#e7deda] px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#090909]">
                    Peran Pengguna
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as AdminRole)}
                    className="mt-1 w-full rounded-xl border border-[#e7deda] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#ff491a]"
                  >
                    <option value="editor">Editor Konten</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-full bg-[#ff491a] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#e03a0e] disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "+ Daftarkan Admin"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className={isSuperAdmin && admins.length === 0 ? "lg:col-span-7" : "lg:col-span-12"}>
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-[#090909]">
              Daftar Admin Terdaftar ({admins.length})
            </h2>

            {admins.length === 0 ? (
              <div className="rounded-2xl border border-[#e7deda] bg-white p-6 text-sm text-[#8d6a5e]">
                Belum ada akun admin yang terdaftar di database Convex. Gunakan
                form di samping untuk mendaftarkan akun pertama.
              </div>
            ) : (
              admins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-[#e7deda] bg-white p-5 shadow-sm sm:flex-row sm:items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#ff491a]/10 px-2.5 py-0.5 text-[11px] font-bold uppercase text-[#ff491a]">
                        {admin.role === "super_admin"
                          ? "Super Admin"
                          : "Editor"}
                      </span>
                      <span className="text-xs text-[#8d6a5e]">
                        {admin.createdAt}
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-base font-extrabold text-[#090909]">
                      {admin.fullName}
                    </h3>
                    <p className="text-xs text-[#8d6a5e]">{admin.email}</p>
                  </div>

                  {isSuperAdmin &&
                    admin.email.toLowerCase() !==
                      currentUserEmail.toLowerCase() && (
                      <button
                        type="button"
                        onClick={() => handleDelete(admin.id)}
                        className="self-start rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 sm:self-center"
                      >
                        Hapus
                      </button>
                    )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
