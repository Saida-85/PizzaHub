import Link from "next/link";
import { Pizza } from "lucide-react";
import { Button } from "@/components/ui/button";
import { outlineBtn, primaryBtn } from "@/lib/styles";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 py-20 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(224,90,43,0.12),transparent_60%)]"
      />
      <div className="relative z-10 flex flex-col items-center">
        <Pizza className="h-10 w-10 -rotate-12 text-[#E05A2B]" />
        <p className="mt-4 text-7xl font-extrabold tracking-tight text-white sm:text-8xl">
          4<span className="text-[#D4A359]">0</span>4
        </p>
        <h1 className="mt-4 text-2xl font-extrabold uppercase tracking-tight text-white sm:text-3xl">
          This slice is missing
        </h1>
        <p className="mt-3 max-w-md text-sm text-slate-300">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
          Let&apos;s get you back to something delicious.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild className={`${primaryBtn} px-8 py-6`}>
            <Link href="/">Go home</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className={`${outlineBtn} px-8 py-6`}
          >
            <Link href="/menu">Browse menu</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
