"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { outlineBtn, primaryBtn } from "@/lib/styles";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const retry = () => {
    router.refresh();
    reset();
  };

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-red-400/50 bg-red-400/10">
        <TriangleAlert className="h-6 w-6 text-red-300" />
      </span>
      <h1 className="mt-6 text-3xl font-extrabold uppercase tracking-tight text-white">
        Something went wrong
      </h1>
      <p className="mt-3 text-sm text-slate-300">
        We couldn&apos;t load this page. Check your connection and try again in
        a moment.
      </p>
      {error.digest && (
        <p className="mt-3 text-[11px] text-slate-500">
          Error ID: {error.digest}
        </p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={retry} className={`${primaryBtn} px-8 py-6`}>
          Try again
        </Button>
        <Button asChild variant="outline" className={`${outlineBtn} px-8 py-6`}>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </section>
  );
}
