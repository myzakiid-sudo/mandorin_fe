import { API_BASE_URL } from "@/lib/api-config";
import { requestJson, type ApiResponse } from "@/lib/auth-fetch";

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
  photo: string;
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

const isAuthFailure = (status: number, message?: string) =>
  status === 401 || isAccessTokenInvalidMessage(message);

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
    return payload.data;
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

  return payload.data;
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

  return [{ milestones: [normalized] }, normalized];
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

  if (!response.ok || payload?.success !== true) {
    throw new Error(payload?.message || "Gagal mengambil progres harian.");
  }

  return [];
}

export async function addProjectReport(
  projectId: string,
  input: CreateProjectReportInput,
): Promise<ProjectReport> {
  const { response, payload } = await requestJson<ProjectReportDetailResponse>(
    `${API_BASE_URL}/projects/${encodeURIComponent(projectId)}/reports`,
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
    throw new Error(payload?.message || "Gagal menambah progres harian.");
  }

  return payload.data;
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
