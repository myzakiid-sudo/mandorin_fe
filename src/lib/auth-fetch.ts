import { readAuthSession } from "@/lib/auth-session";

export type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

type RequestJsonOptions = RequestInit & {
  auth?: boolean;
};

export async function fetchWithAuth(
  input: RequestInfo | URL,
  init: RequestInit = {},
) {
  const headers = new Headers(init.headers);
  const authSession = readAuthSession();

  if (authSession?.token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${authSession.token}`);
  }

  return fetch(input, {
    ...init,
    headers,
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
