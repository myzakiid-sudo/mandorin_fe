# Mandorin - Project Knowledge & Copilot Instructions

## Context Team

- FE internship BCC Filkom UB, minggu ke-3 dari 4.
- Role tim: PM, PD, BE, FE.
- FE masih belajar Next.js dan Tailwind.

## Cara Copilot Menjawab

1. Beri penjelasan santai 1-2 kalimat (bahasa Indonesia) sebelum kode.
2. Gunakan Tailwind class berbasis rem untuk typography dan spacing.
3. Hindari px untuk teks, margin, dan padding. Arbitrary value boleh jika fix-size diperlukan.
4. Default mobile-first (mis. flex-col, w-full), lalu naikkan ke md:/lg:.
5. Jika fitur butuh data: ingatkan FE untuk tanya endpoint dan format JSON ke BE.
6. Jika slicing kompleks: ingatkan FE untuk cek ulang desain ke PD.

## Stack

- Next.js 16 (App Router)
- Tailwind CSS v4
- TypeScript
- Desktop-first, wajib responsive mobile

## Product Flow Ringkas

- Client: cari mandor, janji temu, survei, TTD kontrak, proyek berjalan, review.
- Mandor: apply project di /explore, upload progress, TTD kontrak digital, spesialisasi.

## Auth State

- Simpan di localStorage:
  - token
  - role ("client" / "mandor")

## Routing dan Role Logic

- Belum login: public area, tombol aksi disembunyikan.
- Sudah login: dashboard area, tombol aksi muncul.
- Tidak duplikasi halaman, pakai conditional rendering berdasarkan role.

## Design System

### Typography

- H1: text-5xl font-semibold
- H2: text-4xl font-semibold
- H3: text-3xl font-semibold
- H4: text-[1.75rem] font-semibold
- H5: text-2xl font-semibold
- S1: text-lg font-semibold
- S2: text-base font-semibold
- B1: text-base font-normal
- B2: text-base font-medium
- B3: text-sm font-normal
- B4: text-sm font-medium
- C1/C2: text-xs font-normal / text-xs font-medium
- Label: text-xs font-medium

### Button Spec

- Giant: px-6 py-4 text-lg h-[3.75rem] rounded-lg
- Large: px-5 py-3 text-base h-[3.25rem] rounded-lg
- Medium: px-4 py-2 text-sm h-[2.75rem] rounded-lg
- Small: px-3 py-1.5 text-xs h-[2.25rem] rounded-lg

### Layout dan Breakpoints

- Desktop wrapper: max-w-[90rem] mx-auto xl:px-[6.25rem]
- Mobile: px-5
- Tablet: md:px-10
- Desktop: xl:px-[6.25rem]
- Gutter: gap-5

## Color Tokens (CSS Variables)

- Primary: var(--orange-normal) (hover var(--orange-normal-hover))
- Secondary: var(--blue-normal)
- Success: var(--green-normal)
- Danger: var(--red-normal)
- Text utama: var(--text-black)
- Text sekunder: var(--text-secondary)
