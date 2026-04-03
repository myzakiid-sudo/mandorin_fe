"use client";

import { useEffect } from "react";
import Image from "next/image";
import PublicNavbar from "@/components/features/public/navbar";
import BackgroundCircles from "@/components/ui/background-circles";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error
    console.error("Client Error Boundary Caught:", error);
  }, [error]);

  return (
    <>
      <PublicNavbar />
      <main className="relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center overflow-hidden py-16 px-5 text-center bg-white">
        <BackgroundCircles />

        {/* Image Illustration */}
        <div className="relative mb-8 mt-10 h-[20rem] w-full max-w-[32rem] md:h-[24rem]">
          <Image
            src="/images/assets/503 Error.png"
            alt="Terjadi Kesalahan 503"
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Teks Konten */}
        <div className="relative z-10 flex max-w-[38rem] flex-col items-center">
          <p className="mb-10 text-[0.95rem] leading-[1.6rem] text-[var(--text-secondary)] md:text-base">
            Mohon maaf, terjadi kendala teknis. Permintaan Anda tidak dapat
            diproses saat ini. Silakan coba beberapa saat lagi.
          </p>

          <button
            onClick={() => reset()}
            className="inline-flex h-[3.25rem] w-full max-w-[18rem] items-center justify-center rounded-lg bg-[var(--orange-normal)] px-4 text-[1rem] font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Refresh
          </button>
        </div>
      </main>
    </>
  );
}
