"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import PublicNavbar from "@/components/features/public/navbar";
import PublicFooter from "@/components/features/public/footer";
import { PageStateSection } from "@/components/ui/page-state-section";
import { useAuth } from "@/context/auth-context";
import {
  addProjectMilestone,
  addProjectReport,
  deleteReport,
  getProjectMilestones,
  ProjectAuthError,
} from "@/lib/project-api";
import { formatCurrencyIdr, formatDateId } from "@/lib/utils";
import { useProjectDetail } from "@/hooks/use-project-detail";

export default function MandorProjectDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { clearSession } = useAuth();
  const id = String(params?.id ?? "");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneContent, setMilestoneContent] = useState("");
  const [milestoneDeadline, setMilestoneDeadline] = useState("");
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);

  const [showReportForm, setShowReportForm] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [reportContent, setReportContent] = useState("");
  const [reportPhoto, setReportPhoto] = useState("");
  const [isAddingReport, setIsAddingReport] = useState(false);
  const [deletingReportId, setDeletingReportId] = useState<number | null>(null);

  const handleAuthFailure = useCallback(() => {
    clearSession();
    router.replace("/login");
  }, [clearSession, router]);

  const {
    project,
    milestones,
    setMilestones,
    reports,
    setReports,
    loading,
    errorMessage,
  } = useProjectDetail({
    projectId: id,
    onAuthError: handleAuthFailure,
    loadErrorMessage: "Gagal memuat detail proyek.",
  });

  const clearActionState = () => {
    setActionMessage("");
    setActionError("");
  };

  const handleAddMilestone = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!id || isAddingMilestone) {
      return;
    }

    clearActionState();
    setIsAddingMilestone(true);

    try {
      const count = await addProjectMilestone(id, {
        title: milestoneTitle.trim(),
        content: milestoneContent.trim(),
        deadline: `${milestoneDeadline}T00:00:00.000Z`,
      });

      const latestMilestones = await getProjectMilestones(id);
      setMilestones(latestMilestones);

      setMilestoneTitle("");
      setMilestoneContent("");
      setMilestoneDeadline("");
      setShowMilestoneForm(false);
      setActionMessage(`Milestone berhasil ditambahkan (${count}).`);
    } catch (error) {
      if (error instanceof ProjectAuthError) {
        handleAuthFailure();
        return;
      }

      setActionError(
        error instanceof Error ? error.message : "Gagal menambah milestone.",
      );
    } finally {
      setIsAddingMilestone(false);
    }
  };

  const handleAddReport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id || isAddingReport) {
      return;
    }

    clearActionState();
    setIsAddingReport(true);

    try {
      const created = await addProjectReport(id, {
        title: reportTitle.trim(),
        content: reportContent.trim(),
        photo: reportPhoto.trim(),
      });

      setReports((prev) => [created, ...prev]);
      setReportTitle("");
      setReportContent("");
      setReportPhoto("");
      setShowReportForm(false);
      setActionMessage("Progres harian berhasil ditambahkan.");
    } catch (error) {
      if (error instanceof ProjectAuthError) {
        handleAuthFailure();
        return;
      }

      setActionError(
        error instanceof Error
          ? error.message
          : "Gagal menambah progres harian.",
      );
    } finally {
      setIsAddingReport(false);
    }
  };

  const handleDeleteReport = async (reportId: number) => {
    if (deletingReportId || !id) {
      return;
    }

    const confirmed = window.confirm(
      "Hapus progres harian ini? Tindakan ini tidak bisa dibatalkan.",
    );

    if (!confirmed) {
      return;
    }

    clearActionState();
    setDeletingReportId(reportId);

    try {
      await deleteReport(String(reportId));
      setReports((prev) => prev.filter((report) => report.id !== reportId));
      setActionMessage("Progres harian berhasil dihapus.");
    } catch (error) {
      if (error instanceof ProjectAuthError) {
        handleAuthFailure();
        return;
      }

      setActionError(
        error instanceof Error
          ? error.message
          : "Gagal menghapus progres harian.",
      );
    } finally {
      setDeletingReportId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
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
      <div className="flex min-h-screen flex-col bg-white">
        <PublicNavbar />
        <main className="mx-auto w-full max-w-[90rem] flex-1 px-[1rem] py-[1.5rem] md:px-[2.5rem] md:py-[2rem] xl:px-[6.25rem]">
          <PageStateSection
            tone="danger"
            message={errorMessage || "Data proyek tidak ditemukan."}
            actionLabel="Kembali ke Daftar Proyek"
            onAction={() => router.push("/dashboard/mandor/projects")}
          />
        </main>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicNavbar />

      <main className="mx-auto w-full max-w-[90rem] flex-1 px-[1rem] py-[1.5rem] md:px-[2.5rem] md:py-[2rem] xl:px-[6.25rem]">
        <section className="border-b border-[var(--black-light-active)] px-[1rem] py-[1.5rem] md:px-[2.5rem] md:py-[2rem] xl:px-[6.25rem]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-[1.375rem] font-semibold text-[var(--text-black)] md:text-[1.625rem]">
                  {project.title}
                </h1>
                <p className="text-[0.938rem] text-[var(--text-secondary)] md:text-[1rem]">
                  Klien:{" "}
                  {project.clients?.name || `Klien #${project.client_id}`}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/dashboard/mandor/projects"
                className="inline-flex h-[2.75rem] items-center justify-center rounded-[0.5rem] border border-[var(--black-light)] px-4 text-[0.938rem] font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--white-normal-hover)]"
              >
                Kembali
              </Link>

              <span className="inline-flex h-[2.75rem] items-center justify-center rounded-[0.5rem] bg-[var(--green-normal)] px-4 text-[0.938rem] font-semibold text-white">
                {project.status}
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
              onClick={() => {
                clearActionState();
                setShowMilestoneForm((prev) => !prev);
              }}
              className="inline-flex h-[2.75rem] items-center justify-center rounded-[0.5rem] border border-[var(--orange-normal)] px-4 text-[0.938rem] font-semibold text-[var(--orange-normal)] transition-colors hover:bg-[var(--orange-light)]"
            >
              {showMilestoneForm ? "Tutup Form" : "+ Tambah Milestone"}
            </button>
          </div>

          {showMilestoneForm ? (
            <form
              onSubmit={handleAddMilestone}
              className="mb-5 rounded-[0.75rem] border border-[var(--black-light)] bg-white p-4"
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="text-[0.875rem] font-semibold text-[var(--text-black)]">
                    Judul Milestone
                  </span>
                  <input
                    required
                    value={milestoneTitle}
                    onChange={(event) => setMilestoneTitle(event.target.value)}
                    className="h-[2.75rem] rounded-[0.5rem] border border-[var(--black-light)] px-3"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[0.875rem] font-semibold text-[var(--text-black)]">
                    Deadline
                  </span>
                  <input
                    required
                    type="date"
                    value={milestoneDeadline}
                    onChange={(event) =>
                      setMilestoneDeadline(event.target.value)
                    }
                    className="h-[2.75rem] rounded-[0.5rem] border border-[var(--black-light)] px-3"
                  />
                </label>
              </div>

              <label className="mt-3 flex flex-col gap-1">
                <span className="text-[0.875rem] font-semibold text-[var(--text-black)]">
                  Deskripsi Tahapan
                </span>
                <textarea
                  required
                  rows={3}
                  value={milestoneContent}
                  onChange={(event) => setMilestoneContent(event.target.value)}
                  className="rounded-[0.5rem] border border-[var(--black-light)] px-3 py-2"
                />
              </label>

              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isAddingMilestone}
                  className="inline-flex h-[2.75rem] items-center justify-center rounded-[0.5rem] bg-[var(--orange-normal)] px-5 text-[0.938rem] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)]"
                >
                  {isAddingMilestone ? "Menyimpan..." : "Simpan Milestone"}
                </button>
              </div>
            </form>
          ) : null}

          <div className="mb-5 grid grid-cols-1 gap-3 rounded-[0.75rem] border border-[var(--black-light)] bg-[var(--white-normal-hover)] p-4 md:grid-cols-2">
            <p className="text-[0.938rem] text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-black)]">
                Bidang:
              </span>{" "}
              {project.field}
            </p>
            <p className="text-[0.938rem] text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-black)]">
                Lokasi:
              </span>{" "}
              {project.location}
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

          <div className="rounded-[1rem] border border-[var(--black-light)] bg-[var(--white-normal-hover)] p-4 md:p-6">
            {milestones.length ? (
              <ol className="relative border-s-2 border-[var(--black-light)] ps-6">
                {milestones.map((step) => (
                  <li key={step.id} className="mb-6 last:mb-0">
                    <span
                      className={`absolute -start-[0.72rem] mt-1 inline-flex h-[1.25rem] w-[1.25rem] items-center justify-center rounded-full border-2 border-white ${
                        step.completed
                          ? "bg-[var(--green-normal)]"
                          : "bg-[var(--btn-disabled-bg)]"
                      }`}
                    />

                    <div className="rounded-[0.75rem] border border-[var(--black-light)] bg-white p-4 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-left text-[1rem] font-semibold text-[var(--text-black)] md:text-[1.125rem]">
                          Tahapan {step.id}: {step.title}
                        </p>
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

                      <p className="mt-2 text-[0.875rem] text-[var(--text-secondary)]">
                        Target: {formatDateId(step.deadline, "long")}
                      </p>

                      <p className="mt-1 text-[0.875rem] text-[var(--text-secondary)]">
                        {step.content}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-[0.938rem] text-[var(--text-muted)]">
                Belum ada milestone pada proyek ini.
              </p>
            )}
          </div>

          {actionMessage ? (
            <p className="mt-3 text-[0.875rem] text-[var(--green-normal)]">
              {actionMessage}
            </p>
          ) : null}

          {actionError ? (
            <p className="mt-3 text-[0.875rem] text-[var(--red-normal)]">
              {actionError}
            </p>
          ) : null}
        </section>

        <section className="px-[1rem] pb-[2rem] md:px-[2.5rem] xl:px-[6.25rem]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[1.5rem] font-semibold text-[var(--text-black)] md:text-[1.75rem]">
              Progres Harian
            </h2>

            <button
              type="button"
              onClick={() => {
                clearActionState();
                setShowReportForm((prev) => !prev);
              }}
              className="inline-flex h-[2.75rem] items-center justify-center rounded-[0.5rem] border border-[var(--orange-normal)] px-4 text-[0.938rem] font-semibold text-[var(--orange-normal)] transition-colors hover:bg-[var(--orange-light)]"
            >
              {showReportForm ? "Tutup Form" : "+ Tambah Progres"}
            </button>
          </div>

          {showReportForm ? (
            <form
              onSubmit={handleAddReport}
              className="mb-5 rounded-[0.75rem] border border-[var(--black-light)] bg-white p-4"
            >
              <label className="flex flex-col gap-1">
                <span className="text-[0.875rem] font-semibold text-[var(--text-black)]">
                  Judul Progres
                </span>
                <input
                  required
                  value={reportTitle}
                  onChange={(event) => setReportTitle(event.target.value)}
                  className="h-[2.75rem] rounded-[0.5rem] border border-[var(--black-light)] px-3"
                />
              </label>

              <label className="mt-3 flex flex-col gap-1">
                <span className="text-[0.875rem] font-semibold text-[var(--text-black)]">
                  Deskripsi Progres
                </span>
                <textarea
                  required
                  rows={3}
                  value={reportContent}
                  onChange={(event) => setReportContent(event.target.value)}
                  className="rounded-[0.5rem] border border-[var(--black-light)] px-3 py-2"
                />
              </label>

              <label className="mt-3 flex flex-col gap-1">
                <span className="text-[0.875rem] font-semibold text-[var(--text-black)]">
                  URL Foto
                </span>
                <input
                  required
                  type="url"
                  value={reportPhoto}
                  onChange={(event) => setReportPhoto(event.target.value)}
                  className="h-[2.75rem] rounded-[0.5rem] border border-[var(--black-light)] px-3"
                />
              </label>

              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isAddingReport}
                  className="inline-flex h-[2.75rem] items-center justify-center rounded-[0.5rem] bg-[var(--orange-normal)] px-5 text-[0.938rem] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)]"
                >
                  {isAddingReport ? "Menyimpan..." : "Simpan Progres"}
                </button>
              </div>
            </form>
          ) : null}

          {reports.length ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {reports.map((report) => (
                <article
                  key={report.id}
                  className="rounded-[0.75rem] border border-[var(--black-light)] bg-white p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-[1rem] font-semibold text-[var(--text-black)]">
                      {report.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteReport(report.id)}
                        disabled={deletingReportId === report.id}
                        className="inline-flex h-[2rem] items-center justify-center rounded-[0.375rem] border border-[var(--red-normal)] px-3 text-[0.75rem] font-semibold text-[var(--red-normal)] disabled:cursor-not-allowed disabled:border-[var(--btn-disabled-text)] disabled:text-[var(--btn-disabled-text)]"
                      >
                        {deletingReportId === report.id
                          ? "Menghapus..."
                          : "Hapus"}
                      </button>
                    </div>
                  </div>

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
            <div className="rounded-[0.75rem] border border-[var(--black-light)] bg-[var(--white-normal-hover)] p-4 text-[0.938rem] text-[var(--text-muted)]">
              Belum ada progres harian untuk proyek ini.
            </div>
          )}
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
