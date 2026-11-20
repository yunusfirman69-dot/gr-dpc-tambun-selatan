"use client";

import { FormEvent, useState } from "react";
import type { AdminRole } from "@/lib/admin-auth";

export interface AdminAccountRow {
  id: string;
  fullName: string;
  email: string;
  role: AdminRole;
  status?: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function AdminAccountsManager({
  initialAdmins,
  currentUserEmail,
  isPrimaryApprover,
}: {
  initialAdmins: AdminAccountRow[];
  currentUserEmail: string;
  isPrimaryApprover: boolean;
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

  const pendingAdmins = admins.filter((a) => a.status === "pending");

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
        text: `Akun admin ${data.admin.email} berhasil ditambahkan & disetujui!`,
      });
    } catch {
      setStatus({ type: "err", text: "Terjadi kesalahan koneksi." });
    } finally {
      setSaving(false);
    }
  }

  async function handleDecision(id: string, decision: "approved" | "rejected") {
    setStatus(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/accounts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: decision }),
      });

      const data = (await res.json()) as {
        admin?: AdminAccountRow;
        error?: string;
      };

      if (!res.ok || !data.admin) {
        setStatus({
          type: "err",
          text: data.error || "Gagal memproses persetujuan.",
        });
        return;
      }

      setAdmins((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: decision } : a))
      );
      setStatus({
        type: "ok",
        text:
          decision === "approved"
            ? `Akun ${data.admin.email} telah disetujui dan bisa login sekarang.`
            : `Permintaan akun ${data.admin.email} ditolak.`,
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
          Pengaturan & Persetujuan Admin
        </h1>
        <p className="mt-1 text-sm text-[#8d6a5e]">
          Registrasi akun admin baru wajib disetujui oleh{" "}
          <strong>gerakanrakyattamsel@gmail.com</strong>.
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

      {/* Bagian Persetujuan Khusus gerakanrakyattamsel@gmail.com */}
      {isPrimaryApprover && pendingAdmins.length > 0 && (
        <div className="rounded-3xl border-2 border-[#ff491a] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-[#ff491a]">
            Menunggu Persetujuan Anda ({pendingAdmins.length})
          </h2>
          <p className="mt-1 text-xs text-[#8d6a5e]">
            Setujui atau tolak permintaan pendaftaran admin berikut:
          </p>

          <div className="mt-4 space-y-3">
            {pendingAdmins.map((req) => (
              <div
                key={req.id}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-[#e7deda] bg-[#f7f2ee]/60 p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="text-sm font-extrabold text-[#090909]">
                    {req.fullName}
                  </h3>
                  <p className="text-xs text-[#8d6a5e]">
                    {req.email} • Diajukan {req.createdAt}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleDecision(req.id, "approved")}
                    className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    ✓ Setujui
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleDecision(req.id, "rejected")}
                    className="rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
                  >
                    Tolak
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-12">
        {isPrimaryApprover && (
          <div className="lg:col-span-5">
            <form
              onSubmit={handleCreate}
              className="rounded-3xl border border-[#e7deda] bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-extrabold text-[#090909]">
                Tambah Admin (Langsung Disetujui)
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

        <div className={isPrimaryApprover ? "lg:col-span-7" : "lg:col-span-12"}>
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-[#090909]">
              Daftar Akun Admin ({admins.length})
            </h2>

            {admins.map((admin) => {
              const st = admin.status ?? "approved";
              return (
                <div
                  key={admin.id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-[#e7deda] bg-white p-5 shadow-sm sm:flex-row sm:items-center"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#ff491a]/10 px-2.5 py-0.5 text-[11px] font-bold uppercase text-[#ff491a]">
                        {admin.role === "super_admin"
                          ? "Super Admin"
                          : "Editor"}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          st === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : st === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {st === "approved"
                          ? "Disetujui"
                          : st === "pending"
                            ? "Menunggu Persetujuan"
                            : "Ditolak"}
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

                  {isPrimaryApprover &&
                    admin.email.toLowerCase() !==
                      currentUserEmail.toLowerCase() && (
                      <div className="flex shrink-0 gap-2">
                        {st === "pending" && (
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => handleDecision(admin.id, "approved")}
                            className="rounded-full bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                          >
                            Setujui
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(admin.id)}
                          className="rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
