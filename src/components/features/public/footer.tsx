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
                <svg
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mt-1 h-5 w-5 shrink-0 fill-white"
                  aria-hidden="true"
                >
                  <path d="M10 1.667a6.667 6.667 0 0 0-6.667 6.667C3.333 13.333 10 18.333 10 18.333s6.667-5 6.667-10A6.667 6.667 0 0 0 10 1.667Zm0 9.167a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
                </svg>
                <span>
                  Jl. Soekarno Hatta No. 124, Kel. Jatimulyo, Kec. Lowokwaru,
                  Kota Malang, Jawa Timur 65141
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <svg
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mt-1 h-5 w-5 shrink-0 fill-white"
                  aria-hidden="true"
                >
                  <path d="M18.333 14.058v2.775a1.667 1.667 0 0 1-1.817 1.667 16.5 16.5 0 0 1-7.192-2.559 16.258 16.258 0 0 1-5-5 16.5 16.5 0 0 1-2.558-7.225A1.667 1.667 0 0 1 3.425 1.9H6.2a1.667 1.667 0 0 1 1.667 1.433c.1.757.285 1.5.55 2.217a1.667 1.667 0 0 1-.375 1.758L6.858 8.492a13.333 13.333 0 0 0 5 5l1.184-1.184a1.667 1.667 0 0 1 1.758-.375c.717.264 1.46.449 2.217.55a1.667 1.667 0 0 1 1.316 1.575Z" />
                </svg>
                <span>+62 812-3456-7890</span>
              </li>

              <li className="flex items-start gap-2.5">
                <svg
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mt-1 h-5 w-5 shrink-0 fill-white"
                  aria-hidden="true"
                >
                  <path d="M2.5 4.167h15a1.667 1.667 0 0 1 1.667 1.666v8.334A1.667 1.667 0 0 1 17.5 15.833h-15a1.667 1.667 0 0 1-1.667-1.666V5.833A1.667 1.667 0 0 1 2.5 4.167Zm7.5 5.208 7.5-3.958V5.833l-7.5 3.959L2.5 5.833v-.416l7.5 3.958Z" />
                </svg>
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
