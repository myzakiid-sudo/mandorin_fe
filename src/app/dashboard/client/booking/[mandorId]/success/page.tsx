import Image from "next/image";
import Link from "next/link";
import PublicNavbar from "@/components/features/public/navbar";

export default function BookingSuccessPage() {
  return (
    <>
      <PublicNavbar />

      <main className="relative min-h-[70svh] overflow-hidden bg-[var(--white-normal-hover)]">
        <span className="absolute left-[1.25rem] top-[2.25rem] h-[6rem] w-[6rem] rounded-full bg-[rgba(235,209,172,0.95)] md:left-[3.25rem] md:top-[2.75rem] md:h-[8.75rem] md:w-[8.75rem]" />
        <span className="absolute left-[8.75rem] top-[5.25rem] h-[1.8rem] w-[1.8rem] rounded-full bg-[rgba(235,209,172,0.9)] md:left-[13rem] md:top-[5.75rem] md:h-[2.8rem] md:w-[2.8rem]" />
        <span className="absolute left-[5.5rem] top-[9.75rem] h-[1rem] w-[1rem] rounded-full bg-[rgba(235,209,172,0.86)] md:left-[8.75rem] md:top-[11.25rem] md:h-[1.25rem] md:w-[1.25rem]" />

        <span className="absolute bottom-[8rem] right-[2rem] h-[1rem] w-[1rem] rounded-full bg-[rgba(235,209,172,0.9)] md:bottom-[8.5rem] md:right-[7rem] md:h-[1.25rem] md:w-[1.25rem]" />
        <span className="absolute bottom-[3.2rem] right-[1rem] h-[5.8rem] w-[5.8rem] rounded-full bg-[rgba(235,209,172,0.95)] md:bottom-[2rem] md:right-[3.5rem] md:h-[8rem] md:w-[8rem]" />
        <span className="absolute bottom-[4.8rem] right-[6.25rem] h-[1.8rem] w-[1.8rem] rounded-full bg-[rgba(235,209,172,0.9)] md:bottom-[4.5rem] md:right-[11rem] md:h-[2.1rem] md:w-[2.1rem]" />

        <section className="mx-auto flex w-full max-w-[90rem] flex-col items-center px-5 pb-16 pt-10 text-center md:px-10 md:pb-20 md:pt-14 xl:px-[6.25rem]">
          <Image
            src="/images/assets/sucsess.png"
            alt="Booking berhasil"
            width={352}
            height={352}
            priority
            className="h-auto w-[14rem] object-contain md:w-[19.5rem]"
          />

          <h1 className="mt-3 text-[2rem] font-semibold leading-tight text-[var(--blue-dark)] md:text-[2.25rem]">
            Berhasil!
          </h1>

          <p className="mt-3 max-w-[42rem] text-[1rem] leading-[1.6rem] text-[var(--text-secondary)] md:text-[1.1rem] md:leading-[1.75rem]">
            Janji temu berhasil dibuat! Detail survei lokasi telah kami amankan.
            Mohon siapkan dokumen atau referensi bangunan Anda saat waktu
            pertemuan tiba. Terima kasih telah memilih MandorIn.
          </p>

          <Link
            href="/beranda"
            className="mt-8 inline-flex h-[3rem] w-full max-w-[20.5rem] items-center justify-center rounded-[0.45rem] bg-[var(--orange-normal)] px-6 text-[1rem] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Kembali ke Beranda
          </Link>
        </section>
      </main>
    </>
  );
}
