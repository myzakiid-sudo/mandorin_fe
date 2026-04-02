const DEFAULT_API_BASE_URL = "https://be-internship.bccdev.id/dzaki/api";

const configuredApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;

export const API_BASE_URL = configuredApiBaseUrl.replace(/\/+$/, "");
