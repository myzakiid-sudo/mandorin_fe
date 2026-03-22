"use client";

import Image from "next/image";
import Button from "@/components/ui/button";

const formFields = [
  { id: "fullName", label: "Nama Lengkap", type: "text" },
  { id: "nickName", label: "Nama Panggilan", type: "text" },
  { id: "birthPlaceDate", label: "Tempat & Tanggal Lahir", type: "text" },
  { id: "gender", label: "Jenis Kelamin", type: "text" },
  { id: "ktpAddress", label: "Alamat Sesuai KTP", type: "text" },
  { id: "email", label: "Alamat Email", type: "email" },
  { id: "phoneNumber", label: "Nomor HP", type: "tel" },
  { id: "password", label: "Kata Sandi", type: "password" },
  { id: "confirmPassword", label: "Konfirmasi Kata Sandi", type: "password" },
];

export default function RegisterClientPage() {
  return (
    <main className="min-h-screen bg-[var(--white-normal-hover)]">
      <div className="mx-auto w-full max-w-[90rem] px-5 py-6 md:px-10 md:py-8 xl:px-[6.25rem]">
        <header className="flex items-center gap-3">
          <Image
            src="/images/branding/logo/mandorin-logo.png"
            alt="MandorIn"
            width={44}
            height={44}
            className="h-[2.75rem] w-[2.75rem] object-contain"
            priority
          />
          <span className="text-[1.5rem] font-semibold text-[var(--orange-normal)]">
            MandorIn
          </span>
        </header>

        <section className="mt-5 rounded-2xl border border-[var(--black-light)] bg-[var(--white-normal)] px-5 py-8 shadow-sm md:px-10 md:py-10">
          <h1 className="text-center text-2xl font-semibold text-[var(--text-black)]">
            Isi Data Diri
          </h1>

          <div className="mx-auto mt-6 flex h-[6.5rem] w-[6.5rem] items-center justify-center rounded-full bg-[var(--black-light)]">
            <span className="text-[3rem] leading-none text-[var(--text-black)]">
              +
            </span>
          </div>

          <form className="mx-auto mt-8 flex w-full max-w-[44rem] flex-col gap-3 md:mt-10">
            {formFields.map((field) => (
              <div key={field.id} className="flex flex-col gap-1.5">
                <label
                  htmlFor={field.id}
                  className="text-sm font-medium text-[var(--text-black)]"
                >
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  className="h-[2.75rem] rounded-md border border-[var(--black-light)] px-3 text-sm text-[var(--text-black)] outline-none transition-colors focus:border-[var(--orange-normal)]"
                />
              </div>
            ))}

            <p className="mt-2 text-xs text-[var(--text-muted)]">
              Dengan mendaftar, saya menyetujui Syarat & Ketentuan serta
              Kebijakan Privasi Mandorin.
            </p>

            <Button
              type="submit"
              variant="outline"
              size="lg"
              fullWidth
              className="mx-auto mt-3 md:!w-[14.75rem]"
            >
              Kirim
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}
