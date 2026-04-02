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

export default function ClientProjectsPage() {
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
    queryFn: async () => {
      return getProjects(authSession?.userId);
    },
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-[1.75rem] font-semibold leading-[2.5rem] text-[var(--text-black)]">
              Riwayat Proyek
            </h1>
          </div>

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

          <div className="mt-[1rem] overflow-hidden rounded-[0.5rem] border border-[var(--black-light)] bg-[var(--white-normal)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[54rem] border-collapse">
                <thead className="bg-[var(--orange-normal)] text-[var(--text-white)]">
                  <tr>
                    <th className="px-[1rem] py-[0.5rem] text-left text-[1.125rem] font-semibold leading-[1.75rem]">
                      Nama
                    </th>
                    <th className="px-[1rem] py-[0.5rem] text-left text-[1.125rem] font-semibold leading-[1.75rem]">
                      Tanggal
                    </th>
                    <th className="px-[1rem] py-[0.5rem] text-left text-[1.125rem] font-semibold leading-[1.75rem]">
                      Anggaran
                    </th>
                    <th className="px-[1rem] py-[0.5rem] text-right text-[1.125rem] font-semibold leading-[1.75rem]">
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
                              project.foreman?.avatar ||
                              "/images/logo-mandorin.svg"
                            }
                            alt={project.foreman?.name || "Mandor"}
                            width={44}
                            height={44}
                            className="h-[2.75rem] w-[2.75rem] rounded-full object-cover"
                            unoptimized
                          />

                          <div>
                            <p className="text-[1.125rem] font-medium leading-[1.75rem] text-[var(--text-black)]">
                              {project.foreman?.name ||
                                `Mandor #${project.foreman_id}`}
                            </p>
                            <p className="text-[0.875rem] leading-[1.25rem] text-[var(--text-muted)]">
                              {project.title}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-[1rem] py-[0.5rem] text-[1.125rem] leading-[1.75rem] text-[var(--text-secondary)]">
                        {formatDateId(project.created_at || project.deadline)}
                      </td>

                      <td className="px-[1rem] py-[0.5rem] text-[1.125rem] leading-[1.75rem] text-[var(--text-secondary)]">
                        {formatCurrencyIdr(Number(project.budget) || 0)}
                      </td>

                      <td className="px-[1rem] py-[0.5rem] text-right">
                        <Link
                          href={`/dashboard/client/projects/${project.id}`}
                          className="inline-flex min-w-[5.25rem] justify-center rounded-[0.5rem] bg-[var(--orange-normal)] px-[1rem] py-[0.375rem] text-[1rem] font-semibold leading-[1.5rem] text-[var(--text-white)] transition-colors hover:bg-[var(--orange-normal-hover)]"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="h-[12rem] w-full bg-[var(--white-normal)] md:h-[14rem]" />
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
