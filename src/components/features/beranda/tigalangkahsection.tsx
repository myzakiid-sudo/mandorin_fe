import Image from "next/image";

const langkahMandor = [
  {
    judul: "Terima & Atur Proyek",
    deskripsi:
      "Dapatkan permintaan konsultasi dari calon klien dan kelola detail kesepakatan kerja secara terorganisir dalam satu aplikasi.",
  },
  {
    judul: "Konsultasi & Kontrak",
    deskripsi:
      "Diskusikan rencana anggaran biaya (RAB) dan jadwal pengerjaan secara transparan melalui sistem kontrak digital yang aman.",
  },
  {
    judul: "Pantau Progres Harian",
    deskripsi:
      "Terima laporan perkembangan proyek langsung lengkap dengan bukti foto pengerjaan setiap harinya.",
  },
];

export default function TigaLangkahSection() {
  return (
    <section className="w-full bg-[#f5f5f5] py-16 md:py-24">
      <div className="mx-auto w-full max-w-[90rem] px-5 md:px-10 xl:px-[6.25rem]">
        <div className="mx-auto flex max-w-[22rem] flex-col items-center md:max-w-[26rem]">
          <h2 className="text-center text-3xl font-semibold leading-tight text-[var(--text-black)] md:text-4xl">
            Mulai Dalam Tiga Langkah
          </h2>

          <div className="mt-8 inline-flex rounded-full border border-[#f2cfab] bg-[#FAFAFA] p-1">
            <button
              type="button"
              className="rounded-full bg-[var(--orange-normal)] px-6 py-2 text-sm font-semibold leading-6 text-white"
            >
              Untuk Client
            </button>
            <button
              type="button"
              className="rounded-full px-6 py-2 text-sm font-semibold leading-6 text-[#6f6f6f]"
            >
              Untuk Mandor
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-10 lg:mt-16 lg:flex-row lg:items-center lg:gap-14">
          <div className="w-full lg:w-[52%]">
            <Image
              src="/images/beranda/beranda-3langkah.png"
              alt="Ilustrasi alur kerja tiga langkah"
              width={1280}
              height={1280}
              className="h-auto w-full object-contain"
            />
          </div>

          <div className="w-full space-y-6 lg:w-[48%]">
            {langkahMandor.map((item) => (
              <article
                key={item.judul}
                className="rounded-[1.5rem] border border-[#f6eadc] bg-white px-7 py-8 text-center shadow-[0_0.625rem_1.875rem_rgba(0,0,0,0.04)] md:px-9"
              >
                <h3 className="text-[1.75rem] font-semibold leading-[2.25rem] text-[var(--text-black)]">
                  {item.judul}
                </h3>
                <p className="mx-auto mt-4 max-w-[31rem] text-base leading-8 text-[var(--text-secondary)]">
                  {item.deskripsi}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
