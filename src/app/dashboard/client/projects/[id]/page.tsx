"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import PublicNavbar from "@/components/features/public/navbar";
import PublicFooter from "@/components/features/public/footer";
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
        <PublicFooter />
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
        <PublicFooter />
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
              {reports.map((report) => (
                <article
                  key={report.id}
                  className="rounded-[0.75rem] border border-[var(--black-light)] bg-white p-4"
                >
                  <h3 className="text-[1rem] font-semibold text-[var(--text-black)]">
                    {report.title}
                  </h3>

                  <p className="mt-1 text-[0.813rem] text-[var(--text-muted)]">
                    {formatDateId(report.created_at, "long")}
                  </p>

                  {report.photo ? (
                    <div
                      className="mt-3 h-[11rem] rounded-[0.5rem] bg-cover bg-center"
                      style={{ backgroundImage: `url(${report.photo})` }}
                    />
                  ) : (
                    <div className="mt-3 flex h-[11rem] items-center justify-center rounded-[0.5rem] bg-[var(--white-normal-hover)] text-[0.875rem] text-[var(--text-muted)]">
                      Tidak ada foto progres.
                    </div>
                  )}

                  <p className="mt-3 text-[0.875rem] text-[var(--text-secondary)]">
                    {report.content}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-[0.75rem] border border-[var(--black-light)] bg-[var(--white-normal-hover)] p-4 text-[0.938rem] text-[var(--text-muted)]">
              Belum ada progres harian untuk proyek ini.
            </div>
          )}
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
