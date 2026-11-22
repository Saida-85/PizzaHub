import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function serverApi<T>(path: string, opts: { auth?: boolean } = {}): Promise<T> {
  const { auth: withAuth = true } = opts;
  const h: Record<string, string> = {};

  if (withAuth) {
    const result = await auth.api.getToken({ headers: await headers() });
    if (!result?.token) throw new ApiError("Not signed in", 401);
    h.Authorization = `Bearer ${result.token}`;
  }

  const res = await fetch(`${API}${path}`, { headers: h, cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.message || `Request failed (${res.status})`, res.status);
  return data as T;
}