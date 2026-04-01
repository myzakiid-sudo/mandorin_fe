"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import Button from "@/components/ui/button";

const LOGIN_ENDPOINT = "https://be-internship.bccdev.id/dzaki/api/auth/login";
const TOKEN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

type LoginResponse = {
  success?: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    data?: {
      accessToken?: string;
    };
  };
};

const clearAuthState = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  document.cookie =
    "token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax";
  document.cookie =
    "role=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax";
};

const getLoginErrorMessage = (
  responseStatus: number,
  apiMessage?: string,
): string => {
  if (apiMessage?.trim()) return apiMessage;
  if (responseStatus === 400 || responseStatus === 401) {
    return "Email atau kata sandi tidak sesuai.";
  }
  return "Login gagal. Silakan coba lagi.";
};

type SharedLoginProps = {
  role: "client" | "mandor";
};

export default function SharedLogin({ role }: SharedLoginProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const saveAuthState = (accessToken: string) => {
    localStorage.setItem("token", accessToken);
    localStorage.setItem("role", role);
    document.cookie = `token=${encodeURIComponent(accessToken)}; path=/; max-age=${TOKEN_COOKIE_MAX_AGE}; samesite=lax`;
    document.cookie = `role=${role}; path=/; max-age=${TOKEN_COOKIE_MAX_AGE}; samesite=lax`;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (errorMessage) setErrorMessage("");
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (errorMessage) setErrorMessage("");
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data: LoginResponse | null = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok || data?.success !== true) {
        clearAuthState();
        setErrorMessage(getLoginErrorMessage(response.status, data?.message));
        return;
      }

      const accessToken =
        data.data?.accessToken || data.data?.data?.accessToken;
      if (!accessToken) {
        clearAuthState();
        setErrorMessage(data.message || "Email atau kata sandi tidak sesuai.");
        return;
      }

      saveAuthState(accessToken);
      const nextPath = searchParams.get("next");
      const defaultPath = role === "client" ? "/beranda" : "/dashboard/mandor/projects";
      const safeNextPath =
        nextPath && nextPath.startsWith("/") ? nextPath : defaultPath;
      router.push(safeNextPath);
    } catch (err) {
      console.error("Fetch error:", err);
      clearAuthState();
      setErrorMessage(
        "Gagal terhubung ke server. Periksa koneksi atau port 3001.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full">
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 md:px-16 xl:px-24 py-12 bg-white">
        <h1 className="mb-3 text-center text-[2.5rem] font-semibold leading-[3rem]">
          <span className="text-[var(--blue-dark)]">Masuk ke </span>
          <span className="text-[var(--orange-normal)]">MandorIn</span>
        </h1>

        <p className="mb-8 text-center text-[0.875rem] leading-[1.25rem] text-[var(--text-secondary)]">
          Untuk memberikan layanan yang lebih baik, kami menganjurkan anda untuk
          mendaftar akun.
        </p>

        <button
          type="button"
          onClick={() => alert("Fitur Google Login belum aktif")}
          className="w-full flex items-center justify-center gap-3 border border-[var(--black-light)] rounded-lg py-3 mb-6 transition-colors hover:bg-gray-50 text-[1rem] leading-[1.5rem] h-[3.25rem] font-semibold text-[var(--text-black)]"
        >
          <Image src="/images/icons/icon-google.svg" alt="Google" width={24} height={24} />
          Masuk dengan Google
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-[var(--black-light)]" />
          <span className="text-[0.875rem] text-[var(--text-muted)]">
            Masuk dengan Email
          </span>
          <div className="flex-1 h-px bg-[var(--black-light)]" />
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-[0.875rem] leading-[1.25rem] font-medium text-[var(--text-black)]"
            >
              Email Pengguna
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--black-light)] px-4 outline-none transition-colors h-[3.25rem] text-[0.875rem] text-[var(--text-black)] focus:border-[var(--orange-normal)]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-[0.875rem] leading-[1.25rem] font-medium text-[var(--text-black)]"
            >
              Kata Sandi
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--black-light)] px-4 outline-none transition-colors h-[3.25rem] text-[0.875rem] text-[var(--text-black)] focus:border-[var(--orange-normal)]"
            />
          </div>

          <div className="flex justify-end">
            <Link
              href="#"
              className="hover:underline text-[0.875rem] text-[var(--text-secondary)]"
            >
              Lupa Kata Sandi ?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
          >
            {loading ? "Memuat..." : "Masuk"}
          </Button>

          {errorMessage && (
            <p
              role="alert"
              aria-live="polite"
              className="mt-2 text-center text-sm font-medium text-[var(--red-normal)] bg-red-50 py-2 rounded-md border border-red-200"
            >
              {errorMessage}
            </p>
          )}
        </form>

        <p className="text-center mt-6 text-[0.875rem] text-[var(--text-secondary)]">
          Tidak Punya Akun ?{" "}
          <Link
            href={`/register/${role}`}
            className="font-semibold hover:underline text-[var(--text-black)]"
          >
            Daftar di sini
          </Link>
        </p>
      </div>

      <div className="hidden lg:block relative w-1/2">
        <Image
          src="/images/auth/login/login-illustration.png"
          alt="Mandor bekerja"
          fill
          sizes="(max-width: 1023px) 0vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
    </main>
  );
}
