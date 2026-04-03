import Image from "next/image";
import Link from "next/link";

const footerNav = [
  { label: "Cari Mandor", href: "/mandor" },
  { label: "Layanan Kami", href: "/beranda#layanan" },
  { label: "Testimoni", href: "/beranda#testimoni" },
];

export default function PublicFooter() {
  return (
    <footer className="w-full bg-[var(--blue-dark)] text-white">
      <div className="mx-auto w-full max-w-[90rem] px-5 py-12 md:px-10 md:py-16 xl:px-[6.25rem]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-10 lg:grid-cols-[1.15fr_0.72fr_1.13fr] lg:gap-12">
          <section>
            <div className="flex items-center">
              <Image
                src="/images/logo-mandorin.svg"
                alt="MandorIn"
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
            </div>

            <p className="mt-4 max-w-[22rem] text-[0.938rem] leading-[1.6rem] text-[var(--white-normal-hover)] md:text-[1rem] md:leading-[1.75rem] lg:text-[1.125rem] lg:leading-[1.9rem]">
              Membangun masa depan konstruksi yang transparan, aman, dan
              terpercaya melalui teknologi kontrak digital dan laporan progres
              harian.
            </p>
          </section>

          <section>
            <h3 className="text-[1rem] font-semibold leading-[1.5rem] md:text-[1.125rem] md:leading-[1.75rem] lg:text-[1.25rem] lg:leading-[2rem]">
              Navigasi
            </h3>
            <ul className="mt-5 space-y-3.5">
              {footerNav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[0.938rem] leading-[1.5rem] text-[var(--white-normal-hover)] transition-colors hover:text-white md:text-[1rem] md:leading-[1.75rem] lg:text-[1.125rem] lg:leading-[2rem]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-[1rem] font-semibold leading-[1.5rem] md:text-[1.125rem] md:leading-[1.75rem] lg:text-[1.25rem] lg:leading-[2rem]">
              Hubungi Kami
            </h3>

            <ul className="mt-5 space-y-4 text-[0.938rem] leading-[1.5rem] text-[var(--white-normal-hover)] md:text-[1rem] md:leading-[1.75rem] lg:text-[1.125rem] lg:leading-[2rem]">
              <li className="flex items-start gap-2.5">
                <Image
                  src="/images/icons/icon-lokasi.svg"
                  alt="Lokasi"
                  width={20}
                  height={20}
                  className="mt-1 h-5 w-5 shrink-0"
                />
                <span>
                  Jl. Soekarno Hatta No. 124, Kel. Jatimulyo, Kec. Lowokwaru,
                  Kota Malang, Jawa Timur 65141
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <Image
                  src="/images/icons/icon-telpon.svg"
                  alt="Telpon"
                  width={20}
                  height={20}
                  className="mt-1 h-5 w-5 shrink-0"
                />
                <span>+62 812-3456-7890</span>
              </li>

              <li className="flex items-start gap-2.5">
                <Image
                  src="/images/icons/icon-email.svg"
                  alt="Email"
                  width={20}
                  height={20}
                  className="mt-1 h-5 w-5 shrink-0"
                />
                <span>halo@mandorin.id</span>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-10 border-t border-[var(--white-normal-active)] pt-4 text-center text-[0.813rem] leading-6 text-[var(--white-normal-hover)] md:text-[0.875rem] md:leading-7 lg:text-[0.938rem]">
          MandorIn - Solusi Terpercaya Bangun Rumah Impian. 2026
        </div>
      </div>
    </footer>
  );
}
