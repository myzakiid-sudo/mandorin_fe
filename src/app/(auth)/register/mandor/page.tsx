"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import UploadPortfolioModal from "@/components/features/auth/upload-portfolio-modal";
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
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const todayDate = now.toISOString().split("T")[0];

  const [isFormComplete, setIsFormComplete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState("");

  // State khusus Portofolio
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  const updateFormValidity = (
    formElement: HTMLFormElement,
    file: File | null = portfolioFile,
  ) => {
    const formData = new FormData(formElement);

    const allTextFieldsFilled = formFields.every((field) => {
      const value = formData.get(field.name);
      return typeof value === "string" && value.trim() !== "";
    });

    const avatar = formData.get("avatar");
    const hasAvatar = avatar instanceof File && avatar.size > 0;
    const hasPortfolio = file !== null;

    setIsFormComplete(allTextFieldsFilled && hasAvatar && hasPortfolio);
  };

  const handlePortfolioConfirm = (file: File) => {
    setPortfolioFile(file);
    const form = document.getElementById(
      "register-mandor-form",
    ) as HTMLFormElement;
    if (form) updateFormValidity(form, file);
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setAvatarPreviewUrl("");
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    setAvatarPreviewUrl((prev) => {
      if (prev.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }

      return nextUrl;
    });
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // Inject portofolio file
    if (portfolioFile) {
      formData.set("portfolio", portfolioFile);
    } else {
      alert("Mohon unggah file portofolio terlebih dahulu!");
      return;
    }

    // Normaliasi format Backend API ("T00:00:00.000Z")
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
        alert(data?.message || "Gagal mendaftar, silakan periksa data Anda.");
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
          <h1 className="text-center text-2xl font-semibold text-[var(--text-black)]">
            Isi Data Diri Mandor
          </h1>

          <form
            id="register-mandor-form"
            onSubmit={handleRegister}
            onChange={(e) => updateFormValidity(e.currentTarget)}
            className="mx-auto mt-6 flex w-full max-w-[44rem] flex-col gap-3"
          >
            {/* Avatar Upload */}
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

            {/* General Input Fields */}
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

            {/* Custom Portfolio File Trigger */}
            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-sm font-medium text-[var(--text-black)]">
                Foto Portofolio
              </label>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className={`flex h-[4.75rem] cursor-pointer items-center justify-center gap-3 rounded-md border border-[var(--black-light)] text-sm transition-colors hover:bg-[var(--white-normal-hover)] ${portfolioFile ? "bg-[var(--green-light)] text-[var(--green-dark)] border-[var(--green-normal)]" : "text-[var(--text-muted)]"}`}
              >
                <span>
                  {portfolioFile
                    ? `✔ Portofolio Tersimpan`
                    : "Unggah Portofolio"}
                </span>
                {!portfolioFile && (
                  <span className="flex h-[1.75rem] w-[1.75rem] items-center justify-center rounded-full bg-[var(--black-light)] text-base font-semibold text-[var(--text-black)]">
                    ↑
                  </span>
                )}
              </button>
            </div>

            <p className="mt-4 text-xs text-[var(--text-muted)]">
              Dengan mendaftar, saya menyetujui Syarat & Ketentuan serta
              Kebijakan Privasi Mandorin.
            </p>

            <button
              type="submit"
              disabled={!isFormComplete}
              className={`mx-auto mt-3 inline-flex h-[3.25rem] w-full items-center justify-center rounded-lg px-5 text-[1rem] font-semibold transition-colors md:w-[14.75rem] ${
                isFormComplete
                  ? "bg-[var(--orange-normal)] text-white hover:bg-[var(--orange-dark)]"
                  : "border border-[var(--btn-outline-border)] bg-[var(--btn-disabled-bg)] text-[var(--btn-disabled-text)]"
              }`}
            >
              Daftar Mandor
            </button>
          </form>
        </section>
      </div>

      {/* Render the Modal Portofolio Pickup */}
      <UploadPortfolioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePortfolioConfirm}
      />
    </main>
  );
}
