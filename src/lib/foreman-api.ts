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
    cache: "no-store",
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
    cache: "no-store",
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
  avatar?: unknown;
  portfolio?: unknown;
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
  avatar: string;
  portfolio: string;
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
  avatar: "",
  portfolio: "",
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
    avatar: readString(root, "avatar") || readString(nestedForeman, "avatar"),
    portfolio:
      readString(root, "portfolio") || readString(nestedForeman, "portfolio"),
  };
};

const resolveRemoteFileExtension = (contentType: string) => {
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("gif")) return "gif";
  if (contentType.includes("svg")) return "svg";
  return "jpg";
};

const downloadFileFromUrl = async (
  url: string,
  fallbackName: string,
): Promise<File | null> => {
  if (!url.trim()) {
    return null;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }

    const blob = await response.blob();
    const extension = resolveRemoteFileExtension(blob.type || "");
    const filename = `${fallbackName}.${extension}`;
    return new File([blob], filename, {
      type: blob.type || "application/octet-stream",
    });
  } catch {
    return null;
  }
};

const appendMediaField = async (
  formData: FormData,
  key: "avatar" | "portfolio",
  selectedFile: File | null | undefined,
  fallbackUrl: string,
) => {
  if (selectedFile) {
    formData.append(key, selectedFile);
    return;
  }

  const existingFile = await downloadFileFromUrl(fallbackUrl, key);
  if (existingFile) {
    formData.append(key, existingFile);
    return;
  }

  if (fallbackUrl.trim()) {
    formData.append(key, fallbackUrl.trim());
  }
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
  media?: {
    avatarFile?: File | null;
    portfolioFile?: File | null;
  },
): Promise<MandorProfileForm> {
  const body = new FormData();
  body.append("name", form.name);
  body.append("nik", form.nik);
  body.append("birth_place", form.birth_place);
  body.append("birth_date", form.birth_date);
  body.append("sex", form.sex);
  body.append("address", form.address);
  body.append("email", form.email);
  body.append("phone", form.phone || "null");
  body.append("field", form.field);
  body.append("experience", form.experience || "0");
  body.append("bio", form.bio);
  body.append("strength", form.strength);

  await appendMediaField(body, "avatar", media?.avatarFile, form.avatar);
  await appendMediaField(
    body,
    "portfolio",
    media?.portfolioFile,
    form.portfolio,
  );

  const { response, payload } = await requestJson<ForemanApiResponse>(
    `${API_BASE_URL}/foreman`,
    {
      auth: true,
      method: "PATCH",
      headers: {
        Accept: "application/json",
      },
      body,
    },
  );

  if (!response.ok || payload?.success !== true || !payload.data) {
    throw new Error(payload?.message || "Gagal menyimpan profil mandor.");
  }

  return mapApiToMandorForm(payload.data);
}
