# Belajar Flow Role: Public, Client, Mandor

## Tujuan Catatan

Dokumen ini menjelaskan kenapa flow sekarang dipisah, file mana yang mengatur pemisahan, dan bagaimana alur user berjalan dari public sampai dashboard berdasarkan role.

---

## 1) Gambaran Besar

### Sebelumnya

- Banyak interaksi masih terasa satu alur untuk semua user.
- Detail mandor belum benar-benar tegas memisahkan aksi untuk client vs mandor.

### Sekarang

- Flow dipisah berdasarkan role:
  - Guest (belum login)
  - Client (sudah login)
  - Mandor (sudah login)
- Pemisahan dilakukan di 3 lapisan:
  1. Menu navigasi (navbar)
  2. Proteksi route (middleware)
  3. Isi halaman detail mandor (komponen role-aware)

---

## 2) Pemisahan di Navbar

File utama:

- `src/components/features/public/navbar.tsx`

Di file ini ada 3 konfigurasi menu:

- `guestNavItems` -> Beranda, Mandor
- `clientNavItems` -> Beranda, Mandor, Projek, Pesanan (arah ke dashboard client)
- `mandorNavItems` -> Beranda, Mandor, Projek, Pesanan (arah ke dashboard mandor)

Cara kerjanya:

1. Navbar baca `token` dan `role` dari localStorage.
2. Jika belum login -> pakai `guestNavItems`.
3. Jika login role `client` -> pakai `clientNavItems`.
4. Jika login role `mandor` -> pakai `mandorNavItems`.

Hasil:

- Public benar-benar minimal.
- Setelah login, menu muncul sesuai peran.

---

## 3) Proteksi Route di Middleware (Server-side)

File utama:

- `src/middleware.ts`

Yang dicek middleware:

- Cookie `token`
- Cookie `role`

Path yang diproteksi:

- Semua `/dashboard/*`
- Detail mandor `/mandor/:path*` (kecuali `/mandor` list)

Logika utama:

1. Jika tidak ada token -> redirect ke `/login`.
2. Jika membuka dashboard client tapi role bukan `client`:
   - jika role `mandor` -> redirect ke dashboard mandor.
   - selain itu -> ke login.
3. Jika membuka dashboard mandor tapi role bukan `mandor`:
   - jika role `client` -> redirect ke dashboard client.
   - selain itu -> ke login.

Hasil:

- User tidak bisa nyasar ke dashboard role lain.

---

## 4) Pemisahan Isi Detail Mandor (Client vs Mandor)

Rangkaian file:

- `src/app/(public)/mandor/[id]/page.tsx`
- `src/components/features/mandor/contractor-detail-content.tsx`
- `src/components/features/mandor/contractor-detail-reason.tsx`

Flow detail:

1. `page.tsx` ambil data mandor by id.
2. `contractor-detail-content.tsx` membaca role dari localStorage, lalu menentukan `viewerRole`.
3. `contractor-detail-reason.tsx` merender aksi berdasarkan `viewerRole`:
   - Jika `client`:
     - tampil tombol `Buat Janji Temu`
     - form booking tampil
   - Jika `mandor`:
     - tombol berubah jadi `Kelola Projek Saya` dan `Lihat Pesanan Masuk`
     - form booking tidak ditampilkan

Inilah titik pemisahan isi detail mandor per role.

---

## 5) Struktur Route yang Dipisah

### Public

- `/beranda`
- `/mandor`
- `/mandor/[id]`
- `/mandor/[id]/portfolio/[portfolioId]`

### Client Dashboard

- `/dashboard/client/projects`
- `/dashboard/client/pesanan`
- `/dashboard/client/profile`

### Mandor Dashboard

- `/dashboard/mandor/projects`
- `/dashboard/mandor/pesanan`
- `/dashboard/mandor/profile`

Catatan kompatibilitas route lama:

- `src/app/dashboard/client/booking/[mandorId]/page.tsx` sekarang redirect ke namespace pesanan client.

---

## 6) Cara Menentukan Role Saat Login/Register

File contoh:

- `src/app/(auth)/login-client/page.tsx`
- `src/app/(auth)/register/client/page.tsx`
- `src/app/(auth)/login-mandor/page.tsx`

Prinsip yang dipakai:

1. Setelah login/register sukses, simpan `token` + `role` di localStorage.
2. Simpan juga `token` + `role` ke cookie.
3. Cookie dipakai middleware (server-side).
4. localStorage dipakai komponen client-side (misal navbar/detail content).

---

## 7) Ringkasan Flow User

### Guest

1. Buka web.
2. Lihat menu public (Beranda, Mandor).
3. Bisa lihat list/detail mandor, tapi area dashboard tetap diproteksi.

### Client

1. Login sebagai client.
2. Navbar berubah ke menu client.
3. Saat buka detail mandor, muncul aksi booking.
4. Akses dashboard client saja.

### Mandor

1. Login sebagai mandor.
2. Navbar berubah ke menu mandor.
3. Saat buka detail mandor, muncul CTA manajemen (bukan booking).
4. Akses dashboard mandor saja.

---

## 8) Checklist Jika Ada Bug Role Lagi

1. Cek localStorage: `token`, `role`.
2. Cek cookie: `token`, `role`.
3. Cek file `middleware.ts` apakah matcher/path benar.
4. Cek `navbar.tsx` apakah menu dipilih sesuai role.
5. Cek `contractor-detail-content.tsx` apakah role terbaca benar.
6. Cek `contractor-detail-reason.tsx` apakah cabang UI client/mandor sudah sesuai.

---

## Penutup

Sekarang pemisahan role sudah jelas:

- Public untuk eksplorasi awal
- Client untuk booking dan pengelolaan project client
- Mandor untuk menerima pesanan dan mengelola project mandor

Kalau nanti ada perubahan aturan role, edit di tiga titik utama:

1. Navbar
2. Middleware
3. Komponen detail mandor (reason/action)
