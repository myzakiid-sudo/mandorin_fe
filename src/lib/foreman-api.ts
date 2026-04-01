import { API_BASE_URL } from "@/lib/api-config";
import { requestJson, type ApiResponse } from "@/lib/auth-fetch";

export type ForemanProfile = {
  id: number;
  name: string;
  birth_place: string;
  birth_date: string;
  sex: string;
  address: string;
  email: string;
  phone: string;
  avatar: string;
  user_id?: number;
  nik: string;
  field: string;
  bio: string | null;
  strength: string | null;
  experience: number;
  portfolio: string;
  role: string;
};

type ApiListResponse<T> = ApiResponse<T[]>;

type ApiDetailResponse<T> = ApiResponse<T>;

export async function getForemanList(name?: string): Promise<ForemanProfile[]> {
  const query = name?.trim() ? `?name=${encodeURIComponent(name.trim())}` : "";
  const { response, payload } = await requestJson<
    ApiListResponse<ForemanProfile>
  >(`${API_BASE_URL}/foreman${query}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 60 },
  });

  if (
    !response.ok ||
    payload?.success !== true ||
    !Array.isArray(payload.data)
  ) {
    return [];
  }

  return payload.data;
}

export async function getForemanById(
  id: string,
): Promise<ForemanProfile | null> {
  const { response, payload } = await requestJson<
    ApiDetailResponse<ForemanProfile>
  >(`${API_BASE_URL}/foreman/${encodeURIComponent(id)}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 60 },
  });

  if (!response.ok || payload?.success !== true || !payload.data) {
    return null;
  }

  return payload.data;
}

export type ForemanProfileShape = {
  name?: unknown;
  birth_place?: unknown;
  birth_date?: unknown;
  sex?: unknown;
  address?: unknown;
  email?: unknown;
  phone?: unknown;
  nik?: unknown;
  field?: unknown;
  bio?: unknown;
  strength?: unknown;
  experience?: unknown;
  foreman?: unknown;
};

type ForemanApiResponse = ApiResponse<ForemanProfileShape>;

export type MandorProfileForm = {
  name: string;
  birth_place: string;
  birth_date: string;
  sex: string;
  address: string;
  email: string;
  phone: string;
  nik: string;
  field: string;
  experience: string;
  bio: string;
  strength: string;
};

export const emptyMandorProfileForm: MandorProfileForm = {
  name: "",
  birth_place: "",
  birth_date: "",
  sex: "",
  address: "",
  email: "",
  phone: "",
  nik: "",
  field: "",
  experience: "",
  bio: "",
  strength: "",
};

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  return value as Record<string, unknown>;
};

const readString = (source: Record<string, unknown> | null, key: string) => {
  const value = source?.[key];
  return typeof value === "string" ? value : "";
};

const readNumberString = (
  source: Record<string, unknown> | null,
  key: string,
) => {
  const value = source?.[key];

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "string") {
    return value;
  }

  return "";
};

const toDateInputValue = (rawValue: string) => {
  if (!rawValue) {
    return "";
  }

  const parsed = new Date(rawValue);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toISOString().split("T")[0];
};

export const mapApiToMandorForm = (
  payload: ForemanProfileShape,
): MandorProfileForm => {
  const root = asRecord(payload);
  const nestedForeman = asRecord(root?.foreman);

  return {
    name: readString(root, "name"),
    birth_place: readString(root, "birth_place"),
    birth_date: toDateInputValue(readString(root, "birth_date")),
    sex: readString(root, "sex"),
    address: readString(root, "address"),
    email: readString(root, "email"),
    phone: readString(root, "phone"),
    nik: readString(root, "nik") || readString(nestedForeman, "nik"),
    field: readString(root, "field") || readString(nestedForeman, "field"),
    experience:
      readNumberString(root, "experience") ||
      readNumberString(nestedForeman, "experience"),
    bio: readString(root, "bio") || readString(nestedForeman, "bio"),
    strength:
      readString(root, "strength") || readString(nestedForeman, "strength"),
  };
};

export async function getForemanProfileByUserId(
  userId: string,
  signal?: AbortSignal,
): Promise<MandorProfileForm> {
  const { response, payload } = await requestJson<ForemanApiResponse>(
    `${API_BASE_URL}/foreman/${encodeURIComponent(userId)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal,
    },
  );

  if (!response.ok || payload?.success !== true || !payload.data) {
    throw new Error(payload?.message || "Gagal memuat profil mandor.");
  }

  return mapApiToMandorForm(payload.data);
}

export async function updateForemanProfile(
  form: MandorProfileForm,
): Promise<MandorProfileForm> {
  const { response, payload } = await requestJson<ForemanApiResponse>(
    `${API_BASE_URL}/foreman`,
    {
      auth: true,
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        birth_place: form.birth_place,
        birth_date: form.birth_date
          ? `${form.birth_date}T00:00:00.000Z`
          : undefined,
        sex: form.sex,
        address: form.address,
        email: form.email,
        phone: form.phone,
        nik: form.nik,
        field: form.field,
        bio: form.bio,
        strength: form.strength,
        experience: Number(form.experience) || 0,
      }),
    },
  );

  if (!response.ok || payload?.success !== true || !payload.data) {
    throw new Error(payload?.message || "Gagal menyimpan profil mandor.");
  }

  return mapApiToMandorForm(payload.data);
}
