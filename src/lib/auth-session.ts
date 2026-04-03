type UserRole = "client" | "mandor";

export type AuthSession = {
  token: string;
  role: UserRole;
  userId: string;
  userName: string;
};

const TOKEN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  return value as Record<string, unknown>;
};

const firstString = (
  source: Record<string, unknown> | null,
  keys: string[],
): string => {
  if (!source) {
    return "";
  }

  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim() !== "") {
      return value;
    }

    if (typeof value === "number") {
      return String(value);
    }
  }

  return "";
};

const resolveRole = (
  value: unknown,
  fallbackRole?: UserRole,
): UserRole | null => {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized === "client" || normalized === "clients") {
      return "client";
    }

    if (normalized === "mandor" || normalized === "foreman") {
      return "mandor";
    }
  }

  return fallbackRole ?? null;
};

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  const base64Url = parts[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padding = base64.length % 4;
  const paddedBase64 =
    padding === 0 ? base64 : `${base64}${"=".repeat(4 - padding)}`;

  try {
    const decoded = atob(paddedBase64);
    const json = decodeURIComponent(
      decoded
        .split("")
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join(""),
    );
    const parsed = JSON.parse(json);
    return asRecord(parsed);
  } catch {
    return null;
  }
};

const deriveNameFromEmail = (email: string) => {
  const localPart = email.split("@")[0]?.trim() ?? "";
  return localPart || "Akun";
};

const setCookie = (name: string, value: string) => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${TOKEN_COOKIE_MAX_AGE}; samesite=lax`;
};

const clearCookie = (name: string) => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax`;
};

export const persistAuthSession = (session: AuthSession) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("token", session.token);
    localStorage.setItem("role", session.role);
    localStorage.setItem("userId", session.userId);
    localStorage.setItem("userName", session.userName);
  }

  setCookie("token", session.token);
};

export const clearAuthSession = () => {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
  }

  clearCookie("token");
};

export const readAuthSession = (): AuthSession | null => {
  if (typeof localStorage === "undefined") {
    return null;
  }

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || (role !== "client" && role !== "mandor")) {
    return null;
  }

  return {
    token,
    role,
    userId: localStorage.getItem("userId") ?? "",
    userName: localStorage.getItem("userName") ?? "",
  };
};

export const extractAuthSession = (
  response: unknown,
  fallbackRole?: UserRole,
): AuthSession | null => {
  const root = asRecord(response);
  const data = asRecord(root?.data);
  const nestedData = asRecord(data?.data);

  const token =
    firstString(data, ["accessToken", "token"]) ||
    firstString(nestedData, ["accessToken", "token"]) ||
    firstString(root, ["accessToken", "token"]);

  if (!token) {
    return null;
  }

  const jwtPayload = decodeJwtPayload(token);

  const role =
    resolveRole(data?.role, fallbackRole) ||
    resolveRole(nestedData?.role, fallbackRole) ||
    resolveRole(root?.role, fallbackRole) ||
    resolveRole(jwtPayload?.role, fallbackRole) ||
    resolveRole(jwtPayload?.userRole, fallbackRole) ||
    resolveRole(jwtPayload?.user_role, fallbackRole);

  if (!role) {
    return null;
  }

  const user =
    asRecord(nestedData?.user) ||
    asRecord(data?.user) ||
    asRecord(data?.client) ||
    asRecord(data?.foreman) ||
    asRecord(nestedData?.client) ||
    asRecord(nestedData?.foreman) ||
    nestedData ||
    data;

  const emailFromPayload =
    firstString(user, ["email"]) || firstString(jwtPayload, ["email"]);

  const userId =
    firstString(user, ["id", "userId", "clientId", "foremanId"]) ||
    firstString(root, ["id", "userId"]) ||
    firstString(jwtPayload, [
      "id",
      "userId",
      "sub",
      "user_id",
      "client_id",
      "foreman_id",
    ]);
  const userName =
    firstString(user, ["name", "fullName", "fullname", "nick", "nickname"]) ||
    firstString(root, ["name", "fullName"]) ||
    firstString(jwtPayload, [
      "name",
      "fullName",
      "fullname",
      "nick",
      "nickname",
      "username",
    ]) ||
    (emailFromPayload ? deriveNameFromEmail(emailFromPayload) : "Akun");

  return {
    token,
    role,
    userId,
    userName,
  };
};
