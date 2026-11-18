import PageHeader from "@/components/PageHeader";
import { organizationInfo } from "@/data/placeholder";

export default function ProfilPage() {
  const { visiMisiResmi } = organizationInfo;

  return (
    <div>
      <PageHeader
        badge="Tentang Organisasi"
        title="Profil & Visi Misi"
        description="Mengenal perjalanan organisasi, visi utama, haluan gerakan, agenda perjuangan, serta cakupan wilayah kerja Partai Gerakan Rakyat di Kecamatan Tambun Selatan, Kabupaten Bekasi."
      />

      <section className="mx-auto max-w-7xl space-y-12 px-4 py-16 sm:px-6 lg:px-8">
        {/* 1. Perjalanan Organisasi (Sejarah & Latar Belakang) */}
        <div className="rounded-3xl border border-[#e7deda] bg-white p-8 sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff491a]">
            Perjalanan Organisasi
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#090909] sm:text-3xl">
            Sejarah & Latar Belakang
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-[#8d6a5e]">
            {organizationInfo.historySummary}
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {organizationInfo.historyTimeline.map((item) => (
              <div
                key={item.period}
                className="rounded-2xl border border-[#e7deda] bg-[#f7f2ee]/60 p-6"
              >
                <span className="inline-block rounded-full bg-[#ff491a]/10 px-3 py-1 text-xs font-extrabold text-[#ff491a]">
                  {item.period}
                </span>
                <h3 className="mt-3 text-lg font-extrabold text-[#090909]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#8d6a5e]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Visi Utama & Haluan Gerakan */}
        <div className="rounded-3xl border border-[#e7deda] bg-[#f7f2ee] p-8 sm:p-12">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#090909]">
              Visi Utama
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#ff491a] sm:text-5xl">
              {visiMisiResmi.visiUtama}
            </h2>
          </div>

          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[#e7deda] bg-white px-6 py-6 text-center shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff491a]">
              Haluan Gerakan
            </p>
            <p className="mt-2 text-lg font-extrabold text-[#090909] sm:text-2xl">
              {visiMisiResmi.haluanGerakan}
            </p>
          </div>

          {/* 3 Kolom: 5 Agenda, Panca Dharma, Lima Jalan */}
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {/* 5 Agenda Gerakan Rakyat */}
            <div className="rounded-2xl border border-[#e7deda] bg-white p-7 shadow-sm">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#090909]">
                5 Agenda Gerakan Rakyat
              </h3>
              <ol className="mt-5 space-y-3.5">
                {visiMisiResmi.agendaGerakanRakyat.map((item, idx) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ffc3b3]/50 text-xs font-extrabold text-[#ff491a]">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-semibold leading-snug text-[#090909]">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Panca Dharma Gerakan Rakyat */}
            <div className="rounded-2xl border border-[#e7deda] bg-white p-7 shadow-sm">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#090909]">
                Panca Dharma Gerakan Rakyat
              </h3>
              <ol className="mt-5 space-y-3.5">
                {visiMisiResmi.pancaDharma.map((item, idx) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ffc3b3]/50 text-xs font-extrabold text-[#ff491a]">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-semibold leading-snug text-[#090909]">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Lima Jalan Gerakan Rakyat */}
            <div className="rounded-2xl border border-[#e7deda] bg-white p-7 shadow-sm">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#090909]">
                Lima Jalan Gerakan Rakyat
              </h3>
              <ol className="mt-5 space-y-3.5">
                {visiMisiResmi.limaJalan.map((item, idx) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ffc3b3]/50 text-xs font-extrabold text-[#ff491a]">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-semibold leading-snug text-[#090909]">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* 3. Misi Perjuangan */}
        <div className="rounded-3xl border border-[#e7deda] bg-[#f7f2ee] p-8 sm:p-12">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#090909]">
              Misi Perjuangan
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-[#090909] sm:text-3xl">
              Empat Pilar Misi Partai Gerakan Rakyat
            </h2>
          </div>

          <div className="mt-8 space-y-4">
            {visiMisiResmi.misiPerjuangan.map((misi) => (
              <div
                key={misi.number}
                className="flex flex-col gap-4 rounded-2xl border border-[#e7deda] bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:gap-6 sm:p-7"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ff491a] text-base font-black text-white shadow-sm">
                  {misi.number}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#090909] sm:text-xl">
                    {misi.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#8d6a5e] sm:text-base">
                    {misi.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Wilayah Organisasi */}
        <div className="rounded-3xl border border-[#e7deda] bg-white p-8 sm:p-10">
          <h2 className="text-2xl font-extrabold text-[#090909]">
            Wilayah Kerja Organisasi
          </h2>
          <p className="mt-2 text-sm text-[#8d6a5e]">
            Cakupan pembinaan ranting Partai Gerakan Rakyat di Kecamatan Tambun
            Selatan, Kabupaten Bekasi:
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {organizationInfo.areas.map((area) => (
              <div
                key={area}
                className="rounded-xl border border-[#e7deda] bg-[#f7f2ee]/60 px-4 py-3 text-center text-sm font-semibold text-[#090909]"
              >
                {area}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
