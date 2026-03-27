import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative min-h-[100svh] w-full overflow-hidden bg-[var(--white-normal)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(250,140,22,0.14),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(0,61,122,0.12),transparent_35%)]" />

      <section className="relative z-10 flex min-h-[100svh] w-full flex-col items-center justify-center px-5 py-8 md:px-8">
        <div className="relative w-full max-w-[68rem]">
          <Image
            src="/images/assets/not-found-ilustration.png"
            alt="Halaman tidak ditemukan"
            width={1536}
            height={1024}
            priority
            className="h-auto w-full object-contain"
          />
        </div>

        <div className="mt-3 text-center">
          <p
            className="mx-auto max-w-[44rem] text-[0.95rem] leading-[1.45rem] md:text-[1rem]"
            style={{ color: "var(--text-secondary)" }}
          >
            Maaf, halaman yang Anda cari tidak tersedia atau sudah dipindahkan.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex h-[3rem] items-center justify-center rounded-lg px-6 text-[1rem] font-semibold leading-[1.5rem] transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--orange-normal)", color: "white" }}
          >
            Kembali ke Beranda
          </Link>
        </div>
      </section>
    </main>
  );
}
