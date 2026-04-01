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
                className="object-contain"
              />
            </div>

            <p className="mt-4 max-w-[22rem] text-[1.625rem] leading-[2.35rem] text-[var(--white-normal-hover)]">
              Membangun masa depan konstruksi yang transparan, aman, dan
              terpercaya melalui teknologi kontrak digital dan laporan progres
              harian.
            </p>
          </section>

          <section>
            <h3 className="text-[1.625rem] font-semibold leading-[2.35rem]">
              Navigasi
            </h3>
            <ul className="mt-5 space-y-3.5">
              {footerNav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[1.625rem] leading-[2.35rem] text-[var(--white-normal-hover)] transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-[1.625rem] font-semibold leading-[2.35rem]">
              Hubungi Kami
            </h3>

            <ul className="mt-5 space-y-4.5 text-[1.625rem] leading-[2.35rem] text-[var(--white-normal-hover)]">
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

        <div className="mt-10 border-t border-[var(--white-normal-active)] pt-4 text-center text-[1.125rem] leading-7 text-[var(--white-normal-hover)]">
          MandorIn - Solusi Terpercaya Bangun Rumah Impian. 2026
        </div>
      </div>
    </footer>
  );
}
