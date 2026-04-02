import Image from "next/image";
import Link from "next/link";
import BackgroundCircles from "@/components/ui/background-circles";
import PublicNavbar from "@/components/features/public/navbar";
import PublicFooter from "@/components/features/public/footer";

export default function NotFound() {
  return (
    <>
      <PublicNavbar />
      <main className="relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center overflow-hidden py-16 px-5 text-center bg-white">
        <BackgroundCircles />

        {/* Title: Sorry Page Not Found */}
        <h1 className="mb-6 text-2xl font-bold text-[var(--orange-normal)] md:text-[2rem]">
          Sorry, Page not found!
        </h1>

        {/* Image Illustration */}
        <div className="relative mb-8 h-[18rem] w-full max-w-[32rem] md:h-[22rem]">
          <Image
            src="/images/assets/not-found-ilustration.png"
            alt="Halaman Tidak Ditemukan"
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Teks Konten */}
        <div className="relative z-10 flex max-w-[38rem] flex-col items-center">
          <p className="mb-10 text-[0.95rem] leading-[1.6rem] text-[var(--text-secondary)] md:text-base">
            Mohon maaf, terjadi kendala teknis. Permintaan Anda tidak dapat
            diproses saat ini. Silakan coba beberapa saat lagi.
          </p>

          <Link
            href="/"
            className="inline-flex h-[3.25rem] w-full max-w-[18rem] items-center justify-center rounded-lg bg-[var(--orange-normal)] px-4 text-[1rem] font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
