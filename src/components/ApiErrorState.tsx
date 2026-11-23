"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { panel, primaryBtn } from "@/lib/styles";

function explain(status?: number) {
  if (status === 401)
    return "We couldn't verify your login. Please sign out and sign in again.";
  if (status === 403) return "You don't have access to this page.";
  if (status && status >= 500)
    return "The server is waking up or temporarily unavailable. Please try again in a moment.";
  return "We couldn't load this data. Please try again.";
}

export default function ApiErrorState({
  status,
  message,
}: {
  status?: number;
  message?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div
      role="alert"
      className={`${panel} flex flex-col items-center px-6 py-16 text-center`}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-red-400/50 bg-red-400/10">
        <TriangleAlert className="h-5 w-5 text-red-300" />
      </span>
      <h2 className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-white">
        Couldn&apos;t load this page
      </h2>
      <p className="mt-2 max-w-sm text-sm text-slate-400">{explain(status)}</p>
      {(status || message) && (
        <p className="mt-3 text-[11px] text-slate-500">
          {status ? `Error ${status}` : ""}
          {status && message ? " · " : ""}
          {message}
        </p>
      )}
      <Button
        onClick={() => startTransition(() => router.refresh())}
        disabled={pending}
        className={`${primaryBtn} mt-6 px-8 py-5`}
      >
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Trying again...
          </>
        ) : (
          "Try again"
        )}
      </Button>
    </div>
  );
}
