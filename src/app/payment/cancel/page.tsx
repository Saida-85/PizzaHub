import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requireSession } from "@/lib/session";
import { outlineBtn, primaryBtn } from "@/lib/styles";

export const metadata = { title: "Payment Cancelled | PizzaHub" };

export default async function PaymentCancelPage() {
  await requireSession();

  return (
    <section className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-red-400/50 bg-red-400/10">
        <X className="h-7 w-7 text-red-300" />
      </span>
      <span className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-[#D4A359]">
        Payment cancelled
      </span>
      <h1 className="mt-2 text-3xl font-extrabold uppercase leading-[1.12] tracking-tight text-white sm:text-4xl">
        No charge made
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-slate-300">
        Your checkout was cancelled and you haven&apos;t been charged. You can
        try again whenever you&apos;re ready.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild className={`${primaryBtn} px-8 py-6`}>
          <Link href="/dashboard/vendor/subscription">Try again</Link>
        </Button>
        <Button asChild variant="outline" className={`${outlineBtn} px-8 py-6`}>
          <Link href="/dashboard/vendor">Back to dashboard</Link>
        </Button>
      </div>
    </section>
  );
}
