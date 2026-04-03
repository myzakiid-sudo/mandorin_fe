import { API_BASE_URL } from "@/lib/api-config";
import { requestJson, type ApiResponse } from "@/lib/auth-fetch";

export type ProposalStatus =
  | "MENUNGGU PERSETUJUAN"
  | "DISETUJUI"
  | "DITOLAK"
  | "DIBAYAR"
  | string;

type ProposalUserProfile = {
  id?: number;
  name?: string;
  birth_place?: string;
  birth_date?: string;
  sex?: string;
  address?: string;
  email?: string;
  phone?: string;
  avatar?: string;
};

type ProposalClient = {
  user_id?: number;
  nick?: string;
  role?: string;
  users?: ProposalUserProfile;
};

type ProposalForeman = {
  user_id?: number;
  nik?: string;
  field?: string;
  bio?: string;
  strength?: string;
  experience?: number;
  portfolio?: string;
  role?: string;
  users?: ProposalUserProfile;
};

export type Proposal = {
  id: number;
  budget: number;
  deadline: string;
  field: string;
  title: string;
  content: string;
  location: string;
  photo: string;
  status: ProposalStatus;
  client_id: number;
  foreman_id: number;
  created_at: string;
  clients?: ProposalClient;
  foreman?: ProposalForeman;
};

type ProposalListResponse = ApiResponse<Proposal[]> & {
  pagination?: {
    totalItems?: number;
    totalPage?: number;
    currentPage?: number;
    itemsPerPage?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
};

type ProposalDetailResponse = ApiResponse<Proposal>;

type ProposalPaymentResponse = ApiResponse<{
  id?: number;
  order_id?: string;
  orderId?: string;
  payment_url?: string;
  paymentUrl?: string;
  redirect_url?: string;
  redirectUrl?: string;
  status?: ProposalStatus;
  error_messages?: string[];
  data?: {
    order_id?: string;
    orderId?: string;
    payment_url?: string;
    paymentUrl?: string;
    redirect_url?: string;
    redirectUrl?: string;
    status?: ProposalStatus;
    error_messages?: string[];
  };
}>;

export type ProposalPayResult = {
  paymentUrl: string | null;
  orderId: string | null;
  status: ProposalStatus | null;
  proposal: Proposal | null;
};

export type CreateProposalInput = {
  budget: number;
  deadline: string;
  field: string;
  title: string;
  content: string;
  location: string;
  photo?: string;
  client_id?: number;
  foreman_id?: number;
  clientId?: number;
  foremanId?: number;
};

export type UpdateProposalInput = Partial<CreateProposalInput>;
export type UpdateProposalPayload = UpdateProposalInput & {
  status?: ProposalStatus;
};

export class ProposalAuthError extends Error {
  constructor(message = "Sesi login berakhir. Silakan login ulang.") {
    super(message);
    this.name = "ProposalAuthError";
  }
}

export class ProposalForbiddenError extends Error {
  constructor(
    message = "Anda tidak memiliki izin untuk melakukan aksi pada proposal ini.",
  ) {
    super(message);
    this.name = "ProposalForbiddenError";
  }
}

type ProposalOrderRef = {
  id: number;
  client_id: number;
  foreman_id: number;
  location: string;
};

const normalizeText = (value: string) => value.trim().toLowerCase();

export const normalizeProposalStatus = (status?: ProposalStatus) =>
  String(status ?? "")
    .trim()
    .toUpperCase()
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .replace("PERSUTUJUAN", "PERSETUJUAN");

export const isProposalApprovedStatus = (status?: ProposalStatus) => {
  const normalized = normalizeProposalStatus(status);
  return normalized === "DISETUJUI" || normalized === "DIBAYAR";
};

export const isProposalRejectedStatus = (status?: ProposalStatus) =>
  normalizeProposalStatus(status) === "DITOLAK";

export const isProposalPendingStatus = (status?: ProposalStatus) =>
  normalizeProposalStatus(status) === "MENUNGGU PERSETUJUAN";

export const resolveProposalForOrder = (
  order: ProposalOrderRef,
  proposals: Proposal[],
): Proposal | null => {
  const candidateList = proposals
    .filter(
      (proposal) =>
        proposal.client_id === order.client_id &&
        proposal.foreman_id === order.foreman_id,
    )
    .sort((a, b) => {
      const aTime = new Date(a.created_at).getTime();
      const bTime = new Date(b.created_at).getTime();
      return bTime - aTime;
    });

  if (!candidateList.length) {
    return null;
  }

  const directMatch = candidateList.find(
    (proposal) => proposal.id === order.id,
  );
  if (directMatch) {
    return directMatch;
  }

  const locationMatch = candidateList.find(
    (proposal) =>
      normalizeText(proposal.location) === normalizeText(order.location),
  );

  return locationMatch ?? candidateList[0] ?? null;
};

const isAuthFailure = (status: number) => status === 401;

const throwProposalRequestError = (
  status: number,
  message: string | undefined,
  fallbackMessage: string,
): never => {
  if (status === 403) {
    throw new ProposalForbiddenError(message);
  }

  if (isAuthFailure(status)) {
    throw new ProposalAuthError(message);
  }

  throw new Error(message || fallbackMessage);
};

export async function getProposals(): Promise<Proposal[]> {
  const { response, payload } = await requestJson<ProposalListResponse>(
    `${API_BASE_URL}/proposals`,
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

  if (!response.ok || payload?.success !== true) {
    throwProposalRequestError(
      response.status,
      payload?.message,
      "Gagal mengambil daftar proposal.",
    );
  }

  return [];
}

export async function getProposalById(id: string): Promise<Proposal> {
  const { response, payload } = await requestJson<ProposalDetailResponse>(
    `${API_BASE_URL}/proposals/${encodeURIComponent(id)}`,
    {
      auth: true,
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const proposal = payload?.data;

  if (!response.ok || payload?.success !== true) {
    throwProposalRequestError(
      response.status,
      payload?.message,
      "Data proposal tidak ditemukan.",
    );
  }

  if (!proposal) {
    throw new Error("Data proposal tidak ditemukan.");
  }

  return proposal;
}

export async function createProposal(
  input: CreateProposalInput | FormData,
): Promise<Proposal> {
  const isFormData =
    typeof FormData !== "undefined" && input instanceof FormData;

  const { response, payload } = await requestJson<ProposalDetailResponse>(
    `${API_BASE_URL}/proposals`,
    {
      auth: true,
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
      body: isFormData ? input : JSON.stringify(input),
    },
  );

  const proposal = payload?.data;

  if (!response.ok || payload?.success !== true) {
    throwProposalRequestError(
      response.status,
      payload?.message,
      "Proposal gagal dibuat.",
    );
  }

  if (!proposal) {
    throw new Error("Proposal gagal dibuat.");
  }

  return proposal;
}

export async function updateProposal(
  id: string,
  input: UpdateProposalPayload,
): Promise<Proposal> {
  const { response, payload } = await requestJson<ProposalDetailResponse>(
    `${API_BASE_URL}/proposals/${encodeURIComponent(id)}`,
    {
      auth: true,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(input),
    },
  );

  const proposal = payload?.data;

  if (!response.ok || payload?.success !== true) {
    throwProposalRequestError(
      response.status,
      payload?.message,
      "Proposal gagal diperbarui.",
    );
  }

  if (!proposal) {
    throw new Error("Proposal gagal diperbarui.");
  }

  return proposal;
}

export async function updateProposalStatus(
  id: string,
  status: ProposalStatus,
): Promise<Proposal> {
  return updateProposal(id, { status });
}

export async function payProposal(id: string): Promise<ProposalPayResult> {
  const { response, payload } = await requestJson<ProposalPaymentResponse>(
    `${API_BASE_URL}/proposals/${encodeURIComponent(id)}/pay`,
    {
      auth: true,
      method: "PATCH",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const paymentData = payload?.data;
  const nestedPaymentData = paymentData?.data;
  const resolvedPaymentData = nestedPaymentData ?? paymentData;
  const providerErrors = resolvedPaymentData?.error_messages ?? [];

  if (providerErrors.length > 0) {
    throw new Error(providerErrors[0]);
  }

  const paymentUrl =
    resolvedPaymentData?.payment_url ??
    resolvedPaymentData?.paymentUrl ??
    resolvedPaymentData?.redirect_url ??
    resolvedPaymentData?.redirectUrl ??
    null;
  const orderId =
    resolvedPaymentData?.order_id ?? resolvedPaymentData?.orderId ?? null;

  if (!response.ok || payload?.success !== true) {
    throwProposalRequestError(
      response.status,
      payload?.message,
      "Gagal membuat sesi pembayaran.",
    );
  }

  const status = resolvedPaymentData?.status ?? null;

  return {
    paymentUrl,
    orderId,
    status,
    proposal: null,
  };
}

export async function approveProposalByClient(
  id: string,
): Promise<ProposalPayResult> {
  return payProposal(id);
}
