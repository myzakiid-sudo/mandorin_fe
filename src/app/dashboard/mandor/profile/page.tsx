"use client";

import { type FormEvent, useEffect, useState } from "react";

import { AppButton } from "@/components/ui/app-button";
import { FormField } from "@/components/ui/form-field";
import { useAuth } from "@/context/auth-context";
import {
  emptyMandorProfileForm,
  type MandorProfileForm,
  getForemanProfileByUserId,
  updateForemanProfile,
} from "@/lib/foreman-api";

export default function MandorProfilePage() {
  const { authSession, isReady } = useAuth();
  const [form, setForm] = useState<MandorProfileForm>(emptyMandorProfileForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [reloadSeed, setReloadSeed] = useState(0);

  const userId = authSession?.userId?.trim() ?? "";

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!authSession || authSession.role !== "mandor" || !userId) {
      setLoading(false);
      setErrorMessage("Sesi akun mandor tidak ditemukan. Silakan login ulang.");
      return;
    }

    const controller = new AbortController();

    const loadProfile = async () => {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      try {
        const nextForm = await getForemanProfileByUserId(
          userId,
          controller.signal,
        );

        if (!controller.signal.aborted) {
          setForm(nextForm);
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan jaringan saat memuat profil.",
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

  const setField = (key: keyof MandorProfileForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const updatedForm = await updateForemanProfile(form);
      setForm(updatedForm);
      setSuccessMessage("Profil mandor berhasil diperbarui.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan jaringan saat menyimpan profil.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--white-normal-hover)] px-4">
        <p className="text-base font-medium text-[var(--text-secondary)]">
          Memuat profil mandor...
        </p>
      </div>
    );
  }

  if (errorMessage && !form.name) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--white-normal-hover)] px-4">
        <section className="w-full max-w-xl rounded-2xl border border-[var(--black-light)] bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-[var(--text-black)]">
            Profil Mandor
          </h1>

          <p className="mt-3 text-sm text-[var(--red-normal)]">
            {errorMessage}
          </p>

          <AppButton
            type="button"
            onClick={() => setReloadSeed((prev) => prev + 1)}
            className="mt-5 h-11 rounded-lg px-5 text-sm"
          >
            Coba Lagi
          </AppButton>
        </section>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--white-normal-hover)] px-4 py-6 md:px-8 md:py-10 xl:px-16">
      <section className="mx-auto w-full max-w-5xl rounded-2xl border border-[var(--black-light)] bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-[1.75rem] font-semibold text-[var(--text-black)] md:text-3xl">
          Profil Mandor
        </h1>

        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Lengkapi bio dan keahlian pada halaman ini agar profil Anda lebih
          meyakinkan untuk klien.
        </p>

        {errorMessage ? (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-[var(--red-normal)]">
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
            {successMessage}
          </p>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <FormField
            label="Nama Lengkap"
            value={form.name}
            onChange={(v) => setField("name", v)}
          />
          <FormField
            label="Spesialisasi"
            value={form.field}
            onChange={(v) => setField("field", v)}
          />
          <FormField
            label="Tempat Lahir"
            value={form.birth_place}
            onChange={(v) => setField("birth_place", v)}
          />
          <FormField
            label="Tanggal Lahir"
            value={form.birth_date}
            onChange={(v) => setField("birth_date", v)}
            type="date"
          />
          <FormField
            label="Jenis Kelamin"
            value={form.sex}
            onChange={(v) => setField("sex", v)}
          />
          <FormField
            label="Nomor HP"
            value={form.phone}
            onChange={(v) => setField("phone", v)}
          />
          <FormField
            label="Email"
            value={form.email}
            onChange={(v) => setField("email", v)}
            type="email"
          />
          <FormField
            label="NIK"
            value={form.nik}
            onChange={(v) => setField("nik", v)}
          />
          <FormField
            label="Pengalaman (tahun)"
            value={form.experience}
            onChange={(v) => setField("experience", v)}
            type="number"
          />
          <FormField
            label="Alamat"
            value={form.address}
            onChange={(v) => setField("address", v)}
            full
          />

          <FormField
            label="Bio"
            value={form.bio}
            onChange={(v) => setField("bio", v)}
            full
            multiline
          />

          <FormField
            label="Strength / Keunggulan"
            value={form.strength}
            onChange={(v) => setField("strength", v)}
            full
            multiline
          />

          <div className="flex justify-stretch md:col-span-2 md:justify-end">
            <AppButton
              type="submit"
              loading={saving}
              loadingText="Menyimpan..."
              className="h-11 w-full rounded-lg px-5 text-sm md:w-auto md:min-w-[10rem]"
            >
              Simpan Profil
            </AppButton>
          </div>
        </form>
      </section>
    </main>
  );
}
