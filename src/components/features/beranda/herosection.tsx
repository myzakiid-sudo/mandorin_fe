import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Lingkaran dekoratif kiri atas */}
      <div className="pointer-events-none absolute left-0 top-0 h-20 w-20 -translate-x-1/3 -translate-y-1/3 rounded-full bg-[var(--blue-dark-24)] md:h-24 md:w-24" />
      <div className="pointer-events-none absolute left-14 top-24 h-3 w-3 rounded-full bg-[var(--blue-dark-24)] md:left-20 md:top-28 md:h-4 md:w-4" />
      <div className="pointer-events-none absolute left-10 top-36 h-5 w-5 rounded-full bg-[var(--blue-dark-24)] md:left-16 md:top-44 md:h-6 md:w-6" />

      {/* Lingkaran dekoratif kanan bawah */}
      <div className="pointer-events-none absolute bottom-0 right-0 h-16 w-16 translate-x-1/4 translate-y-1/4 rounded-full bg-[var(--orange-normal-24)] md:h-24 md:w-24" />
      <div className="pointer-events-none absolute bottom-20 right-20 h-5 w-5 rounded-full bg-[var(--orange-normal-24)] md:bottom-24 md:right-24 md:h-6 md:w-6" />

      {/* Konten */}
      <div className="mx-auto max-w-[90rem] px-5 py-16 md:px-10 md:py-24 xl:px-[6.25rem]">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-0">
          {/* ── Kiri: Teks ── */}
          <div className="flex flex-1 flex-col items-start">
            <h1 className="mb-5 text-5xl font-semibold leading-[3.625rem] text-[var(--text-black)]">
              Kerja Rapi, Owner{" "}
              <span className="text-[var(--orange-normal)]">Happy!</span>
            </h1>

            <p className="mb-8 max-w-[30rem] text-base leading-6 text-[var(--text-secondary)]">
              Mandorin adalah platform digital yang menghubungkan pemilik
              properti dengan mandor konstruksi terverifikasi melalui sistem
              yang transparan dan aman. Kami hadir untuk menghilangkan
              kekhawatiran pemilik proyek dengan menyediakan fitur Kontrak
              Digital serta Laporan Progres harian berbasis foto dan video.
              Bersama Mandorin, proses renovasi dan pembangunan rumah kini
              menjadi lebih terukur, kredibel, dan dapat dipantau dari mana
              saja.
            </p>
          </div>

          {/* ── Kanan: Foto Hero ── */}
          <div className="relative flex flex-1 items-end justify-end">
            {/* Kotak orange aksen di belakang foto */}
            <div className="absolute bottom-0 right-0 z-0 h-4/5 w-4/5 rounded-tl-[2.5rem] bg-[var(--orange-light-active)]" />

            <div className="relative z-10 w-full max-w-[540px]">
              <Image
                src="/images/beranda/hero/beranda-hero.png"
                alt="Tim mandor profesional"
                width={540}
                height={480}
                priority
                className="relative z-10 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
