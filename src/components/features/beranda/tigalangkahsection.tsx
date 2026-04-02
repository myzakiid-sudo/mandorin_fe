"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

const langkahClient = [
  {
    judul: "Cari & Pilih Mandor",
    deskripsi:
      "Jelajahi ribuan profil mandor profesional dengan portofolio yang sudah terverifikasi di wilayah Anda.",
  },
  {
    judul: "Konsultasi & Buat Kesepakatan",
    deskripsi:
      "Diskusikan detail proyek, budget, dan jadwalkan pengerjaan melalui sistem kontrak digital yang transparan.",
  },
  {
    judul: "Pantau Laporan Harian",
    deskripsi:
      "Terima pembaruan progres harian berupa foto dan laporan dari mandor langsung ke aplikasi Anda.",
  },
];

const langkahMandor = [
  {
    judul: "Lengkapi Portofolio",
    deskripsi:
      "Unggah hasil pengerjaan proyek terbaik Anda untuk membangun reputasi dan menarik minat lebih banyak pemilik proyek.",
  },
  {
    judul: "Terima & Atur Proyek",
    deskripsi:
      "Dapatkan permintaan konsultasi dari calon klien dan kelola detail kesepakatan kerja secara terorganisir dalam satu aplikasi.",
  },
  {
    judul: "Kirim Laporan Harian",
    deskripsi:
      "Bagikan progres pengerjaan harian kepada klien dengan mudah melalui fitur unggah foto lapangan untuk menjaga kepercayaan.",
  },
];

type RoleTab = "client" | "mandor";

export default function TigaLangkahSection() {
  const [activeTab, setActiveTab] = useState<RoleTab>("client");

  const currentData = activeTab === "client" ? langkahClient : langkahMandor;

  return (
    <section className="w-full bg-[#f5f5f5] py-16 md:py-24">
      <div className="mx-auto w-full max-w-[90rem] px-5 md:px-10 xl:px-[6.25rem]">
        {/* Toggle Nav */}
        <div className="mx-auto flex flex-col items-center">
          <div className="inline-flex flex-wrap justify-center gap-1 rounded-full border border-[var(--orange-normal)] bg-white p-1">
            <button
              type="button"
              onClick={() => setActiveTab("client")}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors md:px-6",
                activeTab === "client"
                  ? "bg-[var(--orange-normal)] text-white"
                  : "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-black)]",
              )}
            >
              Untuk Client
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("mandor")}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors md:px-6",
                activeTab === "mandor"
                  ? "bg-[var(--orange-normal)] text-white"
                  : "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-black)]",
              )}
            >
              Untuk Mandor
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-10 lg:mt-16 lg:flex-row lg:items-center lg:gap-14">
          <div className="w-full lg:w-[52%]">
            <Image
              src="/images/beranda/beranda-3langkah.png"
              alt="Ilustrasi alur kerja tiga langkah"
              width={1280}
              height={1280}
              className="h-auto w-full object-contain"
            />
          </div>

          <div className="w-full space-y-6 lg:w-[48%]">
            {currentData.map((item) => (
              <article
                key={item.judul}
                className="rounded-[1.5rem] border border-[#f6eadc] bg-white px-7 py-8 text-center shadow-[0_0.625rem_1.875rem_rgba(0,0,0,0.04)] md:px-9"
              >
                <h3 className="text-[1.375rem] font-semibold leading-[1.875rem] text-[var(--text-black)] md:text-[1.75rem] md:leading-[2.25rem]">
                  {item.judul}
                </h3>
                <p className="mx-auto mt-4 max-w-[31rem] text-[0.938rem] leading-7 text-[var(--text-secondary)] md:text-base md:leading-8">
                  {item.deskripsi}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
