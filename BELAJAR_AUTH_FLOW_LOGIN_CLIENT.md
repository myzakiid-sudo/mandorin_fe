# Belajar Alur Auth - Login Client

## Inti Paling Singkat

1. Frontend kirim email dan password ke backend.
2. Backend balas JSON berisi hasil login dan accessToken (jika sukses).
3. Frontend ambil accessToken dari response.
4. Frontend simpan token yang sama ke localStorage dan cookie.
5. User diarahkan ke halaman tujuan (query next) atau ke beranda.

## Flow Langkah Demi Langkah

1. User isi email dan password.
2. Frontend set loading true dan reset error message.
3. Frontend kirim request POST JSON ke endpoint login.
4. Frontend parse response JSON secara aman (dengan try/catch).
5. Jika status response gagal atau success bukan true:
   tampilkan pesan error login dan bersihkan auth state lama.
6. Jika response sukses:
   ambil accessToken dari data.accessToken atau data.data.accessToken.
7. Jika token tidak ada:
   anggap gagal login dan tampilkan error.
8. Jika token ada:
   simpan token + role ke localStorage, lalu simpan token ke cookie.
9. Frontend cek query next:
   jika path valid internal, redirect ke next; jika tidak, ke /beranda.
10. Loading dimatikan di blok finally.

## Gambaran Visual (Teks)

User submit form login
-> Frontend POST /auth/login (JSON email, password)
-> Backend verifikasi kredensial
-> Backend balas JSON (success, message, token)
-> Frontend parse + validasi response
-> Simpan token ke localStorage dan cookie
-> Redirect ke next path / beranda
-> User dianggap login

## Mapping API Yang Terjadi di Login

1. Mapping request UI ke payload API:
   email + password state -> JSON.stringify({ email, password }).
2. Mapping status API ke pesan user:
   400/401 -> Email atau kata sandi tidak sesuai.
3. Mapping struktur token yang mungkin berbeda:
   - data.accessToken
   - data.data.accessToken
4. Mapping redirect aman:
   hanya path yang diawali slash yang diizinkan sebagai next.

## Kenapa Ada clearAuthState Saat Gagal

1. Mencegah token lama tertinggal jika login baru gagal.
2. Mencegah UI salah baca seolah user masih valid login.
3. Menjaga localStorage dan cookie tetap sinkron.

## Checklist Saat Debug Login

1. Cek request body benar-benar kirim email dan password.
2. Cek status response backend (200/401/500).
3. Cek body response berisi success dan token.
4. Cek token tersimpan di localStorage.
5. Cek cookie token tersimpan dengan max-age 7 hari.
6. Cek redirect next bekerja hanya untuk internal path.
7. Cek error message yang tampil sesuai status response.

## Perbedaan Ringkas Register vs Login

1. Register kirim FormData (ada file avatar), Login kirim JSON.
2. Register ada validasi confirm password, Login tidak ada.
3. Login punya logic next redirect agar kembali ke halaman yang sempat dituju user.
