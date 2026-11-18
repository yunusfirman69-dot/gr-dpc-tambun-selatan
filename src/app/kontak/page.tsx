import { connection } from "next/server";
import { Suspense } from "react";
import ContactForm from "@/components/ContactForm";
import MemberRegistrationForm from "@/components/MemberRegistrationForm";
import PageHeader from "@/components/PageHeader";
import { getContactData } from "@/lib/content-store";

async function KontakContent() {
  await connection();
  const contact = await getContactData();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-12">
        {/* Info Sekretariat */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-3xl border border-[#e7deda] bg-[#f7f2ee] p-7">
            <h2 className="text-xl font-extrabold text-[#090909]">
              Sekretariat DPC Tambun Selatan
            </h2>
            <div className="mt-5 space-y-4 text-sm">
              <div>
                <p className="font-bold text-[#090909]">Alamat</p>
                <p className="mt-1 text-[#8d6a5e]">{contact.address}</p>
              </div>
              <div>
                <p className="font-bold text-[#090909]">Telepon / WhatsApp</p>
                <p className="mt-1 text-[#8d6a5e]">
                  {contact.phone} • {contact.whatsapp}
                </p>
              </div>
              <div>
                <p className="font-bold text-[#090909]">Email Resmi</p>
                <p className="mt-1 text-[#8d6a5e]">{contact.email}</p>
              </div>
              <div>
                <p className="font-bold text-[#090909]">Jam Operasional</p>
                <p className="mt-1 text-[#8d6a5e]">{contact.hours}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#e7deda] bg-white p-7">
            <h3 className="text-base font-extrabold text-[#090909]">
              Media Sosial Resmi
            </h3>
            <div className="mt-4 space-y-2.5">
              {contact.socials.map((soc) => (
                <a
                  key={`${soc.name}-${soc.handle}`}
                  href={soc.href}
                  target={soc.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    soc.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="flex items-center justify-between rounded-xl border border-[#e7deda] px-4 py-3 text-sm transition-colors hover:border-[#ff491a] hover:bg-[#f7f2ee]"
                >
                  <span className="font-bold text-[#090909]">{soc.name}</span>
                  <span className="text-xs text-[#8d6a5e]">{soc.handle}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Form Daftar Anggota & Form Aspirasi */}
        <div className="space-y-8 lg:col-span-7">
          <MemberRegistrationForm />
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

export default function KontakPage() {
  return (
    <div>
      <PageHeader
        badge="Hubungi Kami"
        title="Kontak Sekretariat"
        description="Informasi alamat sekretariat, saluran komunikasi resmi, dan media sosial DPC Partai Gerakan Rakyat Tambun Selatan."
      />

      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 py-16 text-sm text-[#8d6a5e]">
            Memuat informasi kontak...
          </div>
        }
      >
        <KontakContent />
      </Suspense>
    </div>
  );
}
