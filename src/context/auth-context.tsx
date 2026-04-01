"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

import {
  type AuthSession,
  clearAuthSession,
  persistAuthSession,
} from "@/lib/auth-session";

const AUTH_CHANGE_EVENT = "mandorin-auth-change";

const emitAuthChange = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};

const subscribeAuthStore = (listener: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onChange = () => listener();

  window.addEventListener("storage", onChange);
  window.addEventListener(AUTH_CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(AUTH_CHANGE_EVENT, onChange);
  };
};

const subscribeHydration = () => () => {};
const getHydratedSnapshot = () => true;
const getServerHydratedSnapshot = () => false;

let cachedAuthKey = "";
let cachedAuthSnapshot: AuthSession | null = null;

const getCachedAuthSnapshot = (): AuthSession | null => {
  if (typeof localStorage === "undefined") {
    return null;
  }

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId") ?? "";
  const userName = localStorage.getItem("userName") ?? "";
  const nextKey = `${token ?? ""}|${role ?? ""}|${userId}|${userName}`;

  if (nextKey === cachedAuthKey) {
    return cachedAuthSnapshot;
  }

  cachedAuthKey = nextKey;

  if (!token || (role !== "client" && role !== "mandor")) {
    cachedAuthSnapshot = null;
    return cachedAuthSnapshot;
  }

  cachedAuthSnapshot = {
    token,
    role,
    userId,
    userName,
  };

  return cachedAuthSnapshot;
};

type AuthContextValue = {
  authSession: AuthSession | null;
  isReady: boolean;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authSession = useSyncExternalStore(
    subscribeAuthStore,
    getCachedAuthSnapshot,
    () => null,
  );
  const isReady = useSyncExternalStore(
    subscribeHydration,
    getHydratedSnapshot,
    getServerHydratedSnapshot,
  );

  const setSession = (session: AuthSession) => {
    persistAuthSession(session);
    emitAuthChange();
  };

  const clearSession = () => {
    clearAuthSession();
    emitAuthChange();
  };

  const value = useMemo(
    () => ({
      authSession,
      isReady,
      setSession,
      clearSession,
    }),
    [authSession, isReady],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
