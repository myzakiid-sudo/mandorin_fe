import { API_BASE_URL } from "@/lib/api-config";
import { requestJson, type ApiResponse } from "@/lib/auth-fetch";

export type AppointmentStatus =
  | "MENUNGGU PERSUTUJUAN"
  | "DISETUJUI"
  | "DITOLAK"
  | "SELESAI";

export type Appointment = {
  id: number;
  location: string;
  date: string;
  time: string;
  note: string;
  status: AppointmentStatus;
  client_id: number;
  foreman_id: number;
  client_name?: string;
  client_avatar?: string;
};

type ApiListResponse = ApiResponse<Appointment[]>;

type ApiDetailResponse = ApiResponse<Appointment>;

export class AppointmentAuthError extends Error {
  constructor(message = "Sesi login berakhir. Silakan login ulang.") {
    super(message);
    this.name = "AppointmentAuthError";
  }
}

const isNoAppointmentMessage = (message?: string) =>
  Boolean(message && /belum memiliki janji temu/i.test(message));

const isAccessTokenInvalidMessage = (message?: string) =>
  Boolean(
    message &&
    /access token was invalid|token.*invalid|unauthorized/i.test(message),
  );

const isAuthFailure = (status: number, message?: string) =>
  status === 401 || status === 403 || isAccessTokenInvalidMessage(message);

export async function getAppointments(): Promise<Appointment[]> {
  const { response, payload } = await requestJson<ApiListResponse>(
    `${API_BASE_URL}/appointments`,
    {
      auth: true,
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (isNoAppointmentMessage(payload?.message)) {
    return [];
  }

  if (isAuthFailure(response.status, payload?.message)) {
    throw new AppointmentAuthError(payload?.message);
  }

  if (!response.ok || payload?.success !== true) {
    throw new Error(payload?.message || "Gagal mengambil daftar janji temu.");
  }

  return [];
}

export async function getAppointmentById(id: string): Promise<Appointment> {
  const { response, payload } = await requestJson<ApiDetailResponse>(
    `${API_BASE_URL}/appointments/${encodeURIComponent(id)}`,
    {
      auth: true,
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (isAuthFailure(response.status, payload?.message)) {
    throw new AppointmentAuthError(payload?.message);
  }

  if (!response.ok || payload?.success !== true || !payload.data) {
    throw new Error(payload?.message || "Data janji temu tidak ditemukan.");
  }

  return payload.data;
}

export async function createAppointment(input: {
  location: string;
  date: string;
  time: string;
  note: string;
  foremanId: number;
}): Promise<Appointment> {
  const { response, payload } = await requestJson<ApiDetailResponse>(
    `${API_BASE_URL}/appointments`,
    {
      auth: true,
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        location: input.location,
        date: input.date,
        time: input.time,
        note: input.note,
        foremanId: input.foremanId,
      }),
    },
  );

  if (isAuthFailure(response.status, payload?.message)) {
    throw new AppointmentAuthError(payload?.message);
  }

  if (!response.ok || payload?.success !== true || !payload.data) {
    throw new Error(payload?.message || "Gagal membuat janji temu.");
  }

  return payload.data;
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
): Promise<Appointment> {
  const { response, payload } = await requestJson<ApiDetailResponse>(
    `${API_BASE_URL}/appointments/${encodeURIComponent(id)}`,
    {
      auth: true,
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ status }),
    },
  );

  if (isAuthFailure(response.status, payload?.message)) {
    throw new AppointmentAuthError(payload?.message);
  }

  if (!response.ok || payload?.success !== true || !payload.data) {
    throw new Error(payload?.message || "Gagal memperbarui janji temu.");
  }

  return payload.data;
}
