import Image from "next/image";
import Link from "next/link";
import BackgroundCircles from "@/components/ui/background-circles";
import PublicNavbar from "@/components/features/public/navbar";
import PublicFooter from "@/components/features/public/footer";

export default function TargetSuccessPage() {
  return (
    <>
      <PublicNavbar />
      <main className="relative flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center overflow-hidden bg-white px-5 py-12 text-center">
        <BackgroundCircles />

        {/* Gambar Trophy/Badge Success */}
        <div className="relative mb-8 h-[18rem] w-[18rem] md:h-[22rem] md:w-[22rem] lg:w-[26rem] lg:h-[26rem]">
          <Image
            src="/images/assets/success-mandor.png"
            alt="Target Terkirim"
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Konten Text */}
        <div className="relative z-10 flex max-w-[42rem] flex-col items-center">
          <h1 className="mb-4 text-2xl font-bold text-[var(--blue-dark)] md:text-[2.25rem] md:leading-[3rem]">
            Target Pengerjaan Telah Terkirim!
          </h1>
          <p className="mb-10 text-[0.95rem] leading-[1.6rem] text-[var(--text-secondary)] md:text-[1rem]">
            Jadwal dan detail tahapan proyek sudah kami terima. Terima kasih
            telah melakukan perencanaan bersama MandorIn.
          </p>
          <Link
            href="/beranda"
            className="inline-flex h-[3.25rem] w-[18rem] items-center justify-center rounded-lg bg-[var(--orange-normal)] text-[1rem] font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
