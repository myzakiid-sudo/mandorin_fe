"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { API_BASE_URL } from "@/lib/api-config";
import { USE_AUTH_CREDENTIALS } from "@/lib/auth-fetch";
import { extractAuthSession } from "@/lib/auth-session";

const REGISTER_ENDPOINT = `${API_BASE_URL}/auth/register/foreman`;

type RegisterApiResponse = {
  success?: boolean;
  message?: string;
  data?: Record<string, unknown>;
};

const formFields: Array<{
  name: string;
  label: string;
  type: "text" | "password" | "tel" | "email" | "date" | "number";
}> = [
  { name: "name", label: "Nama Lengkap", type: "text" },
  { name: "birth_place", label: "Tempat Lahir", type: "text" },
  { name: "birth_date", label: "Tanggal Lahir", type: "date" },
  { name: "sex", label: "Jenis Kelamin", type: "text" },
  { name: "address", label: "Alamat Sesuai KTP", type: "text" },
  { name: "email", label: "Alamat Email", type: "email" },
  { name: "phone", label: "Nomor HP", type: "tel" },
  { name: "nik", label: "NIK", type: "text" },
  { name: "field", label: "Spesialisasi", type: "text" },
  { name: "area", label: "Wilayah Jangkauan", type: "text" },
  { name: "experience", label: "Pengalaman Kerja (Tahun)", type: "number" },
  { name: "password", label: "Kata Sandi", type: "password" },
  { name: "confirm", label: "Konfirmasi Kata Sandi", type: "password" },
];

export default function RegisterMandorPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const todayDate = new Date().toISOString().split("T")[0];
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState("");
  const [portfolioPreviewUrl, setPortfolioPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setAvatarPreviewUrl("");
      return;
    }

    setAvatarPreviewUrl(URL.createObjectURL(file));
  };

  const handlePortfolioChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setPortfolioPreviewUrl("");
      return;
    }

    setPortfolioPreviewUrl(URL.createObjectURL(file));
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    // Backend meminta format tanggal ISO lengkap.
    const birthDateValue = formData.get("birth_date");
    if (typeof birthDateValue === "string" && birthDateValue) {
      formData.set("birth_date", `${birthDateValue}T00:00:00.000Z`);
    }

    const password = formData.get("password");
    const confirm = formData.get("confirm");
    if (password !== confirm) {
      alert("Kata sandi dan konfirmasi kata sandi tidak cocok!");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(REGISTER_ENDPOINT, {
        method: "POST",
        ...(USE_AUTH_CREDENTIALS ? { credentials: "include" as const } : {}),
        body: formData,
      });

      let data: RegisterApiResponse | null = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok || data?.success !== true) {
        const rawMessage = String(data?.message ?? "").toLowerCase();
        const message =
          rawMessage.includes("users_email_key") ||
          (rawMessage.includes("unique constraint") &&
            rawMessage.includes("email"))
            ? "Email sudah terdaftar. Silakan gunakan email lain."
            : data?.message || "Gagal mendaftar, silakan periksa data Anda.";

        alert(message);
        return;
      }

      const authSession = extractAuthSession(data, "mandor");
      if (!authSession) {
        alert("Registrasi berhasil, tetapi token tidak ditemukan.");
        return;
      }

      setSession(authSession);

      alert("Registrasi Mandor Berhasil!");
      router.push("/dashboard/mandor/projects");
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--white-normal-hover)] relative">
      <div className="mx-auto w-full max-w-[90rem] px-5 py-6 md:px-10 md:py-8 xl:px-[6.25rem]">
        <header className="flex items-center gap-3">
          <Image
            src="/images/logo-mandorin.svg"
            alt="MandorIn"
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
            priority
          />
          <span className="text-[1.5rem] font-semibold text-[var(--orange-normal)]">
            MandorIn
          </span>
        </header>

        <section className="mt-5 rounded-2xl border border-[var(--black-light)] bg-[var(--white-normal)] px-5 py-8 shadow-sm md:px-10 md:py-10">
          <h1 className="text-center text-[1.5rem] font-semibold text-[var(--text-black)] md:text-2xl">
            Isi Data Diri Mandor
          </h1>

          <form
            onSubmit={handleRegister}
            className="mx-auto mt-6 flex w-full max-w-[44rem] flex-col gap-3"
          >
            {/* Upload avatar */}
            <label
              htmlFor="avatar"
              className="mx-auto relative flex h-[6.5rem] w-[6.5rem] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[var(--black-light)] transition-opacity hover:opacity-80"
              title="Unggah File Avatar Gambar"
            >
              {avatarPreviewUrl ? (
                <Image
                  src={avatarPreviewUrl}
                  alt="Preview avatar"
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-[3rem] leading-none text-[var(--text-black)]">
                  +
                </span>
              )}
              <input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                required
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>

            {/* Field data diri */}
            <div className="mt-4 flex flex-col gap-3 md:mt-6">
              {formFields.map((field) => (
                <div key={field.name} className="flex flex-col gap-1.5">
                  <label
                    htmlFor={field.name}
                    className="text-sm font-medium text-[var(--text-black)]"
                  >
                    {field.label}
                  </label>
                  {field.name === "sex" ? (
                    <select
                      id={field.name}
                      name={field.name}
                      required
                      defaultValue=""
                      className="h-[2.75rem] rounded-md border border-[var(--black-light)] px-3 text-sm text-[var(--text-black)] outline-none transition-colors focus:border-[var(--orange-normal)] bg-white"
                    >
                      <option value="" disabled>
                        Pilih jenis kelamin
                      </option>
                      <option value="male">Laki-laki</option>
                      <option value="female">Perempuan</option>
                    </select>
                  ) : (
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      min={field.name === "experience" ? 0 : undefined}
                      max={field.name === "birth_date" ? todayDate : undefined}
                      required
                      className="h-[2.75rem] rounded-md border border-[var(--black-light)] px-3 text-sm text-[var(--text-black)] outline-none transition-colors focus:border-[var(--orange-normal)]"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-2 flex flex-col gap-1.5">
              <label
                htmlFor="portfolio"
                className="text-sm font-medium text-[var(--text-black)]"
              >
                Foto Portofolio
              </label>

              <label
                htmlFor="portfolio"
                className="relative flex h-[9rem] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-[var(--black-light)] bg-[var(--white-normal-hover)] transition-opacity hover:opacity-90"
                title="Unggah Foto Portofolio"
              >
                {portfolioPreviewUrl ? (
                  <Image
                    src={portfolioPreviewUrl}
                    alt="Preview portofolio"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-[3rem] leading-none text-[var(--text-black)]">
                    +
                  </span>
                )}

                <input
                  id="portfolio"
                  name="portfolio"
                  type="file"
                  accept="image/*"
                  required
                  onChange={handlePortfolioChange}
                  className="hidden"
                />
              </label>
            </div>

            <p className="mt-4 text-xs text-[var(--text-muted)]">
              Dengan mendaftar, saya menyetujui Syarat & Ketentuan serta
              Kebijakan Privasi Mandorin.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mx-auto mt-3 inline-flex h-[3.25rem] w-full items-center justify-center rounded-lg bg-[var(--orange-normal)] px-5 text-[1rem] font-semibold text-white transition-colors hover:bg-[var(--orange-dark)] md:w-[14.75rem]"
            >
              {isSubmitting ? "Mendaftar..." : "Daftar Mandor"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
