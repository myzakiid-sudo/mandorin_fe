import Link from "next/link";

export default function DetailNotFound() {
  return (
    <main className="min-h-screen bg-[#f4f4f4]">
      <section className="mx-auto w-full max-w-[90rem] px-5 py-16 text-center md:px-10 xl:px-[6.25rem]">
        <h1 className="text-3xl font-semibold leading-tight text-[var(--text-black)]">
          Detail Mandor Belum Tersedia
        </h1>
        <p className="mx-auto mt-4 max-w-[34rem] text-base leading-7 text-[var(--text-secondary)]">
          Data mandor ini masih dalam proses. Silakan kembali ke daftar mandor
          untuk melihat profil lain yang sudah siap.
        </p>
        <Link
          href="/mandor"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-[var(--orange-normal)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--orange-dark)]"
        >
          Kembali ke Daftar Mandor
        </Link>
      </section>
    </main>
  );
}
