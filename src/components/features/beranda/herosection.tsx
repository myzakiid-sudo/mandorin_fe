"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import BackgroundCircles from "@/components/ui/background-circles";

export default function HeroSection() {
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const role = isHydrated ? localStorage.getItem("role") : null;

  let pesanHref = "/login";
  if (role === "client") {
    pesanHref = "/dashboard/client/chat";
  } else if (role === "mandor") {
    pesanHref = "/dashboard/mandor/chat";
  }

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <BackgroundCircles />

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

            <Link
              href={pesanHref}
              className="inline-flex h-[3.25rem] items-center justify-center rounded-full bg-[var(--orange-normal)] px-10 text-[1rem] font-semibold text-white transition-opacity hover:opacity-90"
            >
              Pesan
            </Link>
          </div>

          {/* ── Kanan: Foto Hero ── */}
          <div className="relative flex flex-1 items-end justify-end">
            {/* Kotak orange aksen di belakang foto */}
            <div className="absolute bottom-0 right-0 z-0 h-4/5 w-4/5 rounded-tl-[2.5rem] bg-[var(--orange-light-active)]" />

            <div className="relative z-10 w-full max-w-[540px]">
              <Image
                src="/images/beranda/beranda-hero.png"
                alt="Tim mandor profesional"
                width={540}
                height={480}
                sizes="(max-width: 1024px) 100vw, 540px"
                priority
                className="relative z-10 h-auto w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
