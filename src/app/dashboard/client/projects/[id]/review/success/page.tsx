import Image from "next/image";
import Link from "next/link";
import PublicNavbar from "@/components/features/public/navbar";
import PublicFooter from "@/components/features/public/footer";
import BackgroundCircles from "@/components/ui/background-circles";

export default function ClientProjectReviewSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--white-normal-hover)]">
      <PublicNavbar />

      <main className="relative mx-auto flex w-full max-w-[90rem] flex-1 items-center justify-center overflow-hidden px-5 py-10 md:px-10 xl:px-[6.25rem]">
        <BackgroundCircles />

        <section className="relative z-10 w-full max-w-[34rem] text-center">
          <div className="relative mx-auto mb-5 h-[11rem] w-[11rem] md:h-[13rem] md:w-[13rem]">
            <Image
              src="/images/assets/sucsess.png"
              alt="Ulasan berhasil dikirim"
              fill
              className="object-contain"
              priority
            />
          </div>

          <h1 className="text-[2rem] font-semibold text-[var(--blue-dark)] md:text-[2.25rem]">
            Berhasil!
          </h1>

          <p className="mx-auto mt-3 max-w-[32rem] text-[1.125rem] leading-[1.75rem] text-[var(--text-secondary)]">
            Ulasan berhasil dikirim! Terima kasih telah berbagi pengalaman Anda
            bersama MandorIn. Feedback Anda sangat berharga bagi kami dan
            pengguna lain dalam memilih mandor terbaik.
          </p>

          <div className="mt-7 flex justify-center">
            <Link
              href="/beranda"
              className="inline-flex h-[2.75rem] w-full max-w-[18rem] items-center justify-center rounded-[0.5rem] bg-[var(--orange-normal)] px-4 text-[0.938rem] font-semibold text-white transition-colors hover:bg-[var(--orange-normal-hover)]"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
