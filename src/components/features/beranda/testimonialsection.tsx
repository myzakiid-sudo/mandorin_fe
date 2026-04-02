import Image from "next/image";

const testimoniList = [
  {
    pesan:
      "Sangat terbantu! bisa pantau progres renovasi dapur lewat foto harian di aplikasi tanpa harus bolak-balik ke lokasi proyek.",
    nama: "Sari Rahayu",
    pekerjaan: "Ibu Rumah Tangga",
    foto: "/images/beranda/tertimoni-cewe.png",
  },
  {
    pesan:
      "Awalnya takut tertipu, tapi di Mandorin ada kontrak digitalnya. Jadi merasa aman karena semua kesepakatan tertulis jelas dan sah secara hukum.",
    nama: "Budi Santoso",
    pekerjaan: "Karyawan Swasta",
    foto: "/images/beranda/testimoni-cowo-1.png",
  },
  {
    pesan:
      "Mandornya beneran ahli dan komunikatif. Portofolionya asli, pengerjaan rapi, dan yang paling penting selesai tepat waktu sesuai jadwal.",
    nama: "Anak Agung Hendrico",
    pekerjaan: "Pilot",
    foto: "/images/beranda/testimoni-cowo-2.png",
  },
];

export default function TestimonialSection() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto w-full max-w-[90rem] px-5 md:px-10 xl:px-[6.25rem]">
        <h2 className="text-center text-[1.75rem] font-semibold leading-[2.25rem] text-[var(--text-black)] md:text-[2.25rem] md:leading-[2.375rem]">
          Testimoni Pelanggan
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {testimoniList.map((item) => (
            <article
              key={item.nama}
              className="flex flex-col items-center text-center"
            >
              <div className="relative w-full rounded-[1.25rem] bg-white px-6 pb-8 pt-8 shadow-[0_0.25rem_1rem_rgba(0,0,0,0.06)] md:min-h-[16rem] md:px-8 md:pt-9">
                <p className="text-[0.938rem] leading-7 text-[var(--text-black)] md:text-base md:leading-8">
                  {item.pesan}
                </p>

                <div className="mt-5 text-[1.5rem] leading-none text-[var(--text-yellow)]">
                  <Image
                    src="/images/icons/icon-5bintang.svg"
                    alt="Rating 5 Bintang"
                    width={277}
                    height={22}
                    className="mx-auto h-auto w-[6.875rem]"
                    style={{ height: "auto" }}
                  />
                </div>

                <span className="absolute bottom-0 left-1/2 h-8 w-8 -translate-x-1/2 translate-y-[55%] rounded-full bg-white shadow-[0_0.25rem_1rem_rgba(0,0,0,0.05)]" />
              </div>

              <div className="mt-12 h-14 w-14 overflow-hidden rounded-full border border-[var(--black-light-active)] bg-[var(--white-normal)] md:h-16 md:w-16">
                <Image
                  src={item.foto}
                  alt={item.nama}
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                />
              </div>

              <h3 className="mt-4 text-[1.375rem] font-semibold leading-8 text-[var(--text-black)] md:text-[1.75rem] md:leading-10">
                {item.nama}
              </h3>
              <p className="mt-1 text-[1.125rem] leading-7 text-[var(--text-secondary)] md:text-[1.5rem] md:leading-9">
                {item.pekerjaan}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center gap-3">
          <span className="h-3 w-3 rounded-full bg-[var(--orange-normal)]" />
          <span className="h-3 w-3 rounded-full bg-[var(--black-light-active)]" />
          <span className="h-3 w-3 rounded-full bg-[var(--black-light-active)]" />
        </div>
      </div>
    </section>
  );
}
