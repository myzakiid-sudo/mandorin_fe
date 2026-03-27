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

const saveAuthState = (accessToken: string) => {
  localStorage.setItem("token", accessToken);
  localStorage.setItem("role", "client");
  document.cookie = `token=${encodeURIComponent(accessToken)}; path=/; max-age=${TOKEN_COOKIE_MAX_AGE}; samesite=lax`;
  document.cookie = `role=client; path=/; max-age=${TOKEN_COOKIE_MAX_AGE}; samesite=lax`;
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

export default function LoginClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
      const safeNextPath =
        nextPath && nextPath.startsWith("/") ? nextPath : "/beranda";
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
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
            <path
              d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              fill="#FFC107"
            />
            <path
              d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
              fill="#FF3D00"
            />
            <path
              d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
              fill="#4CAF50"
            />
            <path
              d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
              fill="#1976D2"
            />
          </svg>
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
              className="mt-2 text-center text-sm font-medium text-red-600 bg-red-50 py-2 rounded-md border border-red-200"
            >
              {errorMessage}
            </p>
          )}
        </form>

        <p className="text-center mt-6 text-[0.875rem] text-[var(--text-secondary)]">
          Tidak Punya Akun ?{" "}
          <Link
            href="/register/client"
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
