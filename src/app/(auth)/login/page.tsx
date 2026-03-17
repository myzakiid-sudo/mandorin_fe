"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-[var(--white-normal)]">
      {/* ── Background radial gradient tengah ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, var(--orange-light) 0%, var(--white-normal) 70%)",
        }}
      />

      {/* ── Lingkaran dekoratif kiri atas (biru, opacity 24%) ── */}
      <div
        className="absolute -top-16 -left-16 w-64 h-64 rounded-full pointer-events-none"
        style={{ backgroundColor: "var(--blue-dark-24)" }}
      />
      <div
        className="absolute top-32 left-8 w-10 h-10 rounded-full pointer-events-none"
        style={{ backgroundColor: "var(--blue-dark-24)" }}
      />

      {/* ── Lingkaran dekoratif kanan bawah (orange, opacity 24%) ── */}
      <div
        className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full pointer-events-none"
        style={{ backgroundColor: "var(--orange-normal-24)" }}
      />
      <div
        className="absolute bottom-24 right-16 w-6 h-6 rounded-full pointer-events-none"
        style={{ backgroundColor: "var(--orange-normal-24)" }}
      />

      {/* ── Konten utama ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-5 w-full max-w-[528px]">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/images/Logo Mandorin 1.png"
            alt="MandorIn"
            width={220}
            height={220}
            priority
            className="object-contain"
          />
        </div>

        {/* Deskripsi */}
        <p
          className="mb-8 text-[var(--text-black)] max-w-[480px]"
          style={{ fontSize: "16px", lineHeight: "24px" }}
        >
          Wujudkan hunian impian dengan transparansi penuh. Pilih peran Anda dan
          mulai bangun masa depan bersama MandorIn.
        </p>

        {/* Tombol */}
        <div className="flex flex-col gap-3 w-full">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => router.push("/login-client")}
          >
            Masuk sebagai pemilik proyek
          </Button>

          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => router.push("/login-mandor")}
          >
            Masuk sebagai mandor
          </Button>
        </div>
      </div>
    </main>
  );
}
