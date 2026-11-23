import MemberRegistrationForm from "@/components/MemberRegistrationForm";
import PageHeader from "@/components/PageHeader";

export default function DaftarAnggotaPage() {
  return (
    <div>
      <PageHeader
        badge="Keanggotaan"
        title="Daftar Anggota"
        description="Bergabung bersama Partai Gerakan Rakyat DPC Kecamatan Tambun Selatan. Seluruh data pribadi dan foto KTP dijaga privat untuk keperluan pendataan internal."
      />

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <MemberRegistrationForm />
      </section>
    </div>
  );
}
