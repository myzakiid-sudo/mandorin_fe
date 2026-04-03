"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import PublicNavbar from "@/components/features/public/navbar";
import { PageStateSection } from "@/components/ui/page-state-section";
import { useAuth } from "@/context/auth-context";
import { formatCurrencyIdr, formatDateId } from "@/lib/utils";
import { useProjectDetail } from "@/hooks/use-project-detail";

export default function ClientProjectDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { clearSession } = useAuth();
  const id = String(params?.id ?? "");
  const handleAuthError = useCallback(() => {
    clearSession();
    router.replace("/login");
  }, [clearSession, router]);

  const { project, milestones, reports, loading, errorMessage } =
    useProjectDetail({
      projectId: id,
      onAuthError: handleAuthError,
      loadErrorMessage: "Gagal memuat detail proyek.",
    });

  const allMilestonesDone = useMemo(
    () =>
      Boolean(milestones.length) && milestones.every((step) => step.completed),
    [milestones],
  );

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f3f3f3]">
        <PublicNavbar />
        <main className="mx-auto w-full max-w-[90rem] flex-1 px-[1rem] py-[1.5rem] md:px-[2.5rem] md:py-[2rem] xl:px-[6.25rem]">
          <PageStateSection message="Memuat detail proyek..." />
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f3f3f3]">
        <PublicNavbar />
        <main className="mx-auto w-full max-w-[90rem] flex-1 px-[1rem] py-[1.5rem] md:px-[2.5rem] md:py-[2rem] xl:px-[6.25rem]">
          <PageStateSection
            tone="danger"
            message={errorMessage || "Data proyek tidak ditemukan."}
            actionLabel="Kembali ke Daftar Proyek"
            onAction={() => router.push("/dashboard/client/projects")}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f3f3f3]">
      <PublicNavbar />

      <main className="mx-auto w-full max-w-[90rem] flex-1 px-[1rem] py-[1.5rem] md:px-[2.5rem] md:py-[2rem] xl:px-[6.25rem]">
        <section className="rounded-[1rem] border border-[var(--black-light)] bg-white px-[1.25rem] py-[1.5rem] md:px-[2rem] md:py-[2rem]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-[1.5rem] font-semibold text-[var(--text-black)] md:text-[2rem]">
              Tahapan Project (Milestone)
            </h1>
            <Link
              href="/dashboard/client/projects"
              className="inline-flex h-[2.5rem] items-center justify-center rounded-[0.5rem] border border-[var(--black-light)] px-4 text-[0.875rem] font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--white-normal-hover)]"
            >
              Kembali
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 rounded-[0.75rem] border border-[var(--black-light)] bg-[var(--white-normal-hover)] p-4 md:grid-cols-2">
            <p className="text-[0.938rem] text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-black)]">
                Judul:
              </span>{" "}
              {project.title}
            </p>
            <p className="text-[0.938rem] text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-black)]">
                Status:
              </span>{" "}
              {project.status}
            </p>
            <p className="text-[0.938rem] text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-black)]">
                Anggaran:
              </span>{" "}
              {formatCurrencyIdr(Number(project.budget) || 0)}
            </p>
            <p className="text-[0.938rem] text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-black)]">
                Deadline:
              </span>{" "}
              {formatDateId(project.deadline, "long")}
            </p>
          </div>

          {milestones.length ? (
            <ol className="relative mt-6 border-s-2 border-[var(--black-light)] ps-6">
              {milestones.map((step) => (
                <li key={step.id} className="mb-5 last:mb-0">
                  <span
                    className={`absolute -start-[0.72rem] mt-1 inline-flex h-[1.25rem] w-[1.25rem] items-center justify-center rounded-full border-2 border-white ${
                      step.completed
                        ? "bg-[var(--green-normal)]"
                        : "bg-[var(--btn-disabled-bg)]"
                    }`}
                  />

                  <article className="rounded-[0.75rem] border border-[var(--black-light)] bg-[var(--white-normal-hover)] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h2 className="text-[1rem] font-semibold text-[var(--text-black)] md:text-[1.125rem]">
                        Tahapan {step.id}: {step.title}
                      </h2>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[0.75rem] font-semibold text-white ${
                          step.completed
                            ? "bg-[var(--green-normal)]"
                            : "bg-[var(--btn-disabled-text)]"
                        }`}
                      >
                        {step.completed ? "Selesai" : "Berjalan"}
                      </span>
                    </div>

                    <p className="mt-1 text-[0.875rem] text-[var(--text-secondary)]">
                      Target: {formatDateId(step.deadline, "long")}
                    </p>
                    <p className="mt-1 text-[0.875rem] text-[var(--text-secondary)]">
                      {step.content}
                    </p>
                  </article>
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-6 rounded-[0.75rem] border border-[var(--black-light)] bg-[var(--white-normal-hover)] p-4 text-[0.938rem] text-[var(--text-muted)]">
              Belum ada milestone pada proyek ini.
            </div>
          )}

          {allMilestonesDone ? (
            <div className="mt-8 flex justify-center">
              <Link
                href={`/dashboard/client/projects/${id}/review?foremanId=${project.foreman_id}`}
                className="inline-flex h-[2.75rem] w-full max-w-[18rem] items-center justify-center rounded-[0.5rem] bg-[var(--orange-normal)] px-4 text-[0.938rem] font-semibold text-white transition-colors hover:bg-[var(--orange-normal-hover)]"
              >
                Beri Rating
              </Link>
            </div>
          ) : null}
        </section>

        <section className="mt-5 rounded-[1rem] border border-[var(--black-light)] bg-white px-[1.25rem] py-[1.5rem] md:px-[2rem] md:py-[2rem]">
          <h2 className="text-[1.5rem] font-semibold text-[var(--text-black)] md:text-[1.75rem]">
            Progres Harian
          </h2>

          {reports.length ? (
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {reports.map((report) => {
                const reportAuthorName = project.foreman?.name || "Mandor";

                return (
                  <article
                    key={report.id}
                    className="rounded-[1.25rem] border border-[var(--black-light)] bg-[#f7f7f7] p-4 shadow-[0_0.375rem_1rem_rgba(0,0,0,0.04)] md:p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-[1.25rem] font-semibold leading-[1.75rem] text-[var(--text-black)]">
                          {report.title || reportAuthorName}
                        </h3>
                        <p className="mt-0.5 text-[0.875rem] text-[var(--text-muted)]">
                          {formatDateId(report.created_at, "long")}
                        </p>
                      </div>

                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-[var(--text-secondary)]">
                        <svg
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          aria-hidden="true"
                        >
                          <path
                            d="M14 5l6 6-6 6M20 11H9a5 5 0 0 0-5 5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                        </svg>
                      </span>
                    </div>

                    {report.photo ? (
                      <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-[var(--white-normal)]">
                        <Image
                          src={report.photo}
                          alt={`Foto progres ${report.title || reportAuthorName}`}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 40vw"
                        />
                      </div>
                    ) : (
                      <div className="mt-4 flex h-[11rem] items-center justify-center rounded-[1.25rem] bg-[var(--white-normal)] text-[0.875rem] text-[var(--text-muted)]">
                        Tidak ada foto progres.
                      </div>
                    )}

                    <p className="mt-4 text-[1rem] leading-[1.875rem] text-[var(--text-secondary)]">
                      <span className="font-semibold text-[var(--text-black)]">
                        {reportAuthorName}
                      </span>{" "}
                      {report.content}
                    </p>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-[0.75rem] border border-[var(--black-light)] bg-[var(--white-normal-hover)] p-4 text-[0.938rem] text-[var(--text-muted)]">
              Belum ada progres harian untuk proyek ini.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
