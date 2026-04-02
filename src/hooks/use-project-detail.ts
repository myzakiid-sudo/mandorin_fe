"use client";

import { useEffect, useMemo, useState } from "react";

import {
  getProjectById,
  getProjectMilestones,
  getProjectReports,
  ProjectAuthError,
  type Project,
  type ProjectMilestone,
  type ProjectReport,
} from "@/lib/project-api";

type UseProjectDetailOptions = {
  projectId: string;
  onAuthError?: () => void;
  loadErrorMessage?: string;
};

const sortReportsByNewest = (items: ProjectReport[]) =>
  [...items].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

export function useProjectDetail({
  projectId,
  onAuthError,
  loadErrorMessage = "Gagal memuat detail proyek.",
}: UseProjectDetailOptions) {
  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [reports, setReports] = useState<ProjectReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadSeed, setReloadSeed] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadProject = async () => {
      setLoading(true);
      setErrorMessage("");

      if (!projectId) {
        setProject(null);
        setMilestones([]);
        setReports([]);
        setErrorMessage("ID proyek tidak valid.");
        setLoading(false);
        return;
      }

      try {
        const [projectData, milestoneData, reportData] = await Promise.all([
          getProjectById(projectId),
          getProjectMilestones(projectId),
          getProjectReports(projectId),
        ]);

        if (cancelled) {
          return;
        }

        setProject(projectData);
        setMilestones(milestoneData);
        setReports(sortReportsByNewest(reportData));
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (error instanceof ProjectAuthError) {
          onAuthError?.();
          return;
        }

        setProject(null);
        setMilestones([]);
        setReports([]);
        setErrorMessage(
          error instanceof Error ? error.message : loadErrorMessage,
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProject();

    return () => {
      cancelled = true;
    };
  }, [projectId, onAuthError, loadErrorMessage, reloadSeed]);

  const refetch = useMemo(
    () => () => {
      setReloadSeed((prev) => prev + 1);
    },
    [],
  );

  return {
    project,
    milestones,
    setMilestones,
    reports,
    setReports,
    loading,
    errorMessage,
    refetch,
  };
}
