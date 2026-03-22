"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import Button from "@/components/ui/button";

type MandorRegisterForm = {
  fullName: string;
  birthPlaceDate: string;
  gender: string;
  nik: string;
  specialization: string;
  coverageArea: string;
  experienceYears: string;
  ktpAddress: string;
  phoneNumber: string;
  portfolioFile: File | null;
  password: string;
  confirmPassword: string;
};

const initialForm: MandorRegisterForm = {
  fullName: "",
  birthPlaceDate: "",
  gender: "",
  nik: "",
  specialization: "",
  coverageArea: "",
  experienceYears: "",
  ktpAddress: "",
  phoneNumber: "",
  portfolioFile: null,
  password: "",
  confirmPassword: "",
};

const formFields: Array<{
  id: Exclude<keyof MandorRegisterForm, "portfolioFile">;
  label: string;
  type: "text" | "password" | "tel";
}> = [
  { id: "fullName", label: "Nama Lengkap", type: "text" },
  { id: "birthPlaceDate", label: "Tempat & Tanggal Lahir", type: "text" },
  { id: "gender", label: "Jenis Kelamin", type: "text" },
  { id: "nik", label: "NIK", type: "text" },
  { id: "specialization", label: "Spesialisasi", type: "text" },
  { id: "coverageArea", label: "Wilayah Jangkauan", type: "text" },
  { id: "experienceYears", label: "Pengalaman Kerja (Tahun)", type: "text" },
  { id: "ktpAddress", label: "Alamat Sesuai KTP", type: "text" },
  { id: "phoneNumber", label: "Nomor HP", type: "tel" },
  { id: "password", label: "Kata Sandi", type: "password" },
  { id: "confirmPassword", label: "Konfirmasi Kata Sandi", type: "password" },
];

export default function RegisterMandorPage() {
  const [form, setForm] = useState<MandorRegisterForm>(initialForm);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO BACKEND 1: Minta endpoint BE untuk register mandor + method HTTP dan auth requirement.
    // TODO BACKEND 2: Samakan payload JSON/FormData dengan BE (nama key wajib sama, termasuk file portfolio).
    // TODO BACKEND 3: Tambahkan validasi FE sesuai kontrak BE (format nomor HP, panjang password, NIK, dsb).
    // TODO BACKEND 4: Kirim request register, lalu handle response sukses/gagal (toast + redirect login mandor).
    // TODO BACKEND 5: Jika BE mengembalikan token+role, simpan ke localStorage: token dan role="mandor".
    console.log("Mandor register payload preview:", form);
  };

  return (
    <main className="min-h-screen bg-[var(--white-normal-hover)]">
      <div className="mx-auto w-full max-w-[90rem] px-5 py-6 md:px-10 md:py-8 xl:px-[6.25rem]">
        <header className="flex items-center gap-3">
          <Image
            src="/images/logo-mandorin.svg"
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

          <form
            className="mx-auto mt-8 flex w-full max-w-[44rem] flex-col gap-3 md:mt-10"
            onSubmit={handleSubmit}
          >
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
                  value={form[field.id]}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      [field.id]: event.target.value,
                    }))
                  }
                  className="h-[2.75rem] rounded-md border border-[var(--black-light)] px-3 text-sm text-[var(--text-black)] outline-none transition-colors focus:border-[var(--orange-normal)]"
                />
              </div>
            ))}

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="portfolioFile"
                className="text-sm font-medium text-[var(--text-black)]"
              >
                Foto Portofolio
              </label>
              <label
                htmlFor="portfolioFile"
                className="flex h-[4.75rem] cursor-pointer items-center justify-center gap-3 rounded-md border border-[var(--black-light)] text-sm text-[var(--text-muted)] transition-colors hover:bg-[var(--white-normal-hover)]"
              >
                <span>Unggah Portofolio</span>
                <span className="flex h-[1.75rem] w-[1.75rem] items-center justify-center rounded-full bg-[var(--black-light)] text-base font-semibold text-[var(--text-black)]">
                  ↑
                </span>
              </label>
              <input
                id="portfolioFile"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    portfolioFile: event.target.files?.[0] ?? null,
                  }))
                }
              />
              {form.portfolioFile ? (
                <p className="text-xs text-[var(--text-secondary)]">
                  File dipilih: {form.portfolioFile.name}
                </p>
              ) : null}
            </div>

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
