import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requireSession } from "@/lib/session";
import { outlineBtn, primaryBtn } from "@/lib/styles";

export const metadata = { title: "Payment Success | PizzaHub" };

export default async function PaymentSuccessPage() {
  await requireSession();

  return (
    <section className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-400/10">
        <Check className="h-7 w-7 text-emerald-300" />
      </span>
      <span className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-[#D4A359]">
        Payment received
      </span>
      <h1 className="mt-2 text-3xl font-extrabold uppercase leading-[1.12] tracking-tight text-white sm:text-4xl">
        Thank you!
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-slate-300">
        We&apos;re confirming your payment with Stripe. Your Premium plan
        switches on as soon as the confirmation arrives, usually within a few
        seconds. You can check the status on your subscription page.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild className={`${primaryBtn} px-8 py-6`}>
          <Link href="/dashboard/vendor/subscription">View subscription</Link>
        </Button>
        <Button asChild variant="outline" className={`${outlineBtn} px-8 py-6`}>
          <Link href="/dashboard/vendor">Go to dashboard</Link>
        </Button>
      </div>
    </section>
  );
}
