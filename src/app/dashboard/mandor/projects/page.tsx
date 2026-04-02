"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import PublicFooter from "@/components/features/public/footer";
import PublicNavbar from "@/components/features/public/navbar";
import { TableQueryStateRows } from "@/components/ui/table-query-state-rows";
import { useAuth } from "@/context/auth-context";
import { getProjects, ProjectAuthError, type Project } from "@/lib/project-api";
import { formatCurrencyIdr, formatDateId } from "@/lib/utils";
import { useAsyncQuery } from "@/hooks/use-async-query";

type ProjectTab = "berlangsung" | "selesai";

const tabLabel: Record<ProjectTab, string> = {
  berlangsung: "Berlangsung",
  selesai: "Selesai",
};

const isCompletedProject = (status: string) =>
  /selesai|finish|done/i.test(status);

export default function MandorProjectsPage() {
  const { authSession, clearSession } = useAuth();
  const [activeTab, setActiveTab] = useState<ProjectTab>("berlangsung");

  const handleAuthError = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const {
    data: projects,
    loading,
    error,
  } = useAsyncQuery<Project[]>({
    initialData: [],
    deps: [authSession?.userId],
    enabled: Boolean(authSession?.userId),
    queryFn: async () => getProjects(authSession?.userId),
    mapError: (fetchError) => {
      if (fetchError instanceof ProjectAuthError) {
        handleAuthError();
        return "Sesi login berakhir. Silakan login ulang.";
      }

      return fetchError instanceof Error
        ? fetchError.message
        : "Gagal memuat daftar proyek.";
    },
  });

  const projectList = useMemo(
    () =>
      projects.filter((project) =>
        activeTab === "berlangsung"
          ? !isCompletedProject(project.status)
          : isCompletedProject(project.status),
      ),
    [activeTab, projects],
  );

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <PublicNavbar />

      <main className="mx-auto w-full max-w-[90rem] px-[1rem] py-[1.5rem] md:px-[2.5rem] md:py-[2rem] xl:px-[6.25rem]">
        <section className="rounded-[0.75rem] bg-[var(--white-normal)] p-[1rem] md:p-[1.5rem]">
          <h1 className="text-[1.75rem] font-semibold leading-[2.5rem] text-[var(--text-black)]">
            Riwayat Proyek
          </h1>

          <div className="mt-[0.75rem] flex items-center gap-[0.75rem]">
            {(Object.keys(tabLabel) as ProjectTab[]).map((tabKey) => {
              const isActive = activeTab === tabKey;

              return (
                <button
                  key={tabKey}
                  type="button"
                  onClick={() => setActiveTab(tabKey)}
                  className={`min-w-[5.75rem] rounded-[0.5rem] px-[0.875rem] py-[0.5rem] text-[1.125rem] font-semibold leading-[1.75rem] transition-colors ${
                    isActive
                      ? "bg-[var(--orange-normal)] text-[var(--text-white)]"
                      : "bg-[var(--btn-disabled-bg)] text-[var(--btn-disabled-text)] hover:bg-[var(--black-light-hover)]"
                  }`}
                >
                  {tabLabel[tabKey]}
                </button>
              );
            })}
          </div>

          <div className="mt-[1rem] space-y-3 md:hidden">
            {loading ? (
              <div className="rounded-[0.5rem] border border-[var(--black-light)] bg-[var(--white-normal)] px-4 py-3 text-[0.875rem] text-[var(--text-secondary)]">
                Memuat daftar proyek...
              </div>
            ) : null}

            {!loading && error ? (
              <div className="rounded-[0.5rem] border border-red-200 bg-red-50 px-4 py-3 text-[0.875rem] text-[var(--red-normal)]">
                {error}
              </div>
            ) : null}

            {!loading && !error && !projectList.length ? (
              <div className="rounded-[0.5rem] border border-[var(--black-light)] bg-[var(--white-normal)] px-4 py-3 text-[0.875rem] text-[var(--text-secondary)]">
                Belum ada data proyek pada tab ini.
              </div>
            ) : null}

            {!loading &&
              !error &&
              projectList.map((project) => (
                <article
                  key={`${activeTab}-${project.id}`}
                  className="rounded-[0.75rem] border border-[var(--black-light)] bg-[var(--white-normal)] p-3"
                >
                  <div className="flex items-start gap-3">
                    <Image
                      src={
                        project.clients?.avatar || "/images/logo-mandorin.svg"
                      }
                      alt={project.clients?.name || "Klien"}
                      width={44}
                      height={44}
                      className="h-[2.75rem] w-[2.75rem] rounded-full object-cover"
                      unoptimized
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[1rem] font-medium leading-[1.5rem] text-[var(--text-black)]">
                        {project.clients?.name || `Klien #${project.client_id}`}
                      </p>
                      <p className="mt-0.5 text-[0.813rem] leading-[1.25rem] text-[var(--text-muted)]">
                        {project.title}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5 text-[0.875rem] text-[var(--text-secondary)]">
                    <p>
                      Tanggal:{" "}
                      {formatDateId(project.created_at || project.deadline)}
                    </p>
                    <p>
                      Anggaran: {formatCurrencyIdr(Number(project.budget) || 0)}
                    </p>
                  </div>

                  <div className="mt-3">
                    <Link
                      href={`/dashboard/mandor/projects/${project.id}`}
                      className="inline-flex h-[2.5rem] w-full items-center justify-center rounded-[0.5rem] bg-[var(--orange-normal)] px-[1rem] text-[0.938rem] font-semibold text-[var(--text-white)] transition-colors hover:bg-[var(--orange-normal-hover)]"
                    >
                      Detail
                    </Link>
                  </div>
                </article>
              ))}
          </div>

          <div className="mt-[1rem] hidden overflow-hidden rounded-[0.5rem] border border-[var(--black-light)] bg-[var(--white-normal)] md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[46rem] border-collapse">
                <thead className="bg-[var(--orange-normal)] text-[var(--text-white)]">
                  <tr>
                    <th className="px-[1rem] py-[0.5rem] text-left text-[1rem] font-semibold leading-[1.5rem] lg:text-[1.125rem] lg:leading-[1.75rem]">
                      Nama
                    </th>
                    <th className="px-[1rem] py-[0.5rem] text-left text-[1rem] font-semibold leading-[1.5rem] lg:text-[1.125rem] lg:leading-[1.75rem]">
                      Tanggal
                    </th>
                    <th className="px-[1rem] py-[0.5rem] text-left text-[1rem] font-semibold leading-[1.5rem] lg:text-[1.125rem] lg:leading-[1.75rem]">
                      Anggaran
                    </th>
                    <th className="px-[1rem] py-[0.5rem] text-right text-[1rem] font-semibold leading-[1.5rem] lg:text-[1.125rem] lg:leading-[1.75rem]">
                      Lihat Detail
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <TableQueryStateRows
                    loading={loading}
                    error={error}
                    isEmpty={!projectList.length}
                    colSpan={4}
                    loadingMessage="Memuat daftar proyek..."
                    emptyMessage="Belum ada data proyek pada tab ini."
                  />

                  {projectList.map((project) => (
                    <tr
                      key={`${activeTab}-${project.id}`}
                      className="border-t border-[var(--black-light)]"
                    >
                      <td className="px-[1rem] py-[0.5rem]">
                        <div className="flex items-center gap-[0.75rem]">
                          <Image
                            src={
                              project.clients?.avatar ||
                              "/images/logo-mandorin.svg"
                            }
                            alt={project.clients?.name || "Klien"}
                            width={44}
                            height={44}
                            className="h-[2.75rem] w-[2.75rem] rounded-full object-cover"
                            unoptimized
                          />

                          <div>
                            <p className="text-[1rem] font-medium leading-[1.5rem] text-[var(--text-black)] lg:text-[1.125rem] lg:leading-[1.75rem]">
                              {project.clients?.name ||
                                `Klien #${project.client_id}`}
                            </p>
                            <p className="text-[0.875rem] leading-[1.25rem] text-[var(--text-muted)]">
                              {project.title}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-[1rem] py-[0.5rem] text-[1rem] leading-[1.5rem] text-[var(--text-secondary)] lg:text-[1.125rem] lg:leading-[1.75rem]">
                        {formatDateId(project.created_at || project.deadline)}
                      </td>

                      <td className="px-[1rem] py-[0.5rem] text-[1rem] leading-[1.5rem] text-[var(--text-secondary)] lg:text-[1.125rem] lg:leading-[1.75rem]">
                        {formatCurrencyIdr(Number(project.budget) || 0)}
                      </td>

                      <td className="px-[1rem] py-[0.5rem] text-right">
                        <Link
                          href={`/dashboard/mandor/projects/${project.id}`}
                          className="inline-flex min-w-[5.25rem] justify-center rounded-[0.5rem] bg-[var(--orange-normal)] px-[1rem] py-[0.375rem] text-[0.938rem] font-semibold leading-[1.5rem] text-[var(--text-white)] transition-colors hover:bg-[var(--orange-normal-hover)] lg:text-[1rem]"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
