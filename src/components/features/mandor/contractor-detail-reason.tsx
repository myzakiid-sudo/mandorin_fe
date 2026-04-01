"use client";

import { type FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type { ContractorDetail, ViewerRole } from "./types";
import Link from "next/link";
import { AppointmentAuthError, createAppointment } from "@/lib/appointment-api";
import { useAuth } from "@/context/auth-context";

type ContractorDetailReasonProps = {
  contractorId: string;
  contractor: ContractorDetail;
  viewerRole: ViewerRole;
};

export default function ContractorDetailReason({
  contractorId,
  contractor,
  viewerRole,
}: ContractorDetailReasonProps) {
  const router = useRouter();
  const { authSession, clearSession, isReady } = useAuth();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const bookingSectionRef = useRef<HTMLElement | null>(null);
  const parsedForemanId = Number(contractorId);
  const hasValidForemanId = Number.isFinite(parsedForemanId);

  const handleOpenBooking = () => {
    if (!isBookingOpen) {
      setIsBookingOpen(true);

      // Wait for the section to render before scrolling into view.
      window.requestAnimationFrame(() => {
        bookingSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
      return;
    }

    bookingSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleCreateAppointment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isReady || !authSession || authSession.role !== "client") {
      setSubmitError("Silakan login sebagai client terlebih dahulu.");
      return;
    }

    if (!hasValidForemanId) {
      setSubmitError("Mandor ini belum bisa menerima janji temu.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const location = String(formData.get("location") ?? "").trim();
    const date = String(formData.get("date") ?? "").trim();
    const time = String(formData.get("time") ?? "").trim();
    const note = String(formData.get("note") ?? "").trim();

    if (!location || !date || !time) {
      setSubmitError("Lokasi, tanggal, dan waktu wajib diisi.");
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      await createAppointment({
        location,
        date: `${date}T00:00:00.000Z`,
        time,
        note,
        foremanId: parsedForemanId,
      });

      router.push("/dashboard/client/pesanan");
    } catch (error) {
      if (error instanceof AppointmentAuthError) {
        clearSession();
        setSubmitError("Sesi login berakhir. Silakan login ulang.");
        router.replace("/login");
        return;
      }

      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat membuat janji temu.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="mx-auto w-full max-w-[90rem] px-5 py-12 md:px-10 md:py-16 xl:px-[6.25rem]">
        <div className="rounded-[1.5rem] bg-transparent py-2">
          <h2 className="text-[2.25rem] font-semibold leading-tight text-[var(--text-black)] md:text-[3rem]">
            Mengapa Pilih {contractor.name}?
          </h2>
          <p className="mt-5 max-w-[70rem] text-base leading-8 text-[var(--text-secondary)] md:text-lg">
            {contractor.reason}
          </p>

          {viewerRole === "client" ? (
            <div className="mt-8 flex flex-col gap-[1rem] max-w-[20rem]">
              <button
                type="button"
                onClick={handleOpenBooking}
                disabled={!hasValidForemanId}
                className="inline-flex h-[3.25rem] w-full items-center justify-center rounded-[0.5rem] bg-[var(--orange-normal)] px-8 text-[1rem] font-semibold text-white transition-colors hover:bg-[var(--orange-dark)]"
              >
                Buat Janji Temu
              </button>
              <Link
                href="/dashboard/client/chat"
                className="inline-flex h-[3.25rem] w-full items-center justify-center rounded-[0.5rem] bg-[var(--orange-normal)] px-8 text-[1rem] font-semibold text-white transition-colors hover:bg-[var(--orange-dark)]"
              >
                Hubungi
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      {viewerRole === "client" && isBookingOpen ? (
        <section
          id="booking-jadwal-mandor"
          ref={bookingSectionRef}
          className="mx-auto w-full max-w-[90rem] px-5 pb-12 md:px-10 md:pb-16 xl:px-[6.25rem]"
        >
          <div className="rounded-[1.25rem] border border-[var(--black-light)] bg-white px-5 py-6 shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.06)] md:px-8 md:py-8">
            <h3 className="text-center text-3xl font-semibold leading-tight text-[var(--text-black)] md:text-4xl">
              Booking Jadwal Mandor
            </h3>

            <form
              onSubmit={handleCreateAppointment}
              className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5"
            >
              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-sm font-medium text-[var(--text-black)] md:text-base">
                  Lokasi
                </span>
                <input
                  type="text"
                  name="location"
                  required
                  className="h-11 rounded-md border border-[var(--black-light)] px-4 text-sm outline-none transition-colors focus:border-[var(--orange-normal)]"
                  placeholder="Contoh: Malang"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[var(--text-black)] md:text-base">
                  Tanggal
                </span>
                <input
                  type="date"
                  name="date"
                  required
                  className="h-11 rounded-md border border-[var(--black-light)] px-4 text-sm outline-none transition-colors focus:border-[var(--orange-normal)]"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[var(--text-black)] md:text-base">
                  Waktu
                </span>
                <input
                  type="time"
                  name="time"
                  required
                  className="h-11 rounded-md border border-[var(--black-light)] px-4 text-sm outline-none transition-colors focus:border-[var(--orange-normal)]"
                />
              </label>

              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-sm font-medium text-[var(--text-black)] md:text-base">
                  Catatan
                </span>
                <textarea
                  name="note"
                  rows={4}
                  className="rounded-md border border-[var(--black-light)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--orange-normal)]"
                  placeholder="Contoh: tolong bawa meteran"
                />
              </label>

              {submitError ? (
                <p className="text-xs leading-6 text-[var(--red-normal)] md:col-span-2 md:text-sm">
                  {submitError}
                </p>
              ) : null}

              <p className="text-xs leading-6 text-[var(--text-secondary)] md:col-span-2 md:text-sm">
                Dengan mengirim formulir ini, Anda setuju bahwa data di atas
                akan digunakan untuk keperluan survei dan jadwal konsultasi.
              </p>

              <div className="md:col-span-2 md:flex md:justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[var(--orange-normal)] px-10 text-sm font-semibold text-white transition-colors hover:bg-[var(--orange-dark)] disabled:cursor-not-allowed disabled:opacity-70 md:w-[15rem]"
                >
                  {isSubmitting ? "Menyimpan..." : "Kirim"}
                </button>
              </div>
            </form>
          </div>
        </section>
      ) : null}
    </>
  );
}
