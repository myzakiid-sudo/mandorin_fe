"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import PublicNavbar from "@/components/features/public/navbar";
import PublicFooter from "@/components/features/public/footer";
import { resolveMandorOrderPhase } from "@/lib/mandor-order-flow";

type MilestoneStatus = "completed" | "current" | "upcoming";

const milestoneSteps: Array<{
  id: number;
  title: string;
  targetDate: string;
  status: MilestoneStatus;
}> = [
  {
    id: 1,
    title: "Persiapan & Fondasi",
    targetDate: "16-04-2026",
    status: "completed",
  },
  {
    id: 2,
    title: "Struktur Utama & Dinding",
    targetDate: "01-05-2026",
    status: "completed",
  },
  {
    id: 3,
    title: "Konstruksi Atap",
    targetDate: "13-05-2026",
    status: "current",
  },
  {
    id: 4,
    title: "Instalasi & MEP",
    targetDate: "24-05-2026",
    status: "upcoming",
  },
  {
    id: 5,
    title: "Finishing & Interior",
    targetDate: "05-06-2026",
    status: "upcoming",
  },
  {
    id: 6,
    title: "Pembersihan Akhir & Serah Terima",
    targetDate: "10-06-2026",
    status: "upcoming",
  },
];

const progressReports = [
  {
    id: 1,
    date: "Rabu, 17 Juni 2026",
    image: "/images/auth/login/login-illustration.png",
    desc: "Pengecatan area utama selesai dan tim melanjutkan pembersihan area kerja.",
  },
  {
    id: 2,
    date: "Selasa, 16 Juni 2026",
    image: "/images/auth/login/login-illustration.png",
    desc: "Pemasangan keramik dinding dapur berjalan sesuai target harian.",
  },
];

const statusBadgeClass: Record<MilestoneStatus, string> = {
  completed: "bg-[var(--green-normal)] text-white",
  current: "bg-[var(--orange-normal)] text-white",
  upcoming: "bg-[var(--btn-disabled-bg)] text-[var(--btn-disabled-text)]",
};

export default function MandorProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const orderId = String(params?.id ?? "");
  const phase = resolveMandorOrderPhase(orderId, "pending");

  if (phase !== "client_approved") {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <PublicNavbar />

        <main className="mx-auto flex w-full max-w-[90rem] flex-1 items-center justify-center px-[1rem] py-[2rem] md:px-[2.5rem] xl:px-[6.25rem]">
          <section className="w-full max-w-[38rem] rounded-[1rem] border border-[var(--black-light)] bg-white p-6 text-center shadow-[0_0.375rem_1.25rem_rgba(0,0,0,0.06)]">
            <h1 className="text-[1.75rem] font-semibold text-[var(--text-black)]">
              Proyek Belum Aktif
            </h1>

            <p className="mt-2 text-[0.938rem] leading-[1.5rem] text-[var(--text-secondary)]">
              Anda bisa masuk ke halaman proyek setelah klien menyetujui
              proposal tahapan pengerjaan.
            </p>

            <div className="mt-5 flex justify-center">
              <Link
                href="/dashboard/mandor/pesanan"
                className="inline-flex h-[2.75rem] min-w-[12rem] items-center justify-center rounded-[0.5rem] bg-[var(--orange-normal)] px-5 text-[0.938rem] font-semibold text-white transition-colors hover:bg-[var(--orange-dark)]"
              >
                Kembali ke Pesanan
              </Link>
            </div>
          </section>
        </main>

        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicNavbar />

      <main className="mx-auto w-full max-w-[90rem] flex-1">
        <section className="border-b border-[var(--black-light-active)] px-[1rem] py-[1.5rem] md:px-[2.5rem] md:py-[2rem] xl:px-[6.25rem]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Image
                src="/images/logo-mandorin.svg"
                alt="Avatar Klien"
                width={64}
                height={64}
                className="rounded-full border border-[var(--black-light)] object-cover"
              />

              <div>
                <h1 className="text-[1.375rem] font-semibold text-[var(--text-black)] md:text-[1.625rem]">
                  Renovasi Interior Dapur Modern
                </h1>
                <p className="text-[0.938rem] text-[var(--text-secondary)] md:text-[1rem]">
                  Klien: Anak Agung Hendrico
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-[2.75rem] items-center justify-center rounded-[0.5rem] bg-[var(--green-normal)] px-4 text-[0.938rem] font-semibold text-white">
                Proyek Berjalan
              </span>

              <Link
                href="/dashboard/mandor/chat"
                className="inline-flex h-[2.75rem] items-center justify-center rounded-[0.5rem] border border-[var(--orange-normal)] px-4 text-[0.938rem] font-semibold text-[var(--orange-normal)] transition-colors hover:bg-[var(--orange-light)]"
              >
                Pesan
              </Link>
            </div>
          </div>
        </section>

        <section className="px-[1rem] py-[2rem] md:px-[2.5rem] md:py-[2.5rem] xl:px-[6.25rem]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[1.5rem] font-semibold text-[var(--text-black)] md:text-[1.75rem]">
              Timeline Utama Pengerjaan
            </h2>

            <button
              type="button"
              className="inline-flex h-[2.625rem] items-center justify-center rounded-[0.5rem] border border-[var(--orange-normal)] px-4 text-[0.875rem] font-semibold text-[var(--orange-normal)] transition-colors hover:bg-[var(--orange-light)]"
            >
              + Tambah Tahapan Utama
            </button>
          </div>

          <div className="rounded-[1rem] border border-[var(--black-light)] bg-[var(--white-normal-hover)] p-4 md:p-6">
            <ol className="relative border-s-2 border-[var(--black-light)] ps-6">
              {milestoneSteps.map((step) => (
                <li key={step.id} className="mb-6 last:mb-0">
                  <span
                    className={`absolute -start-[0.72rem] mt-1 inline-flex h-[1.25rem] w-[1.25rem] items-center justify-center rounded-full border-2 border-white ${
                      step.status === "completed"
                        ? "bg-[var(--green-normal)]"
                        : step.status === "current"
                          ? "bg-[var(--orange-normal)]"
                          : "bg-[var(--btn-disabled-bg)]"
                    }`}
                  />

                  <div className="rounded-[0.75rem] border border-[var(--black-light)] bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-[1rem] font-semibold text-[var(--text-black)] md:text-[1.125rem]">
                        Tahapan {step.id}: {step.title}
                      </p>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[0.75rem] font-semibold ${statusBadgeClass[step.status]}`}
                      >
                        {step.status === "completed"
                          ? "Selesai"
                          : step.status === "current"
                            ? "Berjalan"
                            : "Menunggu"}
                      </span>
                    </div>

                    <p className="mt-2 text-[0.875rem] text-[var(--text-secondary)]">
                      Target: {step.targetDate}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="px-[1rem] pb-[2rem] md:px-[2.5rem] xl:px-[6.25rem]">
          <div className="mb-4 flex justify-end">
            <button className="inline-flex h-[2.75rem] items-center justify-center rounded-[0.5rem] border border-[var(--orange-normal)] px-6 text-[0.938rem] font-semibold text-[var(--orange-normal)] transition-colors hover:bg-[var(--orange-normal)] hover:text-white">
              + Tambah Progres Harian
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {progressReports.map((report) => (
              <article
                key={report.id}
                className="rounded-[1rem] border border-[var(--black-light-active)] bg-white p-4 shadow-sm"
              >
                <h3 className="text-[1rem] font-semibold text-[var(--text-black)]">
                  Progres Harian
                </h3>
                <p className="text-[0.813rem] text-[var(--text-muted)]">
                  {report.date}
                </p>

                <div className="relative mt-3 h-[10rem] overflow-hidden rounded-lg bg-[#efefef]">
                  <Image
                    src={report.image}
                    alt={report.date}
                    fill
                    className="object-cover"
                  />
                </div>

                <p className="mt-3 text-[0.875rem] leading-[1.5rem] text-[var(--text-secondary)]">
                  {report.desc}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
