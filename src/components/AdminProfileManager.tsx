"use client";

import { FormEvent, useState } from "react";
import type { StoredOrganizationProfile } from "@/lib/content-store";

export default function AdminProfileManager({
  initialProfile,
}: {
  initialProfile: StoredOrganizationProfile;
}) {
  const [profile, setProfile] =
    useState<StoredOrganizationProfile>(initialProfile);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });

      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        setStatus({
          type: "err",
          text: err.error || "Gagal menyimpan profil & visi misi.",
        });
        return;
      }

      const data = (await res.json()) as {
        profile: StoredOrganizationProfile;
      };
      setProfile(data.profile);
      setStatus({
        type: "ok",
        text: "Profil & Visi Misi berhasil disimpan dan langsung tayang di halaman publik!",
      });
    } catch {
      setStatus({ type: "err", text: "Terjadi kesalahan koneksi." });
    } finally {
      setSaving(false);
    }
  }

  function updateStringList(
    key: "agendaGerakanRakyat" | "pancaDharma" | "limaJalan" | "areas",
    idx: number,
    value: string
  ) {
    setProfile((prev) => ({
      ...prev,
      [key]: prev[key].map((item, i) => (i === idx ? value : item)),
    }));
  }

  function addStringListItem(
    key: "agendaGerakanRakyat" | "pancaDharma" | "limaJalan" | "areas",
    defaultText: string
  ) {
    setProfile((prev) => ({
      ...prev,
      [key]: [...prev[key], defaultText],
    }));
  }

  function removeStringListItem(
    key: "agendaGerakanRakyat" | "pancaDharma" | "limaJalan" | "areas",
    idx: number
  ) {
    setProfile((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== idx),
    }));
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#090909] sm:text-3xl">
          Kelola Profil &amp; Visi Misi
        </h1>
        <p className="mt-1 text-sm text-[#8d6a5e]">
          Ubah sejarah organisasi, visi utama, haluan gerakan, 5 agenda, Panca
          Dharma, Lima Jalan, misi perjuangan, serta wilayah kerja yang tampil
          di halaman <code className="font-mono text-xs">/profil</code>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Visi Utama & Haluan */}
        <div className="space-y-4 rounded-2xl border border-[#e7deda] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-[#090909]">
            Visi Utama &amp; Haluan Gerakan
          </h2>
          <div>
            <label className="block text-xs font-bold text-[#090909]">
              Visi Utama
            </label>
            <input
              type="text"
              required
              value={profile.visiUtama}
              onChange={(e) =>
                setProfile({ ...profile, visiUtama: e.target.value })
              }
              className="mt-1 w-full rounded-xl border border-[#e7deda] px-4 py-2.5 text-sm outline-none focus:border-[#ff491a]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#090909]">
              Haluan Gerakan
            </label>
            <input
              type="text"
              required
              value={profile.haluanGerakan}
              onChange={(e) =>
                setProfile({ ...profile, haluanGerakan: e.target.value })
              }
              className="mt-1 w-full rounded-xl border border-[#e7deda] px-4 py-2.5 text-sm outline-none focus:border-[#ff491a]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#090909]">
              Tagline Organisasi
            </label>
            <input
              type="text"
              required
              value={profile.tagline}
              onChange={(e) =>
                setProfile({ ...profile, tagline: e.target.value })
              }
              className="mt-1 w-full rounded-xl border border-[#e7deda] px-4 py-2.5 text-sm outline-none focus:border-[#ff491a]"
            />
          </div>
        </div>

        {/* 2. Sejarah & Perjalanan Organisasi */}
        <div className="space-y-4 rounded-2xl border border-[#e7deda] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-[#090909]">
              Sejarah &amp; Perjalanan Organisasi
            </h2>
            <button
              type="button"
              onClick={() =>
                setProfile((prev) => ({
                  ...prev,
                  historyTimeline: [
                    ...prev.historyTimeline,
                    { period: "Periode Baru", title: "", description: "" },
                  ],
                }))
              }
              className="rounded-full bg-[#090909] px-4 py-1.5 text-xs font-bold text-white hover:bg-neutral-800"
            >
              + Tambah Linimasa
            </button>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#090909]">
              Ringkasan Sejarah
            </label>
            <textarea
              rows={3}
              required
              value={profile.historySummary}
              onChange={(e) =>
                setProfile({ ...profile, historySummary: e.target.value })
              }
              className="mt-1 w-full rounded-xl border border-[#e7deda] px-4 py-2.5 text-sm outline-none focus:border-[#ff491a]"
            />
          </div>

          <div className="space-y-4">
            {profile.historyTimeline.map((item, idx) => (
              <div
                key={idx}
                className="space-y-3 rounded-xl border border-[#e7deda] bg-[#f7f2ee]/50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-[#ff491a]">
                    Linimasa #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setProfile((prev) => ({
                        ...prev,
                        historyTimeline: prev.historyTimeline.filter(
                          (_, i) => i !== idx
                        ),
                      }))
                    }
                    className="rounded-lg bg-red-50 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-100"
                  >
                    Hapus
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#090909]">
                      Periode
                    </label>
                    <input
                      type="text"
                      required
                      value={item.period}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          historyTimeline: prev.historyTimeline.map((t, i) =>
                            i === idx ? { ...t, period: e.target.value } : t
                          ),
                        }))
                      }
                      className="mt-1 w-full rounded-lg border border-[#e7deda] bg-white px-3 py-2 text-xs outline-none focus:border-[#ff491a]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#090909]">
                      Judul
                    </label>
                    <input
                      type="text"
                      required
                      value={item.title}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          historyTimeline: prev.historyTimeline.map((t, i) =>
                            i === idx ? { ...t, title: e.target.value } : t
                          ),
                        }))
                      }
                      className="mt-1 w-full rounded-lg border border-[#e7deda] bg-white px-3 py-2 text-xs outline-none focus:border-[#ff491a]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#090909]">
                    Deskripsi
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={item.description}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        historyTimeline: prev.historyTimeline.map((t, i) =>
                          i === idx ? { ...t, description: e.target.value } : t
                        ),
                      }))
                    }
                    className="mt-1 w-full rounded-lg border border-[#e7deda] bg-white px-3 py-2 text-xs outline-none focus:border-[#ff491a]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 5 Agenda, Panca Dharma, Lima Jalan */}
        <div className="grid gap-6 lg:grid-cols-3">
          {(
            [
              ["agendaGerakanRakyat", "5 Agenda Gerakan Rakyat"],
              ["pancaDharma", "Panca Dharma Gerakan Rakyat"],
              ["limaJalan", "Lima Jalan Gerakan Rakyat"],
            ] as const
          ).map(([fieldKey, heading]) => (
            <div
              key={fieldKey}
              className="space-y-3 rounded-2xl border border-[#e7deda] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#090909]">
                  {heading}
                </h2>
                <button
                  type="button"
                  onClick={() => addStringListItem(fieldKey, "Poin baru")}
                  className="rounded-full bg-[#090909] px-3 py-1 text-[11px] font-bold text-white"
                >
                  + Tambah
                </button>
              </div>
              <div className="space-y-2.5">
                {profile[fieldKey].map((val, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-5 text-xs font-bold text-[#ff491a]">
                      {idx + 1}.
                    </span>
                    <input
                      type="text"
                      required
                      value={val}
                      onChange={(e) =>
                        updateStringList(fieldKey, idx, e.target.value)
                      }
                      className="flex-1 rounded-lg border border-[#e7deda] px-3 py-2 text-xs outline-none focus:border-[#ff491a]"
                    />
                    <button
                      type="button"
                      onClick={() => removeStringListItem(fieldKey, idx)}
                      className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 4. Misi Perjuangan */}
        <div className="space-y-4 rounded-2xl border border-[#e7deda] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-[#090909]">
              Misi Perjuangan
            </h2>
            <button
              type="button"
              onClick={() =>
                setProfile((prev) => ({
                  ...prev,
                  misiPerjuangan: [
                    ...prev.misiPerjuangan,
                    {
                      number: `0${prev.misiPerjuangan.length + 1}`,
                      title: "",
                      description: "",
                    },
                  ],
                }))
              }
              className="rounded-full bg-[#090909] px-4 py-1.5 text-xs font-bold text-white hover:bg-neutral-800"
            >
              + Tambah Misi
            </button>
          </div>
          <div className="space-y-4">
            {profile.misiPerjuangan.map((misi, idx) => (
              <div
                key={idx}
                className="space-y-3 rounded-xl border border-[#e7deda] bg-[#f7f2ee]/50 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#ff491a]">
                    Misi #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setProfile((prev) => ({
                        ...prev,
                        misiPerjuangan: prev.misiPerjuangan.filter(
                          (_, i) => i !== idx
                        ),
                      }))
                    }
                    className="rounded-lg bg-red-50 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-100"
                  >
                    Hapus
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#090909]">
                      Nomor
                    </label>
                    <input
                      type="text"
                      required
                      value={misi.number}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          misiPerjuangan: prev.misiPerjuangan.map((m, i) =>
                            i === idx ? { ...m, number: e.target.value } : m
                          ),
                        }))
                      }
                      className="mt-1 w-full rounded-lg border border-[#e7deda] bg-white px-3 py-2 text-xs outline-none focus:border-[#ff491a]"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-[#090909]">
                      Judul Misi
                    </label>
                    <input
                      type="text"
                      required
                      value={misi.title}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          misiPerjuangan: prev.misiPerjuangan.map((m, i) =>
                            i === idx ? { ...m, title: e.target.value } : m
                          ),
                        }))
                      }
                      className="mt-1 w-full rounded-lg border border-[#e7deda] bg-white px-3 py-2 text-xs outline-none focus:border-[#ff491a]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#090909]">
                    Deskripsi Misi
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={misi.description}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        misiPerjuangan: prev.misiPerjuangan.map((m, i) =>
                          i === idx ? { ...m, description: e.target.value } : m
                        ),
                      }))
                    }
                    className="mt-1 w-full rounded-lg border border-[#e7deda] bg-white px-3 py-2 text-xs outline-none focus:border-[#ff491a]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Wilayah Kerja */}
        <div className="space-y-4 rounded-2xl border border-[#e7deda] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-[#090909]">
              Wilayah Kerja Organisasi
            </h2>
            <button
              type="button"
              onClick={() => addStringListItem("areas", "Desa Baru")}
              className="rounded-full bg-[#090909] px-4 py-1.5 text-xs font-bold text-white hover:bg-neutral-800"
            >
              + Tambah Wilayah
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {profile.areas.map((area, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) =>
                    updateStringList("areas", idx, e.target.value)
                  }
                  className="flex-1 rounded-lg border border-[#e7deda] px-3 py-2 text-xs outline-none focus:border-[#ff491a]"
                />
                <button
                  type="button"
                  onClick={() => removeStringListItem("areas", idx)}
                  className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {status && (
          <div
            className={`rounded-xl px-4 py-3 text-sm font-semibold ${
              status.type === "ok"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {status.text}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[#ff491a] px-8 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#e03a0e] disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Simpan Profil & Visi Misi"}
        </button>
      </form>
    </div>
  );
}
