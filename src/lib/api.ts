import { authClient } from "./auth-client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Asks Better Auth for a fresh short-lived JWT for the signed-in user.
async function getAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const { data } = await authClient.token();
  return data?.token ?? null;
}

interface ApiRequestOptions extends RequestInit {
  token?: string | null;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { token, headers, body, ...rest } = options;
  const authToken = token ?? (await getAuthToken());

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    body,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || data.error || `Request failed (${res.status})`);
  }

  return data as T;
}

export const api = {
  get: <T = unknown>(endpoint: string, options?: ApiRequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T = unknown>(
    endpoint: string,
    payload?: unknown,
    options?: ApiRequestOptions
  ) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body:
        payload instanceof FormData
          ? payload
          : payload !== undefined
            ? JSON.stringify(payload)
            : undefined,
    }),

  patch: <T = unknown>(
    endpoint: string,
    payload?: unknown,
    options?: ApiRequestOptions
  ) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: payload !== undefined ? JSON.stringify(payload) : undefined,
    }),

  delete: <T = unknown>(endpoint: string, options?: ApiRequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};