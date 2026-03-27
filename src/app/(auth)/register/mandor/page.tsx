"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import Button from "@/components/ui/button";

const REGISTER_ENDPOINTS = [
  "https://be-internship.bccdev.id/dzaki/api/auth/register/foreman",
  "https://be-internship.bccdev.id/dzaki/api/auth/register/foremans",
];
const TOKEN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

type RegisterMandorResponse = {
  success?: boolean;
  message?: string;
  errors?: string[] | Record<string, string | string[] | undefined> | string;
  data?: {
    accessToken?: string;
    data?: {
      accessToken?: string;
    };
  };
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
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const todayDate = now.toISOString().split("T")[0];
  const [isFormComplete, setIsFormComplete] = useState(false);
  const isDevMode = process.env.NODE_ENV !== "production";

  const updateFormValidity = (formElement: HTMLFormElement) => {
    const formData = new FormData(formElement);

    const allTextFieldsFilled = formFields.every((field) => {
      const value = formData.get(field.name);
      return typeof value === "string" && value.trim() !== "";
    });

    const avatar = formData.get("avatar");
    const portfolio = formData.get("portfolio");
    const hasAvatar = avatar instanceof File && avatar.size > 0;
    const hasPortfolio = portfolio instanceof File && portfolio.size > 0;

    setIsFormComplete(allTextFieldsFilled && hasAvatar && hasPortfolio);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const rawBirthDateValue = formData.get("birth_date");

    const missingField = formFields.find((field) => {
      const value = formData.get(field.name);
      return typeof value !== "string" || value.trim() === "";
    });
    if (missingField) {
      alert(
        missingField.name === "sex"
          ? "Jenis kelamin wajib dipilih."
          : `${missingField.label} wajib diisi.`,
      );
      return;
    }

    const avatar = formData.get("avatar");
    const portfolio = formData.get("portfolio");
    const hasAvatar = avatar instanceof File && avatar.size > 0;
    const hasPortfolio = portfolio instanceof File && portfolio.size > 0;
    if (!hasAvatar || !hasPortfolio) {
      alert("Foto profil dan foto portofolio wajib diunggah.");
      return;
    }

    const sexValue = formData.get("sex");
    if (typeof sexValue === "string") {
      const normalizedSex = normalizeSexValue(sexValue);
      formData.set("sex", normalizedSex);
    }

    const birthDateValue = formData.get("birth_date");
    if (typeof birthDateValue === "string" && birthDateValue) {
      formData.set("birth_date", birthDateValue);
    }

    const password = formData.get("password");
    const confirm = formData.get("confirm");
    if (password !== confirm) {
      alert("Kata sandi dan konfirmasi kata sandi tidak cocok!");
      return;
    }

    appendCompatibilityFields(formData, rawBirthDateValue);
    console.info("Register mandor payload", buildPayloadPreview(formData));

    try {
      const { endpoint, response, rawBody, data } =
        await submitWithEndpointFallback(formData);

      if (!response.ok || data?.success !== true) {
        const detailMessage = buildApiErrorMessage(
          data,
          response.status,
          rawBody,
        );
        console.warn("Register mandor gagal", {
          endpoint,
          status: response.status,
          body: rawBody,
          response: data,
        });
        alert(detailMessage);
        return;
      }

      const accessToken =
        data.data?.accessToken || data.data?.data?.accessToken;
      if (!accessToken) {
        alert("Registrasi berhasil, tetapi token tidak ditemukan.");
        return;
      }

      saveAuthState(accessToken);
      alert("Registrasi mandor berhasil!");
      router.push("/dashboard/mandor/projects");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn("Terjadi masalah saat register mandor:", message);
      alert("Terjadi kesalahan jaringan.");
    }
  };

  const handleDevLoginMandor = () => {
    saveAuthState("dev-mandor-token");
    router.push("/dashboard/mandor/projects");
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
            className="mx-auto mt-6 flex w-full max-w-[44rem] flex-col gap-3"
            onSubmit={handleSubmit}
            onChange={(e) => updateFormValidity(e.currentTarget)}
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
                className="hidden"
              />
            </label>

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
                    className="h-[2.75rem] rounded-md border border-[var(--black-light)] px-3 text-sm text-[var(--text-black)] outline-none transition-colors focus:border-[var(--orange-normal)]"
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

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="portfolio"
                className="text-sm font-medium text-[var(--text-black)]"
              >
                Foto Portofolio
              </label>
              <label
                htmlFor="portfolio"
                className="flex h-[4.75rem] cursor-pointer items-center justify-center gap-3 rounded-md border border-[var(--black-light)] text-sm text-[var(--text-muted)] transition-colors hover:bg-[var(--white-normal-hover)]"
              >
                <span>Unggah Portofolio</span>
                <span className="flex h-[1.75rem] w-[1.75rem] items-center justify-center rounded-full bg-[var(--black-light)] text-base font-semibold text-[var(--text-black)]">
                  ↑
                </span>
              </label>
              <input
                id="portfolio"
                name="portfolio"
                type="file"
                accept="image/*"
                className="hidden"
              />
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

            {isDevMode ? (
              <Button
                type="button"
                variant="outline"
                size="lg"
                fullWidth
                onClick={handleDevLoginMandor}
                className="mx-auto mt-2 md:!w-[14.75rem]"
              >
                Masuk Mandor (Dev)
              </Button>
            ) : null}
          </form>
        </section>
      </div>
    </main>
  );
}

function saveAuthState(accessToken: string) {
  localStorage.setItem("token", accessToken);
  localStorage.setItem("role", "mandor");
  document.cookie = `token=${encodeURIComponent(accessToken)}; path=/; max-age=${TOKEN_COOKIE_MAX_AGE}; samesite=lax`;
  document.cookie = `role=mandor; path=/; max-age=${TOKEN_COOKIE_MAX_AGE}; samesite=lax`;
}

function normalizeSexValue(value: string) {
  const normalized = value.trim().toLowerCase();
  if (["l", "laki-laki", "laki", "male", "pria"].includes(normalized)) {
    return "male";
  }
  if (["p", "perempuan", "female", "famele", "wanita"].includes(normalized)) {
    return "female";
  }
  return value.trim();
}

function buildApiErrorMessage(
  data: RegisterMandorResponse | null,
  status: number,
  rawBody?: string,
) {
  const baseMessage =
    data?.message || `Registrasi mandor gagal (HTTP ${status}).`;
  const errors = data?.errors;

  if (!errors) {
    return baseMessage;
  }

  if (typeof errors === "string") {
    return `${baseMessage}\n${errors}`;
  }

  if (Array.isArray(errors)) {
    return `${baseMessage}\n${errors.join("\n")}`;
  }

  const lines = Object.entries(errors)
    .flatMap(([key, value]) => {
      if (!value) {
        return [];
      }
      if (Array.isArray(value)) {
        return value.map((item) => `${key}: ${item}`);
      }
      return `${key}: ${value}`;
    })
    .filter(Boolean);

  if (lines.length > 0) {
    return `${baseMessage}\n${lines.join("\n")}`;
  }

  if (rawBody && rawBody.trim() !== "") {
    return `${baseMessage}\nDetail server: ${rawBody}`;
  }

  return baseMessage;
}

function parseRegisterResponse(rawBody: string): RegisterMandorResponse | null {
  if (!rawBody || rawBody.trim() === "") {
    return null;
  }

  try {
    return JSON.parse(rawBody) as RegisterMandorResponse;
  } catch {
    return null;
  }
}

function appendCompatibilityFields(
  formData: FormData,
  rawBirthDateValue: FormDataEntryValue | null,
) {
  addAlias(formData, "full_name", "name");
  addAlias(formData, "gender", "sex");
  addAlias(formData, "phone_number", "phone");
  addAlias(formData, "phoneNumber", "phone");
  addAlias(formData, "specialization", "field");
  addAlias(formData, "experience_year", "experience");
  addAlias(formData, "experience_years", "experience");
  addAlias(formData, "confirm_password", "confirm");
  addAlias(formData, "confirmPassword", "confirm");
  addAlias(formData, "portofolio", "portfolio");
  addAlias(formData, "portfolio_file", "portfolio");

  if (typeof rawBirthDateValue === "string" && rawBirthDateValue) {
    setIfMissing(formData, "birthDate", rawBirthDateValue);
    setIfMissing(formData, "date_of_birth", rawBirthDateValue);
  }

  const nameValue = formData.get("name");
  const nickValue = formData.get("nick");
  if (
    (!nickValue ||
      (typeof nickValue === "string" && nickValue.trim() === "")) &&
    typeof nameValue === "string"
  ) {
    const suggestedNick = nameValue.trim().split(" ")[0];
    if (suggestedNick) {
      formData.set("nick", suggestedNick);
    }
  }
}

function addAlias(formData: FormData, aliasKey: string, sourceKey: string) {
  const sourceValue = formData.get(sourceKey);
  if (sourceValue == null) {
    return;
  }

  if (sourceValue instanceof File) {
    if (sourceValue.size <= 0) {
      return;
    }
    formData.set(aliasKey, sourceValue);
    return;
  }

  if (typeof sourceValue === "string" && sourceValue.trim() !== "") {
    formData.set(aliasKey, sourceValue);
  }
}

function setIfMissing(formData: FormData, key: string, value: string) {
  const current = formData.get(key);
  if (typeof current === "string" && current.trim() !== "") {
    return;
  }
  formData.set(key, value);
}

function buildPayloadPreview(formData: FormData) {
  const entries: Record<string, string> = {};

  formData.forEach((value, key) => {
    if (value instanceof File) {
      entries[key] = value.name
        ? `file:${value.name} (${value.size} bytes)`
        : "file:empty";
      return;
    }

    entries[key] = value;
  });

  return entries;
}

async function submitWithEndpointFallback(formData: FormData) {
  let lastResult: {
    endpoint: string;
    response: Response;
    rawBody: string;
    data: RegisterMandorResponse | null;
  } | null = null;

  for (const endpoint of REGISTER_ENDPOINTS) {
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    const rawBody = await response.text();
    const data = parseRegisterResponse(rawBody);

    lastResult = { endpoint, response, rawBody, data };

    if (response.ok && data?.success === true) {
      return lastResult;
    }

    // Retry only when endpoint is not found.
    // For any other status, keep this response as the main diagnostic result.
    if (response.status !== 404) {
      return lastResult;
    }
  }

  if (lastResult) {
    return lastResult;
  }

  throw new Error("Semua endpoint register mandor gagal diakses.");
}
