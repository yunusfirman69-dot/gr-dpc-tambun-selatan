# Tutorial Deploy Website ke Cloudflare Workers
**Partai Gerakan Rakyat — DPC Tambun Selatan**

Panduan ini disusun langkah demi langkah untuk pemula agar bisa menayangkan website Next.js ini ke **Cloudflare Workers**.

---

## Persiapan Sebelum Mulai
1. Pastikan Anda sudah memiliki akun **Cloudflare** (bisa daftar gratis di `https://dash.cloudflare.com`).
2. Buka terminal di **Antigravity IDE** lalu masuk ke folder proyek:
   ```powershell
   cd D:\PGR\gr-dpc-tambun-selatan
   ```
   *(Jika muncul error `npm is not recognized`, jalankan `$env:Path += ";C:\Program Files\nodejs"` lalu ulangi perintahnya).*

---

## Langkah 1 — Pasang Paket Cloudflare (`@opennextjs/cloudflare` & `wrangler`)
Jalankan perintah berikut sekali saja di folder proyek:

```powershell
npm install @opennextjs/cloudflare
npm install -D wrangler
```

Tunggu hingga proses unduh dan instalasi selesai tanpa error.

---

## Langkah 2 — Login ke Akun Cloudflare
Hubungkan terminal laptop Anda dengan akun Cloudflare:

```powershell
npx wrangler login
```

- Browser akan otomatis terbuka ke halaman login Cloudflare.
- Masuk ke akun Cloudflare Anda, lalu klik tombol **Allow** untuk memberi izin Wrangler.
- Setelah muncul tulisan `Successfully logged in`, kembali ke terminal.

---

## Langkah 3 — Siapkan Password & Rahasia Admin

### A. Untuk Uji Lokal (Preview di Laptop)
Salin file contoh `.dev.vars.example` menjadi `.dev.vars`:

```powershell
Copy-Item .dev.vars.example .dev.vars
```

Buka file `.dev.vars`, lalu ubah `ADMIN_EMAIL`, `ADMIN_PASSWORD`, dan `ADMIN_SESSION_SECRET` dengan nilai pilihan Anda. *(File `.dev.vars` sudah otomatis diabaikan oleh `.gitignore` agar aman).*

### B. Untuk Server Live (Cloudflare Workers)
Daftarkan variabel rahasia langsung ke Cloudflare agar tidak tersimpan di kode:

```powershell
npx wrangler secret put ADMIN_EMAIL
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_SESSION_SECRET
```
*(Ketik nilainya masing-masing lalu tekan **Enter** saat diminta).*

---

## Langkah 4 — Uji Tampilan Lokal ala Cloudflare (`preview`)
Sebelum naik ke internet, uji hasil build Cloudflare di komputer Anda terlebih dahulu:

```powershell
npm run preview
```

Jika berhasil, terminal akan menampilkan alamat lokal (biasanya `http://localhost:8787`). Buka alamat tersebut di browser untuk memastikan seluruh halaman tampil normal. Tekan `Ctrl + C` jika sudah selesai menguji.

---

## Langkah 5 — Deploy ke Internet (`deploy`)
Jalankan perintah berikut untuk mempublikasikan website ke Cloudflare Workers:

```powershell
npm run deploy
```

Tunggu proses build & upload selesai. Di akhir output terminal akan muncul alamat website online Anda, misalnya:
```text
https://gr-dpc-tambun-selatan.<username>.workers.dev
```
Buka link tersebut di browser HP atau laptop untuk menguji website yang sudah online!

---

## Langkah 6 — Menghubungkan Domain Sendiri (Opsional)
Jika organisasi sudah memiliki domain (misalnya `dpc-tambunselatan.org`) dan DNS-nya dikelola di Cloudflare:
1. Buka **Cloudflare Dashboard** → **Workers & Pages**.
2. Pilih worker **`gr-dpc-tambun-selatan`**.
3. Masuk ke tab **Settings** → **Domains & Routes** → klik **Add** → pilih **Custom Domain**.
4. Masukkan nama domain Anda lalu simpan. HTTPS akan aktif secara otomatis.

---

## Catatan Penting: Penyimpanan Data & Upload Admin
Cloudflare Workers berjalan tanpa disk lokal permanen (read-only filesystem). Artinya:
- Seluruh **halaman publik** (Beranda, Profil, Pengurus, Program Kerja, Berita, Galeri, Kontak) berjalan lancar.
- Namun jika Anda mengunggah foto atau mengedit data dari **Dashboard Admin** saat sudah live di Cloudflare Workers, perubahan tidak akan tersimpan permanen ke file lokal.
- Untuk penggunaan produksi penuh pada Dashboard Admin, langkah berikutnya adalah menghubungkan database & penyimpanan eksternal (**Supabase PostgreSQL + Supabase Storage** sesuai [PLAN.md](file:///d:/PGR/PLAN.md), atau **Cloudflare D1 + R2**).

---

## Masalah Umum & Solusinya
- **`ENOENT: no such file or directory, open 'D:\PGR\package.json'`**
  → Anda belum masuk ke folder proyek. Jalankan `cd D:\PGR\gr-dpc-tambun-selatan` terlebih dahulu.
- **`npm` tidak dikenali**
  → Jalankan `$env:Path += ";C:\Program Files\nodejs"` atau restart Antigravity IDE.
- **Gagal saat `npm run deploy` karena belum login**
  → Jalankan ulang `npx wrangler login` dan pastikan klik **Allow** di browser.
