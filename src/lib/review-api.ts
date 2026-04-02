import { API_BASE_URL } from "@/lib/api-config";
import { requestJson, type ApiResponse } from "@/lib/auth-fetch";

export type Review = {
  id: number;
  content: string;
  client_id: number;
  foreman_id: number;
  score: number;
};

type ReviewListResponse = ApiResponse<Review[]> & {
  pagination?: {
    totalItems?: number;
    totalPage?: number;
    currentPage?: number;
    itemsPerPage?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
};

type ReviewDetailResponse = ApiResponse<Review>;

export type CreateReviewInput = {
  content: string;
  client_id: number;
  foreman_id: number;
  score: number;
};

export class ReviewAuthError extends Error {
  constructor(message = "Sesi login berakhir. Silakan login ulang.") {
    super(message);
    this.name = "ReviewAuthError";
  }
}

const isAccessTokenInvalidMessage = (message?: string) =>
  Boolean(
    message && /access token was invalid|token.*invalid|jwt/i.test(message),
  );

const isAuthFailure = (status: number, message?: string) =>
  status === 401 || isAccessTokenInvalidMessage(message);

export async function getReviews(userId?: string): Promise<Review[]> {
  const query = userId?.trim() ? `?userId=${encodeURIComponent(userId)}` : "";

  const { response, payload } = await requestJson<ReviewListResponse>(
    `${API_BASE_URL}/reviews${query}`,
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
    throw new ReviewAuthError(payload?.message);
  }

  if (!response.ok || payload?.success !== true) {
    throw new Error(payload?.message || "Gagal mengambil daftar review.");
  }

  return [];
}

export async function createReview(input: CreateReviewInput): Promise<Review> {
  const { response, payload } = await requestJson<ReviewDetailResponse>(
    `${API_BASE_URL}/reviews`,
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
    throw new ReviewAuthError(payload?.message);
  }

  if (!response.ok || payload?.success !== true || !payload.data) {
    throw new Error(payload?.message || "Gagal membuat review.");
  }

  return payload.data;
}

export async function deleteReview(id: string): Promise<Review> {
  const { response, payload } = await requestJson<ReviewDetailResponse>(
    `${API_BASE_URL}/reviews/${encodeURIComponent(id)}`,
    {
      auth: true,
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (isAuthFailure(response.status, payload?.message)) {
    throw new ReviewAuthError(payload?.message);
  }

  if (!response.ok || payload?.success !== true || !payload.data) {
    throw new Error(payload?.message || "Gagal menghapus review.");
  }

  return payload.data;
}
