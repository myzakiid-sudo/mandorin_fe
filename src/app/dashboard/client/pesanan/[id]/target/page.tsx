"use client";

import React from "react";
import PublicNavbar from "@/components/features/public/navbar";
import PublicFooter from "@/components/features/public/footer";

function ReadonlyTargetInput({
  label,
  value,
  type = "text",
  rows,
}: {
  label: string;
  value: string;
  type?: string;
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
          value={value}
          readOnly
          className="rounded-[0.375rem] border border-[var(--black-light-active)] bg-white px-[0.75rem] py-2 text-[0.938rem] leading-[1.375rem] text-[var(--text-black)] outline-none md:text-[1rem] cursor-default"
        />
      ) : (
        <input
          type={type}
          value={value}
          readOnly
          className="h-[2.5rem] rounded-[0.375rem] border border-[var(--black-light-active)] bg-white px-[0.75rem] text-[0.938rem] leading-[1.375rem] text-[var(--text-black)] outline-none md:h-[2.75rem] md:text-[1rem] cursor-default"
        />
      )}
    </label>
  );
}

export default function ClientTargetPengerjaanPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f3f3f3]">
      <PublicNavbar />

      <main className="mx-auto w-full max-w-[90rem] flex-1 px-[1rem] py-[1.5rem] md:px-[2.5rem] md:py-[2rem] xl:px-[6.25rem]">
        <section className="mx-auto max-w-[65rem] rounded-[1rem] border border-[var(--black-light)] bg-white px-[1.5rem] py-[2rem] shadow-[0_0.375rem_1.25rem_rgba(0,0,0,0.06)] md:px-[4rem] md:py-[3rem]">
          <h1 className="text-center text-[1.5rem] font-semibold leading-[2rem] text-[var(--text-black)] md:text-[2rem] md:leading-[2.5rem]">
            Target Tahapan Pengerjaan
          </h1>

          <div className="mt-[2rem] flex flex-col gap-[1.25rem]">
            <ReadonlyTargetInput 
                label="Nama Proyek" 
                value="Renovasi Dapur Modern Open Space - Kediaman Rico"
            />

            <div className="grid grid-cols-1 gap-[1.25rem] md:grid-cols-2">
              <ReadonlyTargetInput 
                label="Tanggal Survei" 
                value="15/03/2026" 
              />
              <ReadonlyTargetInput 
                label="Target Tanggal Selesai" 
                value="15/05/2026" 
              />
            </div>

            <ReadonlyTargetInput 
                label="Alamat Lengkap Proyek" 
                value="Jl. Simpang Borobudur No. 45, Kec. Lowokwaru, Kota Malang"
            />

            <ReadonlyTargetInput 
                label="Deskripsi Pekerjaan" 
                type="textarea"
                rows={2}
                value="Transformasi total area dapur meliputi pembongkaran kabinet lama, penggantian lantai, instalasi ulang jalur air dan listrik, serta pemasangan kitchen set kustom dengan material HPL premium."
            />

            <div className="mt-4 flex flex-col gap-[1.25rem]">
              <h3 className="text-[1.125rem] font-semibold text-[var(--text-black)]">
                Urutan Tahapan
              </h3>
              <ReadonlyTargetInput 
                label="Tahapan 1" 
                value="Pembongkaran area dapur lama dan pembersihan puing material."
              />
              <ReadonlyTargetInput 
                label="Tahapan 2" 
                value="Instalasi jalur pipa air baru (wastafel) dan titik kelistrikan (oven/kulkas)."
              />
              <ReadonlyTargetInput 
                label="Tahapan 3" 
                value="Pengerjaan lantai granit dan finishing cat dinding bagian belakang."
              />
              <ReadonlyTargetInput 
                label="Tahapan 4" 
                value="Pemasangan kabinet kitchen set bawah, top table, dan kabinet gantung."
              />
              <ReadonlyTargetInput 
                label="Tahapan 5" 
                value="Finishing akhir, pemasangan lampu LED, dan pembersihan menyeluruh."
              />
              <ReadonlyTargetInput 
                label="Syarat Tahapan" 
                type="textarea"
                rows={2}
                value="Pemasangan kabinet (Tahapan 4) hanya dapat dilakukan setelah instalasi listrik dan lantai (Tahapan 2 & 3) selesai 100% untuk menghindari kerusakan material."
              />
            </div>

            <p className="mt-2 text-[0.75rem] leading-[1.125rem] text-[var(--text-muted)] md:text-[0.875rem] mb-6 border-b pb-8 border-transparent">
              Menyimpan formulir ini berarti menetapkan target pengerjaan yang
              akan dipantau secara berkala melalui laporan progres harian di
              aplikasi Mandorin.
            </p>
            
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
