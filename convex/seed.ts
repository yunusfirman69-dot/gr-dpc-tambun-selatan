import { mutation } from "./_generated/server";

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    const seeded: string[] = [];

    // 1. Seed organizationProfile
    const existingOrg = await ctx.db
      .query("organizationProfile")
      .withIndex("by_key", (q) => q.eq("key", "default"))
      .first();
    if (!existingOrg) {
      await ctx.db.insert("organizationProfile", {
        key: "default",
        partyName: "Partai Gerakan Rakyat",
        unitName: "DPC Tambun Selatan",
        region: "Kabupaten Bekasi, Jawa Barat",
        tagline: "Membangun Indonesia Adil dan Makmur",
        quote: "Kekuatan Utama Rakyat adalah Gotong Royong.",
        historySummary:
          "Partai Gerakan Rakyat lahir secara organik dari semangat kerelawanan dan aspirasi masyarakat akan ruang perjuangan politik yang terbuka, inklusif, modern, serta berpihak pada keadilan sosial. Berawal dari konsolidasi simpul-simpul relawan perubahan, gerakan ini resmi dideklarasikan sebagai Organisasi Kemasyarakatan (Ormas) pada 27 Februari 2025 sebelum bertransformasi menjadi Partai Gerakan Rakyat melalui Rakernas I pada 17–18 Januari 2026.",
        historyTimeline: [
          {
            period: "2023 – 2024",
            title: "Konsolidasi Awal Gerakan Relawan",
            description:
              "Cikal bakal gerakan terkonsolidasi dari simpul-simpul relawan dan masyarakat pengusung gagasan perubahan yang menyadari pentingnya wadah perjuangan permanen dan terorganisir.",
          },
          {
            period: "27 Februari 2025",
            title: "Deklarasi Ormas Gerakan Rakyat",
            description:
              "Dideklarasikan secara resmi di Jakarta dengan Ketua Umum Sahrin Hamid, membangun struktur organisasi di 38 provinsi serta menginisiasi pendidikan politik akar rumput melalui Sekolah Politik Kerakyatan (Spartan).",
          },
          {
            period: "17–18 Januari 2026",
            title: "Rakernas I & Transformasi Menjadi Partai Politik",
            description:
              "Melalui musyawarah mufakat pada Rapat Kerja Nasional (Rakernas) I di Jakarta, Gerakan Rakyat resmi bertransformasi menjadi Partai Gerakan Rakyat untuk memperjuangkan gagasan Indonesia Adil dan Makmur secara formal.",
          },
          {
            period: "2026 – Sekarang",
            title: "Penguatan DPC Tambun Selatan, Kabupaten Bekasi",
            description:
              "Menghadirkan struktur kepengurusan hingga tingkat ranting di 10 desa dan kelurahan se-Kecamatan Tambun Selatan guna mengorganisir kekuatan gotong royong warga secara terukur.",
          },
        ],
        visiUtama: "Indonesia Adil dan Makmur",
        haluanGerakan: "Keadilan Sosial bagi Seluruh Rakyat Indonesia.",
        agendaGerakanRakyat: [
          "Pajak yang Adil",
          "Ekonomi untuk Kesejahteraan",
          "Pemerintahan yang Kompeten dan Bijak",
          "Hukum yang Tegak untuk Semua",
          "Pembangunan yang Peduli Lingkungan",
        ],
        pancaDharma: [
          "Integritas Moral",
          "Kersa-Kesatria",
          "Kasih Sayang",
          "Nasionalisme Kerakyatan",
          "Religiusitas",
        ],
        limaJalan: [
          "Musyawarah Mufakat",
          "Gotong Royong",
          "Transparansi",
          "Meritokrasi",
          "Kesetaraan",
        ],
        misiPerjuangan: [
          {
            number: "01",
            title: "Pendidikan Politik untuk Rakyat",
            description:
              "Menjadi organisasi yang fokus memberikan pendidikan politik kepada masyarakat luas. Ini bertujuan membangun kesadaran politik yang lebih matang, menumbuhkan nalar kritis, dan meningkatkan partisipasi publik dalam proses demokrasi. Program utamanya adalah pendirian Sekolah Politik Kerakyatan (Spartan).",
          },
          {
            number: "02",
            title: "Penguatan Kontrol Masyarakat Sipil",
            description:
              "Berfungsi sebagai alat kontrol terhadap hak-hak politik dan ekonomi rakyat. Tujuannya adalah mencegah penurunan kualitas demokrasi dan memastikan kesejahteraan masyarakat tidak makin merosot, terutama bagi kelas menengah.",
          },
          {
            number: "03",
            title: "Menjaga Silaturahmi dan Kebersamaan",
            description:
              "Menjadi sarana untuk menjaga dan memperkuat silaturahmi antara berbagai komponen masyarakat yang disatukan oleh gagasan perubahan (yang diinspirasi oleh Anies Baswedan). Kebersamaan rakyat dipandang sebagai langkah awal untuk memperkuat gerakan perubahan.",
          },
          {
            number: "04",
            title: "Memperjuangkan Gagasan Perubahan",
            description:
              "Berkomitmen untuk memastikan bahwa ide dan gagasan besar tentang pembangunan bangsa dan perubahan untuk kebaikan terus hidup, dijaga, dan diyakinkan kepada seluruh rakyat Indonesia.",
          },
        ],
        areas: [
          "Kelurahan Jatimulya",
          "Desa Lambangjaya",
          "Desa Lambangsari",
          "Desa Mangunjaya",
          "Desa Mekarsari",
          "Desa Setiadarma",
          "Desa Setiamekar",
          "Desa Sumberjaya",
          "Desa Tambun",
          "Desa Tridayasakti",
        ],
      });
      seeded.push("organizationProfile");
    }

    // 2. Seed contact
    const existingContact = await ctx.db
      .query("contact")
      .withIndex("by_key", (q) => q.eq("key", "default"))
      .first();
    if (!existingContact) {
      await ctx.db.insert("contact", {
        key: "default",
        address:
          "[Placeholder Alamat Sekretariat] Jl. Contoh Raya No. 01, Kecamatan Tambun Selatan, Kabupaten Bekasi, Jawa Barat 17510",
        phone: "[Placeholder Telepon Resmi] (021) 0000-0000",
        whatsapp: "[Placeholder WhatsApp Resmi] +62 812-0000-0000",
        email: "sekretariat@contoh-dpc-tambunselatan.org",
        hours: "Senin – Jumat, 09.00 – 17.00 WIB",
        socials: [
          { name: "Instagram", handle: "@gerakanrakyat.tambunselatan", href: "#" },
          { name: "Facebook", handle: "Gerakan Rakyat Tambun Selatan", href: "#" },
          { name: "YouTube", handle: "Gerakan Rakyat Tambun Selatan", href: "#" },
          { name: "TikTok", handle: "@gerakanrakyat.tamsel", href: "#" },
        ],
      });
      seeded.push("contact");
    }

    // 3. Seed programKerja
    const existingProgram = await ctx.db
      .query("programKerja")
      .withIndex("by_key", (q) => q.eq("key", "default"))
      .first();
    if (!existingProgram) {
      await ctx.db.insert("programKerja", {
        key: "default",
        intro:
          "Rancangan Program Kerja DPC Partai Gerakan Rakyat Kecamatan Tambun Selatan disusun dengan menyelaraskan instruksi utama DPP PGR yaitu Pancakarya, nilai dasar Panca Dharma, serta karakteristik wilayah Tambun Selatan sebagai kawasan padat penduduk, pusat permukiman komuter, dan wilayah penyangga industri/perdagangan di Kabupaten Bekasi.",
        landasan: "Pancakarya & Panca Dharma Partai Gerakan Rakyat",
        fields: [
          {
            number: "01",
            title: "Bidang Organisasi, Keanggotaan, dan Legalitas",
            pillar: "Pilar Pancakarya 1 & 2",
            focus:
              "Fokus utama pada penguatan mesin partai hingga ke akar rumput dan tertib administrasi verifikasi.",
            items: [
              {
                name: "Pembentukan 100% DPRt (Dewan Pimpinan Ranting)",
                description:
                  "Melengkapi struktur kepengurusan di seluruh 9 Desa dan 1 Kelurahan se-Kecamatan Tambun Selatan (Jatimulya, Lambangjaya, Lambangsari, Mangunjaya, Mekarsari, Setiadarma, Setiamekar, Sumberjaya, Tambun, dan Tridayasakti).",
              },
              {
                name: "Tertib Administrasi & Legalitas",
                description:
                  "Melakukan pendataan, pemberkasan KTA/KTP kader secara digital maupun fisik, serta pelaporan resmi keberadaan DPC dan DPRt ke kantor Kecamatan Tambun Selatan, Polsek, Koramil, dan Kesbangpol Kabupaten Bekasi sesuai arahan DPP.",
              },
              {
                name: "Kantor Sekretariat Aktif",
                description:
                  "Mengoperasikan sekretariat DPC Tambun Selatan sebagai pusat komando, ruang musyawarah-mufakat pengurus, dan posko pengaduan masyarakat.",
              },
            ],
          },
          {
            number: "02",
            title: "Bidang Kaderisasi dan Pendidikan Politik",
            pillar: "Pilar Panca Dharma",
            focus:
              "Menyiapkan kader yang militan, berintegritas, dan melek politik.",
            items: [
              {
                name: "Tindak Lanjut Kelas Kader",
                description:
                  "Menyelenggarakan pendidikan politik dan Training of Trainer (ToT) berjenjang bagi pengurus DPC dan DPRt se-Tambun Selatan (melanjutkan semangat Kelas Kader PGR di Bekasi).",
              },
              {
                name: "Diskusi Publik & Bedah Kebijakan Lokal",
                description:
                  "Mengadakan forum rutin bulanan (\"Ngopi Perubahan\") untuk membahas isu-isu lokal Kabupaten Bekasi seperti kemacetan, pengelolaan sampah, banjir perumahan, dan layanan publik.",
              },
            ],
          },
          {
            number: "03",
            title: "Bidang Sosialisasi, Humas, dan Media Digital",
            pillar: "Pilar Pancakarya 3 & 4",
            focus:
              "Meningkatkan brand awareness partai di kalangan warga komuter dan pemilih muda (Gen Z & Milenial) di Tambun Selatan.",
            items: [
              {
                name: "Masifikasi Media Sosial DPC",
                description:
                  "Mengaktifkan kanal resmi DPC Tambun Selatan di Instagram, TikTok, Facebook, dan YouTube untuk mendokumentasikan setiap gerakan kader serta menyebarkan gagasan perubahan.",
              },
              {
                name: "Branding & Atribut Wilayah",
                description:
                  "Melakukan pemasangan atribut, bendera, dan spanduk Partai Gerakan Rakyat di titik-titik strategis serta mewajibkan kader mengenakan atribut partai dalam setiap kegiatan kemasyarakatan.",
              },
            ],
          },
          {
            number: "04",
            title: "Bidang Aksi Sosial, Kerelawanan, dan Pemberdayaan Masyarakat",
            pillar: "Pilar Pancakarya 5",
            focus:
              "Hadir langsung memberikan solusi nyata bagi warga Tambun Selatan.",
            items: [
              {
                name: "Bakti Sosial & Kesehatan Gratis",
                description:
                  "Menggelar kegiatan rutin seperti donor darah, pemeriksaan kesehatan/cek tensi gratis, dan fogging nyamuk demam berdarah di kompleks perumahan maupun perkampungan.",
              },
              {
                name: "Tim Siaga Bencana & Tanggap Darurat",
                description:
                  "Membentuk unit relawan cepat tanggap untuk membantu warga di titik-titik rawan banjir di Tambun Selatan saat musim penghujan.",
              },
              {
                name: "Pemberdayaan UMKM Lokal",
                description:
                  "Mengadakan pelatihan pemasaran digital (digital marketing) dan pendampingan perizinan (NIB/Sertifikasi Halal) bagi pelaku usaha mikro di sekitar Tambun Selatan.",
              },
              {
                name: "Kegiatan Keagamaan & Kebangsaan",
                description:
                  "Mengadakan santunan anak yatim, buka puasa bersama, dan peringatan hari besar nasional untuk mempererat silaturahmi lintas elemen masyarakat.",
              },
            ],
          },
        ],
        implementationMatrix: [
          {
            field: "Organisasi, Keanggotaan & Legalitas",
            shortTerm:
              "Pembentukan 100% DPRt di 9 Desa & 1 Kelurahan, pemberkasan KTA/KTP, dan pelaporan resmi ke Kecamatan, Polsek, Koramil, serta Kesbangpol.",
            mediumTerm:
              "Evaluasi kinerja DPRt berkala, pemutakhiran database kader terpadu, dan optimalisasi sekretariat sebagai posko aspirasi warga.",
            indicator:
              "10/10 DPRt terbentuk lengkap, surat tanda lapor terbit, sekretariat beroperasi rutin.",
          },
          {
            field: "Kaderisasi & Pendidikan Politik",
            shortTerm:
              "Pelaksanaan Kelas Kader / ToT perdana untuk pengurus DPC & DPRt serta peluncuran forum bulanan 'Ngopi Perubahan'.",
            mediumTerm:
              "Kaderisasi berjenjang hingga tingkat ranting dan penyusunan rekomendasi kebijakan lokal (kemacetan, sampah, banjir, layanan publik).",
            indicator:
              "Minimal 1x ToT kader per periode & forum 'Ngopi Perubahan' berjalan rutin setiap bulan.",
          },
          {
            field: "Sosialisasi, Humas & Media Digital",
            shortTerm:
              "Aktivasi penuh Instagram, TikTok, Facebook, YouTube DPC serta pemasangan atribut/bendera di titik-titik strategis Tambun Selatan.",
            mediumTerm:
              "Produksi konten edukasi politik dan dokumentasi aksi kader secara konsisten untuk menjangkau warga komuter, Gen Z, dan Milenial.",
            indicator:
              "4 kanal media sosial aktif terverifikasi & seluruh kegiatan kader terdokumentasi dengan atribut resmi.",
          },
          {
            field: "Aksi Sosial, Relawan & Pemberdayaan",
            shortTerm:
              "Pembentukan Tim Siaga Bencana banjir, kegiatan bakti sosial/cek kesehatan & fogging, serta santunan/peringatan hari besar.",
            mediumTerm:
              "Program pendampingan UMKM berkelanjutan (digital marketing, NIB, Sertifikasi Halal) dan perluasan jangkauan layanan sosial di perumahan & perkampungan.",
            indicator:
              "Unit relawan siaga terbentuk, aksi sosial terlaksana rutin, pelaku UMKM terbantu legalitas & pemasaran.",
          },
        ],
      });
      seeded.push("programKerja");
    }

    // 4. Seed officials
    const existingOfficials = await ctx.db.query("officials").first();
    if (!existingOfficials) {
      const initialOfficials = [
        {
          externalId: "off-1",
          order: 0,
          name: "[Nama Ketua DPC — Placeholder]",
          position: "Ketua DPC",
          division: "Pimpinan Harian",
          period: "2026 – 2031",
          bio: "Data resmi pengurus akan ditampilkan setelah SK kepengurusan DPC Tambun Selatan diverifikasi.",
        },
        {
          externalId: "off-2",
          order: 1,
          name: "[Nama Sekretaris DPC — Placeholder]",
          position: "Sekretaris DPC",
          division: "Pimpinan Harian",
          period: "2026 – 2031",
          bio: "Mengelola administrasi kesekretariatan dan koordinasi antarbidang di wilayah Tambun Selatan.",
        },
        {
          externalId: "off-3",
          order: 2,
          name: "[Nama Bendahara DPC — Placeholder]",
          position: "Bendahara DPC",
          division: "Pimpinan Harian",
          period: "2026 – 2031",
          bio: "Bertanggung jawab atas pengelolaan keuangan organisasi secara transparan dan akuntabel.",
        },
        {
          externalId: "off-4",
          order: 3,
          name: "[Nama Ketua Bidang OKK — Placeholder]",
          position: "Ketua Bidang Organisasi, Kaderisasi & Keanggotaan",
          division: "Bidang OKK",
          period: "2026 – 2031",
          bio: "Menjalankan penguatan struktur ranting dan pembinaan kader di Kecamatan Tambun Selatan.",
        },
        {
          externalId: "off-5",
          order: 4,
          name: "[Nama Ketua Bidang Sosial — Placeholder]",
          position: "Ketua Bidang Sosial & Pemberdayaan Masyarakat",
          division: "Bidang Sosial",
          period: "2026 – 2031",
          bio: "Menggerakkan program kepedulian sosial, tanggap bencana, dan dukungan bagi warga.",
        },
        {
          externalId: "off-6",
          order: 5,
          name: "[Nama Ketua Bidang Media — Placeholder]",
          position: "Ketua Bidang Komunikasi & Media",
          division: "Bidang Komunikasi",
          period: "2026 – 2031",
          bio: "Menyampaikan informasi kegiatan resmi DPC kepada masyarakat melalui kanal digital.",
        },
      ];
      for (const o of initialOfficials) {
        await ctx.db.insert("officials", o);
      }
      seeded.push("officials");
    }

    // 5. Seed news
    const existingNews = await ctx.db.query("news").first();
    if (!existingNews) {
      const initialNews = [
        {
          slug: "rapat-konsolidasi-awal-dpc-tambun-selatan",
          title:
            "[Contoh Berita] Rapat Konsolidasi Awal Pengurus DPC Tambun Selatan",
          category: "Organisasi",
          publishedAt: "15 November 2026",
          author: "Tim Komunikasi DPC",
          excerpt:
            "Artikel contoh untuk menampilkan format berita organisasi. Pengurus membahas penyusunan agenda kerja dan penguatan struktur ranting.",
          content: [
            "Ini adalah artikel contoh (placeholder) untuk menguji tampilan halaman detail berita pada website Partai Gerakan Rakyat DPC Tambun Selatan.",
            "Dalam rapat konsolidasi awal, jajaran pengurus membahas pentingnya tata kelola organisasi yang rapi, terbuka, dan berorientasi pada pelayanan masyarakat di Kecamatan Tambun Selatan.",
            "Konten berita resmi beserta foto dokumentasi kegiatan akan diperbarui melalui Dashboard Admin setelah data resmi disetujui pengurus.",
          ],
        },
        {
          slug: "bakti-sosial-gotong-royong-warga-bekasi",
          title:
            "[Contoh Berita] Aksi Gotong Royong & Silaturahmi Bersama Warga",
          category: "Kegiatan Sosial",
          publishedAt: "10 November 2026",
          author: "Tim Komunikasi DPC",
          excerpt:
            "Artikel contoh mengenai kegiatan sosial kemasyarakatan bersama tokoh warga dan relawan di wilayah Tambun Selatan.",
          content: [
            "Ini adalah artikel contoh (placeholder) untuk kategori Kegiatan Sosial.",
            "Semangat gotong royong menjadi fondasi utama setiap kegiatan di tingkat akar rumput. Melalui kolaborasi bersama warga, berbagai persoalan lingkungan dapat ditangani secara bersama-sama.",
            "Nantikan informasi kegiatan resmi berikutnya melalui halaman Berita dan Galeri website ini.",
          ],
        },
        {
          slug: "pengumuman-persiapan-portal-informasi-resmi",
          title:
            "[Contoh Pengumuman] Persiapan Peluncuran Portal Informasi Resmi DPC",
          category: "Pengumuman",
          publishedAt: "05 November 2026",
          author: "Sekretariat DPC",
          excerpt:
            "Portal digital DPC Tambun Selatan disiapkan sebagai sarana informasi publik mengenai profil, program kerja, dan kegiatan resmi.",
          content: [
            "Ini adalah pengumuman contoh (placeholder) terkait pembangunan portal website resmi DPC Tambun Selatan.",
            "Website ini dirancang agar masyarakat dapat dengan mudah mengakses informasi mengenai profil organisasi, struktur pengurus yang disetujui untuk publik, program kerja, serta kontak sekretariat.",
            "Seluruh data pribadi anggota disimpan secara terpisah dan privat hanya untuk keperluan administrasi internal yang berwenang.",
          ],
        },
      ];
      for (const n of initialNews) {
        await ctx.db.insert("news", n);
      }
      seeded.push("news");
    }

    // 6. Seed gallery
    const existingGallery = await ctx.db.query("gallery").first();
    if (!existingGallery) {
      const initialGallery = [
        {
          title: "[Contoh Foto] Rapat Koordinasi Pengurus DPC",
          category: "Rapat & Konsolidasi",
          date: "November 2026",
          description:
            "Placeholder dokumentasi kegiatan rapat koordinasi pengurus DPC Tambun Selatan.",
        },
        {
          title: "[Contoh Foto] Aksi Gotong Royong Lingkungan",
          category: "Sosial",
          date: "November 2026",
          description:
            "Placeholder dokumentasi kerja bakti bersama warga di Kecamatan Tambun Selatan.",
        },
        {
          title: "[Contoh Foto] Dialog Bersama Pelaku UMKM Lokal",
          category: "Ekonomi Rakyat",
          date: "Oktober 2026",
          description:
            "Placeholder dokumentasi kunjungan dan dialog pemberdayaan UMKM setempat.",
        },
        {
          title: "[Contoh Foto] Silaturahmi Tokoh Masyarakat",
          category: "Silaturahmi",
          date: "Oktober 2026",
          description:
            "Placeholder dokumentasi silaturahmi bersama tokoh masyarakat Kabupaten Bekasi.",
        },
        {
          title: "[Contoh Foto] Pembinaan Kader & Ranting",
          category: "Organisasi",
          date: "Oktober 2026",
          description:
            "Placeholder dokumentasi kegiatan pembinaan struktur ranting desa dan kelurahan.",
        },
        {
          title: "[Contoh Foto] Posko Layanan Aspirasi Warga",
          category: "Sosial",
          date: "September 2026",
          description:
            "Placeholder dokumentasi posko penerimaan aspirasi masyarakat Tambun Selatan.",
        },
      ];
      for (const g of initialGallery) {
        await ctx.db.insert("gallery", g);
      }
      seeded.push("gallery");
    }

    return { ok: true, seeded };
  },
});
