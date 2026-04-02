import Image from "next/image";
import Link from "next/link";
import BackgroundCircles from "@/components/ui/background-circles";

export default function BookingSuccessPage() {
  return (
    <main className="relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center overflow-hidden py-12 px-5 text-center bg-white">
      <BackgroundCircles />

      {/* Image Illustration */}
      <div className="relative mb-8 h-[16rem] w-[16rem] sm:h-[20rem] sm:w-[20rem] md:h-[24rem] md:w-[24rem]">
        <Image
          src="/images/assets/sucsess.png"
          alt="Booking Berhasil"
          fill
          priority
          className="object-contain"
        />
      </div>

      {/* Teks Konten */}
      <div className="relative z-10 flex max-w-[36rem] flex-col items-center">
        <h1 className="mb-4 text-3xl font-bold text-[var(--blue-dark)] md:text-[2.25rem]">
          Berhasil!
        </h1>
        <p className="mb-10 text-[0.95rem] leading-[1.6rem] text-[var(--text-secondary)] md:text-base">
          Janji temu berhasil dibuat! Detail survei lokasi telah kami amankan.
          Mohon siapkan dokumen atau referensi bangunan Anda saat waktu
          pertemuan tiba. Terima kasih telah memilih MandorIn.
        </p>

        {/* Tombol Kembali */}
        <Link
          href="/"
          className="inline-flex h-[3.25rem] w-full max-w-[18rem] items-center justify-center rounded-lg bg-[var(--orange-normal)] px-4 text-[1rem] font-semibold text-white transition-colors hover:bg-orange-600"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
