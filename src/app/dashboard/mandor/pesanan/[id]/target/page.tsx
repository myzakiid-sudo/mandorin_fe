"use client";

import { useRouter, useParams } from "next/navigation";
import React, { FormEvent } from "react";
import PublicNavbar from "@/components/features/public/navbar";
import PublicFooter from "@/components/features/public/footer";

function InputTarget({
  label,
  type = "text",
  placeholder = "",
  rows,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="flex flex-col gap-[0.5rem]">
      <span className="text-[0.938rem] font-medium leading-[1.5rem] text-[var(--text-black)] md:text-[1rem]">
        {label}
      </span>
      {type === "textarea" ? (
        <textarea
          rows={rows || 3}
          placeholder={placeholder}
          className="rounded-[0.375rem] border border-[var(--black-light-active)] bg-white px-[0.75rem] py-2 text-[0.938rem] leading-[1.375rem] text-[var(--text-black)] outline-none transition-colors focus:border-[var(--orange-normal)] md:text-[1rem]"
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className="h-[2.5rem] rounded-[0.375rem] border border-[var(--black-light-active)] bg-white px-[0.75rem] text-[0.938rem] leading-[1.375rem] text-[var(--text-black)] outline-none transition-colors focus:border-[var(--orange-normal)] md:h-[2.75rem] md:text-[1rem]"
        />
      )}
    </label>
  );
}

export default function TargetTahapanPengerjaanPage() {
  const router = useRouter();
  const params = useParams();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push(`/dashboard/mandor/pesanan/${params?.id}/target/success`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f3f3f3]">
      <PublicNavbar />

      <main className="mx-auto w-full max-w-[90rem] flex-1 px-[1rem] py-[1.5rem] md:px-[2.5rem] md:py-[2rem] xl:px-[6.25rem]">
        <section className="mx-auto max-w-[65rem] rounded-[1rem] border border-[var(--black-light)] bg-white px-[1.5rem] py-[2rem] shadow-[0_0.375rem_1.25rem_rgba(0,0,0,0.06)] md:px-[4rem] md:py-[3rem]">
          <h1 className="text-center text-[1.5rem] font-semibold leading-[2rem] text-[var(--text-black)] md:text-[2rem] md:leading-[2.5rem]">
            Target Tahapan Pengerjaan
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mt-[2rem] flex flex-col gap-[1.25rem]"
          >
            <InputTarget label="Nama Proyek" />

            <div className="grid grid-cols-1 gap-[1.25rem] md:grid-cols-2">
              <InputTarget label="Tanggal Survei" type="date" />
              <InputTarget label="Target Tanggal Selesai" type="date" />
            </div>

            <div className="grid grid-cols-1 gap-[1.25rem] md:grid-cols-2">
              <InputTarget label="Alamat Lengkap Proyek" />
              <InputTarget label="Nomor WhatsApp" />
            </div>

            <InputTarget label="Deskripsi Pekerjaan" />

            <div className="mt-4 flex flex-col gap-[1.25rem]">
              <h3 className="text-[1.125rem] font-semibold text-[var(--text-black)]">
                Urutan Tahapan
              </h3>
              <InputTarget label="Tahapan 1" />
              <InputTarget label="Tahapan 2" />
              <InputTarget label="Tahapan 3" />
              <InputTarget label="Tahapan 4" />
              <InputTarget label="Tahapan 5" />
              <InputTarget label="Syarat Tahapan" />
            </div>

            <p className="mt-2 text-[0.75rem] leading-[1.125rem] text-[var(--text-muted)] md:text-[0.875rem]">
              Menyimpan formulir ini berarti menetapkan target pengerjaan yang
              akan dipantau secara berkala melalui laporan progres harian di
              aplikasi Mandorin.
            </p>

            <div className="mt-4 flex justify-center">
              <button
                type="submit"
                className="h-[3.25rem] w-full max-w-[18rem] rounded-[0.5rem] bg-[var(--orange-normal)] text-[1rem] font-semibold text-white transition-colors hover:bg-[var(--orange-dark)]"
              >
                Kirim
              </button>
            </div>
          </form>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
