import Image from "next/image";

const poinKeamanan = [
  {
    judul: "Verifikasi Mandor",
    deskripsi:
      "Membangun masa depan konstruksi yang transparan, aman, dan terpercaya melalui teknologi kontrak digital dan laporan progres harian.",
  },
  {
    judul: "Transparansi Proyek",
    deskripsi:
      "Pengguna dapat memantau perkembangan pekerjaan melalui update progres, bukti foto, dan catatan aktivitas proyek sehingga meminimalkan miskomunikasi selama pelaksanaan.",
  },
  {
    judul: "Jaminan Komplain",
    deskripsi:
      "Jika terjadi ketidaksesuaian pekerjaan, pengguna dapat menyampaikan komplain langsung melalui platform agar masalah lebih mudah ditindaklanjuti dan terdokumentasi dengan jelas.",
  },
];

export default function KeamananSection() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto w-full max-w-[90rem] px-5 md:px-10 xl:px-[6.25rem]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:gap-12">
          <article className="rounded-[2rem] bg-white p-6 shadow-[0_0_1.875rem_rgba(255,148,0,0.55)] md:p-10">
            <div className="space-y-8">
              {poinKeamanan.map((item) => (
                <div key={item.judul} className="flex gap-4">
                  <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--orange-normal)]">
                    <Image
                      src="/images/icons/icon-centang.svg"
                      alt="Check"
                      width={16}
                      height={16}
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  </span>

                  <div>
                    <h3 className="text-3xl font-semibold leading-[2.25rem] text-[var(--text-black)] md:text-[2rem] md:leading-[2.5rem]">
                      {item.judul}
                    </h3>
                    <p className="mt-3 text-xl leading-8 text-[#7b7b7b]">
                      {item.deskripsi}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="lg:pl-4">
            <h2 className="text-3xl font-semibold leading-[2.25rem] text-[var(--text-black)] md:text-[2rem] md:leading-[2.5rem]">
              Kepercayaan & Keamanan Proyek Mandorin
            </h2>

            <p className="mt-8 text-xl leading-8 text-[#7b7b7b]">
              Keamanan dan kenyamanan pengguna adalah prioritas utama kami.
              Mandorin membantu memastikan setiap proyek berjalan lebih terarah
              melalui mandor terverifikasi, komunikasi yang terdokumentasi, dan
              progres pekerjaan yang lebih transparan.
            </p>

            <p className="mt-8 text-xl font-semibold leading-8 text-[var(--orange-normal)]">
              “Mandorin bukan sekadar membantu mencari mandor, tetapi juga
              menghadirkan rasa aman melalui proses kerja yang lebih transparan,
              terpantau, dan terpercaya.”
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
