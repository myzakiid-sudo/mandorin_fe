"use client";

import Image from "next/image";
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

const REGISTER_ENDPOINT =
  "https://be-internship.bccdev.id/dzaki/api/auth/register/clients";
const TOKEN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

type RegisterApiResponse = {
  success?: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    data?: {
      accessToken?: string;
    };
  };
};

const formFields = [
  { name: "name", label: "Nama Lengkap", type: "text" },
  { name: "nick", label: "Nama Panggilan", type: "text" },
  { name: "birth_place", label: "Tempat Lahir", type: "text" },
  { name: "birth_date", label: "Tanggal Lahir", type: "date" },
  { name: "sex", label: "Jenis Kelamin", type: "text" },
  { name: "address", label: "Alamat Sesuai KTP", type: "text" },
  { name: "email", label: "Alamat Email", type: "email" },
  { name: "phone", label: "Nomor HP", type: "tel" },
  { name: "password", label: "Kata Sandi", type: "password" },
  { name: "confirm", label: "Konfirmasi Kata Sandi", type: "password" },
];

export default function RegisterClientPage() {
  const router = useRouter();
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const todayDate = now.toISOString().split("T")[0];
  const [isFormComplete, setIsFormComplete] = useState(false);

  const updateFormValidity = (formElement: HTMLFormElement) => {
    const formData = new FormData(formElement);

    const allTextFieldsFilled = formFields.every((field) => {
      const value = formData.get(field.name);
      return typeof value === "string" && value.trim() !== "";
    });

    const avatar = formData.get("avatar");
    const hasAvatar = avatar instanceof File && avatar.size > 0;

    setIsFormComplete(allTextFieldsFilled && hasAvatar);
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const birthDateValue = formData.get("birth_date");
    if (typeof birthDateValue === "string" && birthDateValue) {
      formData.set("birth_date", `${birthDateValue}T00:00:00.000Z`);
    }

    const password = formData.get("password");
    const confirm = formData.get("confirm");

    if (password !== confirm) {
      alert("Kata sandi dan konfirmasi kata sandi tidak cocok!");
      return;
    }

    try {
      const response = await fetch(REGISTER_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      let data: RegisterApiResponse | null = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok || data?.success !== true) {
        alert(data?.message || "Gagal mendaftar, silakan periksa data Anda.");
        return;
      }

      const accessToken =
        data.data?.accessToken || data.data?.data?.accessToken;
      if (!accessToken) {
        alert("Registrasi berhasil, tetapi token tidak ditemukan.");
        return;
      }

      saveAuthState(accessToken);

      alert("Registrasi Berhasil!");
      router.push("/beranda");
    } catch (error) {
      console.error("Terjadi masalah saat register:", error);
      alert("Terjadi kesalahan jaringan.");
    }
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

          <form
            onSubmit={handleRegister}
            onChange={(e) => updateFormValidity(e.currentTarget)}
            className="mx-auto mt-6 flex w-full max-w-[44rem] flex-col gap-3"
          >
            <label
              htmlFor="avatar"
              className="mx-auto flex h-[6.5rem] w-[6.5rem] cursor-pointer items-center justify-center rounded-full bg-[var(--black-light)] transition-opacity hover:opacity-80"
            >
              <span className="text-[3rem] leading-none text-[var(--text-black)]">
                +
              </span>
              <input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                required
                className="hidden"
              />
            </label>

            <div className="mt-4 flex flex-col gap-3 md:mt-6">
              {formFields.map((field) => (
                <div key={field.name} className="flex flex-col gap-1.5">
                  <label
                    htmlFor={field.name}
                    className="text-sm font-medium text-[var(--text-black)]"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    max={field.name === "birth_date" ? todayDate : undefined}
                    required
                    className="h-[2.75rem] rounded-md border border-[var(--black-light)] px-3 text-sm text-[var(--text-black)] outline-none transition-colors focus:border-[var(--orange-normal)]"
                  />
                </div>
              ))}
            </div>

            <p className="mt-2 text-xs text-[var(--text-muted)]">
              Dengan mendaftar, saya menyetujui Syarat & Ketentuan serta
              Kebijakan Privasi Mandorin.
            </p>

            <Button
              type="submit"
              variant={isFormComplete ? "primary" : "outline"}
              size="lg"
              fullWidth
              disabled={!isFormComplete}
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

function saveAuthState(accessToken: string) {
  localStorage.setItem("token", accessToken);
  localStorage.setItem("role", "client");
  document.cookie = `token=${encodeURIComponent(accessToken)}; path=/; max-age=${TOKEN_COOKIE_MAX_AGE}; samesite=lax`;
  document.cookie = `role=client; path=/; max-age=${TOKEN_COOKIE_MAX_AGE}; samesite=lax`;
}
