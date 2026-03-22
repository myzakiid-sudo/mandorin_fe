import Image from "next/image";

const layanan = [
  {
    icon: "/images/icons/icon-cari-mandor.svg",
    judul: "Cari Mandor Terpercaya",
    deskripsi:
      "Temukan mandor sesuai kebutuhan proyek Anda dengan profil, portofolio, dan informasi pengalaman yang lebih jelas.",
  },
  {
    icon: "/images/icons/icon-booking-proyek.svg",
    judul: "Booking Proyek",
    deskripsi:
      "Ajukan kebutuhan pembangunan atau renovasi, lalu lakukan booking mandor secara lebih mudah melalui platform.",
  },
  {
    icon: "/images/icons/icon-pantau-progres.svg",
    judul: "Pantau Progres Pekerjaan",
    deskripsi:
      "Monitor perkembangan proyek melalui update singkat dan dokumentasi foto agar proses kerja lebih transparan.",
  },
];

export default function LayananSection() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[90rem] px-5 md:px-10 xl:px-[6.25rem]">
        {/* Judul */}
        <h2 className="mb-12 text-center text-4xl font-semibold leading-[2.375rem] text-[var(--text-black)]">
          Layanan Kami
        </h2>

        {/* 3 Card */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {layanan.map((item) => (
            <div key={item.judul} className="relative pt-8">
              <div className="flex min-h-[15.5rem] flex-col items-center rounded-[1.5rem] bg-white px-6 pb-8 pt-14 text-center shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.06)]">
                {/* Icon circle */}
                <div className="absolute left-1/2 top-0 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--orange-normal)]">
                  <Image
                    src={item.icon}
                    alt={item.judul}
                    width={32}
                    height={32}
                  />
                </div>

                {/* Judul layanan */}
                <h3 className="text-[1.125rem] font-semibold leading-7 text-[var(--text-black)]">
                  {item.judul}
                </h3>

                {/* Deskripsi */}
                <p className="mt-4 max-w-[17.5rem] text-sm leading-5 text-[var(--text-secondary)]">
                  {item.deskripsi}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
