# Belajar Alur Auth - Register Client

## Inti Paling Singkat

1. Frontend kirim data register ke backend.
2. Backend balas JSON berisi status dan accessToken (jika sukses).
3. Frontend ambil accessToken dari response.
4. Frontend simpan token yang sama ke localStorage dan cookie.
5. Token dipakai untuk cek login dan proteksi halaman.

## Flow Langkah Demi Langkah

1. User isi form register di halaman register client.
2. Frontend validasi sederhana (field wajib, konfirmasi password, avatar).
3. Frontend kirim request POST ke endpoint register.
4. Backend proses request lalu kirim response.
5. Frontend parse response JSON.
6. Jika gagal, tampilkan pesan error.
7. Jika sukses, ambil accessToken dari response.
8. Simpan token ke localStorage.
9. Simpan token ke cookie dengan masa berlaku 7 hari.
10. Redirect user ke beranda.

## Gambaran Visual (Teks)

User submit form
-> Frontend kirim POST /auth/register/clients
-> Backend validasi + buat token
-> Backend balas JSON (success, message, accessToken)
-> Frontend baca accessToken
-> Simpan ke localStorage (token, role)
-> Simpan ke cookie (token)
-> Middleware/Layout baca token
-> User dianggap login

## Kenapa Simpan di 2 Tempat

1. Cookie: supaya bisa dibaca middleware saat request route privat.
2. localStorage: supaya komponen client bisa cek role/status login dengan mudah.

## Catatan Penting

1. Di pola sekarang, cookie dibuat oleh frontend dari accessToken response.
2. Untuk keamanan yang lebih kuat, idealnya cookie auth dibuat langsung oleh backend (HttpOnly cookie).
3. Kalau response backend tidak berisi token, frontend harus anggap autentikasi belum berhasil.

## Checklist Saat Debug

1. Cek status response (harus 200/201 saat sukses).
2. Cek body response apakah ada success true.
3. Cek token ada di data.accessToken atau data.data.accessToken.
4. Cek localStorage berisi token dan role.
5. Cek cookie token tersimpan.
6. Cek middleware masih redirect atau tidak pada route privat.
