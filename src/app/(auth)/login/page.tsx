"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import BackgroundCircles from "@/components/ui/background-circles";

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-[var(--white-normal)]">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, var(--orange-light) 0%, var(--white-normal) 70%)",
        }}
      />

      <BackgroundCircles />

      {/* ── Konten utama ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-5 w-full max-w-[528px]">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/images/logo-mandorin.svg"
            alt="MandorIn"
            width={220}
            height={220}
            priority
            className="h-auto w-auto object-contain"
          />
        </div>

        {/* Deskripsi */}
        <p className="mb-8 max-w-[480px] text-[1rem] leading-[1.5rem] text-[var(--text-black)]">
          Wujudkan hunian impian dengan transparansi penuh. Pilih peran Anda dan
          mulai bangun masa depan bersama MandorIn.
        </p>

        {/* Tombol */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => router.push("/login-client")}
            className="inline-flex h-[3.25rem] w-full items-center justify-center rounded-lg bg-[var(--orange-normal)] px-5 text-[1rem] font-semibold text-white transition-colors hover:bg-[var(--orange-dark)]"
          >
            Masuk sebagai pemilik proyek
          </button>

          <button
            onClick={() => router.push("/login-mandor")}
            className="inline-flex h-[3.25rem] w-full items-center justify-center rounded-lg bg-[var(--blue-normal-active)] px-5 text-[1rem] font-semibold text-white transition-colors hover:bg-[var(--blue-dark-hover)]"
          >
            Masuk sebagai mandor
          </button>
        </div>
      </div>
    </main>
  );
}
