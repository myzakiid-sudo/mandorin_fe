"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/context/auth-context";

const API_BASE_URL = "https://be-internship.bccdev.id/dzaki/api";

type ClientProfile = {
  id: number;
  name: string;
  birth_place: string;
  birth_date: string;
  sex: string;
  address: string;
  email: string;
  phone: string;
  avatar: string;
  user_id?: number;
  nick?: string;
  role?: string;
};

type ClientProfileResponse = {
  success?: boolean;
  data?: ClientProfile;
  message?: string;
};

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatGender = (value: string) => {
  if (value === "male") return "Laki-laki";
  if (value === "female") return "Perempuan";
  return value || "-";
};

export default function ClientProfilePage() {
  const { authSession, isReady } = useAuth();
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadSeed, setReloadSeed] = useState(0);

  const userId = authSession?.userId?.trim() ?? "";

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!authSession || authSession.role !== "client" || !userId) {
      setProfile(null);
      setErrorMessage("Sesi akun client tidak ditemukan. Silakan login ulang.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadProfile = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/clients/${encodeURIComponent(userId)}`,
          {
            method: "GET",
            signal: controller.signal,
            headers: {
              Accept: "application/json",
            },
          },
        );

        let payload: ClientProfileResponse | null = null;

        try {
          payload = await response.json();
        } catch {
          payload = null;
        }

        if (!response.ok || payload?.success !== true || !payload.data) {
          setProfile(null);
          setErrorMessage(
            payload?.message || "Gagal mengambil data profil client.",
          );
          return;
        }

        setProfile(payload.data);
      } catch {
        if (controller.signal.aborted) {
          return;
        }

        setProfile(null);
        setErrorMessage(
          "Terjadi kesalahan jaringan saat memuat profil client.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => controller.abort();
  }, [authSession, isReady, reloadSeed, userId]);

  const displayedName = useMemo(() => {
    if (profile?.name) return profile.name;
    return authSession?.userName || "-";
  }, [authSession?.userName, profile?.name]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--white-normal-hover)] px-4">
        <p className="text-base font-medium text-[var(--text-secondary)]">
          Memuat profil client...
        </p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--white-normal-hover)] px-4">
        <section className="w-full max-w-xl rounded-2xl border border-[var(--black-light)] bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-[var(--text-black)]">
            Profil Client
          </h1>
          <p className="mt-3 text-sm text-[var(--red-normal)]">
            {errorMessage}
          </p>
          <button
            type="button"
            onClick={() => setReloadSeed((prev) => prev + 1)}
            className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-[var(--orange-normal)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--orange-dark)]"
          >
            Muat Ulang
          </button>
        </section>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--white-normal-hover)] px-4 py-6 md:px-8 md:py-10 xl:px-16">
      <section className="mx-auto w-full max-w-5xl rounded-2xl border border-[var(--black-light)] bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-3xl font-semibold text-[var(--text-black)]">
          Profil Client
        </h1>

        <div className="mt-6 grid gap-6 md:grid-cols-[10rem_1fr] md:items-start">
          <div className="relative h-40 w-40 overflow-hidden rounded-full border border-[var(--black-light)] bg-[var(--white-normal-hover)]">
            {profile?.avatar ? (
              <Image
                src={profile.avatar}
                alt={displayedName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-[var(--text-muted)]">
                Tanpa Foto
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <ProfileField label="Nama Lengkap" value={displayedName} />
            <ProfileField label="Nama Panggilan" value={profile?.nick || "-"} />
            <ProfileField label="Email" value={profile?.email || "-"} />
            <ProfileField label="Nomor HP" value={profile?.phone || "-"} />
            <ProfileField
              label="Tempat, Tanggal Lahir"
              value={`${profile?.birth_place || "-"}, ${profile?.birth_date ? formatDate(profile.birth_date) : "-"}`}
            />
            <ProfileField
              label="Jenis Kelamin"
              value={formatGender(profile?.sex || "")}
            />
            <ProfileField label="Alamat" value={profile?.address || "-"} full />
          </div>
        </div>
      </section>
    </main>
  );
}

function ProfileField({
  label,
  value,
  full = false,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <article className={full ? "md:col-span-2" : undefined}>
      <p className="text-sm text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 rounded-lg border border-[var(--black-light)] bg-[var(--white-normal-hover)] px-4 py-2.5 text-sm font-medium text-[var(--text-black)]">
        {value}
      </p>
    </article>
  );
}
