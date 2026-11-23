import { headers } from "next/headers";
import { unstable_rethrow } from "next/navigation";
import { auth } from "@/lib/auth";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const TIMEOUT_MS = 25_000; // give a sleeping Render server time to wake up
const RETRIES = 1;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
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
    if (!result?.token) {
      console.error(`[serverApi] ${path} -> no JWT token for this session`);
      throw new ApiError("Not signed in", 401);
    }
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

      // This line shows up in the Vercel logs and names the real cause.
      console.error(
        `[serverApi] ${path} -> ${res.status} ${data.message ?? ""}`.trim(),
      );
      throw new ApiError(
        data.message || `Request failed (${res.status})`,
        res.status,
      );
    } catch (e) {
      if (e instanceof ApiError) throw e;
      lastError = e;
      if (attempt < RETRIES) await sleep(3000);
    }
  }

  console.error(`[serverApi] ${path} -> network failure:`, lastError);
  throw new ApiError(
    "The server is waking up. Please try again in a moment.",
    503,
  );
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string };

// Same as serverApi, but never throws. Pages use it so one failed request
// shows a friendly message inside the page instead of crashing the whole app.
export async function serverApiSafe<T>(
  path: string,
  opts: { auth?: boolean } = {},
): Promise<ApiResult<T>> {
  try {
    return { ok: true, data: await serverApi<T>(path, opts) };
  } catch (e) {
    unstable_rethrow(e); // let Next.js handle its own redirects / not-found
    const status = e instanceof ApiError ? e.status : 500;
    const error = e instanceof Error ? e.message : "Something went wrong.";
    return { ok: false, status, error };
  }
}