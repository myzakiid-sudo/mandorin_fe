import { API_BASE_URL } from "@/lib/api-config";
import { requestJson, type ApiResponse } from "@/lib/auth-fetch";
import { getClientDisplayByUserId } from "@/lib/client-api";
import { getForemanById } from "@/lib/foreman-api";

export type ProjectStatus = "SEDANG BERJALAN" | "SELESAI" | "DITUNDA" | string;

export type ProjectMilestone = {
  id: number;
  title: string;
  content: string;
  completed: boolean;
  deadline: string;
  photo: string | null;
  comment: string | null;
  project_id: number;
};

export type ProjectReport = {
  id: number;
  title: string;
  content: string;
  photo: string | null;
  project_id: number;
  created_at: string;
};

type ProjectPerson = {
  id?: number;
  name?: string;
  birth_place?: string;
  birth_date?: string;
  sex?: string;
  address?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  user_id?: number;
  nick?: string;
  role?: string;
  nik?: string;
  field?: string;
  bio?: string;
  strength?: string;
  experience?: number;
  portfolio?: string;
};

export type Project = {
  id: number;
  field: string;
  title: string;
  content: string;
  budget: number;
  deadline: string;
  location: string;
  status: ProjectStatus;
  client_id: number;
  foreman_id: number;
  created_at: string;
  milestones?: ProjectMilestone[];
  clients?: ProjectPerson;
  foreman?: ProjectPerson;
};

type ProjectListResponse = ApiResponse<Project[]> & {
  pagination?: {
    totalItems?: number;
    totalPage?: number;
    currentPage?: number;
    itemsPerPage?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
};

type ProjectDetailResponse = ApiResponse<Project>;
type ProjectMilestoneListResponse = ApiResponse<ProjectMilestone[]>;
type AddProjectMilestoneResponse = ApiResponse<{ count?: number }>;
type ProjectReportListResponse = ApiResponse<ProjectReport[]>;
type ProjectReportDetailResponse = ApiResponse<ProjectReport>;

export type CreateProjectInput = {
  field: string;
  title: string;
  content: string;
  budget: number;
  deadline: string;
  location: string;
  status?: ProjectStatus;
};

export type CreateProjectMilestoneInput = {
  title: string;
  content: string;
  deadline: string;
  photo?: string | null;
  comment?: string | null;
  completed?: boolean;
};

export type CreateProjectReportInput = {
  title: string;
  content: string;
  photo?: string;
  photoFile?: File | null;
};

export class ProjectAuthError extends Error {
  constructor(message = "Sesi login berakhir. Silakan login ulang.") {
    super(message);
    this.name = "ProjectAuthError";
  }
}

const isAccessTokenInvalidMessage = (message?: string) =>
  Boolean(
    message && /access token was invalid|token.*invalid|jwt/i.test(message),
  );

const isEmptyProjectDataMessage = (message?: string) =>
  Boolean(
    message &&
    /belum memiliki laporan harian|belum memiliki milestone|belum ada milestone|belum ada laporan|data .* tidak ditemukan|not found/i.test(
      message,
    ),
  );

const isAuthFailure = (status: number, message?: string) =>
  status === 401 || isAccessTokenInvalidMessage(message);

const isPlaceholderRoleName = (name: string, role: "Klien" | "Mandor") => {
  if (role === "Klien") {
    return /^klien(?:\s*#?\s*\d+)?$/i.test(name);
  }

  return /^mandor(?:\s*#?\s*\d+)?$/i.test(name);
};

const getResolvedPersonName = (
  name: string | undefined,
  role: "Klien" | "Mandor",
) => {
  const normalized = name?.trim() ?? "";

  if (!normalized || isPlaceholderRoleName(normalized, role)) {
    return null;
  }

  return normalized;
};

const applyResolvedNames = (
  project: Project,
  resolved: {
    clientName?: string | null;
    foremanName?: string | null;
  },
): Project => {
  let nextProject = project;

  if (resolved.clientName) {
    nextProject = {
      ...nextProject,
      clients: {
        ...(nextProject.clients ?? {}),
        name: resolved.clientName,
      },
    };
  }

  if (resolved.foremanName) {
    nextProject = {
      ...nextProject,
      foreman: {
        ...(nextProject.foreman ?? {}),
        name: resolved.foremanName,
      },
    };
  }

  return nextProject;
};

const getIdsToResolve = (
  projects: Project[],
  getId: (project: Project) => number,
  needsResolve: (project: Project) => boolean,
) => {
  const uniqueIds = new Set<number>();

  projects.forEach((project) => {
    if (!needsResolve(project)) {
      return;
    }

    const id = getId(project);

    if (Number.isFinite(id) && id > 0) {
      uniqueIds.add(id);
    }
  });

  return [...uniqueIds];
};

const resolveClientNames = async (projects: Project[]) => {
  const clientIds = getIdsToResolve(
    projects,
    (project) => project.client_id,
    (project) => !getResolvedPersonName(project.clients?.name, "Klien"),
  );

  if (!clientIds.length) {
    return new Map<number, string>();
  }

  const entries = await Promise.all(
    clientIds.map(async (clientId) => {
      const client = await getClientDisplayByUserId(String(clientId));
      const resolvedName = getResolvedPersonName(client?.name, "Klien");

      if (!resolvedName) {
        return null;
      }

      return [clientId, resolvedName] as const;
    }),
  );

  return new Map(
    entries.filter(
      (entry): entry is readonly [number, string] => entry !== null,
    ),
  );
};

const resolveForemanNames = async (projects: Project[]) => {
  const foremanIds = getIdsToResolve(
    projects,
    (project) => project.foreman_id,
    (project) => !getResolvedPersonName(project.foreman?.name, "Mandor"),
  );

  if (!foremanIds.length) {
    return new Map<number, string>();
  }

  const entries = await Promise.all(
    foremanIds.map(async (foremanId) => {
      const foreman = await getForemanById(String(foremanId));
      const resolvedName = getResolvedPersonName(foreman?.name, "Mandor");

      if (!resolvedName) {
        return null;
      }

      return [foremanId, resolvedName] as const;
    }),
  );

  return new Map(
    entries.filter(
      (entry): entry is readonly [number, string] => entry !== null,
    ),
  );
};

const enrichProjectsWithRealNames = async (projects: Project[]) => {
  const [clientNames, foremanNames] = await Promise.all([
    resolveClientNames(projects),
    resolveForemanNames(projects),
  ]);

  return projects.map((project) =>
    applyResolvedNames(project, {
      clientName: clientNames.get(project.client_id),
      foremanName: foremanNames.get(project.foreman_id),
    }),
  );
};

const enrichProjectWithRealNames = async (project: Project) => {
  const [client, foreman] = await Promise.all([
    getResolvedPersonName(project.clients?.name, "Klien")
      ? Promise.resolve(null)
      : getClientDisplayByUserId(String(project.client_id)),
    getResolvedPersonName(project.foreman?.name, "Mandor")
      ? Promise.resolve(null)
      : getForemanById(String(project.foreman_id)),
  ]);

  return applyResolvedNames(project, {
    clientName: getResolvedPersonName(client?.name, "Klien"),
    foremanName: getResolvedPersonName(foreman?.name, "Mandor"),
  });
};

export async function getProjects(userId?: string): Promise<Project[]> {
  const query = userId?.trim() ? `?userId=${encodeURIComponent(userId)}` : "";

  const { response, payload } = await requestJson<ProjectListResponse>(
    `${API_BASE_URL}/projects${query}`,
    {
      auth: true,
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (Array.isArray(payload?.data)) {
    return enrichProjectsWithRealNames(payload.data);
  }

  if (isAuthFailure(response.status, payload?.message)) {
    throw new ProjectAuthError(payload?.message);
  }

  if (!response.ok || payload?.success !== true) {
    throw new Error(payload?.message || "Gagal mengambil daftar proyek.");
  }

  return [];
}

export async function getProjectById(id: string): Promise<Project> {
  const { response, payload } = await requestJson<ProjectDetailResponse>(
    `${API_BASE_URL}/projects/${encodeURIComponent(id)}`,
    {
      auth: true,
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (isAuthFailure(response.status, payload?.message)) {
    throw new ProjectAuthError(payload?.message);
  }

  if (!response.ok || payload?.success !== true || !payload.data) {
    throw new Error(payload?.message || "Data proyek tidak ditemukan.");
  }

  return enrichProjectWithRealNames(payload.data);
}

export async function createProject(
  input: CreateProjectInput,
): Promise<Project> {
  const { response, payload } = await requestJson<ProjectDetailResponse>(
    `${API_BASE_URL}/projects`,
    {
      auth: true,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(input),
    },
  );

  if (isAuthFailure(response.status, payload?.message)) {
    throw new ProjectAuthError(payload?.message);
  }

  if (!response.ok || payload?.success !== true || !payload.data) {
    throw new Error(payload?.message || "Gagal membuat proyek.");
  }

  return payload.data;
}

export async function getProjectMilestones(
  projectId: string,
): Promise<ProjectMilestone[]> {
  const { response, payload } = await requestJson<ProjectMilestoneListResponse>(
    `${API_BASE_URL}/projects/${encodeURIComponent(projectId)}/milestones`,
    {
      auth: true,
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (isAuthFailure(response.status, payload?.message)) {
    throw new ProjectAuthError(payload?.message);
  }

  if (response.status === 404 && isEmptyProjectDataMessage(payload?.message)) {
    return [];
  }

  if (
    payload?.success === false &&
    isEmptyProjectDataMessage(payload?.message)
  ) {
    return [];
  }

  if (!response.ok || payload?.success !== true) {
    throw new Error(payload?.message || "Gagal mengambil milestone proyek.");
  }

  return [];
}

const getMilestonePayloadVariants = (input: CreateProjectMilestoneInput) => {
  const normalized = {
    title: input.title,
    content: input.content,
    deadline: input.deadline,
    photo: input.photo ?? null,
    comment: input.comment ?? null,
    completed: input.completed ?? false,
  };

  return [[normalized], { milestones: [normalized] }, normalized];
};

export async function addProjectMilestone(
  projectId: string,
  input: CreateProjectMilestoneInput,
): Promise<number> {
  const variants = getMilestonePayloadVariants(input);
  let latestMessage = "Gagal menambah milestone.";

  for (const payloadBody of variants) {
    const { response, payload } =
      await requestJson<AddProjectMilestoneResponse>(
        `${API_BASE_URL}/projects/${encodeURIComponent(projectId)}/milestones`,
        {
          auth: true,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payloadBody),
        },
      );

    if (isAuthFailure(response.status, payload?.message)) {
      throw new ProjectAuthError(payload?.message);
    }

    if (response.ok && payload?.success === true) {
      return payload.data?.count ?? 1;
    }

    latestMessage = payload?.message || latestMessage;
  }

  throw new Error(latestMessage);
}

export async function getProjectReports(
  projectId: string,
): Promise<ProjectReport[]> {
  const { response, payload } = await requestJson<ProjectReportListResponse>(
    `${API_BASE_URL}/projects/${encodeURIComponent(projectId)}/reports`,
    {
      auth: true,
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (isAuthFailure(response.status, payload?.message)) {
    throw new ProjectAuthError(payload?.message);
  }

  if (response.status === 404 && isEmptyProjectDataMessage(payload?.message)) {
    return [];
  }

  if (
    payload?.success === false &&
    isEmptyProjectDataMessage(payload?.message)
  ) {
    return [];
  }

  if (!response.ok || payload?.success !== true) {
    throw new Error(payload?.message || "Gagal mengambil progres harian.");
  }

  return [];
}

export async function addProjectReport(
  projectId: string,
  input: CreateProjectReportInput,
): Promise<ProjectReport> {
  const endpoint = `${API_BASE_URL}/projects/${encodeURIComponent(projectId)}/reports`;
  const normalizedTitle = input.title?.trim() ?? "";
  const normalizedContent = input.content?.trim() ?? "";
  const normalizedPhoto = input.photo?.trim() ?? "";

  const requestVariants: RequestInit[] = [];

  if (input.photoFile instanceof File) {
    const formData = new FormData();
    formData.set("title", normalizedTitle);
    formData.set("content", normalizedContent);
    formData.set("photo", input.photoFile);

    requestVariants.push({
      auth: true,
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    } as RequestInit & { auth: boolean });
  }

  if (normalizedPhoto) {
    requestVariants.push({
      auth: true,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        title: normalizedTitle,
        content: normalizedContent,
        photo: normalizedPhoto,
      }),
    } as RequestInit & { auth: boolean });
  }

  if (!requestVariants.length) {
    throw new Error("Foto progres wajib diunggah.");
  }

  let latestMessage = "Gagal menambah progres harian.";

  for (const init of requestVariants) {
    const { response, payload } =
      await requestJson<ProjectReportDetailResponse>(
        endpoint,
        init as RequestInit & { auth: boolean },
      );

    if (isAuthFailure(response.status, payload?.message)) {
      throw new ProjectAuthError(payload?.message);
    }

    if (response.ok && payload?.success === true && payload.data) {
      return payload.data;
    }

    latestMessage = payload?.message || latestMessage;
  }

  throw new Error(latestMessage);
}

export async function deleteReport(id: string): Promise<void> {
  const { response, payload } = await requestJson<ApiResponse<unknown>>(
    `${API_BASE_URL}/reports/${encodeURIComponent(id)}`,
    {
      auth: true,
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (isAuthFailure(response.status, payload?.message)) {
    throw new ProjectAuthError(payload?.message);
  }

  if (!response.ok || payload?.success !== true) {
    throw new Error(payload?.message || "Gagal menghapus laporan progres.");
  }
}
