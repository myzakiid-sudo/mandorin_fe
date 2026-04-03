import Link from "next/link";

import { getForemanById } from "@/lib/foreman-api";

export default async function MandorPortfolioDetailPage({
  params,
}: {
  params: Promise<{ id: string; portfolioId: string }>;
}) {
  const { id, portfolioId } = await params;
  const foreman = await getForemanById(id);

  const portfolioItem =
    foreman?.portfolio && portfolioId === "api-portfolio"
      ? {
          id: "api-portfolio",
          title: foreman.field || "Portofolio Proyek",
          description: `Portofolio ${foreman.name}`,
          year: String(new Date().getFullYear()),
          image: foreman.portfolio,
          location: foreman.address || "Lokasi proyek belum tersedia",
          status: "Selesai",
          duration: "-",
          area: "-",
          details:
            foreman.bio?.trim() ||
            "Detail portofolio belum tersedia dari backend.",
        }
      : null;

  if (!portfolioItem) {
    return (
      <main className="min-h-screen bg-[#0f172a] px-5 py-16 text-white md:px-10 xl:px-[6.25rem]">
        <div className="mx-auto w-full max-w-[90rem]">
          <h1 className="text-3xl font-semibold leading-tight">
            Detail proyek tidak ditemukan
          </h1>
          <p className="mt-4 max-w-[40rem] text-base leading-8 text-white/80">
            Proyek yang kamu pilih belum tersedia atau tautan sudah berubah.
          </p>
          <Link
            href={`/mandor/${id}`}
            className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-[var(--orange-normal)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--orange-dark)]"
          >
            Kembali ke Detail Mandor
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${portfolioItem.image})` }}
    >
      <div className="absolute inset-0 bg-black/55" />

      <section className="relative z-10 mx-auto w-full max-w-[90rem] px-5 pb-20 pt-24 text-white md:px-10 md:pb-28 md:pt-32 xl:px-[6.25rem]">
        <Link
          href={`/mandor/${id}`}
          className="inline-flex items-center text-sm font-semibold text-white/90 hover:text-white"
        >
          ← Kembali ke Detail Mandor
        </Link>

        <div className="mt-10 max-w-[68rem] space-y-10 md:mt-12 md:space-y-12">
          <h1 className="text-[2rem] font-semibold leading-tight md:text-[2.5rem]">
            {`Portofolio ${portfolioItem.title}`}
          </h1>

          <div className="space-y-1 text-[1.125rem] leading-9 md:text-[2rem] md:leading-[3.125rem]">
            <p>Lokasi: {portfolioItem.location}.</p>
            <p>Status: {portfolioItem.status}.</p>
            <p>Durasi: {portfolioItem.duration}.</p>
            <p>Luas Bangunan: {portfolioItem.area}.</p>
          </div>

          <p className="text-[1.2rem] leading-10 text-white/95 md:text-[2rem] md:leading-[3.125rem]">
            {portfolioItem.details}
          </p>
        </div>
      </section>
    </main>
  );
}
