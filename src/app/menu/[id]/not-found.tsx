import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { primaryBtn } from "@/lib/styles";

export default function ItemNotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#D4A359]/40 bg-[#132024]">
        <SearchX className="h-6 w-6 text-[#D4A359]" />
      </span>
      <h1 className="mt-6 text-3xl font-extrabold uppercase tracking-tight text-white">
        Item not found
      </h1>
      <p className="mt-3 text-sm text-slate-300">
        This item doesn&apos;t exist or is no longer available. It may have been
        removed or is still waiting for approval.
      </p>
      <Button asChild className={`${primaryBtn} mt-8 px-8 py-6`}>
        <Link href="/menu">Browse the menu</Link>
      </Button>
    </section>
  );
}
