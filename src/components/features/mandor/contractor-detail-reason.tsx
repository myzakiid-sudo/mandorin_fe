"use client";

import { useRef, useState } from "react";

import type { ContractorDetail } from "./types";

type ContractorDetailReasonProps = {
  contractor: ContractorDetail;
};

export default function ContractorDetailReason({
  contractor,
}: ContractorDetailReasonProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const bookingSectionRef = useRef<HTMLElement | null>(null);

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
          <button
            type="button"
            onClick={handleOpenBooking}
            className="mt-8 inline-flex h-12 min-w-[14rem] items-center justify-center rounded-lg bg-[var(--orange-normal)] px-8 text-sm font-semibold text-white transition-colors hover:bg-[var(--orange-dark)]"
          >
            Buat Janji Temu
          </button>
        </div>
      </section>

      {isBookingOpen ? (
        <section
          id="booking-jadwal-mandor"
          ref={bookingSectionRef}
          className="mx-auto w-full max-w-[90rem] px-5 pb-12 md:px-10 md:pb-16 xl:px-[6.25rem]"
        >
          <div className="rounded-[1.25rem] border border-[var(--black-light)] bg-white px-5 py-6 shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.06)] md:px-8 md:py-8">
            <h3 className="text-center text-3xl font-semibold leading-tight text-[var(--text-black)] md:text-4xl">
              Booking Jadwal Mandor
            </h3>

            <form className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-sm font-medium text-[var(--text-black)] md:text-base">
                  Nama Lengkap
                </span>
                <input
                  type="text"
                  name="fullName"
                  className="h-11 rounded-md border border-[var(--black-light)] px-4 text-sm outline-none transition-colors focus:border-[var(--orange-normal)]"
                  placeholder="Masukkan nama lengkap"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[var(--text-black)] md:text-base">
                  Tanggal Survei
                </span>
                <input
                  type="date"
                  name="surveyDate"
                  className="h-11 rounded-md border border-[var(--black-light)] px-4 text-sm outline-none transition-colors focus:border-[var(--orange-normal)]"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[var(--text-black)] md:text-base">
                  Waktu yang Diinginkan
                </span>
                <input
                  type="time"
                  name="surveyTime"
                  className="h-11 rounded-md border border-[var(--black-light)] px-4 text-sm outline-none transition-colors focus:border-[var(--orange-normal)]"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[var(--text-black)] md:text-base">
                  Alamat Email
                </span>
                <input
                  type="email"
                  name="email"
                  className="h-11 rounded-md border border-[var(--black-light)] px-4 text-sm outline-none transition-colors focus:border-[var(--orange-normal)]"
                  placeholder="nama@email.com"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[var(--text-black)] md:text-base">
                  Nomor WhatsApp
                </span>
                <input
                  type="tel"
                  name="whatsapp"
                  className="h-11 rounded-md border border-[var(--black-light)] px-4 text-sm outline-none transition-colors focus:border-[var(--orange-normal)]"
                  placeholder="08xxxxxxxxxx"
                />
              </label>

              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-sm font-medium text-[var(--text-black)] md:text-base">
                  Kota / Wilayah
                </span>
                <input
                  type="text"
                  name="city"
                  className="h-11 rounded-md border border-[var(--black-light)] px-4 text-sm outline-none transition-colors focus:border-[var(--orange-normal)]"
                  placeholder="Contoh: Malang"
                />
              </label>

              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-sm font-medium text-[var(--text-black)] md:text-base">
                  Alamat Lengkap Proyek
                </span>
                <input
                  type="text"
                  name="projectAddress"
                  className="h-11 rounded-md border border-[var(--black-light)] px-4 text-sm outline-none transition-colors focus:border-[var(--orange-normal)]"
                  placeholder="Masukkan alamat proyek"
                />
              </label>

              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-sm font-medium text-[var(--text-black)] md:text-base">
                  Detail Kebutuhan (Pesan)
                </span>
                <textarea
                  name="message"
                  rows={4}
                  className="rounded-md border border-[var(--black-light)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--orange-normal)]"
                  placeholder="Tuliskan kebutuhan renovasi atau pembangunan Anda"
                />
              </label>

              <p className="text-xs leading-6 text-[var(--text-secondary)] md:col-span-2 md:text-sm">
                Dengan mengirim formulir ini, Anda setuju bahwa data di atas
                akan digunakan untuk keperluan survei dan jadwal konsultasi.
              </p>

              <div className="md:col-span-2 md:flex md:justify-center">
                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[var(--orange-normal)] px-10 text-sm font-semibold text-white transition-colors hover:bg-[var(--orange-dark)] md:w-[15rem]"
                >
                  Kirim
                </button>
              </div>
            </form>
          </div>
        </section>
      ) : null}
    </>
  );
}
