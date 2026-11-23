import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const TIMEOUT_MS = 25_000; // wait for Render to wake up
const RETRIES = 1;

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function serverApi<T>(
  path: string,
  opts: { auth?: boolean } = {},
): Promise<T> {
  const { auth: withAuth = true } = opts;
  const h: Record<string, string> = {};

  if (withAuth) {
    const result = await auth.api.getToken({ headers: await headers() });
    if (!result?.token) throw new ApiError("Not signed in", 401);
    h.Authorization = `Bearer ${result.token}`;
  }

  let lastError: unknown;
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    try {
      const res = await fetch(`${API}${path}`, {
        headers: h,
        cache: "no-store",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) return data as T;

      // Gateway errors mean the server is still waking up: retry once
      if ([502, 503, 504].includes(res.status) && attempt < RETRIES) {
        await sleep(3000);
        continue;
      }
      throw new ApiError(data.message || `Request failed (${res.status})`, res.status);
    } catch (e) {
      if (e instanceof ApiError) throw e;
      lastError = e;
      if (attempt < RETRIES) await sleep(3000);
    }
  }

  console.error("serverApi failed:", path, lastError);
  throw new ApiError("The server is waking up. Please try again in a moment.", 503);
}