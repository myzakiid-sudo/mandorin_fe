"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";

export default function LoginClientPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: sambungkan ke BE
    // const res = await fetch("http://localhost:3001/api/auth/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email, password }),
    // });
    // const data = await res.json();
    // localStorage.setItem("token", data.token);
    // localStorage.setItem("role", "client");
    // router.push("/dashboard/client/projects");

    setLoading(false);
  };

  const handleGoogle = () => {
    // TODO: sambungkan ke OAuth BE
  };

  return (
    <main className="flex min-h-screen w-full">
      {/* ── Kolom Kiri — Form ── */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 md:px-16 xl:px-24 py-12 bg-white">
        {/* Judul */}
        <h1
          className="font-semibold mb-3"
          style={{ fontSize: "40px", lineHeight: "48px" }}
        >
          <span style={{ color: "var(--blue-dark)" }}>Masuk ke </span>
          <span style={{ color: "var(--orange-normal)" }}>MandorIn</span>
        </h1>

        {/* Subjudul */}
        <p
          className="mb-8 text-center"
          style={{
            fontSize: "14px",
            lineHeight: "20px",
            color: "var(--text-secondary)",
          }}
        >
          Untuk memberikan layanan yang lebih baik, kami
          <br />
          menganjurkan anda untuk mendaftar akun.
        </p>

        {/* Tombol Google */}
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 border rounded-lg py-3 mb-6 transition-colors hover:bg-gray-50"
          style={{
            borderColor: "var(--black-light)",
            fontSize: "16px",
            lineHeight: "24px",
            fontWeight: 600,
            color: "var(--text-black)",
            height: "52px",
          }}
        >
          {/* Google Icon SVG */}
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

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: "var(--black-light)" }}
          />
          <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Masuk dengan Email
          </span>
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: "var(--black-light)" }}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              style={{
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 500,
                color: "var(--text-black)",
              }}
            >
              Email Pengguna
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border px-4 outline-none transition-colors focus:border-[var(--orange-normal)]"
              style={{
                height: "52px",
                borderColor: "var(--black-light)",
                fontSize: "14px",
                color: "var(--text-black)",
              }}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              style={{
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 500,
                color: "var(--text-black)",
              }}
            >
              Kata Sandi
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border px-4 outline-none transition-colors focus:border-[var(--orange-normal)]"
              style={{
                height: "52px",
                borderColor: "var(--black-light)",
                fontSize: "14px",
                color: "var(--text-black)",
              }}
            />
          </div>

          {/* Lupa Kata Sandi */}
          <div className="flex justify-end">
            <Link
              href="#"
              style={{ fontSize: "14px", color: "var(--text-secondary)" }}
              className="hover:underline"
            >
              Lupa Kata Sandi ?
            </Link>
          </div>

          {/* Tombol Masuk */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
          >
            {loading ? "Memuat..." : "Masuk"}
          </Button>
        </form>

        {/* Link Daftar */}
        <p
          className="text-center mt-6"
          style={{ fontSize: "14px", color: "var(--text-secondary)" }}
        >
          Tidak Punya Akun ?{" "}
          <Link
            href="/register/client"
            className="font-semibold hover:underline"
            style={{ color: "var(--text-black)" }}
          >
            Daftar di sini
          </Link>
        </p>
      </div>

      {/* ── Kolom Kanan — Foto ── */}
      <div className="hidden lg:block relative w-1/2">
        <Image
          src="/images/login.png"
          alt="Mandor bekerja"
          fill
          className="object-cover"
          priority
        />
      </div>
    </main>
  );
}
