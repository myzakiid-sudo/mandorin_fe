import {
  extractAuthSession,
  persistAuthSession,
  readAuthSession,
} from "@/lib/auth-session";
import { API_BASE_URL } from "@/lib/api-config";

const TOKEN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const REFRESH_ENDPOINT = `${API_BASE_URL}/auth/refresh`;
const RETRY_MARKER_HEADER = "x-mandorin-auth-retry";
const AUTH_CHANGE_EVENT = "mandorin-auth-change";
export const USE_AUTH_CREDENTIALS =
  process.env.NEXT_PUBLIC_AUTH_USE_CREDENTIALS?.trim().toLowerCase() === "true";

let refreshInFlight: Promise<string | null> | null = null;

const syncTokenCookie = (token: string) => {
  if (typeof document === "undefined") {
    return;
  }

  // This is only a frontend-readable cookie for route guard/proxy checks.
  // Refresh token cookie remains fully managed by backend (HttpOnly).
  document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=${TOKEN_COOKIE_MAX_AGE}; samesite=lax`;
};

const emitAuthChange = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};

export type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

type RefreshResponse = ApiResponse<{
  accessToken?: string;
  token?: string;
}>;

type RequestJsonOptions = RequestInit & {
  auth?: boolean;
};

const refreshAccessToken = async (): Promise<string | null> => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!USE_AUTH_CREDENTIALS) {
    return null;
  }

  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = (async () => {
    try {
      const response = await fetch(REFRESH_ENDPOINT, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      let payload: RefreshResponse | null = null;
      try {
        payload = (await response.json()) as RefreshResponse;
      } catch {
        payload = null;
      }

      if (!response.ok || payload?.success !== true) {
        return null;
      }

      const current = readAuthSession();
      const next = extractAuthSession(payload, current?.role);

      if (!next?.token) {
        return null;
      }

      const mergedSession = {
        token: next.token,
        role: next.role,
        userId: next.userId || current?.userId || "",
        userName: next.userName || current?.userName || "Akun",
      };

      persistAuthSession(mergedSession);
      syncTokenCookie(next.token);
      emitAuthChange();

      return next.token;
    } catch {
      return null;
    }
  })();

  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
};

export async function fetchWithAuth(
  input: RequestInfo | URL,
  init: RequestInit = {},
) {
  const headers = new Headers(init.headers);
  const alreadyRetried = headers.get(RETRY_MARKER_HEADER) === "1";
  const authSession = readAuthSession();

  if (authSession?.token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${authSession.token}`);
    // Keep proxy/middleware auth in sync because protected routes rely on cookie token.
    syncTokenCookie(authSession.token);
  }

  const initialResponse = await fetch(input, {
    ...init,
    headers,
  });

  if (initialResponse.status !== 401 || alreadyRetried) {
    return initialResponse;
  }

  const refreshedToken = await refreshAccessToken();
  if (!refreshedToken) {
    return initialResponse;
  }

  const retryHeaders = new Headers(init.headers);
  retryHeaders.set("Authorization", `Bearer ${refreshedToken}`);
  retryHeaders.set(RETRY_MARKER_HEADER, "1");

  return fetch(input, {
    ...init,
    headers: retryHeaders,
  });
}

export async function requestJson<TPayload = unknown>(
  input: RequestInfo | URL,
  options: RequestJsonOptions = {},
) {
  const { auth = false, ...init } = options;
  const requester = auth ? fetchWithAuth : fetch;
  const response = await requester(input, init);

  let payload: TPayload | null = null;

  try {
    payload = (await response.json()) as TPayload;
  } catch {
    payload = null;
  }

  return {
    response,
    payload,
  };
}
