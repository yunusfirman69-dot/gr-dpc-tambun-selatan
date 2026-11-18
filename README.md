# Website & Dashboard Admin — Partai Gerakan Rakyat (DPC Tambun Selatan)

Proyek website resmi dan dashboard admin untuk **Partai Gerakan Rakyat — DPC Tambun Selatan, Kabupaten Bekasi, Jawa Barat**.

## Teknologi
- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS**
- **Supabase** (PostgreSQL, Auth, Storage — akan diintegrasikan di Tahap 4)

## Struktur Folder Utama
```text
gr-dpc-tambun-selatan/
├── public/          # Aset statis (logo, gambar resmi)
├── src/
│   └── app/         # Halaman & routing Next.js App Router
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── package.json     # Daftar dependensi & skrip npm
└── tsconfig.json    # Konfigurasi TypeScript
```

## Cara Menjalankan di Komputer Lokal
1. Buka terminal di folder proyek:
   ```powershell
   cd D:\PGR\gr-dpc-tambun-selatan
   ```
2. Jalankan server pengembangan:
   ```powershell
   npm run dev
   ```
3. Buka browser dan kunjungi: `http://localhost:3000`

## Perintah Penting Lainnya
- `npm run lint` — Memeriksa kualitas kode dan aturan ESLint.
- `npm run build` — Memastikan aplikasi bisa di-build untuk produksi tanpa error.

## Deploy ke Cloudflare Workers (`@opennextjs/cloudflare`)
Proyek ini sudah dilengkapi konfigurasi awal Cloudflare Workers (`wrangler.jsonc`, `open-next.config.ts`, dan `.dev.vars.example`).

1. **Pasang paket adapter Cloudflare** (sekali saja):
   ```powershell
   npm install @opennextjs/cloudflare
   npm install -D wrangler
   ```
2. **Login ke akun Cloudflare**:
   ```powershell
   npx wrangler login
   ```
3. **Siapkan Environment Variables**:
   - Untuk uji lokal di Wrangler, salin `.dev.vars.example` menjadi `.dev.vars` dan ubah kredensialnya.
   - Untuk produksi di Cloudflare Dashboard / CLI, set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, dan `ADMIN_SESSION_SECRET` sebagai secret (`npx wrangler secret put ADMIN_PASSWORD`).
4. **Uji preview lokal & deploy**:
   ```powershell
   npm run preview
   npm run deploy
   ```

> **Catatan Penting Penyimpanan:** Cloudflare Workers tidak memiliki penyimpanan file lokal permanen (`fs`). Saat ini fitur upload/edit admin masih menyimpan ke file lokal (`src/data/content-store.json` & `public/uploads/`). Untuk menggunakan fitur upload/edit admin secara permanen di Cloudflare Workers, integrasikan database & storage eksternal (seperti **Supabase PostgreSQL + Storage** sesuai `PLAN.md`, atau **Cloudflare D1 + R2**).

