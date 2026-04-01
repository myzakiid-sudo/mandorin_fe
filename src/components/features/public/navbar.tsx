"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { fetchWithAuth } from "@/lib/auth-fetch";

const LOGOUT_ENDPOINT = "https://be-internship.bccdev.id/dzaki/api/auth/logout";

type LogoutResponse = {
  success?: boolean;
  message?: string;
};

type UserRole = "client" | "mandor";

const guestNavItems = [
  { label: "Beranda", href: "/beranda" },
  { label: "Mandor", href: "/mandor" },
];

const clientNavItems = [
  { label: "Beranda", href: "/beranda" },
  { label: "Mandor", href: "/mandor" },
  { label: "Projek", href: "/dashboard/client/projects" },
  { label: "Pesanan", href: "/dashboard/client/pesanan" },
];

const mandorNavItems = [
  { label: "Beranda", href: "/beranda" },
  { label: "Mandor", href: "/mandor" },
  { label: "Projek", href: "/dashboard/mandor/projects" },
  { label: "Pesanan", href: "/dashboard/mandor/pesanan" },
];

export default function PublicNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { authSession, isReady, clearSession } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const isLoggedIn = isReady && Boolean(authSession?.token);
  const userRole: UserRole | null =
    authSession?.role === "client" || authSession?.role === "mandor"
      ? authSession.role
      : null;
  const navItems =
    isLoggedIn && userRole
      ? userRole === "client"
        ? clientNavItems
        : mandorNavItems
      : guestNavItems;
  const profileLabel = authSession?.userName?.trim() || "Profil";
  const profileHref =
    userRole === "client"
      ? "/dashboard/client/profile"
      : userRole === "mandor"
        ? "/dashboard/mandor/profile"
        : "/login";
  const editProfileHref =
    userRole === "client"
      ? "/dashboard/client/profile?mode=edit"
      : userRole === "mandor"
        ? "/dashboard/mandor/profile?mode=edit"
        : "/login";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      const response = await fetchWithAuth(LOGOUT_ENDPOINT, {
        method: "POST",
        credentials: "include",
      });

      let data: LogoutResponse | null = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok || data?.success === false) {
        // Backend may not expose logout endpoint yet (404). Keep local logout flow silent.
        if (response.status !== 404) {
          console.warn("Logout API returned non-success status", {
            status: response.status,
            message: data?.message,
          });
        }
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      clearSession();
      setIsProfileMenuOpen(false);
      setIsMobileMenuOpen(false);
      router.push("/login");
      setIsLoggingOut(false);
    }
  };

  const isNavItemActive = (href: string) => {
    if (href === "/mandor") {
      return pathname === "/mandor" || pathname.startsWith("/mandor/");
    }

    if (href.startsWith("/dashboard/")) {
      return pathname === href || pathname.startsWith(`${href}/`);
    }

    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--black-light)] bg-white/95 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-[90rem] items-center justify-between px-5 py-3 md:px-10 xl:px-[6.25rem]">
        <Link href="/beranda" className="flex items-center gap-2">
          <Image
            src="/images/logo-mandorin.svg"
            alt="MandorIn"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
          <span className="text-[1.75rem] font-semibold text-[var(--orange-normal)]">
            MandorIn
          </span>
        </Link>

        <ul className="hidden items-center gap-10 lg:flex">
          {navItems.map((item) => {
            const isActive = isNavItemActive(item.href);

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
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="inline-flex h-[2.75rem] items-center justify-center gap-2 rounded-lg border border-[var(--orange-normal)] px-4 text-sm font-semibold text-[var(--orange-normal)] transition-colors hover:bg-[var(--orange-light)] md:h-[3.25rem] md:px-6 md:text-base"
                aria-haspopup="menu"
                aria-expanded={isProfileMenuOpen}
              >
                <span className="max-w-[7.5rem] truncate">{profileLabel}</span>
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </button>

              {isProfileMenuOpen ? (
                <div className="absolute right-0 mt-2 min-w-[11.5rem] overflow-hidden rounded-lg border border-[var(--black-light)] bg-white shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.08)]">
                  <Link
                    href={profileHref}
                    className="block px-4 py-2.5 text-sm text-[var(--text-black)] transition-colors hover:bg-[var(--white-normal-hover)]"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href={editProfileHref}
                    className="block px-4 py-2.5 text-sm text-[var(--text-black)] transition-colors hover:bg-[var(--white-normal-hover)]"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Edit Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="block w-full px-4 py-2.5 text-left text-sm font-medium text-[var(--red-normal)] transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoggingOut ? "Keluar..." : "Log Out"}
                  </button>
                </div>
              ) : null}
            </div>
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
              const isActive = isNavItemActive(item.href);

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
