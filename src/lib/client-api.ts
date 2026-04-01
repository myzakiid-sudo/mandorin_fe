import { API_BASE_URL } from "@/lib/api-config";
import { requestJson, type ApiResponse } from "@/lib/auth-fetch";

type ClientProfile = {
  id: number;
  name?: string;
  avatar?: string;
};

type ClientProfileResponse = ApiResponse<ClientProfile>;

export async function getClientDisplayByUserId(userId: string) {
  if (!userId.trim()) {
    return null;
  }

  const { response, payload } = await requestJson<ClientProfileResponse>(
    `${API_BASE_URL}/clients/${encodeURIComponent(userId)}`,
    {
      auth: true,
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok || payload?.success !== true || !payload.data) {
    return null;
  }

  return payload.data;
}
