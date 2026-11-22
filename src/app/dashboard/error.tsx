"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { panel, primaryBtn } from "@/lib/styles";

export default function DashboardError({
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
    <div
      className={`${panel} flex flex-col items-center px-6 py-16 text-center`}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-red-400/50 bg-red-400/10">
        <TriangleAlert className="h-5 w-5 text-red-300" />
      </span>
      <h2 className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-white">
        Couldn&apos;t load this page
      </h2>
      <p className="mt-2 max-w-sm text-sm text-slate-400">
        The server didn&apos;t respond. Your data is safe. Please try again.
      </p>
      <Button onClick={retry} className={`${primaryBtn} mt-6 px-8 py-5`}>
        Try again
      </Button>
    </div>
  );
}
