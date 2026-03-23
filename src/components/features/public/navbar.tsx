"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";

const navItems = [
  { label: "Beranda", href: "/beranda" },
  { label: "Mandor", href: "/mandor" },
  { label: "Projek", href: "/explore" },
  { label: "Pesanan", href: "/login-client" },
];

export default function PublicNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const token = isHydrated ? localStorage.getItem("token") : null;
  const isLoggedIn = Boolean(token);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--black-light)] bg-white/95 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-[90rem] items-center justify-between px-5 py-3 md:px-10 xl:px-[6.25rem]">
        <Link href="/beranda" className="flex items-center gap-2">
          <Image
            src="/images/logo-mandorin.svg"
            alt="MandorIn"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            priority
          />
          <span className="text-[1.75rem] font-semibold text-[var(--orange-normal)]">
            MandorIn
          </span>
        </Link>

        <ul className="hidden items-center gap-10 lg:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`inline-flex items-center border-b-2 pb-1 text-[1.75rem] leading-10 transition-colors ${
                    isActive
                      ? "border-[var(--orange-normal)] font-semibold text-[var(--orange-normal)]"
                      : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-black)]"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2 md:gap-3">
          {isLoggedIn ? (
            <Link
              href="/login"
              className="inline-flex h-[2.75rem] items-center justify-center rounded-lg border border-[var(--orange-normal)] px-4 text-sm font-semibold text-[var(--orange-normal)] transition-colors hover:bg-[var(--orange-light)] md:h-[3.25rem] md:px-6 md:text-base"
            >
              Profil
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-[2.75rem] items-center justify-center rounded-lg border border-[var(--orange-normal)] px-4 text-sm font-semibold text-[var(--orange-normal)] transition-colors hover:bg-[var(--orange-light)] md:h-[3.25rem] md:px-6 md:text-base"
            >
              Masuk
            </Link>
          )}

          <button
            type="button"
            aria-label="Buka menu navigasi"
            aria-expanded={isMobileMenuOpen}
            className="inline-flex h-[2.75rem] w-[2.75rem] items-center justify-center rounded-lg border border-[var(--black-light)] text-[var(--text-black)] transition-colors hover:bg-[var(--white-normal-hover)] lg:hidden"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path
                d="M4 7H20M4 12H20M4 17H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </nav>

      {isMobileMenuOpen ? (
        <div className="border-t border-[var(--black-light)] bg-white lg:hidden">
          <ul className="mx-auto flex w-full max-w-[90rem] flex-col px-5 py-3 md:px-10">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex w-full items-center py-2 text-base transition-colors ${
                      isActive
                        ? "font-semibold text-[var(--orange-normal)]"
                        : "text-[var(--text-secondary)]"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
