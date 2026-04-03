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

type CreateReviewInput = {
  content: string;
  client_id: number;
  foreman_id: number;
  score: number;
};

type CreateReviewPayload = CreateReviewInput & {
  clientId?: number;
  foremanId?: number;
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

const isMissingMandorOrClientIdMessage = (message?: string) =>
  Boolean(
    message && /(id\s*mandor|id\s*klien).*(wajib\s*diisi)/i.test(message),
  );

const postCreateReview = async (payloadBody: CreateReviewPayload) => {
  const { response, payload } = await requestJson<ReviewDetailResponse>(
    `${API_BASE_URL}/reviews`,
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

  return { response, payload };
};

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

export async function getPublicReviews(userId?: string): Promise<Review[]> {
  const query = userId?.trim() ? `?userId=${encodeURIComponent(userId)}` : "";

  const { response, payload } = await requestJson<ReviewListResponse>(
    `${API_BASE_URL}/reviews${query}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (!response.ok || payload?.success !== true) {
    return [];
  }

  return [];
}

export async function createReview(input: CreateReviewInput): Promise<Review> {
  const firstAttempt = await postCreateReview(input);

  if (
    isAuthFailure(firstAttempt.response.status, firstAttempt.payload?.message)
  ) {
    throw new ReviewAuthError(firstAttempt.payload?.message);
  }

  if (
    firstAttempt.response.ok &&
    firstAttempt.payload?.success === true &&
    firstAttempt.payload.data
  ) {
    return firstAttempt.payload.data;
  }

  if (isMissingMandorOrClientIdMessage(firstAttempt.payload?.message)) {
    const secondAttempt = await postCreateReview({
      ...input,
      clientId: input.client_id,
      foremanId: input.foreman_id,
    });

    if (
      isAuthFailure(
        secondAttempt.response.status,
        secondAttempt.payload?.message,
      )
    ) {
      throw new ReviewAuthError(secondAttempt.payload?.message);
    }

    if (
      secondAttempt.response.ok &&
      secondAttempt.payload?.success === true &&
      secondAttempt.payload.data
    ) {
      return secondAttempt.payload.data;
    }

    throw new Error(secondAttempt.payload?.message || "Gagal membuat review.");
  }

  throw new Error(firstAttempt.payload?.message || "Gagal membuat review.");
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
